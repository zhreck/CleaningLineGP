import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'varchar', name: 'image_url', nullable: true })
  imageUrl: string;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL', // O 'CASCADE' si prefieres eliminar productos al borrar categoría
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

    // --- NUEVOS CAMPOS PARA OFERTAS / CARRUSEL ---
  @Column({ type: 'boolean', name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ type: 'boolean', name: 'is_on_sale', default: false })
  isOnSale: boolean;

  @Column({ type: 'int', name: 'discount_percent', nullable: true })
  discountPercent: number | null;

  // Relación con categoría
  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;
}