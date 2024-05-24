import { ClientOptions, Transport } from '@nestjs/microservices';

export const redisServerOptions: ClientOptions = {
  transport: Transport.REDIS,
  options: {
    port: Number(process.env.CONFIG_REDIS_PORT),
    host: process.env.CONFIG_REDIS_HOST,
    password: process.env.CONFIG_REDIS_PASSWORD,
    db: Number(process.env.CONFIG_REDIS_DB),
    retryAttempts: 5,
    retryDelay: 3000,
  },
};
