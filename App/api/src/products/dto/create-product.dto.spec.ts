import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateProductDto } from './create-product.dto';

describe('CreateProductDto', () => {
  describe('Validation', () => {
    it('should pass validation with valid data', async () => {
      const dto = plainToClass(CreateProductDto, {
        name: 'Cloro 1L',
        description: 'Cloro líquido para limpieza',
        slug: 'cloro-1l',
        price: 2990,
        stock: 100,
        imageUrl: 'http://localhost:9000/products/cloro.jpg',
        categoryId: 1,
        isFeatured: false,
        isOnSale: false,
        discountPercent: null,
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation when name is empty', async () => {
      const dto = plainToClass(CreateProductDto, {
        name: '',
        description: 'Descripción',
        slug: 'test',
        price: 1000,
        stock: 10,
        categoryId: 1,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });

    it('should fail validation when price is negative', async () => {
      const dto = plainToClass(CreateProductDto, {
        name: 'Producto',
        description: 'Descripción',
        slug: 'producto',
        price: -100,
        stock: 10,
        categoryId: 1,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      const priceError = errors.find((e) => e.property === 'price');
      expect(priceError).toBeDefined();
    });

    it('should fail validation when price is zero', async () => {
      const dto = plainToClass(CreateProductDto, {
        name: 'Producto',
        description: 'Descripción',
        slug: 'producto',
        price: 0,
        stock: 10,
        categoryId: 1,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      const priceError = errors.find((e) => e.property === 'price');
      expect(priceError).toBeDefined();
    });

    it('should fail validation when stock is negative', async () => {
      const dto = plainToClass(CreateProductDto, {
        name: 'Producto',
        description: 'Descripción',
        slug: 'producto',
        price: 1000,
        stock: -5,
        categoryId: 1,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      const stockError = errors.find((e) => e.property === 'stock');
      expect(stockError).toBeDefined();
    });

    it('should fail validation when categoryId is not a positive integer', async () => {
      const dto = plainToClass(CreateProductDto, {
        name: 'Producto',
        description: 'Descripción',
        slug: 'producto',
        price: 1000,
        stock: 10,
        categoryId: 0,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      const categoryError = errors.find((e) => e.property === 'categoryId');
      expect(categoryError).toBeDefined();
    });

    it('should pass validation with optional fields omitted', async () => {
      const dto = plainToClass(CreateProductDto, {
        name: 'Producto',
        description: 'Descripción',
        slug: 'producto',
        price: 1000,
        stock: 10,
        categoryId: 1,
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation when discountPercent is greater than 100', async () => {
      const dto = plainToClass(CreateProductDto, {
        name: 'Producto',
        description: 'Descripción',
        slug: 'producto',
        price: 1000,
        stock: 10,
        categoryId: 1,
        discountPercent: 150,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      const discountError = errors.find(
        (e) => e.property === 'discountPercent',
      );
      expect(discountError).toBeDefined();
    });

    it('should fail validation when discountPercent is negative', async () => {
      const dto = plainToClass(CreateProductDto, {
        name: 'Producto',
        description: 'Descripción',
        slug: 'producto',
        price: 1000,
        stock: 10,
        categoryId: 1,
        discountPercent: -10,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      const discountError = errors.find(
        (e) => e.property === 'discountPercent',
      );
      expect(discountError).toBeDefined();
    });

    it('should pass validation with valid discountPercent', async () => {
      const dto = plainToClass(CreateProductDto, {
        name: 'Producto',
        description: 'Descripción',
        slug: 'producto',
        price: 1000,
        stock: 10,
        categoryId: 1,
        discountPercent: 25,
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation when price has more than 2 decimal places', async () => {
      const dto = plainToClass(CreateProductDto, {
        name: 'Producto',
        description: 'Descripción',
        slug: 'producto',
        price: 1000.999,
        stock: 10,
        categoryId: 1,
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      const priceError = errors.find((e) => e.property === 'price');
      expect(priceError).toBeDefined();
    });
  });
});
