import { Controller, Get, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  @Get()
  findAll() {
    return this.categoryRepo.find();
  }

  @Post()
  create(@Body() data: { name: string }) {
    const category = this.categoryRepo.create(data);
    return this.categoryRepo.save(category);
  }
}
