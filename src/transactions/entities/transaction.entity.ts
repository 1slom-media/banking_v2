import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('banking_transaction')
export class BankingTransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  backend_application_id: number;

  @Column({ nullable: true })
  merchant_id: number;

  @Column()
  branch_id: number;

  @Column({})
  name: string;

  @Column({ nullable: true })
  merchant: string;

  @Column({})
  bank: string;

  @Column()
  period: number;

  @Column({ type: 'timestamp' })
  created_billing: Date;

  @Column({ type: 'timestamp' })
  updated_billing: Date;

  @Column({ length: 50 })
  status: string;

  @Column({ length: 50, default: 'draft' })
  p_status: string;

  @Column({ type: 'varchar' })
  price: string;

  @Column({ type: 'varchar' })
  total: string;

  @Column({ type: 'varchar' })
  bank_sum: string;

  @Column({ type: 'varchar' })
  allgood_sum: string;

  @Column({ nullable: true })
  log: string;

  @Column()
  bank_markup: string;

  @Column({ nullable: true })
  branch: string;

  @Column({ nullable: true })
  fixal_check: string;

  @Column()
  category_type: string;

  @Column()
  mfo: string;

  @Column()
  bank_account: string;

  @Column()
  contract_no: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ nullable: true })
  merchant_name: string;

  @Column({ nullable: true })
  branch_name: string;

  @Column({ nullable: true })
  merchant_inn: string;

  @Column({ nullable: true })
  vid_id: number;

  @Column({ nullable: true,type:"bigint" })
  bank_id: number;

  @Column({ nullable: true })
  numm_doc: number;

  @Column('json', { nullable: true })
  response: object;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
