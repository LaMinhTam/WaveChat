import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import { UserMessageResponse } from 'src/connection/response/user-message.response';
import { CONVERSATION_STATUS, MESSAGE_STATUS, MESSAGE_TYPE } from 'src/enum';
import {
  BaseResponse,
  Conversation,
  ConversationMember,
  ExceptionResponse,
  Message,
  User,
  UserResponse,
} from 'src/shared';
import { formatUnixTimestamp } from 'src/util';
import { GetAllMessagesDto } from './dto/get-all-messages.dto';
import { ListMessageResponse } from './response/list-message.response';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,

    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,

    @InjectModel(ConversationMember.name)
    private readonly conversationMemberModel: Model<ConversationMember>,
  ) {}

  async deleteMessage(user_id: string, message_id: string) {
    try {
      const message = await this.messageModel.findOne({
        _id: new Types.ObjectId(message_id),
      });

      if (!message || message.user_deleted.includes(user_id)) {
        throw new ExceptionResponse(404, 'Bạn không có quyền xóa tin nhắn này');
      }

      const memberConversation = await this.conversationMemberModel.findOne({
        conversation_id: message.conversation_id,
        user_id: user_id,
      });

      if (!memberConversation) {
        throw new ExceptionResponse(
          400,
          'Bạn không có quyền truy cập tài nguyên này',
        );
      }

      // push user_id to user_deleted , if not exist this field, create new field

      await this.messageModel.updateOne(
        {
          _id: new Types.ObjectId(message_id),
        },
        {
          $push: {
            user_deleted: user_id,
          },
        },
        {
          upsert: true,
        },
      );

      return;
    } catch (error) {
      console.log('MessageService ~ error:', error);
      throw new ExceptionResponse(400, error.message);
    }
  }

  async getMessageList(
    user_id: string,
    conversation_id: string,
    query: GetAllMessagesDto,
  ) {
    const { limit = 20, position } = query;
    try {
      const memberConversation = await this.conversationMemberModel.findOne({
        conversation_id: conversation_id,
        user_id: user_id,
      });

      if (!memberConversation) {
        throw new ExceptionResponse(
          400,
          'Bạn không có quyền truy cập tài nguyên này',
        );
      }

      // get message with user_deleted not contain user_id
      const querySearch = {
        conversation_id: conversation_id,
        user_deleted: {
          $nin: [user_id],
        },
      };

      if (position) {
        querySearch['created_at'] = {
          $lt: +position,
          $gt: memberConversation.message_pre_id,
        };
      } else {
        querySearch['created_at'] = { $gt: memberConversation.message_pre_id };
      }

      const messageList = await this.messageModel
        .find(querySearch)
        .populate('user_id', { _id: 1, username: 1, avatar: 1, full_name: 1 })
        .sort({ created_at: 'desc' })
        .limit(+limit)
        .lean();

      if (messageList.length == 0) {
        return new BaseResponse(200, 'OK', []);
      }

      return new BaseResponse(
        200,
        'OK',
        messageList.map((item) => {
          return new ListMessageResponse({
            user: item?.user_id,
            _id: item?._id,
            conversation_id: item?.conversation_id,
            user_target: item?.user_target,
            message: item?.message,
            media: item?.media,
            no_of_reaction: item?.no_of_reaction,
            type: item?.type,
            status: item?.status,
            user_tag: item?.user_tag,
            reaction: item?.reaction,
            created_at: formatUnixTimestamp(item?.created_at),
            updated_at: formatUnixTimestamp(item?.updated_at),
            position: item?.created_at.toString(),
            user_deleted: item?.user_deleted,

            // message_reply: messageReplyList[item?.message_reply_id?.toString()],
            message_reply: item.message_reply,
          });
        }),
      );
    } catch (error) {
      console.log('MessageService ~ error:', error);
      throw new ExceptionResponse(400, error.message);
    }
  }

  async checkConversationValid(conversation_id: string): Promise<Conversation> {
    return await this.conversationModel.findOne({
      _id: new Types.ObjectId(conversation_id),
      status: CONVERSATION_STATUS.ACTIVE,
    });
  }

  async shareMessage(
    user_id: string,
    query: { message_id: string; conversation_ids: string[]; content: string },
  ) {
    const { message_id, conversation_ids, content } = query;

    const message = await this.messageModel.findOne({
      _id: new Types.ObjectId(message_id),
    });

    if (!message) {
      throw new ExceptionResponse(404, 'Tin nhắn không tồn tại');
    }

    const currentUser = await this.userModel.findOne(
      {
        _id: new Types.ObjectId(user_id),
      },
      {
        _id: 1,
        avatar: 1,
        full_name: 1,
      },
    );

    const conversationList = await this.conversationModel.find({
      _id: { $in: conversation_ids.map((item) => new Types.ObjectId(item)) },
      status: CONVERSATION_STATUS.ACTIVE,
    });

    if (conversationList.length !== conversation_ids.length) {
      throw new ExceptionResponse(404, 'Một số cuộc trò chuyện không tồn tại');
    }

    const momentTemp = +moment();
    let last_message_id: string;
    await Promise.all(
      conversation_ids.map(async (conversation_id) => {
        const newMessage = new this.messageModel({
          user_id: currentUser._id,
          conversation_id: conversation_id,
          message: message.message,
          media: message.media,
          type: message.type,
          user_tag: message.user_tag,
          user_target: message.user_target,
          no_of_reaction: 0,
          status: MESSAGE_STATUS.ACTIVE,
          created_at: momentTemp,
          updated_at: momentTemp,
        });

        const newMessageSave = await newMessage.save();

        last_message_id = newMessage._id.toString();

        const currentConversation = conversationList.find(
          (item) => item._id.toString() === conversation_id,
        );

        this.emitSocketMessage(
          {
            _id: currentUser._id.toString(),
            role: '',
            full_name: currentUser.full_name,
            avatar: currentUser.avatar,
          },
          newMessageSave.toObject(),
          currentConversation,
          'message',
        );

        if (content) {
          const newMessageContentTemp = new this.messageModel({
            user_id: currentUser._id,
            conversation_id: conversation_id,
            message: content,
            type: MESSAGE_TYPE.TEXT,
            no_of_reaction: 0,
            status: MESSAGE_STATUS.ACTIVE,
            created_at: momentTemp + 10,
            updated_at: momentTemp + 10,
          });

          const newMessageContent = await newMessageContentTemp.save();

          last_message_id = newMessageContent._id.toString();

          this.emitSocketMessage(
            {
              _id: currentUser._id.toString(),
              role: '',
              full_name: currentUser.full_name,
              avatar: currentUser.avatar,
            },
            newMessageContent.toObject(),
            currentConversation,
            'message',
          );
        }

        await this.conversationModel.updateOne(
          {
            _id: new Types.ObjectId(conversation_id),
          },
          {
            $set: {
              last_message_id: last_message_id,
              last_activity: +moment() + 10,
            },
          },
        );
      }),
    );
  }

  emitSocketMessage(
    user: UserResponse,
    new_message: any,
    conversation: Conversation,
    emit_socket: string,
  ) {
    const to = conversation.members.map(String);

    new_message['updated_at'] = formatUnixTimestamp(new_message.updated_at);
    new_message['created_at'] = formatUnixTimestamp(new_message.created_at);
    new_message['user'] = new UserMessageResponse(user);
    new_message['conversation'] = conversation;

    console.log('emit_socket', new_message);

    global['io'].to(to).emit(emit_socket, {
      message: new_message,
    });
  }

  async getReactList(user_id: string, message_id: string) {
    // const message = await this.messageModel
    //   .findOne({ _id: new Types.ObjectId(message_id) })
    //   .lean();
    // if (!message) {
    //   throw new ExceptionResponse(404, 'Tin nhắn không tồn tại');
    // }
    // const listUserIds = message.reaction.map(
    //   (item) => new Types.ObjectId(item.user_id),
    // );
    // if (listUserIds.length === 0) {
    //   return [];
    // }
    // const listUser = await this.userModel
    //   .find(
    //     {
    //       _id: { $in: listUserIds },
    //     },
    //     {
    //       _id: 1,
    //       avatar: 1,
    //       full_name: 1,
    //     },
    //   )
    //   .then((data) =>
    //     data.map((item) => {
    //       return {
    //         _id: item._id.toString(),
    //         avatar: item.avatar,
    //         full_name: item.full_name,
    //       };
    //     }),
    //   );
    // return [];
  }

  async reactMessage(user_id: string, message_id: string, type: string) {
    const message = await this.messageModel.findOne({
      _id: new Types.ObjectId(message_id),
    });

    if (!message) {
      throw new ExceptionResponse(404, 'Tin nhắn không tồn tại');
    }

    const reacted = message.reaction.find(
      (item) => item.user_id.toString() === user_id,
    );

    if (!reacted) {
      await this.messageModel.updateOne(
        {
          _id: new Types.ObjectId(message_id),
        },
        {
          $push: {
            reaction: {
              user_id: user_id,
              type: type,
            },
          },
          $set: {
            no_of_reaction: message.no_of_reaction + 1,
          },
        },
      );
    } else {
      //remove reaction
      await this.messageModel.updateOne(
        {
          _id: new Types.ObjectId(message_id),
        },
        {
          $pull: {
            reaction: {
              user_id: user_id,
              type: type,
            },
          },
          $set: {
            no_of_reaction: message.no_of_reaction - 1,
          },
        },
      );
    }
  }
}
