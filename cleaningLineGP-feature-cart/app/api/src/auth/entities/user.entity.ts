import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../models/roles.model';

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

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (!this.password) return;
    this.password = bcrypt.hashSync(this.password, 10);
  }
}