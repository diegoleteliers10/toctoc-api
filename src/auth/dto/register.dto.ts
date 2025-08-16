import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEnum,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
}

export class RegisterDto {
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
  email: string;

  @ApiProperty({
    description:
      'Contraseña del usuario (mínimo 8 caracteres, debe incluir mayúscula, minúscula y número)',
    example: 'MiPassword123',
    minLength: 8,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(255, { message: 'La contraseña no puede exceder 255 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
  })
  password: string;

  @ApiProperty({
    description: 'Rol del usuario en la plataforma',
    enum: UserRole,
    example: UserRole.BUYER,
  })
  @IsEnum(UserRole, {
    message: 'El rol debe ser buyer (comprador) o seller (vendedor)',
  })
  @IsNotEmpty()
  role: UserRole;
}
