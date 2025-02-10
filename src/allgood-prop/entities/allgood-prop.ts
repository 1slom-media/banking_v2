import { IsNumber, IsString } from 'class-validator';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('allgood_prop')
export class AllgoodPropEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar' })
  @IsString()
  mfo: string;

  @Column({ type: 'varchar' })
  @IsString()
  account: string;

  @Column({ type: 'varchar' })
  @IsString()
  name: string;

  @Column({ type: 'varchar' })
  @IsString()
  bank: string;

  @Column({ type: 'int' })
  @IsNumber()
  bank_unique: number;

  @Column({ type: 'varchar' })
  @IsString()
  inn: string;

  @Column({ type: 'varchar', default: 'active' })
  @IsString()
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;
}
