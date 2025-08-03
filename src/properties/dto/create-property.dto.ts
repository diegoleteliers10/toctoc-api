import {
  IsString,
  IsNumber,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEnum,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PropertyCategory {
  DEPARTMENT = 'departamento',
  HOUSE = 'casa',
  COMERCIAL = 'comercial',
}

export enum PropertyType {
  RENT = 'arriendo',
  BUY = 'compra',
}

export enum PropertyCurrency {
  CLP = 'CLP',
  UF = 'UF',
}

export class CreatePropertyDto {
  @ApiProperty({
    description: 'Titulo de la propiedad',
    example: 'Edificio moderno a metros del centro',
    minLength: 2,
    maxLength: 300,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  @Matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  readonly title: string;

  @ApiProperty({
    description: 'Descripcion de la propiedad',
    example:
      'Casa a metros del mall parque arauco. Cuenta con 3 banos, 2 dormitorios, cocina, lavadora. Esta full equipada. El recinto es privado y cuenta con seguridad 24/7',
    minLength: 2,
    maxLength: 2000,
  })
  @IsNotEmpty()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(2000, { message: 'El email no puede exceder 2000 caracteres' })
  description: string;

  @ApiProperty({
    description: 'Precio de la propiedad',
    example: 300000000,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Direccion de la propiedad',
    example: 'Avenida Siempreviva 742, Las Condes',
    minLength: 2,
    maxLength: 300,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  @Matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s0-9,.]+$/, {
    message:
      'La dirección debe contener solo letras, números, espacios, comas y puntos',
  })
  address: string;

  @ApiProperty({
    description: 'Categoria de la propiedad',
    enum: PropertyCategory,
    example: PropertyCategory.DEPARTMENT,
  })
  @IsEnum(PropertyCategory, {
    message: 'La categoria debe ser de tipo departamento, casa o comercial',
  })
  @IsNotEmpty()
  category: PropertyCategory;

  @ApiProperty({
    description: 'Tipo de la propiedad',
    enum: PropertyType,
    example: PropertyType.RENT,
  })
  @IsEnum(PropertyType, {
    message: 'El tipo debe ser de tipo arriendo o compra',
  })
  @IsNotEmpty()
  type: PropertyType;

  @ApiProperty({
    description: 'Tipo de la propiedad',
    enum: PropertyCurrency,
    example: PropertyCurrency.CLP,
  })
  @IsEnum(PropertyCurrency, {
    message: 'El tipo debe ser de tipo arriendo o compra',
  })
  @IsNotEmpty()
  currency: PropertyCurrency;

  @ApiProperty({
    description: 'Ciudad donde se encuentra la propiedad',
    example: 'Santiago',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'La ciudad debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'La ciudad no puede exceder 100 caracteres' })
  @Matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, {
    message: 'La ciudad solo puede contener letras y espacios',
  })
  city: string;

  @ApiProperty({
    description: 'Región donde se encuentra la propiedad',
    example: 'Región Metropolitana',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'La región debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'La región no puede exceder 100 caracteres' })
  @Matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, {
    message: 'La región solo puede contener letras y espacios',
  })
  region: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
      description: 'Imagen de la propiedad (archivo de imagen opcional)',
    },
    description:
      'Lista de imágenes de la propiedad (archivos de imagen opcionales)',
    required: false,
  })
  image_urls?: string[];

  @ApiProperty({
    description: 'ID del propietario de la propiedad',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty({ message: 'El ID del propietario es requerido' })
  owner_id: string;
}
