import { AnorHistoryDto, TransactionType } from './dto/anor-history.dto';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AnorbankExtractService {
  constructor(
    @Inject('ANOR_API_CLIENT')
    private readonly apiClient: any,
  ) {}

  async anorHistory(dto: AnorHistoryDto) {
    try {
      const { from, to, type } = dto;

      const data = {
        id: Date.now().toString(),
        jsonrpc: '2.0',
        method: 'account.history',
        params: {
          account: {
            number: '20208000105474855002',
            mfo: '01183',
          },
          filter: {
            from: from.getTime(), // sana -> timestamp
            to: to.getTime(), // sana -> timestamp
            type: type,
          },
        },
      };
      const response = await this.apiClient.post('/services', data);
      return response.data?.result;
    } catch (error) {
      console.error('Failed to fetch history:', error.message);
      throw new Error('Failed to fetch transaction history');
    }
  }
}
