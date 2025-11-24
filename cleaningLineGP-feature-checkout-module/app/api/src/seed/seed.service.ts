import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/models/roles.model';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    const userCount = await this.userRepository.count();

    if (userCount > 0) {
      this.logger.log('Database is already seeded. Skipping...');
      return;
    }

    this.logger.log('Seeding database with initial users...');

    const admin = this.userRepository.create({
      email: 'admin@example.com',
      password: 'password123', // La entidad se encarga de hashear esto
      roles: [Role.ADMIN, Role.USER],
    });

    const user = this.userRepository.create({
      email: 'user@example.com',
      password: 'password123',
      roles: [Role.USER],
    });

    await this.userRepository.save([admin, user]);
    this.logger.log('Seeding complete!');
  }
}