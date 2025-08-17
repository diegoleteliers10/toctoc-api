import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../domain/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez González',
  })
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'URL del avatar del usuario',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar?: string;

  @ApiProperty({
    description: 'Estado activo del usuario',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: UserRole,
    example: UserRole.BUYER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}
