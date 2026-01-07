import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from './dto/pagination.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Create a new product. Admin authentication required.',
  })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Product successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description: 'Retrieve all products without pagination. Use /paginated endpoint for better performance with large datasets.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all products',
  })
  findAll() {
    return this.productsService.findAll();
  }

  @Get('paginated')
  @ApiOperation({
    summary: 'Get paginated products',
    description: 'Retrieve products with server-side pagination and optional filtering by search term and category. Supports efficient loading of large product catalogs.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-based)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (max: 100)',
    example: 20,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term to filter products by name (case-insensitive)',
    example: 'laptop',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: Number,
    description: 'Filter products by category ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved paginated products',
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Gaming Laptop Pro' },
              slug: { type: 'string', example: 'gaming-laptop-pro' },
              description: { type: 'string', example: 'High-performance gaming laptop' },
              price: { type: 'number', example: 1299.99 },
              stock: { type: 'number', example: 15 },
              imageUrl: { type: 'string', example: 'https://example.com/image.jpg' },
              isFeatured: { type: 'boolean', example: true },
              isOnSale: { type: 'boolean', example: false },
              discountPercent: { type: 'number', nullable: true, example: null },
              category: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  name: { type: 'string', example: 'Laptops' },
                  slug: { type: 'string', example: 'laptops' },
                },
              },
            },
          },
        },
        total: { type: 'number', example: 150, description: 'Total number of products matching filters' },
        page: { type: 'number', example: 1, description: 'Current page number' },
        lastPage: { type: 'number', example: 8, description: 'Last page number' },
        hasMore: { type: 'boolean', example: true, description: 'Whether more pages are available' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid query parameters',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['page must not be less than 1', 'limit must not be greater than 100'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAllPaginated(@Query() paginationDto: PaginationDto) {
    const { page = 1, limit = 20, search, categoryId } = paginationDto;

    const filters = {
      ...(search && { search }),
      ...(categoryId && { categoryId }),
    };

    return this.productsService.findAllPaginated(page, limit, filters);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieve a single product by its ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Product ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved product',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update product',
    description: 'Update an existing product. Admin authentication required.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Product ID',
    example: 1,
  })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product successfully updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete product',
    description: 'Delete a product by ID. Admin authentication required.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Product ID',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Product successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
