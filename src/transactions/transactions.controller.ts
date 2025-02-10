import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateDavrPayloadDto } from './dto/payload';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly billingReportService: TransactionsService) {}

  @ApiOperation({ summary: 'Bir kun oldingi reportsdan clon olish' })
  @Get('get')
  async getReports() {
    try {
      const data = this.billingReportService.getReports();
      return data;
    } catch (error) {
      console.log(error, 'err');
    }
  }

  @ApiOperation({ summary: 'Barcha transactionlarni olish' })
  @Get('find')
  async findAll() {
    return this.billingReportService.find();
  }

  @ApiOperation({ summary: 'Tranzaktsiya holatini ko`rish va update qilish' })
  @ApiQuery({ name: 'type', type: String })
  @Get('davr/:id')
  async findAndUpdateDavr(@Param('id') id: number, @Query() type: string) {
    return this.billingReportService.findAndUpdateDavrStatus(id, type);
  }

  @ApiOperation({ summary: "Application id bo`yicha tranzaktsiya o'tkazish" })
  @Get('davr/create/:id')
  async createDavrByAppId(@Param('id') id: number) {
    return this.billingReportService.sendDavrTransactionByAppId(id);
  }

  @ApiOperation({ summary: 'Ruchnoy tranzaktsiya yaratish' })
  @Post('davr/send')
  async davrSendTransaction(@Body() data: CreateDavrPayloadDto) {
    return this.billingReportService.sendDavrTransaction(data);
  }
}
