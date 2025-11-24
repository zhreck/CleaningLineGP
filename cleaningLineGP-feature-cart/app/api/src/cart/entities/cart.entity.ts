import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  //   ManyToOne,
  //   JoinColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';
// import { User } from '../../auth/entities/user.entity'; // Asumiendo la ruta del User

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' }) // Asociaremos por ID de usuario
  userId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
  items: CartItem[];

  //   @ManyToOne(() => User)
  //   @JoinColumn({ name: 'user_id' })
  //   user: User;
}

