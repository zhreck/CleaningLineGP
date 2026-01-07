import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PaymentsService {
    private tx: any;

    constructor(private readonly ordersService: OrdersService) {
        // Configurar Webpay Plus para desarrollo (integración)
        const options = new Options(
            IntegrationCommerceCodes.WEBPAY_PLUS,
            IntegrationApiKeys.WEBPAY,
            Environment.Integration
        );
        this.tx = new WebpayPlus.Transaction(options);
    }

    async createWebpayTransaction(orderId: number) {
        // Obtener la orden
        const order = await this.ordersService.findOne(orderId);
        if (!order) {
            throw new NotFoundException(`Orden con ID ${orderId} no encontrada`);
        }

        if (order.total <= 0) {
            throw new BadRequestException('El monto de la orden debe ser mayor a 0');
        }

        try {
            // Crear transacción en Webpay
            const buyOrder = `ORDER-${orderId}-${Date.now()}`;
            const sessionId = `SESSION-${orderId}-${Date.now()}`;
            const amount = Math.round(order.total); // Webpay requiere enteros
            const returnUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/return`;

            const response = await this.tx.create(
                buyOrder,
                sessionId,
                amount,
                returnUrl
            );

            return {
                url: response.url,
                token: response.token,
                buyOrder,
                sessionId,
                amount,
            };
        } catch (error) {
            console.error('Error creating Webpay transaction:', error);
            throw new BadRequestException('Error al crear la transacción de pago');
        }
    }

    async commitWebpayTransaction(token_ws: string) {
        try {
            const response = await this.tx.commit(token_ws);

            return {
                status: response.status,
                amount: response.amount,
                authorizationCode: response.authorization_code,
                paymentTypeCode: response.payment_type_code,
                responseCode: response.response_code,
                installmentsNumber: response.installments_number,
                buyOrder: response.buy_order,
                sessionId: response.session_id,
            };
        } catch (error) {
            console.error('Error committing Webpay transaction:', error);
            throw new BadRequestException('Error al confirmar la transacción de pago');
        }
    }
}