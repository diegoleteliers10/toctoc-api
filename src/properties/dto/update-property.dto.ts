import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePropertyDto } from './create-property.dto';

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
  // PartialType hace que todas las propiedades sean opcionales
  // Esto es perfecto para operaciones PATCH

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    description: 'URLs de las imágenes de la propiedad',
    required: false,
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
  })
  image_urls?: string[];
}
