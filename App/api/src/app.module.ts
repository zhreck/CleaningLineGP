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
import { Order } from './orders/entities/order.entity'; 
import { OrderItem } from './orders/entities/order-item.entity'; 
import { ProductsModule } from './products/products.module';
import { RedisModule } from './redis/redis.module';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { SeedModule } from './seed/seed.module';
import { CategoriesModule } from './categories/categories.module';
import { MediaModule } from './media/media.module';
import { WebpayModule } from './webpay/webpay.module';
import { PaymentsModule } from './payments/payments.module';

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
        password: configService.get<string>('DB_PASSWORD', 'devpass'), 
        database: configService.get<string>('DB_DATABASE', 'ecommerce'),
        
        // 👇 AQUÍ ESTÁ LA MAGIA PARA CONECTAR A NEON DB 👇
        ssl: {
          rejectUnauthorized: false,
        },
        // -----------------------------------------------

        entities: [Product, Category, Cart, CartItem, User, Order, OrderItem], 
        synchronize: true, // En desarrollo, crea/actualiza las tablas automáticamente. No usar en producción.
      }),
    }),
    ProductsModule,
    RedisModule,
    CartModule,
    AuthModule,
    OrdersModule,
    SeedModule,
    CategoriesModule,
    MediaModule,
    WebpayModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}