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
}