import { IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity("davr_balance")
export class DavrBalanceEntity{
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: "varchar" })
    @IsString()
    account: string

    @Column({ type: "varchar" })
    @IsString()
    name: string

    @Column({ type: "varchar" })
    @IsString()
    bank: string

    @Column({ type: "bigint" })
    @IsString()
    balance: number

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;
}