import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('davr_payload')
export class DavrPayloadEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vid: number;

  @Column({ type: 'bigint', nullable: true })
  bank_id: number;

  @Column({ type: 'varchar', default: 'draft' })
  p_status: string;

  @Column()
  vbranch: string;

  @Column()
  vaccount: string;

  @Column()
  vname_cl: string;

  @Column()
  vinn_cl: string;

  @Column()
  vmfo_cr: string;

  @Column()
  vaccount_cr: string;

  @Column()
  vname_cr: string;

  @Column()
  vinn_cr: string;

  @Column()
  vsumma: number;

  @Column()
  vnaz_pla: string;

  @Column()
  vnum_doc: string;

  @Column({ default: '00668' })
  vcode_naz_pla: string;

  @Column({ nullable: true })
  vbudget_account: string;

  @Column({ nullable: true })
  vbudget_inn: string;

  @Column({ nullable: true })
  vbudget_name: string;

  @Column({ default: 'allgood' })
  vusername: string;

  @Column({ default: 2905 })
  vparentid: number;

  @Column({ nullable: true, default: 'auto' })
  who: string;

  @Column('json', { nullable: true })
  response: object;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
