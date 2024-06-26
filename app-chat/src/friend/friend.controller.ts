import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BaseResponse } from 'src/shared/base-response.response';
import { RequestWithUser } from 'src/shared/requests.type';
import { FriendWithQueryDto } from './dto/friend-with-query.dto';
import { RequestFriendWithParamDto } from './dto/request-friend-with-param.dto';
import { FriendService } from './friend.service';
import { FriendResponse } from './response/friend.response';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get('')
  @ApiResponse({
    status: 200,
    description: 'Danh sách bạn bè',
    type: FriendResponse,
  })
  @ApiOperation({ summary: 'Lấy danh sách bạn bè' })
  async getFriend1(
    @Request() req: RequestWithUser,
    @Query() query: FriendWithQueryDto,
  ) {
    const data = await this.friendService.getFriend(req.user._id, query);
    return data;
  }

  /**
   * Bạn bè
   */
  @Get('get-friend')
  @ApiResponse({
    status: 200,
    description: 'Danh sách bạn bè',
    type: FriendResponse,
  })
  @ApiOperation({ summary: 'Lấy danh sách bạn bè' })
  async getFriend(
    @Request() req: RequestWithUser,
    @Query() query: FriendWithQueryDto,
  ) {
    const data = await this.friendService.getFriend(req.user._id, query);
    return data;
  }

  @Post('send')
  @ApiResponse({
    status: HttpStatus.OK,
    type: BaseResponse,
    description: 'Gửi lời mời kết bạn',
  })
  @ApiOperation({ summary: 'Gửi lời mời kết bạn' })
  async sendFriendRequest(
    @Request() req: RequestWithUser,
    @Query() query: RequestFriendWithParamDto,
  ) {
    const data = await this.friendService.sendFriendRequest(
      req.user._id,
      query._id,
    );
    return data;
  }

  @Post('accept')
  @ApiResponse({
    status: HttpStatus.OK,
    type: BaseResponse,
    description: 'Chấp nhận lời mời kết bạn',
  })
  @ApiOperation({ summary: 'Chấp nhận lời mời kết bạn' })
  async acceptFriend(
    @Request() req: RequestWithUser,
    @Query() param: RequestFriendWithParamDto,
  ) {
    const data = await this.friendService.acceptFriendRequest(
      req.user._id,
      param._id,
    );
    return data;
  }

  @Post('denied')
  @ApiResponse({
    status: HttpStatus.OK,
    type: BaseResponse,
    description: 'Huỷ lời mời kết bạn',
  })
  @ApiOperation({ summary: 'Từ chối lời mời kết bạn' })
  async deniedFriend(
    @Request() req: RequestWithUser,
    @Query() param: RequestFriendWithParamDto,
  ) {
    const data = await this.friendService.deniedFriendRequest(
      req.user._id,
      param._id,
    );
    return data;
  }

  @Post('remove-request')
  @ApiResponse({
    status: HttpStatus.OK,
    type: BaseResponse,
    description: 'Xoá lời mời kết bạn',
  })
  @ApiOperation({ summary: 'Xoá lời mời kết bạn' })
  async removeRequestFriend(
    @Request() req: RequestWithUser,
    @Query() param: RequestFriendWithParamDto,
  ) {
    const data = await this.friendService.removeRequestFriend(
      req.user._id,
      param._id,
    );
    return data;
  }

  // @Get('count-tab')
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Số lượng yêu cầu kết bạn, lời mời kết bạn và số lượng bạn bè',
  //   type: CountFriendRequestsResponseSwagger,
  // })
  // @ApiOperation({ summary: 'Số lượng yêu cầu kết bạn và lời mời kết bạn' })
  // async countFriendRequests(@Request() req: RequestWithUser) {
  //   const data = await this.friendService.countFriendRequests(req.user._id);
  //   return data;
  // }

  // @Post('sync')
  // @ApiOperation({
  //   summary: 'Đồng Bộ danh bạ',
  // })
  // @ApiResponse({
  //   status: 200,
  //   type: ContactResponseSwagger,
  //   description: 'Đồng bộ danh bạ - truyền vào một array số điện thoại',
  // })
  // async sync(
  //   @Body() syncFriendDto: SyncFriendDto,
  //   @Request() req: RequestWithUser,
  // ) {
  //   const data = await this.friendService.syncPhone(
  //     req.user._id,
  //     syncFriendDto,
  //   );
  //   return data;
  // }

  @Post('remove-friend')
  @ApiResponse({
    type: BaseResponse,
    description: 'Xoá bạn bè',
  })
  @ApiOperation({ summary: 'Xoá bạn bè' })
  async removeFriend(
    @Request() req: RequestWithUser,
    @Query() param: RequestFriendWithParamDto,
  ) {
    const data = await this.friendService.removeFriend(req.user._id, param._id);
    return data;
  }
}
