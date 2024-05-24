import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RedisSubService } from './redis-sub.service';

@Controller()
export class RedisSubController {
  constructor(private readonly redisSubService: RedisSubService) {}

  @MessagePattern('notification')
  async emitMessage(
    @Payload() payload: { emit_key: string; to: string[]; payload: any },
  ) {
    await this.redisSubService.emitMessageToUser(
      payload.to,
      payload.emit_key,
      payload.payload,
    );
  }
}
