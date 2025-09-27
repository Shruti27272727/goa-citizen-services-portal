import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  // Assuming 'name' is an array of strings
  @Column("text", { array: true })
  name: string[];
}
