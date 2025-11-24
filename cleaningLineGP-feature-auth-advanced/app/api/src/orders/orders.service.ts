import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly cartService: CartService,
    private readonly productsService: ProductsService,
  ) {}

  async createOrderFromCart(user: User): Promise<Order> {
    const cart = await this.cartService.getRawCartByUserId(user.id);

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('El carrito está vacío.');
    }

    const newOrder = this.orderRepository.create({
      user,
      total: 0, // Lo calcularemos a continuación
      status: OrderStatus.PENDING,
      items: [],
    });

    for (const cartItem of cart.items) {
      const product = await this.productsService.findOne(cartItem.product.id);
      if (!product) {
        throw new NotFoundException(
          `Producto con ID ${cartItem.product.id} no encontrado.`,
        );
      }

      const orderItem = this.orderItemRepository.create({
        product,
        quantity: cartItem.quantity,
        price: Number(product.price), // Aseguramos que sea un número para la BD
      });
      newOrder.total += orderItem.quantity * orderItem.price;
      newOrder.items.push(orderItem);
    }
    // Redondear el total a 2 decimales
    newOrder.total = parseFloat(newOrder.total.toFixed(2));

    const savedOrder = await this.orderRepository.save(newOrder);

    // Limpiar el carrito después de crear la orden
    await this.cartService.clearCartPersistent(user.id);

    return savedOrder;
  }

  async completeOrder(orderId: number, userId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${orderId} no encontrada.`);
    }

    if (order.user.id !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para completar esta orden.',
      );
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `La orden ya está en estado '${order.status}'.`,
      );
    }

    order.status = OrderStatus.COMPLETED;
    return this.orderRepository.save(order);
  }

  async findUserOrders(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
    if (!order) throw new NotFoundException(`Orden con ID ${id} no encontrada.`);
    return order;
  }
}
