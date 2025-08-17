import { PartialType, OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['role'] as const),
) {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Avatar del usuario (archivo de imagen opcional)',
    required: false,
  })
  @IsOptional()
  avatar?: any;
}
