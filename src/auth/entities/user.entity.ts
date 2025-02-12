import { IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity("users")
export class UserEntity{
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: "varchar" })
    @IsString()
    username: string

    @Column({ type: "varchar" })
    @IsString()
    name: string

    @Column({ type: "varchar" })
    @IsString()
    password: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: Date;
}