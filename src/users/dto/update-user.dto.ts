import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // PartialType hace que todas las propiedades sean opcionales
  // Esto es perfecto para operaciones PATCH

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Avatar del usuario (archivo de imagen opcional)',
    required: false,
  })
  avatar?: any;
}
