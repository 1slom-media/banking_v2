import { Injectable } from '@nestjs/common';
import { DavrbankExtractService } from './davrbank/davrbank.service';
import { FetchDavrExtractDto } from './davrbank/dto/extract.dto';

@Injectable()
export class ExtractService {
    constructor(private readonly davrbankService: DavrbankExtractService) {}

    async postExtractDavr(data:FetchDavrExtractDto){
        return this.davrbankService.fetchExtract(data)
    }
}
