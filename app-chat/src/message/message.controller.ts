import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'src/shared';
import { RequestWithUser } from 'src/shared/requests.type';
import { ConversationParamsDto } from './dto/conversation-param.dto';
import { GetAllMessagesDto } from './dto/get-all-messages.dto';
import { MessageService } from './message.service';
@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({ summary: 'Xóa tin nhắn' })
  @Post('delete/:message_id')
  async deleteMessage(
    @Request() req: RequestWithUser,
    @Param('message_id') message_id: string,
  ) {
    const data = await this.messageService.deleteMessage(
      req.user._id,
      message_id,
    );
    return new BaseResponse(200, 'OK', data);
  }

  @ApiOperation({ summary: 'Bày tỏ cảm xúc cho tin nhắn' })
  @Post('react')
  async reactMessage(
    @Request() req: RequestWithUser,
    @Body('message_id') message_id: string,
    @Body('type') type: string,
  ) {
    const data = await this.messageService.reactMessage(
      req.user._id,
      message_id,
      type,
    );
    return new BaseResponse(200, 'OK', data);
  }

  @ApiOperation({ summary: 'Lấy danh sách người bày tỏ cảm xúc' })
  @Get('react/:message_id')
  async getReactList(
    @Request() req: RequestWithUser,
    @Param('message_id') message_id: string,
  ) {
    const data = await this.messageService.getReactList(
      req.user._id,
      message_id,
    );
    return new BaseResponse(200, 'OK', data);
  }

  @ApiOperation({ summary: 'Share tin nhắn' })
  @Post('share-message')
  async shareMessage(
    @Request() req: RequestWithUser,
    @Body()
    body: { message_id: string; conversation_ids: string[]; content: string },
  ) {
    const data = await this.messageService.shareMessage(req.user._id, body);
    return new BaseResponse(200, 'OK', data);
  }

  @ApiOperation({ summary: 'Lấy danh sách tin nhắn' })
  @Get('list/:id')
  async getMessageList(
    @Request() req: RequestWithUser,
    @Param() param: ConversationParamsDto,
    @Query() query: GetAllMessagesDto,
  ) {
    const data = await this.messageService.getMessageList(
      req.user._id,
      param.id,
      query,
    );
    return data;
  }
}
