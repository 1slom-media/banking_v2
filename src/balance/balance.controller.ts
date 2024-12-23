import { Controller, Get, Query } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Balance')
@Controller('balance')
export class BalanceController {
  constructor(public balanceService: BalanceService) {}

  @ApiOperation({ summary: 'Balanslar listi' })
  @Get()
  async findBalance(@Query('bank') bank: string) {
    return this.balanceService.getBalance(bank);
  }

  @ApiOperation({ summary: 'Hozirgi paytdagi balansni olish' })
  @Get('new')
  async updateBalance(@Query('bank') bank: string) {
    return this.balanceService.updateBalance(bank);
  }
}
