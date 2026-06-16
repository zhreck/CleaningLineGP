import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  WebpayPlus,
  Options,
  IntegrationCommerceCodes,
  IntegrationApiKeys,
  Environment,
} from 'transbank-sdk';
import { Order, OrderStatus } from '../orders/entities/order.entity';

@Injectable()
export class WebpayService {
  private readonly logger = new Logger(WebpayService.name);
  private readonly webpayPlus: any;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly configService: ConfigService,
  ) {
    // Configurar Webpay Plus con credenciales de integración
    const commerceCode =
      this.configService.get<string>('WEBPAY_COMMERCE_CODE') ||
      IntegrationCommerceCodes.WEBPAY_PLUS;
    const apiKey =
      this.configService.get<string>('WEBPAY_API_KEY') ||
      IntegrationApiKeys.WEBPAY;
    const environment =
      this.configService.get<string>('WEBPAY_ENVIRONMENT') === 'production'
        ? Environment.Production
        : Environment.Integration;

    this.webpayPlus = new WebpayPlus.Transaction(
      new Options(commerceCode, apiKey, environment),
    );

    this.logger.log(
      `Webpay Plus configurado en modo: ${environment === Environment.Integration ? 'Integration' : 'Production'}`,
    );
  }

  /**
   * Crea una transacción en Webpay Plus
   */
  async createTransaction(
    orderId: number,
    userId?: number,
  ): Promise<{ url: string; token: string }> {
    // Buscar la orden
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${orderId} no encontrada`);
    }

    // Validar que la orden pertenece al usuario (si hay usuario autenticado)
    if (userId && order.user && order.user.id !== userId) {
      throw new BadRequestException('No tienes permiso para pagar esta orden');
    }

    // Validar que la orden esté en estado PENDING
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `La orden ya fue procesada. Estado actual: ${order.status}`,
      );
    }

    // Obtener URL de retorno desde config
    const returnUrl =
      this.configService.get<string>('WEBPAY_RETURN_URL') ||
      'http://localhost:3000/pago/resultado';

    // Crear la transacción en Webpay
    const buyOrder = `ORD-${orderId}-${Date.now()}`;

    // Definir sessionId: usar userId si existe, sino usar email o guest-{orderId}
    const sessionId = order.user
      ? String(order.user.id)
      : (order.customerEmail ?? `guest-${order.id}`);

    const amount = Math.round(Number(order.total)); // Asegurar que sea entero

    this.logger.log(
      `Creando transacción Webpay: buyOrder=${buyOrder}, amount=${amount}, sessionId=${sessionId}`,
    );

    try {
      const response = await this.webpayPlus.create(
        buyOrder,
        sessionId,
        amount,
        returnUrl,
      );

      this.logger.log(
        `Transacción creada exitosamente: token=${response.token}`,
      );

      return {
        url: response.url,
        token: response.token,
      };
    } catch (error) {
      this.logger.error('Error al crear transacción en Webpay', error);
      throw new BadRequestException(
        'Error al crear la transacción de pago. Intenta nuevamente.',
      );
    }
  }

  /**
   * Confirma una transacción de Webpay Plus
   */
  async commitTransaction(token: string): Promise<{
    status: string;
    orderId: number;
    amount: number;
    authorizationCode?: string;
    paymentTypeCode?: string;
  }> {
    this.logger.log(`Confirmando transacción con token: ${token}`);

    try {
      // Confirmar la transacción con Webpay
      const response = await this.webpayPlus.commit(token);

      this.logger.log(`Respuesta de Webpay: ${JSON.stringify(response)}`);

      // Extraer el orderId del buy_order (formato: ORD-{id}-{timestamp})
      const buyOrderParts = response.buy_order.split('-');
      const orderId = parseInt(buyOrderParts[1], 10);

      if (isNaN(orderId)) {
        throw new BadRequestException('Formato de orden inválido');
      }

      // Buscar la orden
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException(`Orden con ID ${orderId} no encontrada`);
      }

      // Validar el monto
      const expectedAmount = Math.round(Number(order.total));
      if (response.amount !== expectedAmount) {
        this.logger.error(
          `Monto no coincide. Esperado: ${expectedAmount}, Recibido: ${response.amount}`,
        );
        throw new BadRequestException('El monto de la transacción no coincide');
      }

      // Verificar si la transacción fue autorizada
      const isAuthorized =
        response.status === 'AUTHORIZED' && response.response_code === 0;

      if (isAuthorized) {
        // Actualizar el estado de la orden a COMPLETED
        order.status = OrderStatus.COMPLETED;
        await this.orderRepository.save(order);

        this.logger.log(`Orden ${orderId} marcada como COMPLETED`);

        return {
          status: 'paid',
          orderId: order.id,
          amount: response.amount,
          authorizationCode: response.authorization_code,
          paymentTypeCode: response.payment_type_code,
        };
      } else {
        // Transacción rechazada
        order.status = OrderStatus.CANCELLED;
        await this.orderRepository.save(order);

        this.logger.warn(
          `Transacción rechazada para orden ${orderId}. Response code: ${response.response_code}`,
        );

        return {
          status: 'rejected',
          orderId: order.id,
          amount: response.amount,
        };
      }
    } catch (error) {
      this.logger.error('Error al confirmar transacción en Webpay', error);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException(
        'Error al confirmar la transacción de pago. Intenta nuevamente.',
      );
    }
  }
}
