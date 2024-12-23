import { Module } from '@nestjs/common';
import { DavrbankPaymentService } from './davrbank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DavrPaymentsEntity } from './entities/payments.entity';

@Module({
  imports:[TypeOrmModule.forFeature([DavrPaymentsEntity],'main')],
  providers: [DavrbankPaymentService],
  exports:[DavrbankPaymentService]
})
export class DavrbankModule {}
