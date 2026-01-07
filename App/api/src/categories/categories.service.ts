import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../products/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { slugify } from '../utils/slugify';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    /**
     * Crear una nueva categoría
     * El slug se genera automáticamente mediante el hook @BeforeInsert de la entidad
     */
    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const { name } = createCategoryDto;

        // Verificar si ya existe una categoría con ese nombre
        const existingCategory = await this.categoryRepository.findOne({
            where: { name },
        });

        if (existingCategory) {
            throw new ConflictException(
                `Category with name "${name}" already exists`,
            );
        }

        // Generar slug para verificar duplicados
        const slug = slugify(name);

        // Verificar si ya existe una categoría con ese slug
        const existingSlug = await this.categoryRepository.findOne({
            where: { slug },
        });

        if (existingSlug) {
            throw new ConflictException(
                `Category with slug "${slug}" already exists`,
            );
        }

        // Crear la categoría - el slug se genera automáticamente
        const category = this.categoryRepository.create(createCategoryDto);
        return this.categoryRepository.save(category);
    }

    /**
     * Obtener todas las categorías con conteo de productos
     */
    async findAll(): Promise<any[]> {
        const categories = await this.categoryRepository
            .createQueryBuilder('category')
            .leftJoinAndSelect('category.products', 'product')
            .getMany();

        // Formatear respuesta con conteo de productos
        return categories.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            productCount: category.products ? category.products.length : 0,
        }));
    }

    /**
     * Obtener una categoría por ID
     */
    async findOne(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['products'],
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return category;
    }

    /**
     * Actualizar una categoría
     * El slug se regenera automáticamente mediante el hook @BeforeUpdate de la entidad
     */
    async update(
        id: number,
        updateCategoryDto: UpdateCategoryDto,
    ): Promise<Category> {
        const category = await this.findOne(id);

        if (updateCategoryDto.name) {
            // Verificar si el nuevo nombre ya existe (excepto en esta categoría)
            const existingCategory = await this.categoryRepository.findOne({
                where: { name: updateCategoryDto.name },
            });

            if (existingCategory && existingCategory.id !== id) {
                throw new ConflictException(
                    `Category with name "${updateCategoryDto.name}" already exists`,
                );
            }

            // Generar slug para verificar duplicados
            const newSlug = slugify(updateCategoryDto.name);

            // Verificar si el nuevo slug ya existe (excepto en esta categoría)
            const existingSlug = await this.categoryRepository.findOne({
                where: { slug: newSlug },
            });

            if (existingSlug && existingSlug.id !== id) {
                throw new ConflictException(
                    `Category with slug "${newSlug}" already exists`,
                );
            }

            // Actualizar nombre - el slug se regenera automáticamente
            category.name = updateCategoryDto.name;
        }

        return this.categoryRepository.save(category);
    }

    /**
     * Eliminar una categoría
     * Los productos asociados tendrán category = null
     */
    async remove(id: number): Promise<void> {
        const category = await this.findOne(id);

        // Actualizar productos para que no tengan categoría
        await this.productRepository
            .createQueryBuilder()
            .update(Product)
            .set({ category: null })
            .where('category_id = :id', { id })
            .execute();

        // Eliminar la categoría
        await this.categoryRepository.remove(category);
    }
}
