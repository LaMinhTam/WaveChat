import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { ConfigMongoModule } from './config-mongo/config-mongo.module';
import { ConnectionModule } from './connection/connection.module';
import { ConversationGroupModule } from './conversation-group/conversation-group.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './user/user.module';
import { FriendModule } from './friend/friend.module';

@Module({
  imports: [
    ConfigMongoModule,
    AuthModule,
    ConversationModule,
    MessageModule,
    ConnectionModule,
    ConversationGroupModule,
    UserModule,
    FriendModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10 days' },
    }),
    RedisModule,
  ], //
  controllers: [AppController],

  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
