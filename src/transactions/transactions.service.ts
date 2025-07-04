import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, MoreThan, Not, Repository } from 'typeorm';
import { BankingTransactionEntity } from './entities/transaction.entity';
import { plainToInstance } from 'class-transformer';
import { BankingTransactionDto } from './dto/transaction.dto';
import { validate } from 'class-validator';
import { AllgoodPropService } from 'src/allgood-prop/allgood-prop.service';
import { Cron } from '@nestjs/schedule';
import {
  AccountTransferAnorDto,
  CreateDavrPayloadDto,
  GetCashQueryDto,
} from './dto/payload';
import { DavrPayloadEntity } from './entities/payload.entity';
import { generateUniqueId } from '../utils/unique-id';
import { CashLogEntity } from './entities/cashtx';
import { Request } from 'express';
import { AnorStateMap } from 'src/utils/anor-state';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectDataSource('secondary')
    private readonly secondaryDataSource: DataSource,
    @Inject('DAVR_API_CLIENT') private readonly apiClient: any,
    @Inject('ANOR_API_CLIENT')
    private readonly apiClientAnor: any,
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

  // getAll cash panel
  async getCash(params: GetCashQueryDto) {
    const {
      fromDate,
      toDate,
      status,
      amount,
      fromAccount,
      toAccount,
      who,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      page = 1,
      limit = 20,
    } = params;

    const query = this.cashLog.createQueryBuilder('cash');

    if (status) {
      query.andWhere('cash.status = :status', { status });
    }
    // Filter by amount
    if (amount) {
      query.andWhere('cash.amount = :amount', { amount });
    }

    // Filter by fromAccount
    if (fromAccount) {
      query.andWhere('cash.fromAccount ILIKE :fromAccount', {
        fromAccount: `%${fromAccount}%`,
      });
    }

    // Filter by toAccount
    if (toAccount) {
      query.andWhere('cash.toAccount ILIKE :toAccount', {
        toAccount: `%${toAccount}%`,
      });
    }

    // Filter by who
    if (who) {
      query.andWhere('cash.who ILIKE :who', { who: `%${who}%` });
    }

    // Filter by date range
    if (fromDate) {
      query.andWhere('cash.createdAt >= :fromDate', { fromDate });
    }
    if (toDate) {
      query.andWhere('cash.createdAt <= :toDate', { toDate });
    }

    // Sorting
    query.orderBy(`cash.${sortBy}`, sortOrder);

    // Pagination
    query.skip((+page - 1) * +limit).take(+limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / +limit),
    };
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
      b.name AS branch_name,
      (SELECT c.category 
       FROM public.merchant_category mc
       JOIN public.categories c ON mc.category_id = c.id
       WHERE mc.merchant_id = COALESCE(m.id, m2.id)
       ORDER BY mc.category_id 
       LIMIT 1) AS category
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
      category: item.category,
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

  // get davr or anor by id status and update
  async findAndUpdateStatus(id: number, provider: string): Promise<any> {
    console.log(id, provider);
    if (provider == 'DAVRBANK') {
      console.log('d');
      return await this.davrCheckAndUpdateStatus(id);
    }
    if (provider == 'ANORBANK') {
      console.log('a');
      return this.anorCheckAndUpdateStatus(id);
    }
  }

  // anorbank transaction metod ==>> ruchnoy pravodka
  async sendAnorTransaction(data: AccountTransferAnorDto, req: Request) {
    const recent = new Date();
    recent.setMinutes(recent.getMinutes() - 3);
    const existing = await this.cashLog.findOne({
      where: {
        who: req.user.name,
        amount: data.amount,
        toAccount: data.toAccount,
        createdAt: MoreThan(recent),
        status: Not('failed'),
      },
    });

    if (existing) {
      return {
        success: false,
        message:
          'Ushbu summa bilan siz tranzaksiya amalga oshirgansiz! Ikki marta tolov bolmasligi uchun tekshiring agar hammasi tog`ri bolsa 3 daqiqadan song davom eting',
      };
    }
    if (data.amount <= 0 || isNaN(data.amount)) {
      throw new BadRequestException('Noto‘g‘ri summa');
    }
    const uniqueNumDoc = generateUniqueId();
    //payload
    const payload = {
      id: Date.now().toString(),
      jsonrpc: '2.0',
      method: 'account.to.account.transfer',
      params: {
        request: {
          agentTranId: uniqueNumDoc,
          currency: 860, // UZS
          from: {
            account: data.fromAccount,
            mfo: data.fromMfo,
            name: data.fromName,
            purposeId: '00668',
            comment: data.comment,
          },
          to: {
            account: data.toAccount,
            mfo: data.toMfo,
            name: data.toName,
            purposeId: '00668',
            comment: data.comment,
          },
          amount: data.amount * 100,
        },
      },
    };
    //create log
    const log = {
      application_id: Number(uniqueNumDoc),
      amount: data.amount,
      fromAccount: data.fromAccount,
      toAccount: data.toAccount,
      toMfo: data.toMfo,
      naz_pla: data.comment,
      bank: 'ANORBANK',
      numm_doc: Number(uniqueNumDoc),
      request: payload,
      who: req.user.name,
    };
    await this.cashLog.save(log);
    try {
      const response = await this.apiClientAnor.post('/payment', payload);
      const { result } = response.data;
      await this.cashLog.update(
        { application_id: Number(uniqueNumDoc) },
        {
          response: response.data,
          status: 'waiting',
          vid_id: result?.recipient.data?.PC_ID,
          bank_id: result?.bmId,
          updatedAt: new Date(),
        },
      );
      const logRes = await this.cashLog.findOneBy({
        application_id: uniqueNumDoc,
      });
      return {
        numm_doc: uniqueNumDoc,
        bank: 'ANORBANK',
        status: logRes.status,
      };
    } catch (error) {
      await this.cashLog.update(
        { application_id: Number(uniqueNumDoc) },
        {
          status: 'failed',
          response: error?.response?.data || error.message || 'Unknown error',
          updatedAt: new Date(),
        },
      );

      // Loglash
      console.error(
        'Anor transfer error:',
        error?.response?.data || error.message,
      );
      throw new BadRequestException(
        error?.response?.data?.error?.data || 'Bank bilan aloqa xatosi',
      );
    }
  }

  // anorbank aplication id
  async sendAnorTransactionByAppId(id: number, req: Request) {
    const allgoodProps = await this.allgoodPropRepository.findOneByBank(2);
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
    const uniqueNumDoc = generateUniqueId();
    const cleanedMerchantName =
      typeof report.merchant_name === 'string'
        ? report.merchant_name.replace(/«/g, '"').replace(/»/g, '"')
        : '';

    const payload = {
      id: Date.now().toString(),
      jsonrpc: '2.0',
      method: 'account.to.account.transfer',
      params: {
        request: {
          agentTranId: String(uniqueNumDoc),
          currency: 860, // UZS
          from: {
            account: allgoodProps.account,
            mfo: allgoodProps.mfo,
            name: allgoodProps.name,
            purposeId: '00668',
            comment: `за услуги сог договора ${report?.contract_no} по рассрочки "${report?.category}" ${report?.name} ID${report?.backend_application_id}`,
          },
          to: {
            account: report.bank_account,
            mfo: report.mfo,
            name: cleanedMerchantName,
            purposeId: '00668',
            comment: `за услуги сог договора ${report?.contract_no} по рассрочки "${report?.category}" ${report?.name} ID${report?.backend_application_id}`,
          },
          amount: parseFloat(report.price),
        },
      },
    };
    console.log(payload, 'sendAnorTransactionByAppId payload');

    const log = {
      application_id: report.backend_application_id,
      amount: parseFloat(report.price),
      fromAccount: allgoodProps.account,
      toAccount: report.bank_account,
      toMfo: report.mfo,
      naz_pla: `за услуги сог договора ${report?.contract_no} по рассрочки "${report?.category}" ${report?.name} ID${report?.backend_application_id}`,
      bank: 'ANORBANK',
      numm_doc: uniqueNumDoc,
      request: payload,
      who: req.user.name,
    };
    await this.cashLog.save(log);
    try {
      const response = await this.apiClientAnor.post('/payment', payload);
      const data = response.data;

      // Agar data.error mavjud bo‘lsa va u object bo‘lsa va code mavjud bo‘lsa
      if (
        data?.error &&
        typeof data.error === 'object' &&
        'code' in data.error
      ) {
        throw new Error(JSON.stringify(data.error)); // bu catch blokga tushadi
      }
      const { result } = data;

      // cashLog update
      await this.cashLog.update(
        { application_id: report.backend_application_id },
        {
          response: response.data,
          status: 'waiting',
          vid_id: result?.recipient.data?.PC_ID,
          bank_id: result?.bmId,
          updatedAt: new Date(),
        },
      );
      // banking update
      await this.bankingRepository.update(
        { backend_application_id: report.backend_application_id },
        {
          vid_id: result?.recipient.data?.PC_ID,
          bank_id: result?.bmId,
          response: response.data,
          p_status: 'waiting',
          numm_doc: uniqueNumDoc,
          updatedAt: new Date(),
          who: req.user.name,
        },
      );
      const logRes = await this.cashLog.findOneBy({
        application_id: report.backend_application_id,
      });
      return {
        numm_doc: uniqueNumDoc,
        bank: 'ANORBANK',
        status: logRes.status,
        application_id: report.backend_application_id,
      };
    } catch (error) {
      // cashLog update
      await this.cashLog.update(
        { application_id: report.backend_application_id },
        {
          status: 'failed',
          response: error?.response?.data || error.message || 'Unknown error',
          updatedAt: new Date(),
        },
      );
      // banking update
      await this.bankingRepository.update(
        { backend_application_id: report.backend_application_id },
        {
          response: error?.response?.data || error.message || 'Unknown error',
          p_status: 'failed',
          numm_doc: uniqueNumDoc,
          updatedAt: new Date(),
          who: req.user.name,
        },
      );

      // Loglash
      console.error(
        'Anor transfer error:',
        error?.response?.data || error.message,
      );
      throw new BadRequestException(
        error?.response?.data?.error?.data || 'Bank bilan aloqa xatosi',
      );
    }
  }

  // application_id bilan pravotka by Davr
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
      vnaz_pla: `за услуги сог договора ${report?.contract_no} по рассрочки "${report?.category}" ${report?.name} ID${report?.backend_application_id}`,
      vnum_doc: `${uniqueNumDoc}`,
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
      fromAccount: payload.vaccount,
      toAccount: payload.vaccount_cr,
      naz_pla: payload.vnaz_pla,
      bank: 'DAVRBANK',
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
      const logRes = await this.cashLog.findOneBy({
        application_id: report.backend_application_id,
      });
      return {
        numm_doc: uniqueNumDoc,
        bank: 'DAVRBANK',
        status: logRes.status,
        application_id: report.backend_application_id,
      };
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

  // davrbank transaction metod ==>> ruchnoy pravodka
  async sendDavrTransaction(data: CreateDavrPayloadDto, req: Request) {
    const recent = new Date();
    recent.setMinutes(recent.getMinutes() - 3);
    const existing = await this.cashLog.findOne({
      where: {
        who: req.user.name,
        amount: data.vsumma,
        toAccount: data.vaccount_cr,
        createdAt: MoreThan(recent),
        status: Not('failed'),
      },
    });

    if (existing) {
      return {
        success: false,
        message:
          'Ushbu summa bilan siz tranzaksiya amalga oshirgansiz! Ikki marta tolov bolmasligi uchun tekshiring agar hammasi tog`ri bolsa 3 daqiqadan song davom eting',
      };
    }
    if (data.vsumma <= 0 || isNaN(data.vsumma)) {
      throw new BadRequestException('Noto‘g‘ri summa');
    }
    const uniqueNumDoc = generateUniqueId();
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
      vnum_doc: String(uniqueNumDoc),
      vcode_naz_pla: data.vcode_naz_pla || '00668',
      vbudget_account: data.vbudget_account || '',
      vbudget_inn: data.vbudget_inn || '',
      vbudget_name: data.vbudget_name || '',
      vusername: data.vusername || 'allgood',
      vparentid: data.vparentid || 2905,
    };
    const log = {
      application_id: uniqueNumDoc,
      amount: data.vsumma,
      fromAccount: data.vaccount,
      toAccount: data.vaccount_cr,
      naz_pla: data.vnaz_pla,
      bank: 'DAVRBANK',
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
        { application_id: uniqueNumDoc },
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
        vnum_doc: uniqueNumDoc,
      };
      const davrPay = this.davrPayloadRepository.create(entityData);
      await this.davrPayloadRepository.save(davrPay);
      const logRes = await this.cashLog.findOneBy({
        application_id: uniqueNumDoc,
      });
      return {
        numm_doc: uniqueNumDoc,
        bank: 'DAVRBANK',
        status: logRes.status,
      };
    } catch (error) {
      if (error.response) {
        await this.cashLog.update(
          { application_id: uniqueNumDoc },
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

  async anorCheckAndUpdateStatus(id: number): Promise<any> {
    const cashLog = await this.cashLog.findOneBy({ numm_doc: id });
    if (!cashLog) {
      throw new NotFoundException(`CashLog with numm_doc ${id} not found`);
    }

    const bankingRecord = await this.bankingRepository.findOneBy({
      numm_doc: id,
    });

    const transId = cashLog.vid_id;
    const groupId = cashLog.toMfo === '01183' ? 0 : 4;

    const payload = {
      id: 1,
      jsonrpc: '2.0',
      method: 'nci.transactionStatus.get',
      params: {
        request: {
          transId,
          groupId,
        },
      },
    };
    console.log(payload, 'py status');
    const response = await this.apiClientAnor.post('/services', payload);
    console.log(response, 'res status');
    const result = response.data?.result[0];
    if (!result || typeof result.STATE !== 'number') {
      throw new Error('Invalid response from ANOR API');
    }

    const state = result.STATE;
    const successStates = [3, 8, 50];
    const stateText = AnorStateMap[state] || `Nomaʼlum holat: ${state}`;
    const now = new Date();

    if (successStates.includes(state)) {
      await this.cashLog.update(
        { numm_doc: id },
        {
          status: 'success',
          updatedAt: now,
          response: result,
          responseText: stateText,
        },
      );

      if (bankingRecord) {
        await this.bankingRepository.update(
          { numm_doc: id },
          {
            p_status: 'success',
            updatedAt: now,
            response: result,
            responseText: stateText,
          },
        );
      }
    } else {
      await this.cashLog.update(
        { numm_doc: id },
        {
          responseText: stateText,
          updatedAt: now,
          response: result,
        },
      );

      if (bankingRecord) {
        await this.bankingRepository.update(
          { numm_doc: id },
          {
            responseText: stateText,
            updatedAt: now,
            response: result,
          },
        );
      }
    }

    return {
      success: true,
      message: stateText,
    };
  }

  // davrbank status find and update
  async davrCheckAndUpdateStatus(id: number) {
    let sourceType: 'davr' | 'banking' | null = null;
    let record: any = null;

    // 1. davrPayloadRepository da qidiring
    const davrRecord = await this.davrPayloadRepository.findOneBy({
      vnum_doc: id,
    });

    if (davrRecord) {
      sourceType = 'davr';
      record = davrRecord;
    } else {
      const bankingRecord = await this.bankingRepository.findOneBy({
        numm_doc: id,
      });

      if (bankingRecord) {
        sourceType = 'banking';
        record = bankingRecord;
      }
    }

    if (!record || !sourceType) {
      throw new NotFoundException(`Record with doc id ${id} not found`);
    }

    // 2. Qaysi field bilan API chaqilishini aniqlaymiz
    const bank_id = record.bank_id;
    const apiField = bank_id ? 'pid' : sourceType === 'davr' ? 'vid' : 'vid_id';
    const apiId = bank_id || record[apiField];

    const response = await this.apiClient.get(
      `/api/v1.0/allgood/allstate/${apiId}`,
    );
    const { pid, name } = response.data.result;

    // 3. statusni aniqlaymiz
    const status = name === 'Проведен' ? 'success' : name;

    const updateFields =
      bank_id || pid
        ? {
            bank_id: pid,
            response: response.data,
            updatedAt: new Date(),
          }
        : {
            p_status: status,
            response: response.data,
            updatedAt: new Date(),
          };

    // 4. Mos tableni yangilash
    if (sourceType === 'davr') {
      const whereField = bank_id || pid ? { vnum_doc: id } : { bank_id: apiId };
      await this.davrPayloadRepository.update(whereField, updateFields);
    } else {
      const whereField = bank_id || pid ? { numm_doc: id } : { bank_id: apiId };
      await this.bankingRepository.update(whereField, updateFields);
    }

    return {
      success: true,
      message: name,
    };
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
