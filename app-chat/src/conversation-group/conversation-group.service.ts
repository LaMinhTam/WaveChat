import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import {
  BOOLEAN,
  CONVERSATION_MEMBER_PERMISSION,
  CONVERSATION_STATUS,
  CONVERSATION_TYPE,
  MESSAGE_TYPE,
  USER_STATUS,
} from 'src/enum';
import {
  Conversation,
  ConversationMember,
  ConversationMemberWaitingConfirm,
  ExceptionResponse,
  Message,
  User,
  UserResponse,
} from 'src/shared';
import { BaseResponse } from 'src/shared/base-response.response';
import { Friend } from 'src/shared/friend.entity';
import {
  checkMongoId,
  formatUnixTimestamp,
  generateRandomString,
} from 'src/util';
import {
  AddMemberConversationDto,
  ConfirmMemberConversationDto,
  RemoveMemberConversationDto,
} from './dto/add-member-conversation.dto';
import { CreateGroupConversationDto } from './dto/create-group-conversation.dto';
import { UpdatePermissionConversation } from './dto/update-permission.dto';
import { RedisSubService } from 'src/redis/redis-sub.service';

@Injectable()
export class ConversationGroupService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,

    @InjectModel(ConversationMember.name)
    private readonly conversationMemberModel: Model<ConversationMember>,

    @InjectModel(ConversationMemberWaitingConfirm.name)
    private readonly conversationMemberWaitingModel: Model<ConversationMemberWaitingConfirm>,

    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,

    @InjectModel(Friend.name)
    private readonly friendModel: Model<Friend>,

    private readonly redisSubService: RedisSubService,
  ) {}

  async updatePermissionConversation(
    conversation_id: string,
    body: UpdatePermissionConversation,
    user: any,
  ) {
    try {
      const member_id = body.user_id;
      const permission = body.permission;

      if (!checkMongoId(member_id)) {
        throw new ExceptionResponse(400, 'member_id không hợp lệ');
      }

      const member = await this.userModel.findOne({
        status: USER_STATUS.ACTIVE,
        _id: new Types.ObjectId(member_id),
      });

      if (!member) {
        throw new ExceptionResponse(404, 'Không tìm thấy user hợp lệ!');
      }

      const conversation = await this.getOneConversation(conversation_id);

      if (conversation.type !== CONVERSATION_TYPE.GROUP) {
        throw new ExceptionResponse(
          404,
          'Chỉ có thể sử dụng với cuộc trò chuyện nhóm!',
        );
      }

      if (
        !conversation?.members?.includes(user._id) ||
        !conversation?.members?.includes(member_id)
      ) {
        throw new ExceptionResponse(404, 'Có user không hợp lệ!');
      }

      if (conversation.owner_id !== user._id) {
        throw new ExceptionResponse(400, 'Bạn không có quyền sử dụng!');
      }

      if (permission == CONVERSATION_MEMBER_PERMISSION.OWNER) {
        await this.conversationMemberModel.updateOne(
          {
            user_id: user._id,
            conversation_id: conversation_id,
          },
          {
            permission: CONVERSATION_MEMBER_PERMISSION.MEMBER,
          },
        );

        await this.conversationModel.updateOne(
          { _id: conversation._id },
          { owner_id: member_id },
        );
      }

      await this.conversationMemberModel.updateOne(
        {
          user_id: member_id,
          conversation_id: conversation_id,
        },
        {
          permission: permission,
        },
      );

      const message = await this.messageModel.create({
        user_id: user._id,
        conversation_id: conversation_id,
        message: 'Đã cập nhật quyền thành viên',
        type: MESSAGE_TYPE.CHANGE_PERMISSION_USER,
        user_target: {
          user_id: member_id,
          full_name: member.full_name,
          avatar: member.avatar,
        },
        created_at: +moment(),
        updated_at: +moment(),
      });

      global['io'].to(conversation.members).emit('update-permission', {
        event: 'update-permission',
        message: 'Cập nhật quyền thành viên',
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
        'ConversationService ~ updatePermissionConversation ~ error:',
        error,
      );
      return error.response;
    }
  }

  async createNewGroupConversation(
    user_id: string,
    createConversation: CreateGroupConversationDto,
  ) {
    const { name, member_ids } = createConversation;
    try {
      const member = await this.userModel.find({
        _id: { $in: member_ids.map((_id) => new Types.ObjectId(_id)) },
      });

      if (!(member?.length == member_ids.length)) {
        throw new ExceptionResponse(400, 'Có user không tồn tại');
      }

      const newConversation = await this.conversationModel.create({
        name: name,
        owner_id: user_id,
        members: [user_id, ...member_ids],
        type: CONVERSATION_TYPE.GROUP,
        no_of_member: member_ids.length + 1,
      });

      //tạo member

      await this.conversationMemberModel.create(
        newConversation.members.map((id) => {
          return {
            user_id: id,
            permission:
              id.toString() == user_id.toString()
                ? CONVERSATION_MEMBER_PERMISSION.OWNER
                : CONVERSATION_MEMBER_PERMISSION.MEMBER,
            conversation_id: newConversation._id.toString(),
          };
        }),
      );

      // tạo tin nhắn chào mừng - hiện tại chưa được tạo bừa cái message text
      const firstMessage = await this.messageModel.create({
        user_id: user_id,
        conversation_id: newConversation._id.toString(),
        message: 'Xin chào cuộc trò chuyện nhóm mới',
        type: MESSAGE_TYPE.NEW_GROUP,
      });

      await this.conversationModel.updateOne(
        {
          _id: newConversation.id,
        },
        {
          last_message_id: firstMessage._id.toString(),
          last_activity: +moment(),
          updated_at: +moment(),
        },
      );

      const user = await this.userModel.findOne({
        _id: new Types.ObjectId(user_id),
      });

      global['io'].to(newConversation.members).emit('new-conversation', {
        event: 'new-conversation',
        message: 'Tạo cuộc trò chuyện mới',
        data: {
          conversation_id: newConversation._id.toString(),
          name: newConversation.name,
          members: newConversation.members,
          owner_id: newConversation.owner_id,

          last_message: {
            message_id: firstMessage._id.toString(),
            message: firstMessage.message,
            user: {
              user_id: user._id.toString(),
              full_name: user.full_name,
              avatar: user.avatar,
            },
            type: firstMessage.type,
            created_at: formatUnixTimestamp(firstMessage.created_at),
          },
        },
      });

      // this.redisSubService.emitMessageToUser(
      //   newConversation.members,
      //   'new-conversation',
      //   {
      //     event: 'new-conversation',
      //     message: 'Tạo cuộc trò chuyện mới',
      //     data: {
      //       conversation_id: newConversation._id.toString(),
      //       name: newConversation.name,
      //       members: newConversation.members,
      //       owner_id: newConversation.owner_id,

      //       last_message: {
      //         message_id: firstMessage._id.toString(),
      //         message: firstMessage.message,
      //         user: {
      //           user_id: user._id.toString(),
      //           full_name: user.full_name,
      //           avatar: user.avatar,
      //         },
      //         type: firstMessage.type,
      //         created_at: formatUnixTimestamp(firstMessage.created_at),
      //       },
      //     },
      //   },
      // );

      return new BaseResponse(201, 'OK', {
        conversation_id: newConversation._id,
      });
    } catch (error) {
      console.log('ConversationGroupService ~ error:', error);
      return error.response;
    }
  }

  async isJoinWithLink(conversation_id: string, user: UserResponse) {
    try {
      const conversation = await this.getOneConversation(conversation_id);

      if (
        !conversation?.members?.includes(user._id) ||
        conversation.type != CONVERSATION_TYPE.GROUP
      ) {
        throw new ExceptionResponse(400, 'Không tìm thấy cuộc trò chuyện');
      }

      const is_join_with_link =
        conversation.is_join_with_link == BOOLEAN.TRUE
          ? BOOLEAN.FALSE
          : BOOLEAN.TRUE;

      let new_link_join: string = '';

      if (is_join_with_link == BOOLEAN.FALSE) new_link_join = '';
      else new_link_join = generateRandomString(10);

      // tạo tin nhắn chào mừng - hiện tại chưa được tạo bừa cái message text
      const messageSetting = await this.messageModel.create({
        user_id: user._id,
        conversation_id: conversation._id.toString(),
        message:
          new_link_join == ''
            ? 'Chủ nhóm đã tắt tham gia bằng link'
            : 'Chủ nhóm đã bật tham gia bằng link',
        type: MESSAGE_TYPE.UPDATE_IS_JOIN_WITH_LINK,
      });

      await this.conversationModel.updateOne(
        { _id: conversation._id },
        {
          link_join: new_link_join,
          last_activity: +moment(),
          updated_at: +moment(),
          last_message_id: messageSetting._id.toString(),
          is_join_with_link: is_join_with_link,
        },
      );

      global['io'].to(conversation.members).emit('update-join-with-link', {
        event: 'update-join-with-link',
        message: 'Thay đổi cài đặt tham gia link',
        data: {
          conversation_id: conversation._id.toString(),
          name: conversation.name,
          members: conversation.members,
          owner_id: conversation.owner_id,

          last_message: {
            message_id: messageSetting._id.toString(),
            message: messageSetting.message,
            user: {
              user_id: user._id.toString(),
              full_name: user.full_name,
              avatar: user.avatar,
            },
            type: messageSetting.type,
            created_at: formatUnixTimestamp(messageSetting.created_at),
          },
        },
      });

      // this.redisSubService.emitMessageToUser(
      //   conversation.members,
      //   'update-join-with-link',
      //   {
      //     event: 'update-join-with-link',
      //     message: 'Thay đổi cài đặt tham gia link',
      //     data: {
      //       conversation_id: conversation._id.toString(),
      //       name: conversation.name,
      //       members: conversation.members,
      //       owner_id: conversation.owner_id,

      //       last_message: {
      //         message_id: messageSetting._id.toString(),
      //         message: messageSetting.message,
      //         user: {
      //           user_id: user._id.toString(),
      //           full_name: user.full_name,
      //           avatar: user.avatar,
      //         },
      //         type: messageSetting.type,
      //         created_at: formatUnixTimestamp(messageSetting.created_at),
      //       },
      //     },
      //   },
      // );

      return new BaseResponse(200, 'OK', { link_join: new_link_join });
    } catch (error) {
      console.log('ConversationGroupService ~ isJoinWithLink ~ error:', error);
      return new ExceptionResponse(400, error.message);
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

  async getMembersConversation(conversation_id: string, user_id: string) {
    try {
      const listMember = await this.conversationMemberModel
        .find({
          conversation_id: new Types.ObjectId(conversation_id),
        })
        .sort({ permission: 'desc', created_at: 'desc' })
        .lean();

      if (listMember.length === 0) return new BaseResponse(200, 'OK', []);

      const listMemberUserIds = listMember.map(
        (item) => new Types.ObjectId(item.user_id),
      );

      const listUser = await this.userModel
        .find(
          {
            _id: { $in: listMemberUserIds },
          },
          {
            _id: 1,
            full_name: 1,
            avatar: 1,
            status: 1,
          },
        )
        .then((res) => {
          const data = {};
          res.forEach((item) => {
            data[item._id.toString()] = {
              user_id: item._id.toString(),
              full_name: item.full_name,
              avatar: item.avatar,
              status: item.status,
            };
          });

          return data;
        });

      const response = await Promise.all(
        listMember.map(async (item) => {
          const user = listUser[item.user_id] || {};

          return {
            _id: item._id.toString(),
            user_id: user.user_id,
            full_name: user.full_name,
            avatar: user.avatar,
            status: user.status,
            permission: item.permission,
            contact_type:
              user.user_id == user_id
                ? 1
                : (
                    await this.friendModel
                      .findOne({
                        user_id: user_id,
                        user_friend_id: user.user_id,
                      })
                      .lean()
                  )?.type || 0,
          };
        }),
      );

      return new BaseResponse(200, 'OK', response);
    } catch (error) {
      console.log(
        'ConversationGroupService ~ getMembersConversation ~ error:',
        error,
      );
      return error.response;
    }
  }
  async removeMembersConversation(
    conversation_id: string,
    user: UserResponse,
    body: RemoveMemberConversationDto,
  ) {
    try {
      const member_id = body.user_id;

      if (user._id == member_id) {
        throw new ExceptionResponse(400, 'Không thể xóa chính mình');
      }

      const conversation = await this.getOneConversation(conversation_id);

      if (
        !conversation ||
        conversation.status != CONVERSATION_STATUS.ACTIVE ||
        !conversation.members.includes(user._id) ||
        !conversation.members.includes(member_id)
      ) {
        throw new ExceptionResponse(404, 'Không tìm thấy cuộc trò chuyện');
      }

      const permissionUser = await this.conversationMemberModel.findOne({
        user_id: user._id,
        conversation_id: conversation_id,
      });

      if (
        !permissionUser ||
        permissionUser?.permission === CONVERSATION_MEMBER_PERMISSION.MEMBER
      ) {
        throw new ExceptionResponse(
          400,
          'Bạn không có quyền sử dụng chức năng này',
        );
      }

      const permissionTarget = await this.conversationMemberModel.findOne({
        user_id: member_id,
        conversation_id: conversation_id,
      });

      if (
        !permissionTarget ||
        permissionTarget.permission === CONVERSATION_MEMBER_PERMISSION.OWNER
      ) {
        throw new ExceptionResponse(400, 'Không thể xóa chủ nhóm');
      }

      await this.conversationMemberModel.deleteOne({
        user_id: member_id,
        conversation_id: conversation_id,
      });

      const userTarget = await this.userModel
        .findOne(
          {
            _id: new Types.ObjectId(member_id),
          },
          {
            _id: 1,
            full_name: 1,
            avatar: 1,
            status: 1,
          },
        )
        .lean();

      const newMessage = await this.messageModel.create({
        user_id: user._id,
        conversation_id: conversation_id,
        message: 'Đã xóa thành viên',
        user_target: userTarget,
        type: MESSAGE_TYPE.REMOVE_USER,
        created_at: +moment(),
        updated_at: +moment(),
      });

      await this.conversationModel.updateOne(
        { _id: conversation._id },
        {
          $pull: { members: member_id },
          $inc: { no_of_member: -1 },
          last_activity: +moment(),
          last_message_id: newMessage._id.toString(),
          updated_at: +moment(),
        },
      );

      global['io'].to(conversation.members).emit('remove-member', {
        event: 'remove-member',
        message: 'Xóa thành viên',
        data: {
          conversation_id: conversation._id.toString(),
          name: conversation.name,
          members: conversation.members,
          owner_id: conversation.owner_id,

          last_message: {
            message_id: newMessage._id.toString(),
            message: newMessage.message,
            user: {
              user_id: user._id,
              full_name: user.full_name,
              avatar: user.avatar,
            },
            type: newMessage.type,
            created_at: formatUnixTimestamp(newMessage.created_at),
          },
        },
      });

      // this.redisSubService.emitMessageToUser(
      //   conversation.members,
      //   'remove-member',
      //   {
      //     event: 'remove-member',
      //     message: 'Xóa thành viên',
      //     data: {
      //       conversation_id: conversation._id.toString(),
      //       name: conversation.name,
      //       members: conversation.members,
      //       owner_id: conversation.owner_id,

      //       last_message: {
      //         message_id: newMessage._id.toString(),
      //         message: newMessage.message,
      //         user: {
      //           user_id: user._id,
      //           full_name: user.full_name,
      //           avatar: user.avatar,
      //         },
      //         type: newMessage.type,
      //         created_at: formatUnixTimestamp(newMessage.created_at),
      //       },
      //     },
      //   },
      // );

      return new BaseResponse(200, 'OK');
    } catch (error) {
      console.log(
        'ConversationGroupService ~ removeMembersConversation ~ error:',
        error,
      );
      return error.response;
    }
  }
  async addMembersConversation(
    conversation_id: string,
    user: UserResponse,
    body: AddMemberConversationDto,
  ) {
    try {
      const userIdAdded = body.members;
      const conversation = await this.getOneConversation(conversation_id);

      if (!conversation || conversation.status != CONVERSATION_STATUS.ACTIVE) {
        throw new ExceptionResponse(404, 'Không tìm thấy cuộc trò chuyện');
      }

      const listUserAdd = await this.userModel.find({
        _id: { $in: userIdAdded.map((item) => new Types.ObjectId(item)) },
        status: USER_STATUS.ACTIVE,
      });

      if (listUserAdd.length !== userIdAdded.length) {
        throw new ExceptionResponse(400, 'Có người dùng không hợp lệ');
      }

      const checkMemberJoinedChat = await this.conversationMemberModel.find({
        conversation_id: conversation_id,
        user_id: { $in: userIdAdded },
      });

      if (checkMemberJoinedChat.length) {
        throw new ExceptionResponse(
          404,
          'Có người dùng đã là thành viên của nhóm',
        );
      }

      const checkMemberJoinedWaitingConfirm =
        await this.conversationMemberModel.find({
          conversation_id: conversation_id,
          user_id: { $in: userIdAdded },
        });

      if (checkMemberJoinedWaitingConfirm.length) {
        throw new ExceptionResponse(
          404,
          'Có người dùng đã trong danh sách chờ duyệt thành viên',
        );
      }

      const userPermission = await this.conversationMemberModel.findOne({
        user_id: user._id,
        conversation_id: conversation_id,
      });

      let newMessage;

      if (userPermission.permission == CONVERSATION_MEMBER_PERMISSION.MEMBER) {
        /** thêm danh sách chờ hoặc add member trực tiếp */

        if (conversation.is_confirm_new_member == BOOLEAN.TRUE) {
          /**
           * add vào waiting_confirm
           */

          await this.conversationMemberWaitingModel.create(
            userIdAdded.map((item) => {
              return {
                conversation_id: conversation_id,
                user_id: item,
                updated_at: +moment(),
                created_at: +moment(),
              };
            }),
          );

          newMessage = await this.messageModel.create({
            user_id: user._id,
            conversation_id: conversation_id,
            message: 'Đã thêm thành viên',
            type: MESSAGE_TYPE.WAITING_CONFIRM,
            user_target: listUserAdd.map((item) => {
              return {
                user_id: item._id.toString(),
                full_name: item.full_name,
                avatar: item.avatar,
              };
            }),
            created_at: +moment(),
            updated_at: +moment(),
          });

          await this.conversationModel.updateOne(
            { _id: conversation._id },
            {
              last_message_id: newMessage._id.toString(),
              last_activity: +moment(),
              updated_at: +moment(),
            },
          );
        }
      } else {
        /**
         * Thêm thành member trực tiếp
         */

        /**
         * add vao nhom
         */
        await this.addListMember(userIdAdded, conversation_id);

        newMessage = await this.messageModel.create({
          user_id: user._id,
          conversation_id: conversation_id,
          message: 'Đã thêm thành viên',
          type: MESSAGE_TYPE.ADD_NEW_USER,
          user_target: listUserAdd.map((item) => {
            return {
              user_id: item._id.toString(),
              full_name: item.full_name,
              avatar: item.avatar,
            };
          }),
          created_at: +moment(),
          updated_at: +moment(),
        });

        await this.conversationModel.updateOne(
          { _id: conversation._id },
          {
            last_message_id: newMessage._id.toString(),
            last_activity: +moment(),
            updated_at: +moment(),
          },
        );

        conversation.members = [...conversation.members, ...userIdAdded];
      }

      global['io'].to(conversation.members).emit('add-member', {
        event: 'add-member',
        message: 'Thêm thành viên',
        data: {
          conversation_id: conversation._id.toString(),
          name: conversation.name,
          members: conversation.members,
          owner_id: conversation.owner_id,

          last_message: {
            message_id: newMessage._id.toString(),
            message: newMessage.message,
            user: {
              user_id: user._id,
              full_name: user.full_name,
              avatar: user.avatar,
            },
            user_target: newMessage.user_target,
            type: newMessage.type,
            created_at: formatUnixTimestamp(newMessage.created_at),
          },
        },
      });

      // this.redisSubService.emitMessageToUser(
      //   conversation.members,
      //   'add-member',
      //   {
      //     event: 'add-member',
      //     message: 'Thêm thành viên',
      //     data: {
      //       conversation_id: conversation._id.toString(),
      //       name: conversation.name,
      //       members: conversation.members,
      //       owner_id: conversation.owner_id,

      //       last_message: {
      //         message_id: newMessage._id.toString(),
      //         message: newMessage.message,
      //         user: {
      //           user_id: user._id,
      //           full_name: user.full_name,
      //           avatar: user.avatar,
      //         },
      //         user_target: newMessage.user_target,
      //         type: newMessage.type,
      //         created_at: formatUnixTimestamp(newMessage.created_at),
      //       },
      //     },
      //   },
      // );

      return new BaseResponse(200, 'OK');
    } catch (error) {
      console.log(
        'ConversationGroupService ~ disbandConversation ~ error:',
        error,
      );

      return error.response;
    }
  }

  async addListMember(userIdAdded: string[], conversation_id: string) {
    await this.conversationMemberModel.create(
      userIdAdded.map((item) => {
        return {
          conversation_id: conversation_id,
          user_id: item,
          updated_at: +moment(),
          created_at: +moment(),
          message_last_id: 0,
          message_pre_id: 0,
          permission: CONVERSATION_MEMBER_PERMISSION.MEMBER,
        };
      }),
    );

    await this.conversationModel.updateOne(
      {
        _id: conversation_id,
      },
      {
        $push: { members: { $each: userIdAdded } },
        last_activity: +moment(),

        $inc: { no_of_member: userIdAdded.length },
      },
    );
  }

  async disbandConversation(conversation_id: string, user_id: string) {
    try {
      const conversation = await this.getOneConversation(conversation_id);

      if (
        !conversation ||
        conversation.status != CONVERSATION_STATUS.ACTIVE ||
        !conversation.members.includes(user_id)
      ) {
        throw new ExceptionResponse(404, 'Không tìm thấy cuộc trò chuyện');
      }

      if (conversation.owner_id !== user_id)
        throw new ExceptionResponse(
          400,
          'Bạn không có quyền sử dụng chức năng này',
        );

      conversation.status = CONVERSATION_STATUS.NOT_ACTIVE;

      conversation.save();

      global['io'].to(conversation.members).emit('disband-group', {
        event: 'disband-group',
        message: 'Giải tán nhóm',
        data: {
          conversation_id: conversation._id.toString(),
          name: conversation.name,
          members: conversation.members,
          owner_id: conversation.owner_id,
        },
      });

      // this.redisSubService.emitMessageToUser(
      //   conversation.members,
      //   'disband-group',
      //   {
      //     event: 'disband-group',
      //     message: 'Giải tán nhóm',
      //     data: {
      //       conversation_id: conversation._id.toString(),
      //       name: conversation.name,
      //       members: conversation.members,
      //       owner_id: conversation.owner_id,
      //     },
      //   },
      // );

      return new BaseResponse(200, 'OK');
    } catch (error) {
      console.log(
        'ConversationGroupService ~ disbandConversation ~ error:',
        error,
      );

      return error.response;
    }
  }

  async userLeaveConversation(conversation_id: string, user: UserResponse) {
    try {
      const conversation = await this.getOneConversation(conversation_id);

      if (
        !conversation ||
        conversation.status != CONVERSATION_STATUS.ACTIVE ||
        !conversation.members.includes(user._id)
      ) {
        throw new ExceptionResponse(404, 'Không tìm thấy cuộc trò chuyện');
      }

      if (conversation.owner_id == user._id)
        throw new ExceptionResponse(
          400,
          'Hãy chuyển quyền trưởng nhóm trước khi rời nhóm',
        );

      await this.conversationMemberModel.deleteOne({
        user_id: user._id,
        conversation_id: conversation_id,
      });

      conversation.members = conversation.members.filter(
        (item) => item != user._id,
      );

      const newMessage = await this.messageModel.create({
        user_id: user._id,
        conversation_id: conversation_id,
        message: 'Đã rời nhóm',
        type: MESSAGE_TYPE.USER_OUT_GROUP,
        created_at: +moment(),
        updated_at: +moment(),
      });

      await this.conversationModel.updateOne(
        {
          _id: conversation._id,
        },
        {
          last_message_id: newMessage._id.toString(),
          last_activity: +moment(),
          updated_at: +moment(),
          members: conversation.members.filter((item) => item != user._id),
        },
      );

      global['io'].to(conversation.members).emit('leave-group', {
        event: 'leave-group',
        message: 'Rời nhóm',
        data: {
          conversation_id: conversation._id.toString(),
          name: conversation.name,
          members: conversation.members,

          last_message: {
            message_id: newMessage._id.toString(),
            message: newMessage.message,
            user: {
              user_id: user._id,
              full_name: user.full_name,
              avatar: user.avatar,
            },
            type: newMessage.type,
            created_at: formatUnixTimestamp(newMessage.created_at),
          },
        },
      });

      // this.redisSubService.emitMessageToUser(
      //   conversation.members,
      //   'leave-group',
      //   {
      //     event: 'leave-group',
      //     message: 'Rời nhóm',
      //     data: {
      //       conversation_id: conversation._id.toString(),
      //       name: conversation.name,
      //       members: conversation.members,

      //       last_message: {
      //         message_id: newMessage._id.toString(),
      //         message: newMessage.message,
      //         user: {
      //           user_id: user._id,
      //           full_name: user.full_name,
      //           avatar: user.avatar,
      //         },
      //         type: newMessage.type,
      //         created_at: formatUnixTimestamp(newMessage.created_at),
      //       },
      //     },
      //   },
      // );

      return new BaseResponse(200, 'OK');
    } catch (error) {
      console.log(
        'ConversationGroupService ~ userLeaveConversation ~ error:',
        error,
      );

      return error.response;
    }
  }

  async joinWithLink(link_join: string, user: UserResponse) {
    try {
      const conversation = await this.conversationModel.findOne({
        is_join_with_link: BOOLEAN.TRUE,
        link_join: link_join,
        type: CONVERSATION_TYPE.GROUP,
      });

      if (!conversation) {
        return new BaseResponse(404, 'Cuộc trò chuyện không tồn tại');
      }

      if (conversation?.members?.includes(user._id)) {
        return new BaseResponse(200, 'Bạn đã là thành viên của nhóm', {
          conversation_id: conversation._id.toString(),
        });
      }

      const hasWaitingConfirmMember =
        await this.conversationMemberWaitingModel.findOne({
          conversation_id: conversation._id.toString(),
          user_id: user._id,
        });

      if (hasWaitingConfirmMember) {
        return new BaseResponse(
          200,
          'Bạn đã có trong danh sách chờ của thành viên nhóm',
          {
            conversation_id: conversation._id.toString(),
          },
        );
      }

      if (conversation.is_confirm_new_member) {
        /**
         * cần phê duyệt
         */

        await this.conversationMemberWaitingModel.create({
          conversation_id: conversation._id.toString(),
          created_at: +moment(),
          updated_at: +moment(),
          user_id: user._id,
        });

        const newMessage = await this.messageModel.create({
          user_id: user._id,
          conversation_id: conversation._id.toString(),
          message: 'Cần chờ phê duyệt',
          type: MESSAGE_TYPE.WAITING_CONFIRM,
          user_target: [],
          created_at: +moment(),
          updated_at: +moment(),
        });

        global['io'].to(conversation.members).emit('add-member', {
          event: 'add-member',
          message: 'Thêm thành viên',
          data: {
            conversation_id: conversation._id.toString(),
            name: conversation.name,
            members: conversation.members,
            owner_id: conversation.owner_id,

            last_message: {
              message_id: newMessage._id.toString(),
              message: newMessage.message,
              user: {
                user_id: user._id,
                full_name: user.full_name,
                avatar: user.avatar,
              },
              user_target: newMessage?.user_target || [],
              type: newMessage.type,
              created_at: formatUnixTimestamp(newMessage.created_at),
            },
          },
        });

        // this.redisSubService.emitMessageToUser(
        //   conversation.members,
        //   'add-member',
        //   {
        //     event: 'add-member',
        //     message: 'Thêm thành viên',
        //     data: {
        //       conversation_id: conversation._id.toString(),
        //       name: conversation.name,
        //       members: conversation.members,
        //       owner_id: conversation.owner_id,

        //       last_message: {
        //         message_id: newMessage._id.toString(),
        //         message: newMessage.message,
        //         user: {
        //           user_id: user._id,
        //           full_name: user.full_name,
        //           avatar: user.avatar,
        //         },
        //         user_target: newMessage?.user_target || [],
        //         type: newMessage.type,
        //         created_at: formatUnixTimestamp(newMessage.created_at),
        //       },
        //     },
        //   },
        // );

        return new BaseResponse(
          200,
          'Bạn cần chờ phê duyệt để tham gia nhóm!',
          {
            conversation_id: conversation._id.toString(),
          },
        );
      } else {
        /**
         * không cần phê duyệt -> thành thẳng member
         */
        await this.conversationMemberModel.create({
          conversation_id: conversation._id.toString(),
          created_at: +moment(),
          updated_at: +moment(),
          user_id: user._id,
          permission: CONVERSATION_MEMBER_PERMISSION.MEMBER,
          message_last_id: 0,
          message_pre_id: 0,
        });

        const newMessage = await this.messageModel.create({
          user_id: user._id,
          conversation_id: conversation._id.toString(),
          message: 'Tham gia nhóm với link',
          type: MESSAGE_TYPE.JOIN_WITH_LINK,
          user_target: [],
          created_at: +moment(),
          updated_at: +moment(),
        });

        await this.conversationModel.updateOne(
          {
            _id: new Types.ObjectId(conversation._id),
          },
          {
            $push: {
              members: user._id,
            },
            $inc: {
              no_of_member: 1,
            },
            updated_at: +moment(),
            last_activity: +moment(),
            last_message_id: newMessage._id.toString(),
          },
        );

        conversation.members = conversation.members.concat(user._id);

        global['io'].to(conversation.members).emit('add-member', {
          event: 'join-with-link',
          message: 'Tham gia nhóm bằng link',
          data: {
            conversation_id: conversation._id.toString(),
            name: conversation.name,
            members: conversation.members,
            owner_id: conversation.owner_id,

            last_message: {
              message_id: newMessage._id.toString(),
              message: newMessage.message,
              user: {
                user_id: user._id,
                full_name: user.full_name,
                avatar: user.avatar,
              },
              user_target: newMessage?.user_target || [],
              type: newMessage.type,
              created_at: formatUnixTimestamp(newMessage.created_at),
            },
          },
        });

        // this.redisSubService.emitMessageToUser(
        //   conversation.members,
        //   'add-member',
        //   {
        //     event: 'join-with-link',
        //     message: 'Tham gia nhóm bằng link',
        //     data: {
        //       conversation_id: conversation._id.toString(),
        //       name: conversation.name,
        //       members: conversation.members,
        //       owner_id: conversation.owner_id,

        //       last_message: {
        //         message_id: newMessage._id.toString(),
        //         message: newMessage.message,
        //         user: {
        //           user_id: user._id,
        //           full_name: user.full_name,
        //           avatar: user.avatar,
        //         },
        //         user_target: newMessage?.user_target || [],
        //         type: newMessage.type,
        //         created_at: formatUnixTimestamp(newMessage.created_at),
        //       },
        //     },
        //   },
        // );

        return new BaseResponse(200, 'Tham gia nhóm thành công!', {
          conversation_id: conversation._id,
        });
      }
    } catch (error) {
      console.log('ConversationGroupService ~ joinWithLink ~ error:', error);
      //return error.response;
      throw new ExceptionResponse(400, 'FAILED', error);
    }
  }
  async confirmMembersConversation(
    conversation_id: string,
    user: UserResponse,
    body: ConfirmMemberConversationDto,
  ) {
    const { members, type } = body;
    const conversation = await this.getOneConversation(conversation_id);

    if (!conversation)
      throw new ExceptionResponse(404, 'Không tìm thấy cuộc trò chuyện');

    const permission = await this.conversationMemberModel.findOne({
      user_id: user._id,
      conversation_id: conversation_id,
      permission: { $ne: CONVERSATION_MEMBER_PERMISSION.MEMBER },
    });

    if (!permission)
      throw new ExceptionResponse(
        400,
        'Bạn không có quyền sử dụng chức năng này',
      );

    await this.conversationMemberWaitingModel.deleteMany({
      conversation_id: conversation_id,
      user_id: { $in: members },
    });

    const listMembers = await this.userModel
      .find({
        status: 1,
        _id: { $in: members.map((item) => new Types.ObjectId(item)) },
      })
      .lean();

    if (type == 1) {
      await this.addListMember(members, conversation_id);

      const newMessage = await this.messageModel.create({
        user_id: user._id,
        conversation_id: conversation_id,
        message: 'Đã thêm thành viên',
        type: MESSAGE_TYPE.ADD_NEW_USER,
        user_target: listMembers.map((item) => {
          return {
            user_id: item._id.toString(),
            full_name: item.full_name,
            avatar: item.avatar,
          };
        }),
        created_at: +moment(),
        updated_at: +moment(),
      });

      await this.conversationModel.updateOne(
        { _id: conversation._id },
        {
          last_message_id: newMessage._id.toString(),
          last_activity: +moment(),
          updated_at: +moment(),
        },
      );

      global['io'].to(conversation.members).emit('add-member', {
        event: 'add-member',
        message: 'Thêm thành viên',
        data: {
          conversation_id: conversation._id.toString(),
          name: conversation.name,
          members: conversation.members,
          owner_id: conversation.owner_id,

          last_message: {
            message_id: newMessage._id.toString(),
            message: newMessage.message,
            user: {
              user_id: user._id,
            },
            user_target: newMessage.user_target,
            type: newMessage.type,
            created_at: formatUnixTimestamp(newMessage.created_at),
          },
        },
      });
    }

    return new BaseResponse(200, 'OK');
  }

  async getWaitingMembersConversation(
    conversation_id: string,
    user_id: string,
  ) {
    const conversation = await this.getOneConversation(conversation_id);

    if (!conversation || !conversation.members.includes(user_id))
      throw new ExceptionResponse(404, 'Không tìm thấy cuộc trò chuyện');

    const listMemberWaiting = await this.conversationMemberWaitingModel
      .find({
        conversation_id: conversation_id,
      })
      .sort({ created_at: 'desc' })
      .lean();

    const listUser = await this.userModel
      .find(
        {
          _id: {
            $in: listMemberWaiting.map(
              (item) => new Types.ObjectId(item.user_id),
            ),
          },
        },
        {
          _id: 1,
          full_name: 1,
          avatar: 1,
          status: 1,
        },
      )
      .lean()
      .then((res) => {
        const data = {};
        res.forEach((item) => {
          data[item._id.toString()] = {
            user_id: item._id.toString(),
            full_name: item.full_name,
            avatar: item.avatar,
            status: item.status,
          };
        });

        return data;
      });

    const response = listMemberWaiting.map((item) => {
      const currentUser = listUser[item.user_id] || {};

      return {
        _id: item._id.toString(),
        user_id: currentUser.user_id,
        full_name: currentUser.full_name,
        avatar: currentUser.avatar,
        status: currentUser.status,
      };
    });

    return new BaseResponse(200, 'OK', response);
  }
}
