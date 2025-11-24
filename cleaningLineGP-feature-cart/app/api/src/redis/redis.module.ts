import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import { BullModule } from '@nestjs/bull';

@Global() // Hacemos el módulo global para que RedisService esté disponible en toda la app
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: +configService.get('REDIS_PORT', 6379),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'redis-queue',
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
