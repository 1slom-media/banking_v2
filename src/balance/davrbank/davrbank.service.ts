import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DavrBalanceEntity } from './entities/balance.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { DavrBalanceDto } from './dto/balance.dto';
import { validate } from 'class-validator';

@Injectable()
export class DavrbankBalanceService {
  constructor(
    @InjectRepository(DavrBalanceEntity, 'main')
    private readonly balanceRepo: Repository<DavrBalanceEntity>,
    @Inject('API_CLIENT') private readonly apiClient: any,
  ) {}

  async getDavrBalance() {
    return this.balanceRepo.find();
  }

  async updateDavrBalance() {
    try {
      // const response = await this.apiClient.get(
      //   '/api/v1.0/allgood/allaccounts/00981/05474855',
      // );
      const response = await this.apiClient.get(
        '/api/v1.0/allgood/allaccounts/00981/04316044',
      );

      const { status, result } = response.data;

      if (status !== 0 || !Array.isArray(result)) {
        throw new Error('Invalid response format from API');
      }

      // `id`ni `account`ga moslashtirish
      const formattedResult = result.map((item) => ({
        account: item.id,
        name: item.name,
        balance: item.balance,
        bank: 'DAVRBANK',
      }));

      // DTOga aylantirish
      const balances = plainToInstance(DavrBalanceDto, formattedResult);
      for (const balance of balances) {
        const errors = await validate(balance);
        if (errors.length > 0) {
          console.error('Validatsiya xatolari:', errors);
          throw new Error('DTO validatsiyadan o‘ta olmadi');
        }
      }

      // Entitylarni yaratish va saqlash
      const entities = formattedResult.map((dtoItem) => {
        const entity = new DavrBalanceEntity();
        Object.assign(entity, dtoItem);
        return entity;
      });

      return await this.balanceRepo.save(entities);
    } catch (error) {
      console.error('Failed to fetch or save balance:', error.message);
      throw new Error('Failed to fetch or save balance');
    }
  }
}
