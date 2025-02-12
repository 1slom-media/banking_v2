import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ExtractService } from './extract.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FetchDavrExtractDto } from './davrbank/dto/extract.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Выписка')
@Controller('extract')
export class ExtractController {
  constructor(private extractService: ExtractService) {}

  @ApiOperation({ summary: 'Выписка по счету ALLGOOD' })
  @Post('davr')
  async fetchTransactions(@Body() requestData: FetchDavrExtractDto) {
    return await this.extractService.postExtractDavr(requestData);
  }
}
