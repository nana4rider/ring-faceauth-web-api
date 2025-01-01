import { Module } from '@nestjs/common';
import { HealthController } from '../controller/health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
