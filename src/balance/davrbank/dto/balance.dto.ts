import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString } from "class-validator"

export class DavrBalanceDto{
    @ApiProperty()
    @IsString()
    account: string

    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    bank: string

    @ApiProperty()
    @IsNumber()
    balance: number
}