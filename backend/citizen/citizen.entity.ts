import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Application } from '../application/application.entity';

@Entity('citizens')
export class Citizen {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false, unique: true })
  email: string;

  @Column({ type: 'text', nullable: false })
  phone: string;

  @Column({ type: 'text', nullable: true, unique: true })
  aadhaar: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ type: 'varchar', default: 'citizen' })
  role: 'citizen' | 'admin' | 'officer';

  @OneToMany(() => Application, (application) => application.citizen)
  applications: Application[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
