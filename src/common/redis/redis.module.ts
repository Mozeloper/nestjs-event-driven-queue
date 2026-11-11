import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { REDIS_CLIENT } from './redis.constants.js';
import { Redis } from 'ioredis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new Redis({
          //   host: config.get<string>('REDIS_HOST', 'localhost'),
          //   port: config.get<string>('REDIS_PORT', '6379'),
          host: 'localhost',
          port: 6379,
        }),
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
