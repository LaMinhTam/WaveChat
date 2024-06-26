import { Module } from '@nestjs/common';
import { ConversationGroupService } from './conversation-group.service';
import { ConversationGroupController } from './conversation-group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  User,
  UserSchema,
  Conversation,
  ConversationSchema,
  ConversationMember,
  ConversationMemberSchema,
  ConversationMemberWaitingConfirm,
  ConversationMemberWaitingConfirmSchema,
  Message,
  MessageSchema,
} from 'src/shared';
import { Friend, FriendSchema } from 'src/shared/friend.entity';
import { RedisModule } from 'src/redis/redis.module';
import { RedisSubService } from 'src/redis/redis-sub.service';

@Module({
  controllers: [ConversationGroupController],
  providers: [ConversationGroupService, RedisSubService],
  imports: [
    RedisModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },

      {
        name: Conversation.name,
        schema: ConversationSchema,
      },

      {
        name: ConversationMember.name,
        schema: ConversationMemberSchema,
      },

      {
        name: ConversationMemberWaitingConfirm.name,
        schema: ConversationMemberWaitingConfirmSchema,
      },

      {
        name: Message.name,
        schema: MessageSchema,
      },
      {
        name: Friend.name,
        schema: FriendSchema,
      },
    ]),
  ],
})
export class ConversationGroupModule {}
