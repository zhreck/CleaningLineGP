import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  /**
   * Ejecutar seed completo
   * GET /seed/run
   */
  @Get('run')
  async runSeed() {
    return this.seedService.runSeed();
  }
}
