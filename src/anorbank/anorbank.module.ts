import { Module } from '@nestjs/common';
import { AnorbankService } from './anorbank.service';
import { AnorbankController } from './anorbank.controller';

@Module({
  providers: [AnorbankService],
  controllers: [AnorbankController]
})
export class AnorbankModule {}
