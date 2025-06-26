import { Module } from '@nestjs/common';
import { AnorbankBalanceService} from './anorbank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnorBalanceEntity } from './entities/balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnorBalanceEntity], 'main')],
  providers: [AnorbankBalanceService],
  exports: [AnorbankBalanceService],
})
export class AnorbankModule {}
