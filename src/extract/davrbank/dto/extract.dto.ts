import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class DavrExtractDto {
  @ApiProperty({ required: false, example: null })
  @IsOptional()
  @IsNumber()
  extractId: number | null;

  @ApiProperty({ required: false, example: null })
  @IsOptional()
  @IsString()
  vDate: string | null;

  @ApiProperty({ required: false, example: null })
  @IsOptional()
  @IsString()
  begin_dat: string | null;

  @ApiProperty({ required: false, example: null })
  @IsOptional()
  @IsString()
  end_dat: string | null;

  @ApiProperty({ required: false, example: null })
  @IsOptional()
  @IsString()
  account: string | null;

  @ApiProperty({ required: false, example: null })
  @IsOptional()
  @IsString()
  bank: string | null;

  @ApiProperty({ required: false, example: null })
  @IsOptional()
  @IsString()
  accountName: string | null;

  @ApiProperty({ required: false, example: null })
  @IsOptional()
  @IsString()
  docNumber: string | null;

  @ApiProperty({ required: false, example: null })
  @IsOptional()
  @IsString()
  typeDoc: string | null;

  @ApiProperty({ required: false, example: null })
  @IsOptional()
  @IsString()
  branch: string | null;

  @ApiProperty({ required: false, example: null })
  @IsOptional()
  @IsNumber()
  debet: number | null;

  @ApiProperty({ required: false, example: null })
  @IsOptional()
  @IsNumber()
  credit: number | null;

  @ApiProperty({ required: false, example: null })
  @IsOptional()
  @IsString()
  purpose: string | null;

  @ApiProperty({ required: false, example: null })
  @IsOptional()
  @IsString()
  cashSmb: string | null;
}

export class FetchDavrExtractDto {
  @ApiProperty({ required: false, example: "28.01.2025" })
  @IsOptional()
  @IsString()
  begin_dat: string | null;

  @ApiProperty({ required: false, example: "29.01.2025" })
  @IsOptional()
  @IsString()
  end_dat: string | null;

  @ApiProperty({ required: false, example: "20208000605474855004" })
  @IsOptional()
  @IsString()
  acc: string | null;

  @ApiProperty({ required: false, example: "%" })
  @IsOptional()
  @IsString()
  acc_co: string | null;

  @ApiProperty({ required: false, example: "%", })
  @IsOptional()
  @IsString()
  bank_co: string | null;

  @ApiProperty({ required: false, example: null })
  @IsOptional()
  @IsString()
  pdc: string | null;

  @ApiProperty({ required: false, example: "00981" })
  @IsOptional()
  @IsString()
  branch: string | null;
}
