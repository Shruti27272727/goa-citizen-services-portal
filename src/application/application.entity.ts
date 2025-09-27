import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum Status {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  citizen_id: number;

  @Column()
  service_id: number;

  @Column({ nullable: true })
  officer_id?: number;

  @Column("enum", { enum: Status, array: true, default: [Status.PENDING] })
  status: Status[];

  @Column("timestamptz", { array: true })
  applied_on: Date[];

  @Column("timestamptz", { nullable: true })
  completed_on?: Date;

  @Column("text", { array: true, nullable: true })
  remarks?: string[];
}
