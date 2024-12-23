import { Module } from '@nestjs/common';
import { DavrbankExtractService } from './davrbank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DavrExtractEntity } from './entities/extract.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DavrExtractEntity], 'main')],
  providers: [DavrbankExtractService],
  exports: [DavrbankExtractService],
})
export class DavrbankModule {}
