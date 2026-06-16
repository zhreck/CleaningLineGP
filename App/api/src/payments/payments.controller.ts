import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateWebpayTransactionDto } from './dto/create-webpay-transaction.dto';
import { CommitWebpayTransactionDto } from './dto/commit-webpay-transaction.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webpay/create')
  @HttpCode(HttpStatus.CREATED)
  async createWebpayTransaction(@Body() dto: CreateWebpayTransactionDto) {
    const result = await this.paymentsService.createWebpayTransaction(
      dto.orderId,
    );
    return {
      success: true,
      data: result,
    };
  }

  @Post('webpay/commit')
  @HttpCode(HttpStatus.OK)
  async commitWebpayTransaction(@Body() dto: CommitWebpayTransactionDto) {
    const result = await this.paymentsService.commitWebpayTransaction(
      dto.token_ws,
    );
    return {
      success: true,
      data: result,
    };
  }
}
