import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DavrPaymentsEntity } from './entities/payments.entity';
import { DavrPaymentsDto, FetchDavrPaymentDto } from './dto/payments.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class DavrbankPaymentService {
  constructor(
    @InjectRepository(DavrPaymentsEntity, 'main')
    private readonly paymentRepo: Repository<DavrPaymentsEntity>,
    @Inject('API_CLIENT') private readonly apiClient: any,
  ) {}

  async getDavrStatus(id: number) {
    const response = await this.apiClient.get(
      `/api/v1.0/allgood/allstate/${id}`,
    );
    console.log(response.data, 'dt');

    return response.data;
  }

  async fetchDavrPayment(data: FetchDavrPaymentDto) {
    try {
      console.log(data,"dt");
      
      const response = await this.apiClient.post(
        '/api/v1.0/allgood/alldoclist',
        data,
      );
      console.log(response,"res vpis");
      

      const { status, result } = response.data;

      if (status !== 0 || !Array.isArray(result)) {
        throw new Error('Invalid response format from API');
      }

      const formattedResult = result.map((item) => ({
        date1: data.date1,
        date2: data.date2,
        paymentId: item.id,
        docBank: item.docbank,
        inOut: item.inout,
        branch: item.branch,
        docNum: item.docNum,
        dDate: item.dDate,
        bankCl: item.bankCl,
        accCl: item.accCl,
        nameCl: item.nameCl,
        innCl: item.innCl,
        bankCo: item.bankCo,
        accCo: item.accCo,
        nameCo: item.nameCo,
        innCo: item.innCo,
        purposeCode: item.purposeCode,
        purpose: item.purpose,
        summa: item.summa,
        currency: item.currency,
        typeDoc: item.typeDoc,
        vDate: item.vDate,
        pdc: item.pdc,
        state: item.state,
        sDealId: item.sDealId,
        cashCode: item.cashCode,
        parentGroupId: item.parentGroupId,
        parentId: item.parentId,
        childId: item.childId,
        fileName: item.fileName,
        kodErr: item.kodErr,
        errGeneral: item.errGeneral,
        empId: item.empId,
        idTransh: item.idTransh,
        idTranshPurp: item.idTranshPurp,
        valDate: item.valDate,
        sign: item.sign,
        generalId: item.generalId,
        errorMessage: item.errorMessage,
        parentIdType: item.parentIdType,
        budgetAccount: item.budgetAccount,
        budgetInn: item.budgetInn,
        budgetName: item.budgetName,
        stateDesc: item.stateDesc,
        edit: item.edit,
        copy: item.copy,
        template: item.template,
        dt1: item.dt1,
        bank: item.bank || 'DAVRBANK',
      }));

      const payments = plainToInstance(DavrPaymentsDto, formattedResult);

      for (const payment of payments) {
        const errors = await validate(payment);
        if (errors.length > 0) {
          console.error('Validatsiya xatolari:', errors);
          throw new Error('DTO validatsiyadan o‘ta olmadi');
        }
      }

      const entities = formattedResult.map((dtoItem) => {
        const entity = new DavrPaymentsEntity();
        Object.assign(entity, dtoItem);
        return entity;
      });

      return await this.paymentRepo.save(entities);
    } catch (error) {
      throw new Error(`Error fetching or saving extracts: ${error.message}`);
    }
  }
}
