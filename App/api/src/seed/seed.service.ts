import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/models/roles.model';
import { Category } from '../products/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart-item.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) { }

  /**
   * Genera un slug a partir del nombre
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
      .trim()
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-'); // Eliminar guiones duplicados
  }

  /**
   * Ejecutar seed completo
   */
  async runSeed() {
    this.logger.log('🌱 Starting seed process...');

    try {
      // 1. Limpiar base de datos
      await this.cleanDatabase();

      // 2. Crear usuarios
      await this.createUsers();

      // 3. Crear categorías
      const categories = await this.createCategories();

      // 4. Crear productos
      await this.createProducts(categories);

      this.logger.log('✅ Seed completed successfully!');
      return {
        message: 'Seed executed successfully',
        users: 2,
        categories: categories.length,
        products: await this.productRepository.count(),
      };
    } catch (error) {
      this.logger.error('❌ Seed failed:', error);
      throw error;
    }
  }

  /**
   * Limpiar base de datos
   */
  private async cleanDatabase() {
    this.logger.log('🧹 Cleaning database...');

    // Usar query builder para eliminar con CASCADE
    await this.cartItemRepository.query('TRUNCATE TABLE cart_items CASCADE');
    this.logger.log('  - Cart items deleted');

    await this.cartRepository.query('TRUNCATE TABLE carts CASCADE');
    this.logger.log('  - Carts deleted');

    await this.productRepository.query('TRUNCATE TABLE products CASCADE');
    this.logger.log('  - Products deleted');

    await this.categoryRepository.query('TRUNCATE TABLE categories CASCADE');
    this.logger.log('  - Categories deleted');

    // No eliminamos usuarios para no perder sesiones
    this.logger.log('  - Users kept (not deleted)');
  }

  /**
   * Crear usuarios
   */
  private async createUsers() {
    this.logger.log('👥 Creating users...');

    // Verificar si ya existen
    const adminExists = await this.userRepository.findOne({
      where: { email: 'admin@test.com' },
    });

    const userExists = await this.userRepository.findOne({
      where: { email: 'user@test.com' },
    });

    if (!adminExists) {
      const admin = this.userRepository.create({
        email: 'admin@test.com',
        password: 'Admin123!',
        roles: [Role.ADMIN, Role.USER],
      });
      await this.userRepository.save(admin);
      this.logger.log('  - Admin user created: admin@test.com / Admin123!');
    } else {
      this.logger.log('  - Admin user already exists');
    }

    if (!userExists) {
      const user = this.userRepository.create({
        email: 'user@test.com',
        password: 'User123!',
        roles: [Role.USER],
      });
      await this.userRepository.save(user);
      this.logger.log('  - Regular user created: user@test.com / User123!');
    } else {
      this.logger.log('  - Regular user already exists');
    }
  }

  /**
   * Crear categorías
   */
  private async createCategories(): Promise<Category[]> {
    this.logger.log('📁 Creating categories...');

    const categoryNames = [
      'Cloro y desinfectantes',
      'Limpieza del hogar',
      'Limpieza industrial',
      'Cuidado personal',
    ];

    const categories: Category[] = [];

    for (const name of categoryNames) {
      const slug = this.generateSlug(name);
      const category = this.categoryRepository.create({ name, slug });
      const saved = await this.categoryRepository.save(category);
      categories.push(saved);
      this.logger.log(`  - Created: ${name} (${slug})`);
    }

    return categories;
  }

  /**
   * Crear productos
   */
  private async createProducts(categories: Category[]) {
    this.logger.log('📦 Creating products...');

    const productsData = this.getProductsData();
    let totalCreated = 0;

    for (const categoryData of productsData) {
      const category = categories.find((c) => c.slug === categoryData.slug);
      if (!category) continue;

      for (const productData of categoryData.products) {
        const slug = this.generateSlug(productData.name);

        const product = this.productRepository.create({
          name: productData.name,
          slug,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(productData.name)}`,
          category,
          isFeatured: productData.isFeatured || false,
          isOnSale: productData.isOnSale || false,
          discountPercent: productData.discountPercent || null,
        });

        await this.productRepository.save(product);
        totalCreated++;
      }

      this.logger.log(`  - Created ${categoryData.products.length} products for "${category.name}"`);
    }

    this.logger.log(`  - Total products created: ${totalCreated}`);
  }

  /**
   * Datos de productos por categoría
   */
  private getProductsData() {
    return [
      {
        slug: 'cloro-y-desinfectantes',
        products: [
          {
            name: 'Cloro Líquido 1L',
            description: 'Cloro líquido concentrado para desinfección de superficies, ideal para baños y cocinas.',
            price: 2490,
            stock: 150,
            isFeatured: true,
            isOnSale: true,
            discountPercent: 10,
          },
          {
            name: 'Cloro Gel 900ml',
            description: 'Cloro en gel adherente para limpieza profunda de inodoros y superficies verticales.',
            price: 3290,
            stock: 120,
            isFeatured: false,
            isOnSale: false,
          },
          {
            name: 'Desinfectante Multiuso 1L',
            description: 'Desinfectante líquido con aroma a lavanda, elimina 99.9% de bacterias y virus.',
            price: 3990,
            stock: 100,
            isFeatured: true,
            isOnSale: false,
          },
          {
            name: 'Cloro Industrial 5L',
            description: 'Cloro concentrado de uso industrial, ideal para grandes superficies y empresas.',
            price: 8990,
            stock: 60,
            isFeatured: false,
            isOnSale: true,
            discountPercent: 15,
          },
          {
            name: 'Desinfectante Pino 2L',
            description: 'Desinfectante con aroma a pino, limpia y desinfecta pisos y superficies.',
            price: 4590,
            stock: 80,
            isFeatured: false,
            isOnSale: false,
          },
          {
            name: 'Alcohol Gel Antibacterial 1L',
            description: 'Alcohol gel 70% para desinfección de manos, con glicerina para suavidad.',
            price: 5990,
            stock: 200,
            isFeatured: true,
            isOnSale: false,
          },
          {
            name: 'Toallas Desinfectantes 80 unidades',
            description: 'Toallas húmedas desinfectantes para superficies, elimina gérmenes al instante.',
            price: 4490,
            stock: 90,
            isFeatured: false,
            isOnSale: true,
            discountPercent: 12,
          },
          {
            name: 'Spray Desinfectante 500ml',
            description: 'Spray desinfectante multiuso, ideal para superficies de contacto frecuente.',
            price: 3790,
            stock: 110,
            isFeatured: false,
            isOnSale: false,
          },
          {
            name: 'Cloro Perfumado 1L',
            description: 'Cloro con fragancia floral, desinfecta y deja un aroma agradable.',
            price: 2990,
            stock: 130,
            isFeatured: false,
            isOnSale: false,
          },
          {
            name: 'Desinfectante Eucalipto 1L',
            description: 'Desinfectante con aroma a eucalipto, ideal para ambientes cerrados.',
            price: 3890,
            stock: 95,
            isFeatured: false,
            isOnSale: false,
          },
        ],
      },
      {
        slug: 'limpieza-del-hogar',
        products: [
          {
            name: 'Detergente Líquido 3L',
            description: 'Detergente líquido concentrado para ropa, elimina manchas difíciles y cuida las telas.',
            price: 6990,
            stock: 85,
            isFeatured: true,
            isOnSale: false,
          },
          {
            name: 'Limpiador de Pisos 2L',
            description: 'Limpiador líquido para todo tipo de pisos, deja brillo sin enjuague.',
            price: 4290,
            stock: 100,
            isFeatured: false,
            isOnSale: true,
            discountPercent: 8,
          },
          {
            name: 'Lavavajillas Líquido 1L',
            description: 'Lavavajillas concentrado con aroma a limón, elimina grasa fácilmente.',
            price: 2990,
            stock: 140,
            isFeatured: false,
            isOnSale: false,
          },
          {
            name: 'Limpia Vidrios 500ml',
            description: 'Limpiador de vidrios y espejos, no deja rayas ni residuos.',
            price: 2490,
            stock: 120,
            isFeatured: false,
            isOnSale: false,
          },
          {
            name: 'Desengrasante Cocina 1L',
            description: 'Desengrasante potente para cocinas, hornos y campanas extractoras.',
            price: 4590,
            stock: 70,
            isFeatured: true,
            isOnSale: true,
            discountPercent: 10,
          },
          {
            name: 'Limpiador Multiuso 1L',
            description: 'Limpiador multiuso para todas las superficies del hogar.',
            price: 3490,
            stock: 110,
            isFeatured: false,
            isOnSale: false,
          },
          {
            name: 'Suavizante de Ropa 2L',
            description: 'Suavizante concentrado con aroma floral, deja la ropa suave y perfumada.',
            price: 4990,
            stock: 90,
            isFeatured: false,
            isOnSale: false,
          },
          {
            name: 'Limpiador de Baños 1L',
            description: 'Limpiador especializado para baños, elimina sarro y manchas difíciles.',
            price: 3790,
            stock: 100,
            isFeatured: false,
            isOnSale: false,
          },
          {
            name: 'Quitamanchas Ropa 500ml',
            description: 'Quitamanchas pre-lavado, efectivo contra manchas de grasa, vino y café.',
            price: 3990,
            stock: 80,
            isFeatured: false,
            isOnSale: true,
            discountPercent: 15,
          },
          {
            name: 'Limpiador de Muebles 500ml',
            description: 'Limpiador y abrillantador para muebles de madera, nutre y protege.',
            price: 4290,
            stock: 65,
            isFeatured: false,
            isOnSale: false,
          },
        ],
      },
      {
        slug: 'limpieza-industrial',
        products: [
          {
            name: 'Detergente Industrial 20L',
            description: 'Detergente industrial concentrado para lavado de ropa en lavanderías.',
            price: 18990,
            stock: 30,
            isFeatured: true,
            isOnSale: false,
          },
          {
            name: 'Desengrasante Industrial 5L',
            description: 'Desengrasante de alta potencia para talleres y fábricas.',
            price: 12990,
            stock: 40,
            isFeatured: false,
            isOnSale: true,
            discountPercent: 10,
          },
          {
            name: 'Limpiador de Pisos Industrial 10L',
            description: 'Limpiador concentrado para pisos industriales, alto rendimiento.',
            price: 14990,
            stock: 35,
            isFeatured: false,
            isOnSale: false,
          },
          {
            name: 'Desinfectante Industrial 10L',
            description: 'Desinfectante de grado industrial, elimina bacterias y virus.',
            price: 16990,
            stock: 25,
            isFeatured: true,
            isOnSale: false,
          },
          {
            name: 'Jabón Líquido Industrial 20L',
            description: 'Jabón líquido para uso industrial, ideal para dispensadores.',
            price: 15990,
            stock: 30,
            isFeatured: false,
            isOnSale: false,
          },
          {
            name: 'Limpiador Multiuso Industrial 5L',
            description: 'Limpiador multiuso concentrado para uso industrial.',
            price: 9990,
            stock: 50,
            isFeatured: false,
            isOnSale: true,
            discountPercent: 12,
          },
          {
            name: 'Cloro Industrial 20L',
            description: 'Cloro concentrado en bidón de 20 litros para uso industrial.',
            price: 17990,
            stock: 20,
            isFeatured: false,
            isOnSale: false,
          },
          {
            name: 'Desodorante Ambiental Industrial 5L',
            description: 'Desodorante ambiental concentrado para grandes espacios.',
            price: 11990,
            stock: 40,
            isFeatured: false,
            isOnSale: false,
          },
          {
            name: 'Limpiador de Vidrios Industrial 5L',
            description: 'Limpiador de vidrios concentrado para uso profesional.',
            price: 8990,
            stock: 45,
            isFeatured: false,
            isOnSale: false,
          },
          {
            name: 'Quitasarro Industrial 5L',
            description: 'Quitasarro potente para baños y sanitarios industriales.',
            price: 10990,
            stock: 35,
            isFeatured: false,
            isOnSale: true,
            discountPercent: 8,
          },
        ],
      },
      {
        slug: 'cuidado-personal',
        products: [
          {
            name: 'Jabón Líquido Manos 1L',
            description: 'Jabón líquido antibacterial para manos, con glicerina y aloe vera.',
            price: 3490,
            stock: 150,
            isFeatured: true,
            isOnSale: false,
          },
          {
            name: 'Shampoo Uso Frecuente 1L',
            description: 'Shampoo para uso diario, limpia suavemente sin resecar el cabello.',
            price: 4990,
            stock: 100,
            isFeatured: false,
            isOnSale: true,
            discountPercent: 10,
          },
          {
            name: 'Acondicionador 1L',
            description: 'Acondicionador hidratante, deja el cabello suave y manejable.',
            price: 4990,
            stock: 95,
            isFeatured: false,
            isOnSale: false,
          },
          {
            name: 'Gel de Ducha 1L',
            description: 'Gel de ducha con aroma fresco, limpia e hidrata la piel.',
            price: 3990,
            stock: 120,
            isFeatured: false,
            isOnSale: false,
          },
          {
            name: 'Jabón en Barra Pack 6 unidades',
            description: 'Pack de 6 jabones en barra con glicerina, suaves con la piel.',
            price: 2990,
            stock: 140,
            isFeatured: false,
            isOnSale: true,
            discountPercent: 15,
          },
          {
            name: 'Crema de Manos 500ml',
            description: 'Crema hidratante para manos, absorción rápida y no grasa.',
            price: 4490,
            stock: 80,
            isFeatured: true,
            isOnSale: false,
          },
          {
            name: 'Papel Higiénico 24 rollos',
            description: 'Papel higiénico suave y resistente, doble hoja, pack de 24 rollos.',
            price: 8990,
            stock: 60,
            isFeatured: false,
            isOnSale: false,
          },
          {
            name: 'Toallas de Papel 6 rollos',
            description: 'Toallas de papel absorbentes, pack de 6 rollos grandes.',
            price: 5990,
            stock: 70,
            isFeatured: false,
            isOnSale: false,
          },
          {
            name: 'Pañuelos Desechables 10 cajas',
            description: 'Pañuelos faciales suaves, pack de 10 cajas de 100 unidades.',
            price: 3990,
            stock: 110,
            isFeatured: false,
            isOnSale: true,
            discountPercent: 8,
          },
          {
            name: 'Alcohol Gel 500ml',
            description: 'Alcohol gel antibacterial 70%, con aloe vera para cuidado de manos.',
            price: 3490,
            stock: 180,
            isFeatured: true,
            isOnSale: false,
          },
        ],
      },
    ];
  }
}
