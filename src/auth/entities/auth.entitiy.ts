import { IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity("auth")
export class AuthEntity{
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: "varchar" })
    @IsString()
    access_token: string

    @Column({ type: "varchar" })
    @IsString()
    refresh_token: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;
}