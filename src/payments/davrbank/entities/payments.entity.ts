import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('davr_payments')
export class DavrPaymentsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', nullable: true })
  paymentId: number;

  @Column({ type: 'int', nullable: true })
  docBank: number;

  @Column({ type: 'int', nullable: true })
  inOut: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  branch: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  docNum: string;

  @Column({ type: 'timestamp', nullable: true })
  dDate: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  bankCl: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  accCl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nameCl: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  innCl: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  bankCo: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  accCo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nameCo: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  innCo: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  purposeCode: string;

  @Column({ type: 'text', nullable: true })
  purpose: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  summa: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  currency: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  typeDoc: string;

  @Column({ type: 'timestamp', nullable: true })
  vDate: Date;

  @Column({ type: 'varchar', length: 1, nullable: true })
  pdc: string;

  @Column({ type: 'int', nullable: true })
  state: number;

  @Column({ type: 'int', nullable: true })
  sDealId: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  cashCode: string | null;

  @Column({ type: 'int', nullable: true })
  parentGroupId: number;

  @Column({ type: 'bigint', nullable: true })
  parentId: number;

  @Column({ type: 'bigint', nullable: true })
  childId: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fileName: string;

  @Column({ type: 'int', nullable: true })
  kodErr: number;

  @Column({ type: 'text', nullable: true })
  errGeneral: string | null;

  @Column({ type: 'int', nullable: true })
  empId: number;

  @Column({ type: 'int', nullable: true })
  idTransh: number;

  @Column({ type: 'int', nullable: true })
  idTranshPurp: number | null;

  @Column({ type: 'timestamp', nullable: true })
  valDate: Date | null;

  @Column({ type: 'text', nullable: true })
  sign: string | null;

  @Column({ type: 'bigint', nullable: true })
  generalId: number;

  @Column({ type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ type: 'int', nullable: true })
  parentIdType: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  budgetAccount: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  budgetInn: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  budgetName: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stateDesc: string;

  @Column({ type: 'int', nullable: true })
  edit: number;

  @Column({ type: 'int', nullable: true })
  copy: number;

  @Column({ type: 'int', nullable: true })
  template: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  dt1: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  bank: string;

  @Column({ type: 'text', nullable: true })
  date1: string;

  @Column({ type: 'text', nullable: true })
  date2: string;

  @CreateDateColumn({ type: 'timestamp'})
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp'})
  updatedAt: Date;
}
