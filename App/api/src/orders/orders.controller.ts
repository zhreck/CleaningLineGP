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
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/models/roles.model';
import type { Request } from 'express';
import { User } from '../auth/entities/user.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  checkout(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    const user = req.user as User | undefined;
    return this.ordersService.createOrderFromCart(createOrderDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/complete')
  completeOrder(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    return this.ordersService.completeOrder(id, (req.user as User).id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mine')
  findUserOrders(@Req() req: Request) {
    return this.ordersService.findUserOrders((req.user as User).id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('stats')
  getStats() {
    return this.ordersService.getStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const user = req.user as User | undefined;
    const order = await this.ordersService.findOne(id);

    // Si hay usuario, verificar permisos
    if (user) {
      const isAdmin = user.roles && user.roles.includes(Role.ADMIN);
      const isOwner = order.user && order.user.id === user.id;

      if (!isAdmin && !isOwner) {
        throw new Error('No tienes permiso para ver esta orden.');
      }
    }
    // Si no hay usuario, permitir ver la orden (para invitados con el ID)

    return order;
  }
}
