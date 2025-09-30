import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Application } from '../application/application.entity';

@Entity({ name: 'officer' }) 
export class Officer {
  @PrimaryGeneratedColumn()
  id: number;

@Column({ type: 'varchar', nullable: false, default: 'Unknown Officer' })
name: string;

  @Column({ type: 'varchar', nullable: false, default: 'unknown@example.com' })
email: string;

@Column({ type: 'varchar', nullable: true })
password: string;


  @Column({ nullable: true })
  department_id?: number;
@OneToMany(() => Application, (application) => application.officer)
  applications: Application[];
}
