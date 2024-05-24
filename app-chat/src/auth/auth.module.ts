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
  Message,
  MessageSchema,
  Sticker,
  StickerSchema,
  User,
  UserSchema,
} from 'src/shared';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserToken, UserTokenSchema } from 'src/shared/token.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
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
        name: User.name,
        schema: UserSchema,
      },

      {
        name: UserToken.name,
        schema: UserTokenSchema,
      },
    ]),
  ],

  exports: [AuthService],
})
export class AuthModule {}
