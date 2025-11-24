import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../models/roles.model';
import { Order } from '../../orders/entities/order.entity'; // <-- 1. Importar la entidad Order
import { Cart } from '../../cart/entities/cart.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false }) // `select: false` para no devolverla por defecto
  password: string;

  @Column({
    type: 'simple-array',
    default: [Role.USER],
  })
  roles: Role[];

  @OneToMany(() => Order, (order) => order.user) // <-- 2. Añadir esta relación
    orders: Order[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (!this.password) return;
    this.password = bcrypt.hashSync(this.password, 10);
  }
}