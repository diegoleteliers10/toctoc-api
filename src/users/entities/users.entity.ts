import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Property } from '../../propoerties/entities/properties.entity';

@Entity('users')
// 🔍 Índices compuestos para consultas frecuentes
@Index('IDX_EMAIL_ROLE', ['email', 'role'])
@Index('IDX_ROLE_CREATED', ['role', 'createdAt'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  @Index('IDX_NAME') // 🔍 Para búsquedas por nombre
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true, // 📧 Email debe ser único
  })
  @Index('IDX_EMAIL') // 🔍 Crítico para login y búsquedas
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false, // 🔒 No incluir password en consultas por defecto
  })
  password: string;

  @Column({
    type: 'enum',
    enum: ['buyer', 'seller'],
    nullable: false,
  })
  @Index('IDX_ROLE') // 🔍 Para filtrar por tipo de usuario
  role: 'buyer' | 'seller';

  // 🔗 Relación One-to-Many con Properties
  @OneToMany(() => Property, property => property.owner, {
    cascade: true, // Operaciones en cascada
    lazy: true, // Carga lazy por defecto para optimizar performance
  })
  properties: Promise<Property[]>;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  @Index('IDX_CREATED_AT') // 🔍 Para ordenar por fecha de registro
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  @Index('IDX_DELETED_AT') // 🔍 Para manejar eliminación lógica eficientemente
  deletedAt?: Date;
}
