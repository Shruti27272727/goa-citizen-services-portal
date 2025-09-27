import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Application } from '../application/application.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn({ name: 'application_id' })
  applicationId: number;

  @Column("text", { name: 'file_url', array: true, nullable: true }) // ✅ mapped
  fileUrl: string[];

  @Column("text", { name: 'doc_type', array: true, nullable: true }) // ✅ mapped
  docType: string[];

  @ManyToOne(() => Application, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'application_id' })
  application: Application;
}
