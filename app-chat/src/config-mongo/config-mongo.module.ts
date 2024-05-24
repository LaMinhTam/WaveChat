import { Module } from '@nestjs/common';
import { ConfigModule as ConfigNest } from '@nestjs/config';
import { ConfigMongoService } from './config-mongo.service';

import { MongooseModule } from '@nestjs/mongoose';
import {
  CategorySticker,
  CategoryStickerSchema,
  Conversation,
  ConversationDisableNotify,
  ConversationDisableNotifySchema,
  ConversationHidden,
  ConversationHiddenSchema,
  ConversationMember,
  ConversationMemberSchema,
  ConversationMemberWaitingConfirm,
  ConversationMemberWaitingConfirmSchema,
  ConversationPinned,
  ConversationPinnedSchema,
  ConversationSchema,
  Message,
  MessageSchema,
  Sticker,
  StickerSchema,
  User,
  UserSchema,
  UserToken,
  UserTokenSchema,
} from 'src/shared';

import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { redisServerOptions } from 'src/redis-server.options';

@Module({
  imports: [
    ConfigNest.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      imports: [ConfigMongoModule],
      useFactory: async (configService: ConfigMongoService) =>
        await configService.createMongooseOptions(),
      inject: [ConfigMongoService],
    }),

    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   username: 'postgres',
    //   password: 'loc123@@',
    //   port: 5432,
    //   database: 'app-chat',
    //   entities: [
    //     CategorySticker,
    //     Conversation,
    //     ConversationMember,
    //     ConversationMemberWaitingConfirm,
    //     Message,
    //     Sticker,
    //     User,
    //   ],
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),

    CacheModule.registerAsync({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      useFactory: async () => {
        console.log('123', +process.env.CONFIG_REDIS_DB);

        return {
          store: await redisStore.redisStore({
            url: `redis://${process.env.CONFIG_REDIS_USER}:${process.env.CONFIG_REDIS_PASSWORD}@${process.env.CONFIG_REDIS_HOST}:${process.env.CONFIG_REDIS_PORT}`,
          }),
        };
      },

      isGlobal: true,
    }),

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
        name: UserToken.name,
        schema: UserTokenSchema,
      },
    ]),
  ],
  providers: [ConfigMongoService],
  exports: [ConfigMongoService],
})
export class ConfigMongoModule {}
