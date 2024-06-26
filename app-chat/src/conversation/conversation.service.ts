import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import {
  CONVERSATION_MEMBER_PERMISSION,
  CONVERSATION_STATUS,
  CONVERSATION_TYPE,
  MESSAGE_TYPE,
  USER_STATUS,
} from 'src/enum';
import {
  Conversation,
  ConversationHidden,
  ConversationMember,
  ConversationMemberWaitingConfirm,
  ConversationPinned,
  ExceptionResponse,
  Message,
  User,
} from 'src/shared';
import { BaseResponse } from 'src/shared/base-response.response';
import { ConversationDisableNotify } from 'src/shared/conversation-disable-notify.entity';
import { checkMongoId, formatUnixTimestamp } from 'src/util';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { DetailConversation } from './dto/detail-conversation.dto';
import { DetailConversationResponse } from './response/detail-conversation.response';
import { QueryConversation } from './response/query-conversation.dto';
import { LastMessageResponse } from './response/last-message.interface';
import { UserMessageResponse } from 'src/connection/response/user-message.response';
import { Friend } from 'src/shared/friend.entity';
import { Block } from 'src/shared/block.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,

    @InjectModel(ConversationMember.name)
    private readonly conversationMemberModel: Model<ConversationMember>,

    @InjectModel(ConversationMemberWaitingConfirm.name)
    private readonly conversationMemberWaitingModel: Model<ConversationMemberWaitingConfirm>,

    @InjectModel(ConversationHidden.name)
    private readonly conversationHiddenModel: Model<ConversationHidden>,

    @InjectModel(ConversationPinned.name)
    private readonly conversationPinnedModel: Model<ConversationPinned>,

    @InjectModel(ConversationDisableNotify.name)
    private readonly conversationDisableNotifyModel: Model<ConversationDisableNotify>,

    @InjectModel(Friend.name)
    private readonly friendModel: Model<Friend>,

    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,

    @InjectModel(Block.name)
    private readonly blockModel: Model<Block>,
  ) {}

  async createNewConversation(
    user_id: string,
    createConversation: CreateConversationDto,
  ) {
    const member_id: string = createConversation.member_id;
    if (user_id == member_id)
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        ` Không thể tạo cuộc trò chuyện với chính mình`,
      );

    const member = await this.userModel.findOne({
      _id: member_id,
      status: USER_STATUS.ACTIVE,
    });

    if (!member)
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        ` Người dùng không tồn tại`,
      );

    await this.blockModel
      .findOne({
        $or: [
          {
            user_id: user_id,
            user_block_id: member_id,
          },
          {
            user_id: member_id,
            user_block_id: user_id,
          },
        ],
      })
      .then((data) => {
        if (data) {
          throw new ExceptionResponse(
            HttpStatus.BAD_REQUEST,
            ` Người dùng đã chặn nhau`,
          );
        }
      });

    await this.friendModel
      .findOne({
        user_id: user_id,
        user_friend_id: member_id,
      })
      .then((data) => {
        if (!data) {
          throw new ExceptionResponse(
            HttpStatus.BAD_REQUEST,
            ` Người dùng chưa là bạn bè, không thể nhắn tin`,
          );
        }
      });

    const filter = {
      type: CONVERSATION_TYPE.PERSONAL,
      members: { $all: [user_id, member_id] },
    };

    let conversation = await this.conversationModel.findOne(filter).exec();

    if (conversation)
      return new BaseResponse(200, 'OK', { conversation_id: conversation.id });

    /** Tạo cuộc trò chuyện */
    conversation = await this.conversationModel.create({
      no_of_member: 2,
      type: CONVERSATION_TYPE.PERSONAL,
      status: CONVERSATION_STATUS.ACTIVE,
      last_activity: performance.timeOrigin + performance.now(),
      members: [user_id, member_id],
      is_join_with_link: 0,
    });

    /** Lưu member */
    await this.conversationMemberModel.create(
      {
        conversation_id: conversation.id,
        user_id: user_id,
        permission: CONVERSATION_MEMBER_PERMISSION.MEMBER,
        message_pre_id: 0,
        message_last_id: 0,
      },
      {
        conversation_id: conversation.id,
        user_id: member_id,
        permission: CONVERSATION_MEMBER_PERMISSION.MEMBER,
        message_pre_id: 0,
        message_last_id: 0,
      },
    );

    return new BaseResponse(201, 'OK', { conversation_id: conversation.id });
  }

  async getListConversationHidden(
    user_id: string,
  ): Promise<ConversationHidden[]> {
    return await this.conversationHiddenModel.find({
      user_id: user_id,
    });
  }

  async getListConversationPinned(
    user_id: string,
  ): Promise<ConversationPinned[]> {
    return await this.conversationPinnedModel.find({
      user_id: user_id,
    });
  }

  async getListConversationDisableNotify(
    user_id: string,
  ): Promise<ConversationDisableNotify[]> {
    return await this.conversationDisableNotifyModel.find({
      user_id: user_id,
    });
  }

  async getListLastMessageConversation(list_message_id): Promise<Message[]> {
    return await this.messageModel
      .find({
        _id: { $in: list_message_id },
      })
      .populate('user_id', { _id: 1, username: 1, avatar: 1, full_name: 1 })
      .lean();
  }

  async getListConversation1(user_id: string, query_param: QueryConversation) {
    const { limit = 20, position } = query_param;

    try {
      const listConversationHidden =
        await this.getListConversationHidden(user_id);

      const listConversationHiddenIds = listConversationHidden.map(
        (item) => new Types.ObjectId(item._id),
      );

      const listConversationPinned =
        await this.getListConversationPinned(user_id);

      const listConversationPinnedIds = listConversationPinned.map(
        (item) => new Types.ObjectId(item.conversation_id),
      );

      const conversations1 = await this.conversationModel
        .aggregate<Conversation>([
          {
            $match: {
              _id: {
                $nin: [
                  ...listConversationHiddenIds,
                  ...listConversationPinnedIds,
                ],
              },
              members: { $in: [user_id] },
              last_message_id: { $ne: '' },
              status: CONVERSATION_STATUS.ACTIVE,
              ...(position ? { updated_at: { $lt: position || '' } } : {}),
            },
          },
        ])
        .project({
          __v: false,
        })
        .limit(+limit)
        .sort({ updated_at: 'desc' })
        .exec(); // Fix: Use exec() instead of toArray()

      const conversationMember = await this.conversationMemberModel
        .find({
          user_id: user_id,
        })
        .lean();

      const mapConversationMember = conversationMember.reduce(
        (map, current) => {
          map[current.conversation_id] = current.message_pre_id;
          return map;
        },
        {},
      );

      const conversations = conversations1.filter(
        (item) =>
          item.last_activity > mapConversationMember[item._id.toString()],
      );

      if (conversations.length == 0) {
        return new BaseResponse(200, 'OK', []);
      }

      const listUserIds = [];
      const listMessageIds = [];
      const listConversationIds = [];

      conversations.map((item) => {
        if (item.type == CONVERSATION_TYPE.PERSONAL)
          listUserIds.push(...item.members);
        listMessageIds.push(new Types.ObjectId(item.last_message_id));
        listConversationIds.push(item._id.toString());
      });

      // get member info

      const listMember: { [user_id: string]: UserMessageResponse } =
        await this.userModel
          .find(
            { _id: { $in: listUserIds } },
            { _id: true, full_name: true, avatar: true, status: true },
          )
          .then((data) => {
            return data.reduce((map, current) => {
              map[current._id.toString()] = {
                _id: current._id.toString(),
                avatar: current.avatar,
                full_name: current.full_name,
              };
              return map;
            }, {});
          });

      // get last message info

      const listMessage = await this.getListLastMessageConversation(
        listMessageIds,
      ).then((data) => {
        return data.reduce((map, message: any) => {
          map[message._id.toString()] = {
            ...message,
            user: new UserMessageResponse(message.user_id),
            updated_at: formatUnixTimestamp(message.updated_at),
            created_at: formatUnixTimestamp(message.created_at),
          };
          return map;
        }, {});
      });

      const listConversationDisableNotify =
        await this.getListConversationDisableNotify(user_id);

      const data = await Promise.all(
        conversations.map(async (item) => {
          const conversation_id = item._id.toString();

          if (item.type == CONVERSATION_TYPE.PERSONAL) {
            const otherUserId = item.members.find((_id) => _id != user_id);

            const otherUser = listMember[otherUserId];

            item.avatar = otherUser?.avatar || '';
            item.name = otherUser?.full_name || '';
          }

          let lastMessage = listMessage[item.last_message_id];

          while (lastMessage?.user_deleted?.includes(user_id)) {
            lastMessage = await this.messageModel
              .findOne({
                conversation_id: conversation_id,
                user_deleted: {
                  $nin: [user_id],
                },
              })
              .sort({ created_at: -1 })
              .lean();

            lastMessage.user = new UserMessageResponse(lastMessage.user_id);
            lastMessage.updated_at = formatUnixTimestamp(
              lastMessage.updated_at,
            );
            lastMessage.created_at = formatUnixTimestamp(
              lastMessage.created_at,
            );
          }

          return {
            ...item,
            _id: conversation_id,
            is_notify: listConversationDisableNotify.find(
              (temp) => temp.conversation_id == conversation_id,
            )
              ? 0
              : 1,
            is_pinned: 0,
            created_at: formatUnixTimestamp(item.created_at),
            updated_at: formatUnixTimestamp(item.updated_at),
            last_activity: formatUnixTimestamp(item.last_activity),
            last_message: new LastMessageResponse({
              ...lastMessage,
              _id: lastMessage._id.toString(),
            }),
            position: item.updated_at.toString(),
          };
        }),
      );

      return new BaseResponse(200, 'OK', data);
    } catch (error) {
      console.log('ConversationService ~ getListConversation ~ error:', error);
      return new BaseResponse(400, 'FAIL', []);
    }
  }

  async getListConversation(user_id: string, query_param: QueryConversation) {
    const { limit = 20, position } = query_param;

    try {
      const listConversationHidden =
        await this.getListConversationHidden(user_id);

      const listConversationHiddenIds = listConversationHidden.map(
        (item) => new Types.ObjectId(item._id),
      );

      const listConversationPinned =
        await this.getListConversationPinned(user_id);

      const listConversationPinnedIds = listConversationPinned.map(
        (item) => new Types.ObjectId(item.conversation_id),
      );

      const query = {
        members: { $in: [user_id] },
        last_message_id: { $ne: '' },
        status: CONVERSATION_STATUS.ACTIVE,
        _id: {
          $nin: [...listConversationHiddenIds, ...listConversationPinnedIds],
        },
      };

      if (position?.length) {
        query['updated_at'] = { $lt: position };
      }

      const conversations = await this.conversationModel
        .find(query, {
          __v: false,
        })
        .sort({ updated_at: 'desc' })
        .limit(+limit)
        .lean();

      if (conversations.length == 0) {
        return new BaseResponse(200, 'OK', []);
      }

      const listUserIds = [];
      const listMessageIds = [];
      const listConversationIds = [];

      conversations.map((item) => {
        if (item.type == CONVERSATION_TYPE.PERSONAL)
          listUserIds.push(...item.members);
        listMessageIds.push(new Types.ObjectId(item.last_message_id));
        listConversationIds.push(item._id.toString());
      });

      // get member info

      const listMember: { [user_id: string]: UserMessageResponse } =
        await this.userModel
          .find(
            { _id: { $in: listUserIds } },
            { _id: true, full_name: true, avatar: true, status: true },
          )
          .then((data) => {
            return data.reduce((map, current) => {
              map[current._id.toString()] = {
                _id: current._id.toString(),
                avatar: current.avatar,
                full_name: current.full_name,
              };
              return map;
            }, {});
          });

      // get last message info

      const listMessage = await this.getListLastMessageConversation(
        listMessageIds,
      ).then((data) => {
        return data.reduce((map, message: any) => {
          map[message._id.toString()] = {
            ...message,
            user: new UserMessageResponse(message.user_id),
            updated_at: formatUnixTimestamp(message.updated_at),
            created_at: formatUnixTimestamp(message.created_at),
          };
          return map;
        }, {});
      });

      // get setting, pinned, notify, hidden
      // const listConversationPinned =
      //   await this.getListConversationPinned(user_id);

      const listConversationDisableNotify =
        await this.getListConversationDisableNotify(user_id);

      const data = conversations.map((item) => {
        const id = item._id.toString();

        if (item.type == CONVERSATION_TYPE.PERSONAL) {
          const otherUserId = item.members.find((_id) => _id != user_id);

          const otherUser = listMember[otherUserId];

          item.avatar = otherUser?.avatar || '';
          item.name = otherUser?.full_name || '';
        }

        return {
          ...item,
          _id: id,
          is_notify: listConversationDisableNotify.find(
            (temp) => temp.conversation_id == id,
          )
            ? 0
            : 1,
          is_pinned: 0,
          created_at: formatUnixTimestamp(item.created_at),
          updated_at: formatUnixTimestamp(item.updated_at),
          last_activity: formatUnixTimestamp(item.last_activity),
          last_message: new LastMessageResponse({
            ...listMessage[item.last_message_id],
            _id: listMessage[item.last_message_id]._id.toString(),
          }),
        };
      });

      return new BaseResponse(200, 'OK', data);
    } catch (error) {
      console.log('ConversationService ~ getListConversation ~ error:', error);
      return new BaseResponse(400, 'FAIL', []);
    }
  }

  async detailConversation(user_id: string, body: DetailConversation) {
    try {
      const conversation: Conversation = await this.conversationModel
        .findById(body.conversation_id)
        .lean();

      if (!conversation)
        throw new ExceptionResponse(400, 'Không tìm thấy cuộc trò chuyện');

      const members: User[] = await this.userModel
        .find(
          {
            _id: {
              $in: conversation.members.map((item) => new Types.ObjectId(item)),
            },
          },
          {
            _id: true,
            full_name: true,
            avatar: true,
          },
        )
        .lean();

      const permission = await this.conversationMemberModel
        .findOne({
          conversation_id: body.conversation_id,
          user_id: user_id,
        })
        .lean();

      let block_type = 0;

      if (conversation.type == 2) {
        const other = members.find((item) => {
          return item._id.toString() != user_id;
        });

        conversation.name = other?.full_name;
        conversation.avatar = other?.avatar;

        const has_block = await this.blockModel
          .findOne({
            $or: [
              {
                user_id: conversation.members[0],
                user_block_id: conversation.members[1],
              },
              {
                user_id: conversation.members[1],
                user_block_id: conversation.members[0],
              },
            ],
          })
          .lean();

        // 0 khoong chan
        // 1 la minh chan nguoi ta
        // 2 la nguoi ta chan minh

        if (has_block) {
          if (has_block.user_id.toString() == user_id) {
            block_type = 1;
          } else {
            block_type = 2;
          }
        }
      }

      const result = {
        ...conversation,
        my_permission: permission?.permission || 0,
        created_at: formatUnixTimestamp(conversation.created_at),
        updated_at: formatUnixTimestamp(conversation.updated_at),
        last_activity: formatUnixTimestamp(conversation.last_activity),
        block_type: block_type,
      };

      return new BaseResponse(
        200,
        'OK',
        new DetailConversationResponse(result),
      );
    } catch (error) {
      console.log('ConversationService ~ detailConversation ~ error:', error);
      return new BaseResponse(400, 'FAIL');
    }
  }

  async hiddenConversation(conversation_id: string, user_id: string) {
    try {
      const conversation = await this.getOneConversation(conversation_id);

      if (!conversation?.members?.includes(user_id)) {
        throw new ExceptionResponse(400, 'Không tìm thấy cuộc trò chuyện');
      }

      const hasConversationHidden = await this.conversationHiddenModel.exists({
        user_id: user_id,
        conversation_id: conversation_id,
      });

      if (hasConversationHidden) {
        await this.conversationHiddenModel.deleteOne({
          user_id: user_id,
          conversation_id: conversation_id,
        });
      } else {
        await this.conversationHiddenModel.create({
          user_id: user_id,
          conversation_id: conversation_id,
          updated_at: +moment(),
          created_at: +moment(),
        });
      }

      return new BaseResponse(200, 'OK');
    } catch (error) {
      console.log('ConversationService ~ hiddenConversation ~ error:', error);
      return error.response;
    }
  }

  async deleteConversation(conversation_id: string, user_id: string) {
    try {
      const conversation = await this.getOneConversation(conversation_id);

      if (!conversation?.members?.includes(user_id)) {
        throw new ExceptionResponse(400, 'Không tìm thấy cuộc trò chuyện');
      }

      await this.conversationMemberModel.updateOne(
        {
          user_id: user_id,
          conversation_id: conversation_id,
        },
        {
          message_last_id: +moment(),
          message_pre_id: +moment(),
          updated_at: +moment(),
        },
      );

      // conversation_ids is set, if not exist, create new
      // await this.conversationDeleteHistoryModel.updateOne(
      //   { user_id: user_id },
      //   {
      //     $addToSet: {
      //       conversation_ids: { $ne: conversation_id },
      //     },
      //   },
      //   { upsert: true , },
      // );

      return new BaseResponse(200, 'OK');
    } catch (error) {
      console.log('ConversationService ~ deleteConversation ~ error:', error);
      return error.response;
    }
  }

  async disableNotify(conversation_id: string, user_id: string) {
    try {
      const conversation = await this.getOneConversation(conversation_id);

      if (!conversation?.members?.includes(user_id)) {
        throw new ExceptionResponse(400, 'Không tìm thấy cuộc trò chuyện');
      }

      const hasConversationHidden =
        await this.conversationDisableNotifyModel.exists({
          user_id: user_id,
          conversation_id: conversation_id,
        });

      if (hasConversationHidden) {
        await this.conversationDisableNotifyModel.deleteOne({
          user_id: user_id,
          conversation_id: conversation_id,
        });
      } else {
        await this.conversationDisableNotifyModel.create({
          user_id: user_id,
          conversation_id: conversation_id,
          updated_at: +moment(),
          created_at: +moment(),
        });
      }

      return new BaseResponse(200, 'OK');
    } catch (error) {
      console.log('ConversationService ~ disableNotify ~ error:', error);
      return error.response;
    }
  }

  async pinConversation(user_id: string, conversation_id: string) {
    try {
      const conversation = await this.getOneConversation(conversation_id);

      if (!conversation?.members?.includes(user_id)) {
        throw new ExceptionResponse(400, 'Không tìm thấy cuộc trò chuyện');
      }

      const hasConversationHidden = await this.conversationPinnedModel.exists({
        user_id: user_id,
        conversation_id: conversation_id,
      });

      if (hasConversationHidden) {
        await this.conversationPinnedModel.deleteOne({
          user_id: user_id,
          conversation_id: conversation_id,
        });
      } else {
        await this.conversationPinnedModel.create({
          user_id: user_id,
          conversation_id: conversation_id,
          updated_at: +moment(),
          created_at: +moment(),
        });
      }

      return new BaseResponse(200, 'OK');
    } catch (error) {
      console.log('ConversationService ~ pinConversation ~ error:', error);
      return error.response;
    }
  }

  async updateBackgroundConversation(
    conversation_id: string,
    back_ground: string,
    user: any,
  ) {
    try {
      if (!back_ground)
        throw new ExceptionResponse(400, 'Không thể đặt tên trống');
      const conversation = await this.getOneConversation(conversation_id);

      if (!conversation?.members?.includes(user._id)) {
        throw new ExceptionResponse(404, 'Không tìm thấy cuộc trò chuyện');
      }

      conversation.background = back_ground;

      conversation.save();
      const message = await this.messageModel.create({
        conversation_id: conversation_id,
        message: back_ground,
        user_id: user._id,
        type: MESSAGE_TYPE.UPDATE_BACKGROUND,
        created_at: +moment(),
        updated_at: +moment(),
      });

      global['io'].to(conversation.members).emit('update-background', {
        event: 'update-background',
        message: 'Cập nhật ảnh back ground nhóm',
        data: {
          conversation_id: conversation_id,
          name: conversation.name,
          members: conversation.members,
          owner_id: conversation.owner_id,

          last_message: {
            message_id: message._id.toString(),
            message: message.message,
            user: {
              user_id: user._id.toString(),
              full_name: user.full_name,
              avatar: user.avatar,
            },
            type: message.type,
            created_at: formatUnixTimestamp(message.created_at),
          },
        },
      });

      return new BaseResponse(200, 'OK', {
        back_ground: conversation.background,
      });
    } catch (error) {
      console.log(
        'ConversationService ~ updateBackgroundConversation ~ error:',
        error,
      );
      return new BaseResponse(400, 'FAIL', error);
    }
  }

  async settingConfirmMemberConversation(conversation_id: string, user: any) {
    try {
      const conversation = await this.getOneConversation(conversation_id);

      if (
        !conversation?.members?.includes(user._id) ||
        conversation.owner_id !== user._id
      ) {
        throw new ExceptionResponse(400, 'Không tìm thấy cuộc trò chuyện');
      }

      conversation.is_confirm_new_member = +!conversation.is_confirm_new_member;

      conversation.save();

      const message = await this.messageModel.create({
        conversation_id: conversation_id,
        message: 'Đã bật/tắt chức năng phê duyệt thành viên',
        user_id: user._id,
        type: MESSAGE_TYPE.UPDATE_IS_CONFIRM_NEW_MEMBER,
        created_at: +moment(),
        updated_at: +moment(),
      });

      global['io'].to(conversation.members).emit('is-confirm-member', {
        event: 'is-confirm-member',
        message: 'Đã bật/tắt chức năng phê duyệt thành viên',
        data: {
          conversation_id: conversation_id,
          name: conversation.name,
          members: conversation.members,
          owner_id: conversation.owner_id,

          last_message: {
            message_id: message._id.toString(),
            message: message.message,
            user: {
              user_id: user._id.toString(),
              full_name: user.full_name,
              avatar: user.avatar,
            },
            type: message.type,
            created_at: formatUnixTimestamp(message.created_at),
          },
        },
      });

      return new BaseResponse(200, 'OK');
    } catch (error) {
      console.log(
        'ConversationService ~ settingConfirmMemberConversation ~ error:',
        error,
      );
      return new BaseResponse(400, 'FAIL', error);
    }
  }

  async updateNameConversation(
    conversation_id: string,
    name: string,
    user: any,
  ) {
    try {
      if (!name) throw new ExceptionResponse(400, 'Không thể đặt tên trống');
      const conversation = await this.getOneConversation(conversation_id);

      if (
        !conversation?.members?.includes(user._id) ||
        conversation.type !== CONVERSATION_TYPE.GROUP
      ) {
        throw new ExceptionResponse(404, 'Không tìm thấy cuộc trò chuyện');
      }

      conversation.name = name;

      conversation.save();

      const message = await this.messageModel.create({
        conversation_id: conversation_id,
        message: name,
        user_id: user._id,
        type: MESSAGE_TYPE.UPDATE_BACKGROUND,
        created_at: +moment(),
        updated_at: +moment(),
      });

      global['io'].to(conversation.members).emit('update-name-group', {
        event: 'update-name-group',
        message: 'Cập nhật tên nhóm',
        data: {
          conversation_id: conversation_id,
          name: conversation.name,
          members: conversation.members,
          owner_id: conversation.owner_id,

          last_message: {
            message_id: message._id.toString(),
            message: message.message,
            user: {
              user_id: user._id.toString(),
              full_name: user.full_name,
              avatar: user.avatar,
            },
            type: message.type,
            created_at: formatUnixTimestamp(message.created_at),
          },
        },
      });

      return new BaseResponse(200, 'OK', { name: conversation.name });
    } catch (error) {
      console.log(
        'ConversationService ~ updateNameConversation ~ error:',
        error,
      );
      return new BaseResponse(400, 'FAIL', error);
    }
  }

  private async getOneConversation(conversation_id: string) {
    if (!checkMongoId(conversation_id)) {
      throw new ExceptionResponse(400, 'Conversation_id không hợp lệ');
    }

    return await this.conversationModel.findById({
      _id: new Types.ObjectId(conversation_id),
    });
  }

  async getListPinnedConversation(user_id: string) {
    try {
      const listConversationPinned =
        await this.getListConversationPinned(user_id);

      if (listConversationPinned.length == 0) {
        return new BaseResponse(200, 'OK', []);
      }

      const listConversationIds = listConversationPinned.map(
        (item) => item.conversation_id,
      );

      const conversations = await this.conversationModel
        .find({
          _id: { $in: listConversationIds },
        })
        .lean();

      const listUserIds = [];
      const listMessageIds = [];

      conversations.map((item) => {
        if (item.type == CONVERSATION_TYPE.PERSONAL)
          listUserIds.push(...item.members);
        listMessageIds.push(new Types.ObjectId(item.last_message_id));
        listConversationIds.push(item._id.toString());
      });

      // get member info

      const listMember: { [user_id: string]: UserMessageResponse } =
        await this.userModel
          .find(
            { _id: { $in: listUserIds } },
            { _id: true, full_name: true, avatar: true, status: true },
          )
          .then((data) => {
            return data.reduce((map, current) => {
              map[current._id.toString()] = {
                _id: current._id.toString(),
                avatar: current.avatar,
                full_name: current.full_name,
              };
              return map;
            }, {});
          });

      // get last message info

      const listMessage = await this.getListLastMessageConversation(
        listMessageIds,
      ).then((data) => {
        return data.reduce((map, message: any) => {
          map[message._id.toString()] = {
            ...message,
            user: new UserMessageResponse(message.user_id),
            updated_at: formatUnixTimestamp(message.updated_at),
            created_at: formatUnixTimestamp(message.created_at),
          };
          return map;
        }, {});
      });

      const myPermissions = await this.conversationMemberModel
        .find({
          user_id: user_id,
          conversation_id: { $in: listConversationIds },
        })
        .lean();

      const mapMyPermissions = myPermissions.reduce((map, current) => {
        map[current.conversation_id] = current?.permission;
        return map;
      }, {});

      const listConversationDisableNotify =
        await this.getListConversationDisableNotify(user_id);

      const data = conversations.map((item) => {
        const id = item._id.toString();

        if (item.type == CONVERSATION_TYPE.PERSONAL) {
          const otherUserId = item.members.find((_id) => _id != user_id);

          const otherUser = listMember[otherUserId];

          item.avatar = otherUser?.avatar || '';
          item.name = otherUser?.full_name || '';
        }

        return {
          ...item,
          _id: id,
          is_notify: listConversationDisableNotify.find(
            (temp) => temp.conversation_id == id,
          )
            ? 0
            : 1,
          is_pinned: 1,

          created_at: formatUnixTimestamp(item.created_at),
          updated_at: formatUnixTimestamp(item.updated_at),
          last_activity: formatUnixTimestamp(item.last_activity),
          last_message: new LastMessageResponse({
            ...listMessage[item.last_message_id],
            _id: listMessage[item.last_message_id]._id.toString(),
          }),
          my_permission: mapMyPermissions[item._id.toString()] || 0,
        };
      });

      return new BaseResponse(200, 'OK', data);
    } catch (error) {
      console.log(
        'ConversationService ~ getListPinnedConversation ~ error:',
        error,
      );
      throw new ExceptionResponse(error.status, error.message, error);
    }
  }

  async getDetailConversationWithLinkJoin(linkJoin: string, userId: any) {
    const conversation: Conversation = await this.conversationModel
      .findOne({ link_join: linkJoin })
      .lean();

    if (!conversation)
      throw new ExceptionResponse(
        HttpStatus.NOT_FOUND,
        'Không tìm thấy cuộc trò chuyện',
      );

    // if (conversation.members.includes(userId))
    //   throw new ExceptionResponse(
    //     HttpStatus.BAD_REQUEST,
    //     'Bạn đã là thành viên của cuộc trò chuyện này',
    //   );

    const listMember = await this.conversationMemberModel
      .find({
        conversation_id: conversation._id.toString(),
        user_id: { $ne: userId },
      })
      .populate('user_id', '_id full_name avatar status')
      .sort({ permission: 'desc', created_at: 'desc' })
      .lean();

    const response = await Promise.all(
      listMember.map(async (item) => {
        const user = item.user_id as unknown as User;
        return {
          ...user,
          user_id: user._id,
          permission: item.permission,
          contact_type:
            (
              await this.friendModel
                .findOne({
                  user_id: userId,
                  user_friend_id: user._id.toString(),
                })
                .lean()
            )?.type || 0,
        };
      }),
    );

    return {
      status: 200,
      message: 'success',
      data: {
        conversation_id: conversation?._id,
        name: conversation?.name,
        type: conversation?.type,
        is_confirm_new_member: conversation?.is_confirm_new_member,
        no_of_member: conversation?.no_of_member,
        link_join: conversation?.link_join,
        avatar: conversation?.avatar,
        members: response,
        is_join: conversation.members.includes(userId) ? 1 : 0,
      },
    };
  }
}
