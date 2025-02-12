import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateDavrPayloadDto } from './dto/payload';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
  async createDavrByAppId(@Param('id') id: number,@Req() req: Request) {
    return this.billingReportService.sendDavrTransactionByAppId(id,req);
  }

  @ApiOperation({ summary: 'Ruchnoy tranzaktsiya yaratish' })
  @Post('davr/send')
  async davrSendTransaction(@Body() data: CreateDavrPayloadDto,@Req() req: Request) {
    return this.billingReportService.sendDavrTransaction(data,req);
  }
}
