import { Body, Controller, Post } from '@nestjs/common';
import { ExtractService } from './extract.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FetchDavrExtractDto } from './davrbank/dto/extract.dto';

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
