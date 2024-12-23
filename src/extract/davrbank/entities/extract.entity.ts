import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('davr_extract')
export class DavrExtractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', nullable: true })
  extractId: number;

  @Column({ type: 'varchar', nullable: true })
  vDate: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  account: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  bank: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  accountName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  docNumber: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  typeDoc: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  branch: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  debet: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  credit: number;

  @Column({ type: 'text', nullable: true })
  purpose: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  cashSmb: string | null;

  @Column({type:'text'})
  begin_dat:string;

  @Column({type:'text'})
  end_dat:string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;
}
