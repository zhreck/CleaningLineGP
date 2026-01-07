import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/models/roles.model';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

const SESSION_COOKIE = 'session_id';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async addToCart(@Req() req, @Res({ passthrough: true }) res: Response, @Body() addToCartDto: AddToCartDto) {
    if (req.user) {
      const cart = await this.cartService.addToCartPersistent(req.user.id, addToCartDto);
      return cart;
    } else {
      let sessionId = req.cookies[SESSION_COOKIE];
      if (!sessionId) {
        sessionId = randomUUID();
        res.cookie(SESSION_COOKIE, sessionId, { httpOnly: true, sameSite: 'strict' });
      }
      return this.cartService.addToCartGuest(sessionId, addToCartDto);
    }
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async getCart(@Req() req, @Res({ passthrough: true }) res: Response) {
    if (req.user) {
      return this.cartService.getCartPersistent(req.user.id);
    } else {
      const sessionId = req.cookies[SESSION_COOKIE];
      if (!sessionId) {
        return { items: [], subtotal: 0, taxes: 0, total: 0 };
      }
      return this.cartService.getCartGuest(sessionId);
    }
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Delete(':productId')
  @HttpCode(HttpStatus.OK)
  async removeFromCart(@Req() req, @Param('productId', ParseIntPipe) productId: number) {
    if (req.user) {
      return this.cartService.removeFromCartPersistent(req.user.id, productId);
    } else {
      const sessionId = req.cookies[SESSION_COOKIE];
      if (sessionId) {
        return this.cartService.removeFromCartGuest(sessionId, productId);
      }
    }
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearCart(@Req() req) {
    if (req.user) {
      return this.cartService.clearCartPersistent(req.user.id);
    } else {
      const sessionId = req.cookies[SESSION_COOKIE];
      if (sessionId) {
        return this.cartService.clearCartGuest(sessionId);
      }
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/all')
  findAllCarts() {
    return this.cartService.findAllCarts();
  }
}
