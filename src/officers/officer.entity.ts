import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Application } from '../application/application.entity';

@Entity({ name: 'officer' }) 
export class Officer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  department_id?: number;
@OneToMany(() => Application, (application) => application.officer)
  applications: Application[];
}
