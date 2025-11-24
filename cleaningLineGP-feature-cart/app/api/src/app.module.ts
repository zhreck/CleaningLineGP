import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Category } from './products/entities/category.entity';
import { Product } from './products/entities/product.entity';
import { Cart } from './cart/entities/cart.entity';
import { CartItem } from './cart/entities/cart-item.entity';
import { User } from './auth/entities/user.entity';
import { ProductsModule } from './products/products.module';
import { RedisModule } from './redis/redis.module';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module'; // Asegúrate de tener este módulo
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigModule esté disponible en toda la aplicación
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: +configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'dev'),
        password: configService.get<string>('DB_PASSWORD', 'devpass'), // Usa tu contraseña por defecto aquí
        database: configService.get<string>('DB_DATABASE', 'ecommerce'),
        entities: [Product, Category, Cart, CartItem, User],
        synchronize: true, // En desarrollo, crea/actualiza las tablas automáticamente. No usar en producción.
      }),
    }),
    ProductsModule,
    RedisModule,
    CartModule,
    AuthModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
