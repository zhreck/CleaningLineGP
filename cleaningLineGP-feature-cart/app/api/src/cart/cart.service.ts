import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ProductsService } from '../products/products.service';
import { RedisService } from '../redis/redis.service';

const TAX_RATE = 0.1; // 10% de impuestos
const REDIS_CART_TTL = 86400; // 24 horas

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly productsService: ProductsService,
    private readonly redisService: RedisService,
  ) {}

  // --- Métodos para usuarios autenticados (PostgreSQL) ---

  async addToCartPersistent(userId: number, dto: AddToCartDto): Promise<Cart> {
    const { productId, quantity } = dto;
    const product = await this.productsService.findOne(productId);

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    if (product.stock < quantity) {
      throw new BadRequestException(`Not enough stock for product ${product.name}`);
    }

    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ userId, items: [] });
    }

    let cartItem = cart.items.find((item) => item.product.id === productId);

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartItemRepository.create({
        product,
        productId,
        quantity,
        price: product.price,
      });
      cart.items.push(cartItem);
    }

    return this.cartRepository.save(cart);
  }

  async getCartPersistent(userId: number) {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      return this.formatCartResponse(null);
    }

    return this.formatCartResponse(cart);
  }

  async removeFromCartPersistent(userId: number, productId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const itemIndex = cart.items.findIndex((item) => item.product.id === productId);
    if (itemIndex === -1) {
      throw new NotFoundException(`Product with ID ${productId} not in cart`);
    }

    cart.items.splice(itemIndex, 1);
    return this.cartRepository.save(cart);
  }

  async clearCartPersistent(userId: number): Promise<void> {
    const cart = await this.cartRepository.findOne({ where: { userId } });
    if (cart) {
      await this.cartRepository.remove(cart);
    }
  }

  // --- Métodos para visitantes (Redis) ---

  async addToCartGuest(sessionId: string, dto: AddToCartDto) {
    const { productId, quantity } = dto;
    const product = await this.productsService.findOne(productId);

    if (!product) throw new NotFoundException(`Product with ID ${productId} not found`);
    if (product.stock < quantity) throw new BadRequestException(`Not enough stock for product ${product.name}`);

    const cartKey = `cart:${sessionId}`;
    const rawCart = await this.redisService.get(cartKey);
    let cart = rawCart ? JSON.parse(rawCart) : { items: [] };

    const itemIndex = cart.items.findIndex((item) => item.productId === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price,
        name: product.name,
        imageUrl: product.imageUrl,
      });
    }

    await this.redisService.set(cartKey, JSON.stringify(cart), REDIS_CART_TTL);
    return this.formatCartResponse(cart, true);
  }

  async getCartGuest(sessionId: string) {
    const cartKey = `cart:${sessionId}`;
    const rawCart = await this.redisService.get(cartKey);

    if (!rawCart) {
      return this.formatCartResponse(null);
    }

    const cart = JSON.parse(rawCart);
    await this.redisService.set(cartKey, JSON.stringify(cart), REDIS_CART_TTL); // Refresh TTL
    return this.formatCartResponse(cart, true);
  }

  async removeFromCartGuest(sessionId: string, productId: number) {
    const cartKey = `cart:${sessionId}`;
    const rawCart = await this.redisService.get(cartKey);
    if (!rawCart) throw new NotFoundException('Cart not found');

    let cart = JSON.parse(rawCart);
    cart.items = cart.items.filter((item) => item.productId !== productId);

    await this.redisService.set(cartKey, JSON.stringify(cart), REDIS_CART_TTL);
    return this.formatCartResponse(cart, true);
  }

  async clearCartGuest(sessionId: string): Promise<void> {
    await this.redisService.del(`cart:${sessionId}`);
  }

  // --- Lógica Común ---

  private formatCartResponse(cart: any, isGuest = false) {
    if (!cart || !cart.items || cart.items.length === 0) {
      return { items: [], subtotal: 0, taxes: 0, total: 0 };
    }

    let subtotal = 0;
    const formattedItems = cart.items.map((item) => {
      const price = isGuest ? item.price : item.product.price;
      const totalItemPrice = item.quantity * price;
      subtotal += totalItemPrice;

      return {
        productId: isGuest ? item.productId : item.product.id,
        name: isGuest ? item.name : item.product.name,
        quantity: item.quantity,
        price: price,
        total: totalItemPrice,
        imageUrl: isGuest ? item.imageUrl : item.product.imageUrl,
      };
    });

    const taxes = subtotal * TAX_RATE;
    const total = subtotal + taxes;

    return {
      id: isGuest ? null : cart.id,
      items: formattedItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      taxes: parseFloat(taxes.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };
  }

  // --- Admin ---
  async findAllCarts(): Promise<Cart[]> {
    return this.cartRepository.find({ relations: ['items', 'items.product'] });
  }
}
