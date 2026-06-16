import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginatedResponse, ProductFilters } from './dto/pagination.dto';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryId, ...productData } = createProductDto;
    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    if (!category) {
      throw new NotFoundException(`Category with ID "${categoryId}" not found`);
    }

    const product = this.productRepository.create({
      ...productData,
      category,
    });

    return this.productRepository.save(product);
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['category'],
    });
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 20,
    filters?: ProductFilters,
  ): Promise<PaginatedResponse<Product>> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .orderBy('product.id', 'DESC');

    // Apply search filter
    if (filters?.search) {
      queryBuilder.andWhere('product.name ILIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    // Apply category filter
    if (filters?.categoryId) {
      queryBuilder.andWhere('product.category.id = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Get total count
    const total = await queryBuilder.getCount();

    // Get paginated results
    const items = await queryBuilder.skip(offset).take(limit).getMany();

    // Calculate pagination metadata
    const lastPage = Math.ceil(total / limit);
    const hasMore = page < lastPage;

    return {
      items,
      total,
      page,
      lastPage,
      hasMore,
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    // Si se incluye categoryId en la actualización, buscar y asignar la categoría correspondiente
    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOneBy({
        id: updateProductDto.categoryId,
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID "${updateProductDto.categoryId}" not found`,
        );
      }
      product.category = category;
    }

    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  }
}
