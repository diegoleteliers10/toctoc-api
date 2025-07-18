import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';

@Entity('properties')
// 🔍 Índices compuestos para búsquedas frecuentes
@Index('IDX_CITY_TYPE_ACTIVE', ['city', 'type', 'isActive'])
@Index('IDX_REGION_CATEGORY_ACTIVE', ['region', 'category', 'isActive'])
@Index('IDX_PRICE_TYPE_CITY', ['price', 'type', 'city'])
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: ['departamento', 'casa', 'comercial'],
    default: 'departamento',
    nullable: false,
  })
  @Index('IDX_CATEGORY') // 🔍 Índice simple para filtros por categoría
  category: string;

  @Column({
    type: 'enum',
    enum: ['arriendo', 'compra'],
    default: 'arriendo', // 🔧 Corregido el default
    nullable: false,
  })
  @Index('IDX_TYPE') // 🔍 Índice simple para filtros por tipo
  type: string;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  @Index('IDX_PRICE') // 🔍 Índice para búsquedas por rango de precio
  price: number;

  @Column({
    type: 'enum',
    enum: ['CLP', 'UF'],
    nullable: false,
  })
  @Index('IDX_CURRENCY')
  currency: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  address: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @Index('IDX_CITY') // 🔍 Muy importante - búsquedas por ciudad son frecuentes
  city: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @Index('IDX_REGION') // 🔍 Para filtros por región
  region: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  image_urls: string[];

  @Column({
    type: 'boolean',
    default: true,
    nullable: false,
  })
  @Index('IDX_IS_ACTIVE') // 🔍 Crítico - siempre filtramos propiedades activas
  isActive: boolean; //para eliminado logico

  @Column({
    type: 'uuid',
    nullable: false,
  })
  @Index('IDX_OWNER_ID') // 🔍 Para buscar propiedades por propietario
  owner_id: string;

  // 🔗 Relación Many-to-One con User
  @ManyToOne(() => User, user => user.properties, {
    nullable: false,
    onDelete: 'CASCADE', // Si se elimina el usuario, se eliminan sus propiedades
  })
  @JoinColumn({ name: 'owner_id' }) // Especifica la columna FK
  owner: User;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  @Index('IDX_PROPERTIES_CREATED_AT') // 🔍 Para ordenar por fecha de creación
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
  deletedAt?: Date;
}
