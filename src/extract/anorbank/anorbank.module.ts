import { Module } from '@nestjs/common';
import { AnorbankExtractService } from './anorbank.service';

@Module({
  providers: [AnorbankExtractService],
  exports: [AnorbankExtractService],
})
export class AnorbankModule {}
