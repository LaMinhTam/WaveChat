import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationMember,
  ConversationMemberSchema,
  ConversationMemberWaitingConfirm,
  ConversationMemberWaitingConfirmSchema,
  ConversationSchema,
  Message,
  MessageSchema,
  User,
  UserSchema,
} from 'src/shared';
import {
  ConversationHidden,
  ConversationHiddenSchema,
} from 'src/shared/conversation-hidden.entity';
import {
  ConversationPinned,
  ConversationPinnedSchema,
} from 'src/shared/conversation-pinned.entity';
import {
  ConversationDisableNotify,
  ConversationDisableNotifySchema,
} from 'src/shared/conversation-disable-notify.entity';
import { Friend, FriendSchema } from 'src/shared/friend.entity';
import { Block, BlockSchema } from 'src/shared/block.entity';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService],
  imports: [
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
        name: ConversationHidden.name,
        schema: ConversationHiddenSchema,
      },

      {
        name: ConversationPinned.name,
        schema: ConversationPinnedSchema,
      },
      {
        name: ConversationDisableNotify.name,
        schema: ConversationDisableNotifySchema,
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
      {
        name: Block.name,
        schema: BlockSchema,
      },
    ]),
  ],
})
export class ConversationModule {}
