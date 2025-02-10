import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankingTransactionEntity } from './entities/transaction.entity';
import { AllgoodPropService } from 'src/allgood-prop/allgood-prop.service';
import { AllgoodPropEntity } from 'src/allgood-prop/entities/allgood-prop';
import { DavrPayloadEntity } from './entities/payload.entity';
import { CashLogEntity } from './entities/cashtx';

@Module({
  imports: [
    TypeOrmModule.forFeature([], 'secondary'),
    TypeOrmModule.forFeature([BankingTransactionEntity,AllgoodPropEntity,DavrPayloadEntity,CashLogEntity], 'main')
  ],
  providers: [TransactionsService,AllgoodPropService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
