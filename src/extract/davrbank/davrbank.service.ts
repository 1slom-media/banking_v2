import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DavrExtractEntity } from './entities/extract.entity';
import { plainToInstance } from 'class-transformer';
import { DavrExtractDto, FetchDavrExtractDto } from './dto/extract.dto';
import { validate } from 'class-validator';

@Injectable()
export class DavrbankExtractService {
  constructor(
    @InjectRepository(DavrExtractEntity, 'main')
    private readonly extractRepo: Repository<DavrExtractEntity>,
    @Inject('API_CLIENT') private readonly apiClient: any,
  ) {}

  async fetchExtract(data: FetchDavrExtractDto) {
    try {
      const response = await this.apiClient.post(
        '/api/v1.0/allgood/allvp',
        data,
      );

      const { status, result } = response.data;

      if (status !== 0 || !Array.isArray(result)) {
        throw new Error('Invalid response format from API');
      }

      const formattedResult = result.map((item) => ({
        extractId: item.id,
        vDate: item.vDate,
        begin_dat: data.begin_dat,
        end_dat: data.end_dat,
        account: item.account,
        bank: item.bank || 'DAVRBANK',
        accountName: item.accountname,
        docNumber: item.docnumber,
        typeDoc: item.typedoc,
        branch: item.branch,
        debet: item.debet || 0,
        credit: item.credit || 0,
        purpose: item.purpose,
        cashSmb: item.cashsmb || null,
      }));

      const extracts = plainToInstance(DavrExtractDto, formattedResult);

      for (const extract of extracts) {
        const errors = await validate(extract);
        if (errors.length > 0) {
          console.error('Validatsiya xatolari:', errors);
          throw new Error('DTO validatsiyadan o‘ta olmadi');
        }
      }

      const entities = formattedResult.map((dtoItem) => {
        const entity = new DavrExtractEntity();
        Object.assign(entity, dtoItem);
        return entity;
      });

      return await this.extractRepo.save(entities);
    } catch (error) {
      throw new Error(`Error fetching or saving extracts: ${error.message}`);
    }
  }
}
