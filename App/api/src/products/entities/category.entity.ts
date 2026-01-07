import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Product } from './product.entity';
import { slugify } from '../../utils/slugify';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  /**
   * Hook que se ejecuta antes de insertar una nueva categoría
   * Genera automáticamente el slug a partir del nombre
   */
  @BeforeInsert()
  generateSlugOnInsert() {
    if (this.name && !this.slug) {
      this.slug = slugify(this.name);
    }
  }

  /**
   * Hook que se ejecuta antes de actualizar una categoría
   * Regenera el slug si el nombre cambió
   */
  @BeforeUpdate()
  generateSlugOnUpdate() {
    if (this.name) {
      this.slug = slugify(this.name);
    }
  }
}
