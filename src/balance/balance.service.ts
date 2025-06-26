import { Injectable } from '@nestjs/common';
import { DavrbankBalanceService } from './davrbank/davrbank.service';
import { AnorbankBalanceService } from './anorbank/anorbank.service';

@Injectable()
export class BalanceService {
  constructor(
    private readonly davrbankService: DavrbankBalanceService,
    private readonly anorbankService: AnorbankBalanceService,
  ) {}

  async updateBalance(bank: string) {
    if (bank === 'DAVRBANK') {
      console.log('davr');
      return this.davrbankService.updateDavrBalance();
    } else if (bank === 'ANORBANK') {
      return this.anorbankService.updateAnorBalance();
    }
  }

  async getBalance(bank: string) {
    if (bank === 'DAVRBANK') {
      console.log('davr');
      return this.davrbankService.getDavrBalance();
    } else if (bank === 'ANORBANK') {
      return this.anorbankService.getDavrBalance();
    }
  }
}
