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
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly cartService: CartService,
    private readonly productsService: ProductsService,
  ) { }

  async createOrderFromCart(
    createOrderDto: CreateOrderDto,
    user?: User,
  ): Promise<Order> {
    let orderItems: any[] = [];

    if (user) {
      // Usuario autenticado: obtener carrito del usuario
      const cart = await this.cartService.getRawCartByUserId(user.id);

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('El carrito está vacío.');
      }

      orderItems = cart.items;
    } else {
      // Usuario invitado: usar items del DTO
      if (!createOrderDto.items || createOrderDto.items.length === 0) {
        throw new BadRequestException(
          'Para checkout invitado, debes enviar los items en el body.',
        );
      }

      // Convertir items del DTO a formato compatible
      orderItems = createOrderDto.items.map(item => ({
        product: { id: item.productId },
        quantity: item.quantity,
        price: item.price,
      }));
    }

    const newOrder = this.orderRepository.create({
      user: user || undefined,
      total: 0, // Lo calcularemos a continuación
      status: OrderStatus.PENDING,
      items: [],
      // Datos del cliente desde el DTO
      customerName: createOrderDto.customerName,
      customerEmail: createOrderDto.customerEmail,
      customerPhone: createOrderDto.customerPhone,
      customerRut: createOrderDto.customerRut,
      customerAddress: createOrderDto.customerAddress,
      customerRegion: createOrderDto.customerRegion,
      customerCommune: createOrderDto.customerCommune,
      deliveryType: createOrderDto.deliveryType,
      notes: createOrderDto.notes,
    });

    for (const cartItem of orderItems) {
      const productId = user ? cartItem.product.id : cartItem.product.id;
      const product = await this.productsService.findOne(productId);

      if (!product) {
        throw new NotFoundException(
          `Producto con ID ${productId} no encontrado.`,
        );
      }

      // Para usuarios autenticados, usar precio del producto
      // Para invitados, usar precio del item (ya calculado en frontend)
      const itemPrice = user ? Number(product.price) : Number(cartItem.price);

      const orderItem = this.orderItemRepository.create({
        product,
        quantity: cartItem.quantity,
        price: itemPrice,
      });

      newOrder.total += orderItem.quantity * orderItem.price;
      newOrder.items.push(orderItem);
    }

    // Redondear el total a 2 decimales
    newOrder.total = parseFloat(newOrder.total.toFixed(2));

    const savedOrder = await this.orderRepository.save(newOrder);

    // Limpiar el carrito después de crear la orden (solo si hay usuario)
    if (user) {
      await this.cartService.clearCartPersistent(user.id);
    }

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

  async getStats() {
    const orders = await this.orderRepository.find({
      relations: ['user', 'items', 'items.product'],
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);

    // Contar clientes únicos (usuarios registrados + emails de invitados)
    const uniqueEmails = new Set<string>();
    orders.forEach(order => {
      if (order.user) {
        uniqueEmails.add(order.user.email);
      } else if (order.customerEmail) {
        uniqueEmails.add(order.customerEmail);
      }
    });
    const totalCustomers = uniqueEmails.size;

    // Órdenes activas (pending)
    const activeOrders = orders.filter(o => o.status === OrderStatus.PENDING).length;

    // Top productos (más vendidos por cantidad)
    const productSales = new Map<number, { name: string; quantity: number }>();
    orders.forEach(order => {
      order.items.forEach(item => {
        const existing = productSales.get(item.product.id);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          productSales.set(item.product.id, {
            name: item.product.name,
            quantity: item.quantity,
          });
        }
      });
    });

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      totalOrders,
      totalRevenue,
      totalCustomers,
      activeOrders,
      topProducts,
    };
  }
}
