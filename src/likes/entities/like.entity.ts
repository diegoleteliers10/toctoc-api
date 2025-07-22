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

@Entity('likes')
// 🔍 Índice único compuesto para evitar likes duplicados
@Index('IDX_USER_PROPERTY_UNIQUE', ['user_id', 'property_id'], { unique: true })
// 🔍 Índices para consultas frecuentes
@Index('IDX_USER_CREATED', ['user_id', 'createdAt'])
@Index('IDX_PROPERTY_CREATED', ['property_id', 'createdAt'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  @Index('IDX_LIKE_USER_ID') // 🔍 Para buscar likes por usuario
  user_id: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  @Index('IDX_LIKE_PROPERTY_ID') // 🔍 Para buscar likes por propiedad
  property_id: string;

  // 🔗 Relación Many-to-One con User
  @ManyToOne(() => User, user => user.id, {
    nullable: false,
    onDelete: 'CASCADE', // Si se elimina el usuario, se eliminan sus likes
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // 🔗 Relación Many-to-One con Property
  @ManyToOne(() => Property, property => property.id, {
    nullable: false,
    onDelete: 'CASCADE', // Si se elimina la propiedad, se eliminan sus likes
  })
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  @Index('IDX_LIKES_CREATED_AT') // 🔍 Para ordenar por fecha de like
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  updatedAt: Date;
}
