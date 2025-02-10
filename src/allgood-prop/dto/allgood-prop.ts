import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AllgoodPropDto {
  @ApiProperty({ example: '00981' })
  @IsString()
  mfo: string;

  @ApiProperty({ example: '20208000605474855004' })
  @IsString()
  account: string;

  @ApiProperty({ example: 'ООО ALL-GOOD MARKETPLACE' })
  @IsString()
  name: string;

  @ApiProperty({ example: '309166181' })
  @IsString()
  inn: string;

  @ApiProperty({ example: 'DAVRBANK' })
  @IsString()
  bank: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  bank_unique: number;
}
