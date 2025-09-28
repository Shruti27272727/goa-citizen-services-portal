import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Application } from '../application/application.entity';

@Entity({ name: 'services' })
export class Service {
  @PrimaryGeneratedColumn()
  id: number; // auto-generated primary key

  @Column({ name: 'department_id' })
  department_id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fee: number;

  @OneToMany(() => Application, (application) => application.service)
  applications: Application[];
}
