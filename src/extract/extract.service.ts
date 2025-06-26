import { Injectable } from '@nestjs/common';
import { DavrbankExtractService } from './davrbank/davrbank.service';
import { FetchDavrExtractDto } from './davrbank/dto/extract.dto';
import { AnorbankExtractService } from './anorbank/anorbank.service';
import { AnorHistoryDto } from './anorbank/dto/anor-history.dto';

@Injectable()
export class ExtractService {
  constructor(
    private readonly davrbankService: DavrbankExtractService,
    private readonly anorbankService: AnorbankExtractService,
  ) {}

  async postExtractDavr(data: FetchDavrExtractDto) {
    return this.davrbankService.fetchExtract(data);
  }

  async postExtractAnor(data: AnorHistoryDto) {
    return this.anorbankService.anorHistory(data);
  }
}
