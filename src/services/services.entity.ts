import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Application } from '../application/application.entity';

@Entity({ name: 'services' })
export class Service {
  @PrimaryGeneratedColumn()
  id: number; 

  @Column({ name: 'department_id' })
  department_id: number;

  @Column({ type: 'varchar', nullable: false, default: 'Default Service Name' })
name: string;


  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false, default: 0 })
fee: number;


  @OneToMany(() => Application, (application) => application.service)
  applications: Application[];
}
