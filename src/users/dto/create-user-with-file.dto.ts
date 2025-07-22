import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './create-user.dto';

export class CreateUserFormDataDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez González',
  })
  name: string;

  @ApiProperty({
    description: 'Correo electrónico único del usuario',
    example: 'juan.perez@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'MiPassword123',
  })
  password: string;

  @ApiProperty({
    description: 'Rol del usuario en la plataforma',
    enum: UserRole,
    example: UserRole.BUYER,
  })
  role: UserRole;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Avatar del usuario (archivo de imagen opcional)',
    required: false,
  })
  avatar?: any;
}
