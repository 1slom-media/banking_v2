import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cashtx_log')
export class CashLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  application_id: number;

  @Column({ nullable: true, default: 'send' })
  status: string;

  @Column()
  amount: number;

  @Column({ nullable: true })
  vid_id: number;

  @Column({ nullable: true, type: 'bigint' })
  bank_id: number;

  @Column({ nullable: true })
  numm_doc: number;

  @Column({ nullable: true, default: 'auto' })
  who: string;

  @Column('json', { nullable: true })
  request: object;

  @Column('json', { nullable: true })
  response: object;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
