import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WebpayService } from './webpay.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CommitTransactionDto } from './dto/commit-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments/webpay')
export class WebpayController {
  constructor(private readonly webpayService: WebpayService) {}

  /**
   * POST /payments/webpay/create
   * Crea una transacción de pago en Webpay Plus
   */
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req,
  ) {
    const userId = req.user?.id; // Opcional para checkout invitado
    const { orderId } = createTransactionDto;

    const result = await this.webpayService.createTransaction(orderId, userId);

    return {
      success: true,
      data: result,
    };
  }

  /**
   * POST /payments/webpay/commit
   * Confirma una transacción de Webpay Plus
   */
  @Post('commit')
  @HttpCode(HttpStatus.OK)
  async commitTransaction(@Body() commitTransactionDto: CommitTransactionDto) {
    const { token_ws } = commitTransactionDto;

    const result = await this.webpayService.commitTransaction(token_ws);

    return {
      success: true,
      data: result,
    };
  }
}
