import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { DavrbankModule } from './davrbank/davrbank.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DavrPaymentsEntity } from './davrbank/entities/payments.entity';

@Module({
  providers: [PaymentsService],
  controllers: [PaymentsController],
  imports: [
    TypeOrmModule.forFeature([DavrPaymentsEntity], 'main'),
    DavrbankModule,
  ],
})
export class PaymentsModule {}
