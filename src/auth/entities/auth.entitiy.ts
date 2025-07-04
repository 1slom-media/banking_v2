import { IsString } from 'class-validator';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('auth')
export class AuthEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar' })
  @IsString()
  access_token: string;

  @Column({ type: 'varchar', nullable: true })
  @IsString()
  provider: string;

  @Column({ type: 'varchar', nullable: true })
  @IsString()
  type: string;

  @Column({ type: 'varchar' })
  @IsString()
  refresh_token: string;

  @Column({ type: 'varchar', nullable: true })
  expires_in_anor: number;

  @Column({ type: 'varchar', nullable: true })
  refresh_expires_in_anor: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;
}
