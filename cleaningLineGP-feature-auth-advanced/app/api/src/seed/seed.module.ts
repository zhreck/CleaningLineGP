import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [AuthModule, ProductsModule], // Importamos los módulos que tienen las entidades que queremos sembrar
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}