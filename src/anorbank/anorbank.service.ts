import { BadRequestException, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AnorbankService {
  constructor(@Inject('ANOR_API_CLIENT') private readonly apiClient: any) {}

  async sendPayment(payload: any): Promise<any> {
  try {
    const response = await this.apiClient.post('/payment', payload);
    return response.data;
  } catch (error) {
    console.error('Payment error:', error.response?.data || error.message);
    throw new BadRequestException(error.response?.data || 'Server error');
  }
}

}
