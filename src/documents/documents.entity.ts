import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Application } from '../application/application.entity';

@Entity('documents')
export class DocumentEntity {   
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { array: true })
  file_url: string[];           

  @Column("text", { array: true })
  doc_type: string[];

  @Column({ name: 'application_id' })
  applicationId: number;

  @ManyToOne(() => Application, (application) => application.documents, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'application_id' })
application: Application;

}
