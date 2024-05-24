import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RedisPubService {
  constructor(
    @Inject('CONNECTION_REDIS_SERVICE')
    private readonly redisClient: ClientProxy,
    // @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  pubMessage(data: { emit_key: string; to: string[]; payload: any }) {
    try {
      this.redisClient.emit('notification', {
        payload: data.payload,
        to: data.to,
        emit_key: data.emit_key,
      });
    } catch (error) {
      console.log('RedisPubService ~ pubMessage ~ error:', error);
    }
  }
}
