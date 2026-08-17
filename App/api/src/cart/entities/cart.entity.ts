import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';
import { User } from '../../auth/entities/user.entity'; // Asumiendo la ruta del User

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // orphanedRowAction: 'delete' asegura que al quitar un item del array y
  // guardar el carrito, TypeORM borre la fila en vez de solo poner cart_id
  // en NULL (comportamiento por defecto), lo que dejaba filas huérfanas.
  @OneToMany(() => CartItem, (item) => item.cart, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  items: CartItem[];

  // Relación con el usuario
  @ManyToOne(() => User, (user) => user.carts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // Esto especifica que la columna en la BD se llamará 'user_id'
  user: User;
}
