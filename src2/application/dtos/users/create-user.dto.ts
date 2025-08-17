import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEnum,
  Matches,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../domain/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez González',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  @Matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  readonly name: string;

  @ApiProperty({
    description: 'Correo electrónico único del usuario',
    example: 'juan.perez@email.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @IsNotEmpty()
  @MaxLength(255, { message: 'El email no puede exceder 255 caracteres' })
  readonly email: string;

  @ApiProperty({
    description:
      'Contraseña del usuario ( debe incluir mayúscula, minúscula y número, y debe tener entre 9 y 15 caracteres, y debe incluir al menos un caracter especial de ?_#$%^&)',
    example: 'MiPassword123',
    minLength: 8,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(255, { message: 'La contraseña no puede exceder 255 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*[?_#$%^&])[A-Za-z\d?_#$%^&]{9,15}$/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número, y debe tener entre 9 y 15 caracteres, y debe incluir al menos un caracter especial de ?_#$%^&',
  })
  readonly password: string;

  @ApiProperty({
    description: 'Rol del usuario en la plataforma',
    enum: UserRole,
    example: UserRole.BUYER,
  })
  @IsEnum(UserRole, {
    message: 'El rol debe ser buyer (comprador) o seller (vendedor)',
  })
  @IsNotEmpty()
  readonly role: UserRole;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Avatar del usuario (archivo de imagen opcional)',
    required: false,
  })
  @IsOptional()
  avatar?: any;
}
