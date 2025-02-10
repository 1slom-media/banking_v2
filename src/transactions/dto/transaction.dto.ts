import { IsNotEmpty, IsNumber, IsOptional, IsString, IsObject, IsDate, Length} from 'class-validator';

export class BankingTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  backend_application_id: number;

  @IsNotEmpty()
  @IsNumber()
  merchant_id: number;

  @IsNotEmpty()
  @IsNumber()
  branch_id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  merchant?: string;

  @IsNotEmpty()
  @IsString()
  bank: string;

  @IsNotEmpty()
  @IsNumber()
  period: number;

  @IsNotEmpty()
  @IsDate()
  created_billing: Date;

  @IsNotEmpty()
  @IsDate()
  updated_billing: Date;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  status: string;

  @IsNotEmpty()
  @IsString()
  price: string;

  @IsNotEmpty()
  @IsString()
  total: string;

  @IsNotEmpty()
  @IsString()
  bank_sum: string;

  @IsNotEmpty()
  @IsString()
  allgood_sum: string;

  @IsOptional()
  @IsString()
  log?: string;

  @IsString()
  bank_markup: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsString()
  fixal_check?: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 1)
  category_type: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  mfo: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  bank_account: string;

  @IsNotEmpty()
  @IsString()
  contract_no: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  merchant_name?: string;

  @IsOptional()
  @IsString()
  branch_name?: string;

  @IsOptional()
  @IsString()
  merchant_inn?: string;

  @IsOptional()
  @IsObject()
  response?: object;
}
