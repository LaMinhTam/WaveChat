import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { ConnectionGateway } from './connection.gateway';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationMember,
  ConversationMemberSchema,
  ConversationSchema,
  Message,
  MessageSchema,
  User,
  UserSchema,
} from 'src/shared';
import { Block, BlockSchema } from 'src/shared/block.entity';
import { RedisModule } from 'src/redis/redis.module';
import { RedisSubService } from 'src/redis/redis-sub.service';

@Module({
  providers: [ConnectionGateway, ConnectionService, RedisSubService],
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),

    RedisModule,

    MongooseModule.forFeature([
      {
        name: ConversationMember.name,
        schema: ConversationMemberSchema,
      },

      {
        name: Conversation.name,
        schema: ConversationSchema,
      },
      {
        name: Message.name,
        schema: MessageSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },

      {
        name: Block.name,
        schema: BlockSchema,
      },
    ]),
  ],
})
export class ConnectionModule {}
