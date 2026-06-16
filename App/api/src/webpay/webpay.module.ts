import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebpayController } from './webpay.controller';
import { WebpayService } from './webpay.service';
import { Order } from '../orders/entities/order.entity';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Order]), OrdersModule],
  controllers: [WebpayController],
  providers: [WebpayService],
  exports: [WebpayService],
})
export class WebpayModule {}
