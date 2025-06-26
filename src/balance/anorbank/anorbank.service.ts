import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnorBalanceEntity } from './entities/balance.entity';
import { generateUniqueId } from 'src/utils/unique-id';

@Injectable()
export class AnorbankBalanceService {
  constructor(
    @InjectRepository(AnorBalanceEntity, 'main')
    private readonly balanceRepo: Repository<AnorBalanceEntity>,
    @Inject('ANOR_API_CLIENT') private readonly apiClient: any,
  ) {}

  async getDavrBalance() {
    return this.balanceRepo.find();
  }

  async updateAnorBalance() {
    try {
      const uniqueNumDoc = generateUniqueId();
      const data = {
        id: uniqueNumDoc,
        jsonrpc: '2.0',
        method: 'account.balance',
        params: {
          number: '20208000105474855002',
          mfo: '01183',
        },
      };
      const response = await this.apiClient.post('/services', data);
      const result = response.data?.result?.account;
      if (!result) throw new Error('Bankdan balance topilmadi');

      const entity = this.balanceRepo.create({
        account: result.number,
        name: result.acct_name,
        bank: 'ANORBANK',
        mfo: result.mfo,
        balance: result.balance,
      });

      return await this.balanceRepo.save(entity);
    } catch (error) {
      console.error('Failed to fetch or save balance:', error.message);
      throw new Error('Failed to fetch or save balance');
    }
  }
}
