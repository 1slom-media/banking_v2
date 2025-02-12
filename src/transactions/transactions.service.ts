import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BankingTransactionEntity } from './entities/transaction.entity';
import { plainToInstance } from 'class-transformer';
import { BankingTransactionDto } from './dto/transaction.dto';
import { validate } from 'class-validator';
import { AllgoodPropService } from 'src/allgood-prop/allgood-prop.service';
import { Cron } from '@nestjs/schedule';
import { CreateDavrPayloadDto } from './dto/payload';
import { DavrPayloadEntity } from './entities/payload.entity';
import { generateUniqueId } from '../utils/unique-id';
import { CashLogEntity } from './entities/cashtx';
import { Request } from 'express';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectDataSource('secondary')
    private readonly secondaryDataSource: DataSource,
    @Inject('API_CLIENT') private readonly apiClient: any,
    @InjectRepository(BankingTransactionEntity, 'main')
    private readonly bankingRepository: Repository<BankingTransactionEntity>,
    @InjectRepository(DavrPayloadEntity, 'main')
    private readonly davrPayloadRepository: Repository<DavrPayloadEntity>,
    @InjectRepository(CashLogEntity, 'main')
    private readonly cashLog: Repository<CashLogEntity>,
    private readonly allgoodPropRepository: AllgoodPropService,
  ) {}

  // getAll
  async find() {
    return this.bankingRepository.find();
  }

  // get reports one day ago:: bir kun oldingi billinglarni olish
  async getReports(): Promise<any> {
    const reportsRepo =
      this.secondaryDataSource.getRepository('billing_reports');

    const query = `
  SELECT 
      br.*,
      COALESCE(m.mfo, m2.mfo) AS mfo,
      COALESCE(m.bank_account, m2.bank_account) AS bank_account,
      COALESCE(m.contract_no, m2.contract_no) AS contract_no,
      COALESCE(m.address, m2.address) AS address,
      COALESCE(m.name, m2.name) AS merchant_name,
      COALESCE(m.inn, m2.inn) AS merchant_inn,
      b.name AS branch_name
  FROM billing_reports br
  LEFT JOIN merchant m 
      ON m.id = br.merchant_id AND br.merchant_id > 0
  LEFT JOIN branchs b 
      ON b.id = br.branch_id AND (br.merchant_id IS NULL OR br.merchant_id = 0)
  LEFT JOIN merchant m2
      ON m2.id = b."merchantId"
  WHERE 
      DATE(br.created_at) = CURRENT_DATE - INTERVAL '1 day'
      AND br.status IN ('BillingSuccess', 'money_transferred');
      `;
    const reports: any[] = await reportsRepo.query(query);

    const formattedResult = reports.map((item) => ({
      backend_application_id: item.backend_application_id,
      merchant_id: item.merchant_id,
      branch_id: item.branch_id,
      name: item.name,
      merchant: item.merchant,
      bank: item.bank,
      period: item.period,
      created_billing: item.created_at,
      updated_billing: item.updated_at,
      status: item.status,
      price: item.price,
      total: item.total,
      bank_sum: item.bank_sum,
      allgood_sum: item.allgood_sum,
      log: item.log,
      bank_markup: item.bank_markup,
      branch: item.branch,
      fixal_check: item.fixal_check,
      category_type: item.category_type,
      mfo: item.mfo,
      bank_account: item.bank_account,
      contract_no: item.contract_no,
      address: item.address,
      merchant_name: item.merchant_name,
      branch_name: item.branch_name,
      merchant_inn: item.merchant_inn,
    }));

    const transactions = plainToInstance(
      BankingTransactionDto,
      formattedResult,
    );

    for (const transaction of transactions) {
      const errors = await validate(transaction);
      if (errors.length > 0) {
        console.error('Validatsiya xatolari:', errors);
        throw new Error('DTO validatsiyadan o‘ta olmadi');
      }
    }

    const entities: BankingTransactionEntity[] = [];
    for (const dtoItem of formattedResult) {
      const existingTransaction = await this.bankingRepository.findOne({
        where: { backend_application_id: dtoItem.backend_application_id },
      });

      if (!existingTransaction) {
        const entity = new BankingTransactionEntity();
        Object.assign(entity, dtoItem);
        entities.push(entity);
      }
    }
    if (entities.length > 0) {
      return await this.bankingRepository.save(entities);
    }

    return [];
  }

  // davrbank transaction metod ==>> ruchnoy pravodka
  async sendDavrTransaction(data: CreateDavrPayloadDto, req: Request) {
    const findLog = await this.cashLog.findOneBy({
      application_id: Number(data.vnum_doc),
    });
    if (findLog && findLog.status !== 'failed') {
      return {
        success: false,
        message: 'Ush tranzaksiya allaqachon mavjud',
      };
    }
    const payload = {
      vbranch: data.vbranch,
      vaccount: data.vaccount,
      vname_cl: data.vname_cl,
      vinn_cl: data.vinn_cl,
      vmfo_cr: data.vmfo_cr,
      vaccount_cr: data.vaccount_cr,
      vname_cr: data.vname_cr,
      vinn_cr: data.vinn_cr,
      vsumma: data.vsumma,
      vnaz_pla: data.vnaz_pla,
      vnum_doc: data.vnum_doc,
      vcode_naz_pla: data.vcode_naz_pla,
      vbudget_account: data.vbudget_account,
      vbudget_inn: data.vbudget_inn,
      vbudget_name: data.vbudget_name,
      vusername: data.vusername || 'allgood',
      vparentid: data.vparentid || 2905,
    };
    const log = {
      application_id: Number(data.vnum_doc),
      amount: data.vsumma,
      numm_doc: Number(data.vnum_doc),
      request: payload,
      who: req.user.name,
    };
    await this.cashLog.save(log);
    try {
      const response = await this.apiClient.post(
        '/api/v1.0/allgood/allepc',
        payload,
      );
      const { result } = response.data;
      await this.cashLog.update(
        { application_id: Number(data.vnum_doc) },
        {
          response: response.data,
          status: 'waiting',
          vid_id: result.vidk,
          updatedAt: new Date(),
        },
      );
      const entityData = {
        ...data,
        response: response.data,
        vid: result.vidk,
        who: req.user.name,
      };
      const davrPay = this.davrPayloadRepository.create(entityData);
      return await this.davrPayloadRepository.save(davrPay);
    } catch (error) {
      if (error.response) {
        await this.cashLog.update(
          { application_id: Number(data.vnum_doc) },
          {
            response: error.response?.data || error.message || error.stack,
            status: 'failed',
            updatedAt: new Date(),
          },
        );
        // Formatlash va BadRequestException chiqarish
        const formattedError = {
          status: error.response?.status || 400,
          message: error.response?.data?.detail || 'Unknown error occurred',
          instance:
            error.response?.data?.instance || '/api/v1.0/allgood/allepc',
          success: false,
        };
        throw new BadRequestException(formattedError);
      }

      // Xatolik boshqa sabab bilan kelgan
      const formattedError = {
        status: 500,
        message: error.message || 'An unexpected error occurred',
        instance: '/api/v1.0/allgood/allepc',
        success: false,
      };
      throw new BadRequestException(formattedError);
    }
  }

  // get davr by id status and update
  async findAndUpdateDavrStatus(id: number, type: string) {
    const response = await this.apiClient.get(
      `/api/v1.0/allgood/allstate/${id}`,
    );
    console.log(type, 'ty');
    const { pid, name } = response.data.result;
    if ((type = 'vid')) {
      // 1. davrPayloadRepository da qidiring
      const davrRecord = await this.davrPayloadRepository.findOneBy({
        vid: id,
      });

      if (davrRecord) {
        await this.davrPayloadRepository.update(
          { vid: id },
          {
            bank_id: pid,
            response: response.data,
            updatedAt: new Date(),
          },
        );
      }

      const bankingRecord = await this.bankingRepository.findOneBy({
        vid_id: id,
      });

      if (bankingRecord) {
        await this.bankingRepository.update(
          { vid_id: id },
          {
            bank_id: pid,
            response: response.data,
            updatedAt: new Date(),
          },
        );
      }
    } else if ((type = 'pid')) {
      const status = name == 'Проведен' ? 'success' : name;
      const davrRecord = await this.davrPayloadRepository.findOneBy({
        bank_id: id,
      });

      if (davrRecord) {
        await this.davrPayloadRepository.update(
          { bank_id: id },
          {
            p_status: status,
            response: response.data,
            updatedAt: new Date(),
          },
        );
      }

      const bankingRecord = await this.bankingRepository.findOneBy({
        bank_id: id,
      });

      if (bankingRecord) {
        await this.bankingRepository.update(
          { bank_id: id },
          {
            p_status: status,
            response: response.data,
            updatedAt: new Date(),
          },
        );
      }
    }

    return response.data;
  }

  // application_id bilan pravotka
  async sendDavrTransactionByAppId(id: number, req: Request) {
    const allgoodProps = await this.allgoodPropRepository.findOneByBank(1);
    if (!allgoodProps) {
      throw new NotFoundException('Active rekvizitlar topilmadi');
    }

    const report = await this.bankingRepository.findOneBy({
      backend_application_id: id,
    });

    if (!report) {
      throw new NotFoundException('Ushbu id li billing topilmadi');
    }

    const findLog = await this.cashLog.findOneBy({
      application_id: report.backend_application_id,
    });

    if (findLog && findLog.status !== 'failed') {
      return {
        success: false,
        message: 'Ush tranzaksiya allaqachon mavjud',
      };
    }

    // Yangi 6 xonali takrorlanmas ID yaratish
    const uniqueNumDoc = generateUniqueId();

    const payload = {
      vbranch: allgoodProps.mfo,
      vaccount: allgoodProps.account,
      vname_cl: allgoodProps.name,
      vinn_cl: allgoodProps.inn,
      vmfo_cr: report.mfo,
      vaccount_cr: report.bank_account,
      vname_cr: report.merchant_name,
      vinn_cr: report.merchant_inn,
      vsumma: parseFloat(report.price),
      vnaz_pla:
        'за услуги сог договора ALG-59 по рассрочки "Бытовая техника" ALTIBOYEVA MAVLUDA ID53419',
      vnum_doc: `${uniqueNumDoc}`, // Yangi generatsiya qilingan ID
      vcode_naz_pla: '00668',
      vbudget_account: '',
      vbudget_inn: '',
      vbudget_name: '',
      vusername: 'allgood',
      vparentid: 2905,
    };
    // log
    const log = {
      application_id: report.backend_application_id,
      amount: parseFloat(report.price),
      numm_doc: uniqueNumDoc,
      request: payload,
      who: req.user.name,
    };
    await this.cashLog.save(log);

    try {
      const response = await this.apiClient.post(
        '/api/v1.0/allgood/allepc',
        payload,
      );
      const { result } = response.data;

      await this.cashLog.update(
        { application_id: report.backend_application_id },
        {
          response: response.data,
          status: 'waiting',
          vid_id: result.vidk,
          updatedAt: new Date(),
        },
      );

      // Banking jadvalini yangilash (vnum_doc ni saqlash)
      await this.bankingRepository.update(
        { backend_application_id: report.backend_application_id },
        {
          vid_id: result.vidk,
          response: response.data,
          p_status: 'waiting',
          numm_doc: uniqueNumDoc,
          updatedAt: new Date(),
          who: req.user.name,
        },
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        const formattedError = {
          status: error.response?.status || 400,
          message: error.response?.data?.detail || 'Unknown error occurred',
          instance:
            error.response?.data?.instance || '/api/v1.0/allgood/allepc',
          success: false,
        };

        await this.cashLog.update(
          { application_id: report.backend_application_id },
          {
            response: error.response?.data || error.message || error.stack,
            status: 'failed',
            updatedAt: new Date(),
          },
        );

        // Banking jadvalini xatolik bilan yangilash
        await this.bankingRepository.update(
          { backend_application_id: report.backend_application_id },
          {
            response: error.response?.data || error.message,
            p_status: 'failed',
            numm_doc: uniqueNumDoc, // Xato bo‘lsa ham saqlab qolish
            updatedAt: new Date(),
            who: req.user.name,
          },
        );

        throw new BadRequestException(formattedError);
      }

      const formattedError = {
        status: 500,
        message: error.message || 'An unexpected error occurred',
        instance: '/api/v1.0/allgood/allepc',
        success: false,
      };
      throw new BadRequestException(formattedError);
    }
  }

  // ----------------------------------------------------------------------------------------------------------------------------
  // avtomat pravotka
  // @Cron('0 26 12 * * *')
  // async processTransactions(): Promise<any> {
  //   const allgoodProps = await this.allgoodPropRepository.findOneByBank(1);
  //   if (!allgoodProps) {
  //     throw new NotFoundException('Active rekvizitlar topilmadi');
  //   }

  //   const reports = await this.getReports();
  //   const davrReports = reports.filter(
  //     (report: BankingTransactionDto) => report.bank === 'DAVRBANK',
  //   );

  //   if (davrReports.length === 0) {
  //     throw new NotFoundException(
  //       'DAVRBANK bilan bog‘liq ma’lumotlar topilmadi',
  //     );
  //   }

  //   const results = [];
  //   for (const report of davrReports) {
  //     const payload = {
  //       vbranch: allgoodProps.mfo,
  //       vaccount: allgoodProps.account,
  //       vname_cl: allgoodProps.name,
  //       vinn_cl: allgoodProps.inn,
  //       vmfo_cr: report.mfo,
  //       vaccount_cr: report.bank_account,
  //       vname_cr: report.merchant_name,
  //       vinn_cr: report.merchant_inn,
  //       vsumma: parseFloat(report.price),
  //       vnaz_pla: 'Оказанные и выполненные услуги',
  //       vnum_doc: `ALG-ID${report.backend_application_id}`,
  //       vcode_naz_pla: '00668',
  //       vbudget_account: '',
  //       vbudget_inn: '',
  //       vbudget_name: '',
  //       vusername: 'allgood',
  //       vparentid: 2905,
  //     };

  //     try {
  //       const response = await this.apiClient.post(
  //         '/api/v1.0/allgood/allepc',
  //         payload,
  //       );

  //       // Faqat kerakli ustunlarni yangilash
  //       await this.bankingRepository.update(
  //         { backend_application_id: report.backend_application_id },
  //         {
  //           response: response.data, // JSON responsni saqlash
  //           p_status: 'success', // Statusni yangilash
  //           updatedAt: new Date(), // Yangilangan vaqt
  //         },
  //       );

  //       results.push({
  //         reportId: report.backend_application_id,
  //         status: 'success',
  //         data: response.data,
  //       });
  //     } catch (error) {
  //       console.error('Xatolik yuz berdi:', error.message);

  //       // Xato responsni saqlash
  //       await this.bankingRepository.update(
  //         { backend_application_id: report.backend_application_id },
  //         {
  //           response: error.response?.data || error.message, // Xato responsni saqlash
  //           p_status: 'failed', // Statusni yangilash
  //           updatedAt: new Date(), // Yangilangan vaqt
  //         },
  //       );

  //       results.push({
  //         reportId: report.backend_application_id,
  //         status: 'failed',
  //         error: error.response?.data || error.message,
  //       });
  //     }
  //   }

  //   return results;
  // }
}
