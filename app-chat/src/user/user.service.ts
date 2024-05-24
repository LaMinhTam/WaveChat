import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CONVERSATION_TYPE, USER_STATUS } from 'src/enum';
import { Conversation, ExceptionResponse, User, UserToken } from 'src/shared';
import { BaseResponse } from 'src/shared/base-response.response';
import { Block } from 'src/shared/block.entity';
import { Friend } from 'src/shared/friend.entity';
import { RequestWithUser } from 'src/shared/requests.type';
import { UserProfileResponse } from './response/user-profile.response';
import { normalizeString } from 'src/util/normalize.util';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Friend.name)
    private readonly friendModel: Model<Friend>,

    @InjectModel(Block.name)
    private readonly blockUserModel: Model<Block>,

    @InjectModel(UserToken.name)
    private readonly userTokenModel: Model<UserToken>,

    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
  ) {}

  async updateUser(req: RequestWithUser, body: Partial<User>) {
    const { password, phone, status, role, ...updateData } = body;

    const userUpdated = await this.userModel.findOneAndUpdate(
      { _id: req.user._id },
      { ...updateData },
      { new: true },
    );

    if (!userUpdated) {
      throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Update that bai');
    }

    return {
      status: 200,
      message: 'OK',
      data: userUpdated,
    };
  }

  async getProfile(user_id: string, target_id: string) {
    const hasBlocked = await this.blockUserModel
      .findOne({
        user_id: new Types.ObjectId(user_id),
        user_block_id: new Types.ObjectId(target_id),
      })
      .lean();

    if (hasBlocked) {
      throw new ExceptionResponse(400, 'Hai người đã chặn nhau');
    }

    const user = await this.userModel
      .findById(target_id)
      .select({ password: 0 })
      .lean();

    if (!user) {
      throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'User không tồn tại');
    }
    const itMe = user_id === target_id;
    const contact_type = await this.friendModel
      .findOne({
        user_id: user_id,
        user_friend_id: user._id.toString(),
      })
      .lean();

    return {
      status: 200,
      message: 'OK',
      data: new UserProfileResponse({
        ...user,
        contact_type: itMe ? 1 : contact_type?.type,
      }),
    };
  }

  async removeAccount(user_id: string) {
    await this.userModel.updateOne(
      { _id: new Types.ObjectId(user_id) },
      { status: USER_STATUS.REMOVE },
    );

    await this.userTokenModel.deleteMany({
      user_id: user_id,
    });

    return new BaseResponse(200, 'OK', 'Xóa tài khoản thành công');
  }

  async findUserByPhone(user_id: string, phone: string) {
    const listBlockUser = await this.blockUserModel.find({
      user_id: user_id,
    });

    console.log(
      'UserService ~ findUserByPhone ~ listBlockUser:',
      listBlockUser,
    );

    const user = await this.userModel
      .findOne({
        status: USER_STATUS.ACTIVE,
        phone: phone,
        _id: {
          $nin: listBlockUser.map(
            (item) => new Types.ObjectId(item.user_block_id),
          ),
        },
      })
      .lean();
    // console.log('UserService ~ findUserByPhone ~ user:', user);

    if (!user) {
      throw new ExceptionResponse(404, 'Không tìm thấy user');
    }

    const contact_type = await this.friendModel
      .findOne({
        user_id: user_id,
        user_friend_id: user._id.toString(),
      })
      .lean();

    // console.log('UserService ~ findUserByPhone ~ contact_type:', contact_type);

    return new BaseResponse(200, 'OK', {
      user: new UserProfileResponse({
        ...user,
        contact_type: contact_type?.type || 0,
      }),
    });
  }

  async searchUser(user_id: string, query: any) {
    // if (query.length < 3) {
    //   throw new ExceptionResponse(400, 'Từ khóa tìm kiếm phải lớn hơn 3 ký tự');
    // }

    const { limit, key_search } = query;

    const keySearchNormalized = normalizeString(key_search);

    // Rest of the code...

    const [friends, conversationPersons] = await Promise.all([
      this.friendModel.find({
        user_id: user_id,
      }),
      this.conversationModel
        .find(
          {
            members: {
              $elemMatch: { $eq: user_id },
            },
            type: CONVERSATION_TYPE.PERSONAL,
          },
          { members: 1, _id: 1, name: 1 },
        )
        .exec(),
    ]);
    console.log(
      'UserService ~ searchUser ~ conversationPersons:',
      conversationPersons,
    );

    const listUserIds = [
      ...friends.map((f) => f.user_friend_id),
      ...conversationPersons.flatMap((item) => item.members),
    ];

    const listUserObjectIds = listUserIds.map((id) => new Types.ObjectId(id));

    const regex = new RegExp(keySearchNormalized, 'i');

    const users = await this.userModel
      .find({
        $or: [
          {
            normalize: {
              $regex: regex,
            },
          },
          {
            nick_name: keySearchNormalized,
          },
        ],
        status: USER_STATUS.ACTIVE,
        _id: {
          $in: listUserObjectIds,
          $ne: user_id,
        },
      })
      .limit(limit)
      .exec();

    console.log('assssssssssss');

    return Promise.all(
      users.map(async (user) => {
        const contact_type = await this.friendModel
          .findOne({
            user_id: user_id,
            user_friend_id: user._id.toString(),
          })
          .lean();

        return new UserProfileResponse({
          ...user.toObject(),
          contact_type: contact_type?.type || 0,
        });
      }),
    );
  }

  async syncPhone(user_id: string, body: any) {
    throw new Error('Method not implemented.');
  }

  async listBlockUser(user_id: string) {
    const listBlockUser = await this.blockUserModel
      .find({
        user_id: user_id,
      })
      .populate('user_block_id', { _id: 1, full_name: 1, avatar: 1 })
      .exec();

    return listBlockUser.map((block) => block.toObject());
  }

  async removeBlockUser(_id: string, target_id: string) {
    const result = await this.blockUserModel.deleteMany({
      user_id: _id,
      user_block_id: target_id,
    });

    if (result.deletedCount !== 0) {
      return 'Bỏ chặn thành công';
    } else throw new ExceptionResponse(400, 'Không thể bỏ chặn user này');
  }
  async blockUser(user_id: string, target_id: string) {
    if (user_id === target_id) {
      throw new ExceptionResponse(400, 'Không thể chặn chính mình');
    }

    const hasBlocked = await this.blockUserModel
      .findOne({
        user_id: user_id,
        user_block_id: target_id,
      })
      .lean();

    if (hasBlocked) {
      throw new ExceptionResponse(400, 'Đã block user này rồi');
    }

    const targetUser = await this.userModel
      .findById(new Types.ObjectId(target_id))
      .lean();

    if (!targetUser) {
      throw new ExceptionResponse(404, 'Không tìm thấy người dùng này');
    }

    // nếu có bạn bè thì xóa bạn bè
    await this.friendModel.deleteMany({
      $or: [
        {
          user_id: user_id,
          user_friend_id: target_id,
        },
        {
          user_id: target_id,
          user_friend_id: user_id,
        },
      ],
    });

    // block user
    await this.blockUserModel.create({
      user_id: user_id,
      user_block_id: target_id,
    });

    return 'Block user thành công';
  }
}
