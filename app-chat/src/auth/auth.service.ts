import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import { USER_STATUS } from 'src/enum';
import { ExceptionResponse, User, UserToken } from 'src/shared';
import { BaseResponse } from 'src/shared/base-response.response';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/user-sign-in.dto';
import { SignUpDto } from './dto/user-sign-up.dto';
import { UserProfileResponse } from './response/user-profile.response';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(UserToken.name)
    private readonly userTokenModel: Model<UserToken>,

    private jwtService: JwtService,
  ) {}

  async checkTokenActive(user_id: Types.ObjectId, token: string) {
    const userToken = await this.userTokenModel.findOne({
      user_id: user_id,
      token: token,
      expired_at: { $gt: +moment() },
    });

    if (!userToken) return false;

    return true;
  }

  async signIn(body: LoginDto) {
    try {
      const hasUser = await this.getAuthenticatedUser(
        {
          phone: body.phone,
          status: USER_STATUS.ACTIVE,
        },
        body.password,
      );

      if (!hasUser)
        return new BaseResponse(400, 'ERROR', {
          error: 'Thông tin đăng nhập không chính xác',
        });

      const existToken = await this.userTokenModel.findOne({
        user_id: hasUser._id.toString(),
        expired_at: { $gt: +moment() },
        _id: new Types.ObjectId(hasUser._id),
      });

      let access_token;

      if (!existToken) {
        const payload = {
          _id: hasUser._id.toString(),
          role: hasUser.role,
          full_name: hasUser.full_name,
          avatar: hasUser.avatar,
          create_at: +moment(),
        };

        access_token = await this.jwtService.signAsync(payload, {
          secret: process.env.JWT_SECRET,
        });

        await this.userTokenModel.updateOne(
          {
            _id: hasUser._id.toString(),
          },
          {
            user_id: hasUser._id.toString(),
            token: access_token,
            expired_at: +moment() + Number(process.env.TIME_TO_LIVE_TOKEN),
          },
          { upsert: true },
        );
      } else {
        access_token = existToken.token;
      }

      return new BaseResponse(200, 'OK', {
        _id: hasUser._id,
        full_name: hasUser.full_name,
        avatar: hasUser.avatar,
        access_token: access_token,
      });
    } catch (error) {
      console.log('AuthService ~ signIn ~ error:', error);
      return new BaseResponse(
        400,
        'ERROR',
        'Thông tin đăng nhập không chính xác',
      );
    }
  }

  private async verifyPlainContentWithHashedContent(
    plainText: string,
    hashedText: string,
  ) {
    const is_matching = await bcrypt.compare(plainText, hashedText);
    if (!is_matching) {
      throw new ExceptionResponse(
        HttpStatus.UNAUTHORIZED,
        'Mật khẩu không chính xác!! 1',
      );
    }
  }

  async logout(user_id: string) {
    await this.userTokenModel.deleteMany({
      user_id: user_id,
    });

    return user_id;
  }

  async signUp(signUpDto: SignUpDto) {
    try {
      const user = await this.userModel.findOne({
        phone: signUpDto.phone,
        status: USER_STATUS.ACTIVE,
      });

      if (user) {
        throw new ExceptionResponse(400, 'Số điện thoại đã được sử dụng');
      }

      const hashedPassword = await bcrypt.hash(signUpDto.password, 5);

      const newUser = await this.userModel.create(
        new UserProfileResponse({
          full_name: signUpDto.full_name,
          nick_name: signUpDto.nick_name,
          phone: signUpDto.phone,
          password: hashedPassword,
        }),
      );
      // instead of the user object
      return new BaseResponse(200, 'OK', newUser);
    } catch (error) {
      console.log('AuthService ~ signUp ~ error:', error);
      throw new ExceptionResponse(400, 'ERROR', error);
    }
  }

  async changePassword(_id: string, changePasswordDto: ChangePasswordDto) {
    const { old_password, new_password } = changePasswordDto;

    if (old_password == new_password) {
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'Mật khẩu mới không được trùng mật khẩu cũ',
      );
    }

    const hasAccess = await this.getAuthenticatedUser(
      { _id: _id },
      old_password,
    );

    if (hasAccess) {
      const userUpdated = await this.userModel.findOneAndUpdate(
        {
          _id: _id,
        },
        {
          password: await bcrypt.hash(changePasswordDto.new_password, 5),
        },
      );

      const payload = {
        _id: userUpdated._id.toString(),
        role: userUpdated.role,
        full_name: userUpdated.full_name,
        avatar: userUpdated.avatar,
        create_at: +moment(),
      };

      const access_token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      });

      await this.userTokenModel.updateOne(
        {
          _id: new Types.ObjectId(userUpdated._id),
        },
        {
          token: access_token,
          expired_at: +moment() + Number(process.env.TIME_TO_LIVE_TOKEN),
        },
      );

      return new BaseResponse(200, 'Đổi mật khẩu thành công!', {
        access_token: access_token,
      });
    }

    return new BaseResponse(400, 'ERROR', 'Mật khẩu không chính xác');
  }

  async getAuthenticatedUser(filter: object, password: string): Promise<User> {
    try {
      // get user
      const user = await this.userModel.findOne(filter).lean();

      if (!user) {
        throw new ExceptionResponse(
          404,
          `Không tìm thấy user với số điện thoại này ${filter['phone']}`,
        );
      }
      // check password
      await this.verifyPlainContentWithHashedContent(password, user.password);

      return user;
    } catch (error) {
      throw new ExceptionResponse(
        HttpStatus.UNAUTHORIZED,
        'Mật khẩu không chính xác!!',
      );
    }
  }

  async getUserById(_id: Types.ObjectId, token: string) {
    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(_id),
    });

    if (user.access_token !== token) return true;

    return false;
  }

  async resetPassword(body: Partial<User>) {
    try {
      const { phone, password } = body;

      const user = await this.userModel.findOne({ phone: phone });

      if (!user) {
        throw new ExceptionResponse(
          HttpStatus.NOT_FOUND,
          'Không tìm thấy user',
        );
      }
      await this.userModel.updateOne(
        { _id: user._id },
        {
          password: await bcrypt.hash(password, 5),
        },
      );

      return new BaseResponse(200, 'OK', 'Thay đổi mật khẩu thành công');
    } catch (error) {
      console.log('UserService ~ resetPassword ~ error:', error);
      return new BaseResponse(400, 'ERROR');
    }
  }
}
