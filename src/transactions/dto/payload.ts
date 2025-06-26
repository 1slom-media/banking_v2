import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsNumberString,
  IsDateString,
  IsIn,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusEnum } from '../enums/status-enum';

export class CreateDavrPayloadDto {
  @ApiProperty({ description: 'Branch code', example: '00981' })
  @IsString()
  vbranch: string;

  @ApiProperty({
    description: 'Account number',
    example: '90963000204316044001',
  })
  @IsString()
  vaccount: string;

  @ApiProperty({
    description: 'Client name',
    example: 'ООО ALL-GOOD MARKETPLACE',
  })
  @IsString()
  vname_cl: string;

  @ApiProperty({ description: 'Client INN', example: '309166181' })
  @IsString()
  vinn_cl: string;

  @ApiProperty({ description: 'Recipient branch MFO', example: '00981' })
  @IsString()
  vmfo_cr: string;

  @ApiProperty({
    description: 'Recipient bank account',
    example: '20208000405671481001',
  })
  @IsString()
  vaccount_cr: string;

  @ApiProperty({
    description: 'Recipient name',
    example: 'ООО «TECHNOLOGY OF ANVAR»',
  })
  @IsString()
  vname_cr: string;

  @ApiProperty({ description: 'Recipient INN', example: '310623191' })
  @IsString()
  vinn_cr: string;

  @ApiProperty({ description: 'Amount', example: 1000 })
  @IsNumber()
  vsumma: number;

  @ApiProperty({
    description: 'Payment description',
    example: 'Оказанные и выполненные услуги',
  })
  @IsString()
  vnaz_pla: string;

  @ApiProperty({ description: 'Document number', example: 'ALG-ID123' })
  @IsString()
  vnum_doc: string;

  @ApiProperty({ description: 'Payment code', example: '00668' })
  @IsString()
  vcode_naz_pla: string;

  @ApiProperty({
    description: 'Budget account is Optional',
    required: false,
    example: '',
  })
  @IsOptional()
  @IsString()
  vbudget_account?: string | '';

  @ApiProperty({
    description: 'Budget INN is Optional',
    required: false,
    example: '',
  })
  @IsOptional()
  @IsString()
  vbudget_inn?: string | '';

  @ApiProperty({
    description: 'Budget name is Optional',
    required: false,
    example: '',
  })
  @IsOptional()
  @IsString()
  vbudget_name?: string | '';

  @ApiProperty({ description: 'Username', example: 'allgood' })
  @IsOptional()
  @IsString()
  vusername: string;

  @ApiProperty({ description: 'Parent ID', example: 2905 })
  @IsOptional()
  @IsNumber()
  vparentid: number;
}

export class AccountTransferAnorDto {
  @ApiProperty({ example: '20208000105474855002' })
  @IsNotEmpty()
  @IsNumberString()
  fromAccount: string;

  @ApiProperty({ example: '01183' })
  @IsNotEmpty()
  @IsString()
  fromMfo: string;

  @ApiProperty({ example: '20208000605474855004' })
  @IsNotEmpty()
  @IsNumberString()
  toAccount: string;

  @ApiProperty({ example: '00981' })
  @IsNotEmpty()
  @IsString()
  toMfo: string;

  @ApiProperty({ example: 'Naz_Pla' })
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiProperty({ example: 'Name sender' })
  @IsNotEmpty()
  @IsString()
  fromName: string;

  @ApiProperty({ example: 'Name to' })
  @IsNotEmpty()
  @IsString()
  toName: string;

  @ApiProperty({ example: 100000 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class GetCashQueryDto {
  @ApiPropertyOptional({
    example: '2024-12-01',
    description: 'Boshlanish sanasi (ISO)',
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    example: '2025-01-01',
    description: 'Tugash sanasi (ISO)',
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({ example: 100000, description: 'To‘lov summasi' })
  @IsOptional()
  @IsString()
  amount?: string;

  @ApiPropertyOptional({
    example: '20208000105474855002',
    description: 'Jo‘natuvchi hisob raqami',
  })
  @IsOptional()
  @IsString()
  fromAccount?: string;

  @ApiPropertyOptional({
    example: '20208000605474855004',
    description: 'Qabul qiluvchi hisob raqami',
  })
  @IsOptional()
  @IsString()
  toAccount?: string;

  @ApiPropertyOptional({ example: 'auto', description: 'Kim tomonidan' })
  @IsOptional()
  @IsString()
  who?: string;

  @ApiPropertyOptional({
    example: 'send',
    description: 'Holat',
    enum: ['send', 'waiting', 'success', 'failed'],
  })
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;

  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Saralash maydoni',
    enum: ['id', 'amount', 'createdAt', 'fromAccount', 'toAccount', 'status'],
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    example: 'DESC',
    description: 'Saralash tartibi',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @ApiPropertyOptional({ example: 1, description: 'Sahifa raqami' })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiPropertyOptional({
    example: 20,
    description: 'Har sahifadagi elementlar soni',
  })
  @IsOptional()
  @IsString()
  limit?: string;
}
