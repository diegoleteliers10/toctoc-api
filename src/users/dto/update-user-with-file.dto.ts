import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './create-user.dto';

export class UpdateUserFormDataDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez González',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Correo electrónico único del usuario',
    example: 'juan.perez@email.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'MiPassword123',
    required: false,
  })
  password?: string;

  @ApiProperty({
    description: 'Rol del usuario en la plataforma',
    enum: UserRole,
    example: UserRole.BUYER,
    required: false,
  })
  role?: UserRole;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Avatar del usuario (archivo de imagen opcional)',
    required: false,
  })
  avatar?: any;
}
