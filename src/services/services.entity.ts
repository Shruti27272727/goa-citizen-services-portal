import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'services' })
export class Service {
  @PrimaryGeneratedColumn({ name: 'id1' })  // ← this auto-generates ID
  id: number;

  @Column({ name: 'department_id' })
  department_id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  fee: string;
}
