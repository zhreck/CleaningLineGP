import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module'; // Para usar los guards de autenticación 

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    ProductsModule, // Para acceder a ProductsService
    AuthModule,     // Para usar los guards de autenticación
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
