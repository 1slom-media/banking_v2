import { Injectable } from '@nestjs/common';
import { DavrbankBalanceService } from './davrbank/davrbank.service';

@Injectable()
export class BalanceService {
  constructor(private readonly davrbankService: DavrbankBalanceService) {}

  async updateBalance(bank: string) {
    if (bank === 'DAVRBANK') {
      console.log('davr');
      return this.davrbankService.updateDavrBalance();
    } else if (bank === 'ANORBANK') {
      return 'Anorbank';
    }
  }

  async getBalance(bank: string) {
    if (bank === 'DAVRBANK') {
      console.log('davr');
      return this.davrbankService.getDavrBalance();
    } else if (bank === 'ANORBANK') {
      return 'Anorbank';
    }
  }
}
