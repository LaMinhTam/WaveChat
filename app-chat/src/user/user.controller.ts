import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { RequestWithUser } from 'src/shared/requests.type';
import { BaseResponse, User } from 'src/shared';
import { QueryPhone } from './dto/query-phone.dto';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req: RequestWithUser, @Query('_id') _id: string) {
    const data = await this.userService.getProfile(req.user._id, _id);
    return data;
  }

  @Post('update')
  async updateUser(
    @Request() req: RequestWithUser,
    @Body() body: Partial<User>,
  ) {
    const data = await this.userService.updateUser(req, body);
    return data;
  }

  @Get('find-phone')
  async findUserByPhone(
    @Request() req: RequestWithUser,
    @Query() query: QueryPhone,
  ) {
    const data = await this.userService.findUserByPhone(
      req.user._id,
      query.phone,
    );
    return data;
  }

  @Post('remove-account')
  async removeAccount(@Request() req: RequestWithUser) {
    const data = await this.userService.removeAccount(req.user._id);
    return data;
  }

  @Get('list-block-user')
  async listBlockUser(@Request() req: RequestWithUser) {
    const data = await this.userService.listBlockUser(req.user._id);
    return new BaseResponse(200, 'OK', data);
  }

  @Post('block-user/:target_id')
  async blockUser(
    @Request() req: RequestWithUser,
    @Param('target_id') target_id: string,
  ) {
    const data = await this.userService.blockUser(req.user._id, target_id);
    return new BaseResponse(200, 'OK', data);
  }

  @Post('remove-block-user/:target_id')
  async removeBlockUser(
    @Request() req: RequestWithUser,
    @Param('target_id') target_id: string,
  ) {
    const data = await this.userService.removeBlockUser(
      req.user._id,
      target_id,
    );
    return new BaseResponse(200, 'OK', data);
  }

  @Post('sync-phone')
  async syncPhone(@Request() req: RequestWithUser, @Body() body: any) {
    const data = await this.userService.syncPhone(req.user._id, body);
    return new BaseResponse(200, 'OK', data);
  }

  @Get('search')
  async searchUser(@Request() req: RequestWithUser, @Query() query: string) {
    const data = await this.userService.searchUser(req.user._id, query);
    return new BaseResponse(200, 'OK', data);
  }
}
