import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisSubService {
  emitMessageToUser(to: string[], emit_key: string, payload: any) {
    try {
      global['io'].to(to).emit(emit_key, payload);
      console.log(
        `RedisSubService ~ PORT: ${process.env.PORT} ~ emit_key: ${emit_key} to: ${to}`,
      );
    } catch (error) {
      console.log('RedisSubService ~ emitMessageToUser ~ error:', error);
    }
  }
  constructor() {}
}
