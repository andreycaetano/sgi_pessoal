import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'usuario_tipo' })
export class UsuarioTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  sistema: string;

  @Column({ type: 'varchar' })
  descricao: string;

  @CreateDateColumn({ name: 'created_at', type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'date' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'date' })
  deletedAt: Date;
}
