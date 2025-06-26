import { Module } from '@nestjs/common';
import { ExtractController } from './extract.controller';
import { ExtractService } from './extract.service';
import { DavrbankModule } from './davrbank/davrbank.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DavrExtractEntity } from './davrbank/entities/extract.entity';
import { DavrbankExtractService } from './davrbank/davrbank.service';
import { AnorbankModule } from './anorbank/anorbank.module';

@Module({
  controllers: [ExtractController],
  providers: [ExtractService,DavrbankExtractService],
  imports: [
    TypeOrmModule.forFeature([DavrExtractEntity], 'main'),
    DavrbankModule,
    AnorbankModule,
  ],
})
export class ExtractModule {}
