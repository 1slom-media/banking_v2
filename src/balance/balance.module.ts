import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { DavrbankModule } from './davrbank/davrbank.module';
import { DavrbankBalanceService } from './davrbank/davrbank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DavrBalanceEntity } from './davrbank/entities/balance.entity';

@Module({
  controllers: [BalanceController],
  providers: [BalanceService, DavrbankBalanceService],
  imports: [
    TypeOrmModule.forFeature([DavrBalanceEntity], 'main'),
    DavrbankModule,
  ],
})
export class BalanceModule {}
