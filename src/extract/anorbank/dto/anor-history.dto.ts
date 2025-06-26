import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export class AnorHistoryDto {
  @ApiProperty({ enum: TransactionType, example: 'CREDIT' })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: '2024-01-01' })
  @IsDate()
  @Type(() => Date)
  from: Date;

  @ApiProperty({ example: '2024-12-31' })
  @IsDate()
  @Type(() => Date)
  to: Date;
}
