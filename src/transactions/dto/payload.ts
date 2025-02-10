import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDavrPayloadDto {
  @ApiProperty({ description: 'Branch code', example: '00981' })
  @IsString()
  vbranch: string;

  @ApiProperty({ description: 'Account number', example: '90963000204316044001' })
  @IsString()
  vaccount: string;

  @ApiProperty({ description: 'Client name', example: 'ООО ALL-GOOD MARKETPLACE' })
  @IsString()
  vname_cl: string;

  @ApiProperty({ description: 'Client INN', example: '309166181' })
  @IsString()
  vinn_cl: string;

  @ApiProperty({ description: 'Recipient branch MFO', example: '00981' })
  @IsString()
  vmfo_cr: string;

  @ApiProperty({ description: 'Recipient bank account', example: '20208000405671481001' })
  @IsString()
  vaccount_cr: string;

  @ApiProperty({ description: 'Recipient name', example: 'ООО «TECHNOLOGY OF ANVAR»' })
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
