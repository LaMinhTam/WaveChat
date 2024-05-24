import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { ConversationGroupController } from './conversation-group/conversation-group.controller';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { redisServerOptions } from './redis-server.options';
import { UserModule } from './user/user.module';
import { FriendModule } from './friend/friend.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.use(morgan('dev'));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // whitelist: true,
      stopAtFirstError: true,
      // enableDebugMessages: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Service ' + process.env.CONFIG_PRODUCTION_MODE)
    .setDescription(`The API description`)
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [
      MessageModule,
      UserModule,
      ConversationModule,
      FriendModule,
      AuthModule,
      ConversationGroupController,
    ],
    deepScanRoutes: true,
  });
  SwaggerModule.setup('v1/docs', app, document, {
    customSiteTitle: 'API swagger',
  });

  app.connectMicroservice<MicroserviceOptions>(redisServerOptions);
  app.startAllMicroservices();

  await app.listen(process.env.PORT);

  console.log(`Application is running on: ${await app.getUrl()}`);
  // console.log(`Application is running on: `);
}
bootstrap();
