import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserTypeOrmEntity } from '../entities/user.typeorm.entity';

@Injectable()
export class UserTypeOrmRepository implements UserRepository {
  constructor(
    @InjectRepository(UserTypeOrmEntity)
    private readonly repository: Repository<UserTypeOrmEntity>,
  ) {}

  // 🔍 CONSULTAS
  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { id, isActive: true },
    });

    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { email },
      select: [
        'id',
        'name',
        'email',
        'avatar',
        'role',
        'isActive',
        'createdAt',
        'updatedAt',
        'deletedAt',
      ],
    });

    return entity ? this.toDomain(entity) : null;
  }

  async findAllActive(): Promise<User[]> {
    const entities = await this.repository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });

    return entities.map(entity => this.toDomain(entity));
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { email },
    });

    return count > 0;
  }

  async findByRole(role: string): Promise<User[]> {
    const entities = await this.repository.find({
      where: { role: role as UserRole, isActive: true },
      order: { createdAt: 'DESC' },
    });

    return entities.map(entity => this.toDomain(entity));
  }

  // ✅ COMANDOS
  async save(user: User): Promise<User> {
    const entity = this.toTypeOrm(user);

    if (user.id) {
      // Actualizar existente
      await this.repository.update(user.id, entity);
      const updatedEntity = await this.repository.findOne({
        where: { id: user.id },
        select: [
          'id',
          'name',
          'email',
          'password',
          'avatar',
          'role',
          'isActive',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ],
      });
      return this.toDomain(updatedEntity!);
    } else {
      // Crear nuevo
      const savedEntity = await this.repository.save(entity);
      return this.toDomain(savedEntity);
    }
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    await this.repository.update(id, this.toTypeOrm(user as User));
    const updatedEntity = await this.repository.findOne({
      where: { id },
      select: [
        'id',
        'name',
        'email',
        'password',
        'avatar',
        'role',
        'isActive',
        'createdAt',
        'updatedAt',
        'deletedAt',
      ],
    });

    if (!updatedEntity) {
      throw new Error('User not found');
    }

    return this.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, {
      isActive: false,
      deletedAt: new Date(),
    });
  }

  // 📊 UTILIDADES
  async count(): Promise<number> {
    return this.repository.count({
      where: { isActive: true },
    });
  }

  // 🔄 MAPPERS (Conversión entre Domain y TypeORM)
  private toDomain(entity: UserTypeOrmEntity): User {
    return User.fromPersistence({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      avatar: entity.avatar,
      role: entity.role as UserRole,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  private toTypeOrm(user: User): Partial<UserTypeOrmEntity> {
    const props = user.toPlainObject();
    return {
      id: props.id,
      name: props.name,
      email: props.email,
      password: props.password,
      avatar: props.avatar,
      role: props.role,
      isActive: props.isActive,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      deletedAt: props.deletedAt,
    };
  }
}
