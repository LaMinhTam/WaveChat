import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RedisPubService } from './redis-pub.service';
import { RedisSubController } from './redis-sub.controller';
import { RedisSubService } from './redis-sub.service';
import { redisServerOptions } from 'src/redis-server.options';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'CONNECTION_REDIS_SERVICE',
        useFactory() {
          return redisServerOptions;
        },
      },
    ]),
  ],

  controllers: [RedisSubController],
  providers: [RedisPubService, RedisSubService],
  exports: [RedisPubService],
})
export class RedisModule {}
