import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
