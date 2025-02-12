import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { FetchDavrPaymentDto } from './davrbank/dto/payments.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Список платежей')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @ApiOperation({ summary: 'Статус платеж ЭПЦ ALLGOOD' })
  @Get('davr/status/:id')
  async getOne(@Param('id') id: string) {
    return await this.paymentService.getDavrStatusById(parseInt(id));
  }

  @ApiOperation({summary:"Список платежей клиента ALLGOOD"})
  @Post('davr')
  async davrPayments(@Body() requestData: FetchDavrPaymentDto) {
    return await this.paymentService.getDavrPayments(requestData);
  }
}
