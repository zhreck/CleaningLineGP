import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsService', () => {
    let service: ProductsService;
    let productRepository: Repository<Product>;
    let categoryRepository: Repository<Category>;

    const mockProductRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        findOneBy: jest.fn(),
        preload: jest.fn(),
        delete: jest.fn(),
        remove: jest.fn(),
    };

    const mockCategoryRepository = {
        findOne: jest.fn(),
        findOneBy: jest.fn(),
    };

    const mockCategory: Category = {
        id: 1,
        name: 'Limpieza',
        slug: 'limpieza',
        products: [],
        generateSlugOnInsert: jest.fn(),
        generateSlugOnUpdate: jest.fn(),
    };

    const mockProduct: Product = {
        id: 1,
        name: 'Cloro 1L',
        description: 'Cloro líquido para limpieza',
        slug: 'cloro-1l',
        price: 2990,
        stock: 100,
        imageUrl: 'http://localhost:9000/products/cloro.jpg',
        category: mockCategory,
        isFeatured: false,
        isOnSale: false,
        discountPercent: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: getRepositoryToken(Product),
                    useValue: mockProductRepository,
                },
                {
                    provide: getRepositoryToken(Category),
                    useValue: mockCategoryRepository,
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        productRepository = module.get<Repository<Product>>(
            getRepositoryToken(Product),
        );
        categoryRepository = module.get<Repository<Category>>(
            getRepositoryToken(Category),
        );

        // Limpiar mocks antes de cada test
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        const createProductDto: CreateProductDto = {
            name: 'Cloro 1L',
            description: 'Cloro líquido para limpieza',
            slug: 'cloro-1l',
            price: 2990,
            stock: 100,
            imageUrl: 'http://localhost:9000/products/cloro.jpg',
            categoryId: 1,
            isFeatured: false,
            isOnSale: false,
            discountPercent: 0,
        };

        it('should create a product successfully', async () => {
            mockCategoryRepository.findOneBy.mockResolvedValue(mockCategory);
            mockProductRepository.create.mockReturnValue(mockProduct);
            mockProductRepository.save.mockResolvedValue(mockProduct);

            const result = await service.create(createProductDto);

            expect(categoryRepository.findOneBy).toHaveBeenCalledWith({
                id: createProductDto.categoryId,
            });
            expect(productRepository.create).toHaveBeenCalled();
            expect(productRepository.save).toHaveBeenCalledWith(mockProduct);
            expect(result).toEqual(mockProduct);
        });

        it('should throw NotFoundException when category does not exist', async () => {
            mockCategoryRepository.findOneBy.mockResolvedValue(null);

            await expect(service.create(createProductDto)).rejects.toThrow(
                NotFoundException,
            );
            await expect(service.create(createProductDto)).rejects.toThrow(
                `Category with ID "${createProductDto.categoryId}" not found`,
            );
        });

        it('should create product with default image if none provided', async () => {
            const dtoWithoutImage = { ...createProductDto, imageUrl: undefined };
            const productWithDefaultImage = {
                ...mockProduct,
                imageUrl: undefined,
            };

            mockCategoryRepository.findOneBy.mockResolvedValue(mockCategory);
            mockProductRepository.create.mockReturnValue(productWithDefaultImage);
            mockProductRepository.save.mockResolvedValue(productWithDefaultImage);

            const result = await service.create(dtoWithoutImage);

            expect(mockCategoryRepository.findOneBy).toHaveBeenCalled();
            expect(mockProductRepository.create).toHaveBeenCalled();
        });

        it('should throw InternalServerErrorException on database error', async () => {
            mockCategoryRepository.findOneBy.mockResolvedValue(mockCategory);
            mockProductRepository.create.mockReturnValue(mockProduct);
            mockProductRepository.save.mockRejectedValue(
                new Error('Database connection failed'),
            );

            await expect(service.create(createProductDto)).rejects.toThrow(
                Error,
            );
        });
    });

    describe('findAll', () => {
        it('should return an array of products', async () => {
            const mockProducts = [mockProduct];
            mockProductRepository.find.mockResolvedValue(mockProducts);

            const result = await service.findAll();

            expect(productRepository.find).toHaveBeenCalledWith({
                relations: ['category'],
            });
            expect(result).toEqual(mockProducts);
        });

        it('should return empty array when no products exist', async () => {
            mockProductRepository.find.mockResolvedValue([]);

            const result = await service.findAll();

            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should throw InternalServerErrorException on database error', async () => {
            mockProductRepository.find.mockRejectedValue(
                new Error('Database error'),
            );

            await expect(service.findAll()).rejects.toThrow(
                Error,
            );
        });
    });

    describe('findOne', () => {
        it('should return a product by id', async () => {
            mockProductRepository.findOne.mockResolvedValue(mockProduct);

            const result = await service.findOne(1);

            expect(productRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                relations: ['category'],
            });
            expect(result).toEqual(mockProduct);
        });

        it('should throw NotFoundException when product does not exist', async () => {
            mockProductRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
            await expect(service.findOne(999)).rejects.toThrow(
                'Product with ID "999" not found',
            );
        });
    });

    describe('update', () => {
        const updateProductDto: UpdateProductDto = {
            name: 'Cloro 2L',
            price: 4990,
        };

        it('should update a product successfully', async () => {
            const updatedProduct = { ...mockProduct, ...updateProductDto };
            mockProductRepository.preload.mockResolvedValue(updatedProduct);
            mockProductRepository.save.mockResolvedValue(updatedProduct);

            const result = await service.update(1, updateProductDto);

            expect(productRepository.preload).toHaveBeenCalledWith({
                id: 1,
                ...updateProductDto,
            });
            expect(productRepository.save).toHaveBeenCalled();
            expect(result.name).toEqual(updateProductDto.name);
            expect(result.price).toEqual(updateProductDto.price);
        });

        it('should throw NotFoundException when product does not exist', async () => {
            mockProductRepository.preload.mockResolvedValue(null);

            await expect(service.update(999, updateProductDto)).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should update category when categoryId is provided', async () => {
            const updateWithCategory = { ...updateProductDto, categoryId: 2 };
            const newCategory = { ...mockCategory, id: 2, name: 'Desinfectantes' };
            const productWithNewCategory = { ...mockProduct, category: newCategory };

            mockProductRepository.preload.mockResolvedValue(mockProduct);
            mockCategoryRepository.findOneBy.mockResolvedValue(newCategory);
            mockProductRepository.save.mockResolvedValue(productWithNewCategory);

            const result = await service.update(1, updateWithCategory);

            expect(categoryRepository.findOneBy).toHaveBeenCalledWith({
                id: 2,
            });
            expect(result.category?.id).toEqual(2);
        });

        it('should throw NotFoundException when new category does not exist', async () => {
            const updateWithCategory = { ...updateProductDto, categoryId: 999 };

            mockProductRepository.preload.mockResolvedValue(mockProduct);
            mockCategoryRepository.findOneBy.mockResolvedValue(null);

            await expect(service.update(1, updateWithCategory)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('remove', () => {
        it('should remove a product successfully', async () => {
            mockProductRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

            await service.remove(1);

            expect(productRepository.delete).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundException when product does not exist', async () => {
            mockProductRepository.delete.mockResolvedValue({ affected: 0, raw: {} });

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
            await expect(service.remove(999)).rejects.toThrow(
                'Product with ID "999" not found',
            );
        });

        it('should throw InternalServerErrorException on database error', async () => {
            mockProductRepository.delete.mockRejectedValue(
                new Error('Database error'),
            );

            await expect(service.remove(1)).rejects.toThrow(
                Error,
            );
        });
    });
});
