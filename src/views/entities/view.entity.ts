import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Property } from '../../properties/entities/properties.entity';

@Entity('views')
// 🔍 Índice único compuesto para evitar registros duplicados en el mismo momento
@Index('IDX_USER_PROPERTY_VIEWED', ['user_id', 'property_id', 'viewedAt'])
// 🔍 Índices para consultas frecuentes
@Index('IDX_USER_VIEWED_AT', ['user_id', 'viewedAt'])
@Index('IDX_PROPERTY_VIEWED_AT', ['property_id', 'viewedAt'])
@Index('IDX_PROPERTY_COUNT', ['property_id'])
export class View {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  @Index('IDX_VIEW_USER_ID') // 🔍 Para buscar views por usuario
  user_id: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  @Index('IDX_VIEW_PROPERTY_ID') // 🔍 Para buscar views por propiedad
  property_id: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Index('IDX_VIEWED_AT') // 🔍 Para ordenar por fecha de visualización
  viewedAt: Date;

  // 🔗 Relación Many-to-One con User
  @ManyToOne(() => User, user => user.id, {
    nullable: false,
    onDelete: 'CASCADE', // Si se elimina el usuario, se eliminan sus views
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // 🔗 Relación Many-to-One con Property
  @ManyToOne(() => Property, property => property.id, {
    nullable: false,
    onDelete: 'CASCADE', // Si se elimina la propiedad, se eliminan sus views
  })
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  @Index('IDX_VIEWS_CREATED_AT') // 🔍 Para ordenar por fecha de creación del registro
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  updatedAt: Date;
}
