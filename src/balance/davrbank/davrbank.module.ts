import { Module } from '@nestjs/common';
import { DavrbankBalanceService } from './davrbank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DavrBalanceEntity } from './entities/balance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DavrBalanceEntity],'main')
  ],
  providers: [DavrbankBalanceService],
  exports:[DavrbankBalanceService],
  controllers: []
})
export class DavrbankModule {}
