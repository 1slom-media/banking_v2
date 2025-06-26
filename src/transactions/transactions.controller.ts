import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import {
  AccountTransferAnorDto,
  CreateDavrPayloadDto,
  GetCashQueryDto,
} from './dto/payload';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly billingReportService: TransactionsService) {}

  @ApiOperation({ summary: 'Sistamadan otgan barcha operatsiyalar' })
  @Get('billing')
  async getCash(@Query() query: GetCashQueryDto) {
    return this.billingReportService.getCash(query);
  }
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
  @ApiQuery({ name: 'provider', type: String })
  @Get('status/:id')
  async findAndUpdateDavr(@Param('id') id: number, @Query('provider') provider: string) {
    return this.billingReportService.findAndUpdateStatus(id, provider);
  }

  @ApiOperation({
    summary: "Application id bo`yicha tranzaktsiya o'tkazish DAVRBANK",
  })
  @Get('davr/create/:id')
  async createDavrByAppId(@Param('id') id: number, @Req() req: Request) {
    return this.billingReportService.sendDavrTransactionByAppId(id, req);
  }

  @ApiOperation({
    summary: "Application id bo`yicha tranzaktsiya o'tkazish ANORBANK",
  })
  @Get('anor/create/:id')
  async createAnorByAppId(@Param('id') id: number, @Req() req: Request) {
    return this.billingReportService.sendAnorTransactionByAppId(id, req);
  }

  @ApiOperation({ summary: 'Ruchnoy tranzaktsiya yaratish' })
  @Post('davr/send')
  async davrSendTransaction(
    @Body() data: CreateDavrPayloadDto,
    @Req() req: Request,
  ) {
    return this.billingReportService.sendDavrTransaction(data, req);
  }

  @ApiOperation({ summary: 'Ruchnoy tranzaktsiya yaratish' })
  @Post('anor/send')
  async anorSendTransaction(
    @Body() data: AccountTransferAnorDto,
    @Req() req: Request,
  ) {
    return this.billingReportService.sendAnorTransaction(data, req);
  }
}
