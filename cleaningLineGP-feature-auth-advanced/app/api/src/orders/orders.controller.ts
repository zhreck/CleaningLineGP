import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/models/roles.model';
import type { Request } from 'express';
import { User } from '../auth/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  checkout(@Req() req: Request) {
    // El DTO se mantiene por si se necesita expandir la funcionalidad en el futuro
    // Por ahora, la orden se crea a partir del carrito del usuario autenticado.
    return this.ordersService.createOrderFromCart(req.user as User);
  }

  @Patch(':id/complete')
  completeOrder(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    return this.ordersService.completeOrder(id, (req.user as User).id);
  }

  @Get('mine')
  findUserOrders(@Req() req: Request) {
    return this.ordersService.findUserOrders((req.user as User).id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    const order = await this.ordersService.findOne(id);
    // Un usuario solo puede ver sus propias órdenes, a menos que sea admin
    if (!user.roles.includes(Role.ADMIN) && order.user.id !== user.id) {
      throw new Error('No tienes permiso para ver esta orden.');
    }
    return order;
  }
}
