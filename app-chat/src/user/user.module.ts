import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CategorySticker,
  CategoryStickerSchema,
  Conversation,
  ConversationMember,
  ConversationMemberSchema,
  ConversationMemberWaitingConfirm,
  ConversationMemberWaitingConfirmSchema,
  ConversationSchema,
  Friend,
  FriendSchema,
  Message,
  MessageSchema,
  Sticker,
  StickerSchema,
  User,
  UserSchema,
  UserToken,
  UserTokenSchema,
} from 'src/shared';
import { Block, BlockSchema } from 'src/shared/block.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: CategorySticker.name,
        schema: CategoryStickerSchema,
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
        name: Conversation.name,
        schema: ConversationSchema,
      },

      {
        name: Sticker.name,
        schema: StickerSchema,
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
        name: UserToken.name,
        schema: UserTokenSchema,
      },

      {
        name: Block.name,
        schema: BlockSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
