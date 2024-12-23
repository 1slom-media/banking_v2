import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  Length,
  MaxLength,
} from 'class-validator';

export class DavrPaymentsDto {
  @ApiProperty()
  @IsString()
  date1: string;

  @ApiProperty()
  @IsString()
  date2: string;

  @IsOptional()
  @IsNumber()
  paymentId?: number;

  @IsNumber()
  docBank: number;

  @IsNumber()
  inOut: number;

  @IsString()
  @Length(1, 50)
  branch: string;

  @IsString()
  @Length(1, 50)
  docNum: string;

  @IsString()
  dDate: string;

  @IsString()
  @Length(1, 50)
  bankCl: string;

  @IsString()
  @Length(1, 50)
  accCl: string;

  @IsString()
  @MaxLength(255)
  nameCl: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  innCl?: string | null;

  @IsString()
  @Length(1, 50)
  bankCo: string;

  @IsString()
  @Length(1, 50)
  accCo: string;

  @IsString()
  @MaxLength(255)
  nameCo: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  innCo?: string | null;

  @IsString()
  @MaxLength(255)
  purposeCode: string;

  @IsString()
  purpose: string;

  summa: number;

  @IsString()
  @Length(1, 10)
  currency: string;

  @IsString()
  @Length(1, 10)
  typeDoc: string;

  @IsString()
  vDate: string;

  @IsString()
  @Length(1, 1)
  pdc: string;

  @IsNumber()
  state: number;

  @IsNumber()
  sDealId: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  cashCode?: string | null;

  @IsNumber()
  parentGroupId: number;

  @IsOptional()
  @IsNumber()
  parentId: number | null;

  @IsOptional()
  @IsNumber()
  childId?: number | null;

  @IsOptional()
  @IsString()
  fileName: string | null;

  @IsNumber()
  kodErr: number;

  @IsOptional()
  @IsString()
  errGeneral?: string | null;

  @IsNumber()
  empId: number;

  @IsOptional()
  @IsNumber()
  idTransh: number;

  @IsOptional()
  @IsNumber()
  idTranshPurp?: number | null;

  @IsOptional()
  @IsString()
  valDate?: string | null;

  @IsOptional()
  @IsString()
  sign?: string | null;

  @IsNumber()
  generalId: number;

  @IsOptional()
  @IsString()
  errorMessage?: string | null;

  @IsNumber()
  parentIdType: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  budgetAccount?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  budgetInn?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  budgetName?: string | null;

  @IsString()
  @MaxLength(255)
  stateDesc: string;

  @IsNumber()
  edit: number;

  @IsNumber()
  copy: number;

  @IsNumber()
  template: number;

  @IsString()
  @Length(1, 50)
  dt1: string;

  @ApiProperty()
  @IsString()
  bank: string;
}

export class FetchDavrPaymentDto {
  @ApiProperty({ example: '00981' })
  @IsString()
  branch: string;

  @ApiProperty({ example: '04316044' })
  @IsString()
  client_id: string;

  @ApiProperty({ example: '23.01.2024' })
  @IsString()
  date1: string;

  @ApiProperty({ example: '23.02.2024' })
  @IsString()
  date2: string;
}
