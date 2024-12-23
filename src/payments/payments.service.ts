import { Injectable } from '@nestjs/common';
import { DavrbankPaymentService } from './davrbank/davrbank.service';
import { FetchDavrPaymentDto } from './davrbank/dto/payments.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly davrbankService: DavrbankPaymentService) {}

  //   davrbank orqali o`tgan platyoj xolatini ko`rish
  async getDavrStatusById(id: number) {
    return this.davrbankService.getDavrStatus(id);
  }
  // date bo`yicha so`rov yuborib olish
  async getDavrPayments(data: FetchDavrPaymentDto) {
    return this.davrbankService.fetchDavrPayment(data);
  }
}
