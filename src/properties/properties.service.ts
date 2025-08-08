import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from './entities/properties.entity';
import type { Repository } from 'typeorm';
import { createClient } from '@supabase/supabase-js';
import type { PropertyResponseDto } from './dto/property-response.dto';
import type { CreatePropertyDto } from './dto/create-property.dto';
import { View } from 'src/views/entities/view.entity';

@Injectable()
export class PropertiesService {
  private supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  );
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(View) private viewRepository: Repository<View>, //si queremos usar el repositorio de views debemos tambien importarlo en el module
  ) {}

  async getAllHouses(): Promise<PropertyResponseDto[]> {
    const properties = await this.propertyRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
    return properties.map((property: Property) =>
      this.toPropertyResponse(property),
    );
  }

  async getHouseById(id: string, userId: string): Promise<PropertyResponseDto> {
    const property = await this.propertyRepository.findOne({
      where: { isActive: true, id },
    });
    if (!property) {
      throw new NotFoundException('La propiedad no existe en la base de datos');
    }
    if (userId) {
      const view = this.viewRepository.create({
        user_id: userId,
        property_id: id,
      });
      await this.viewRepository.save(view);
    }
    return this.toPropertyResponse(property);
  }

  async createProperty(
    createPropertyDto: CreatePropertyDto,
    files?: {
      buffer: Buffer;
      mimetype: string;
      originalname: string;
      size: number;
    }[],
  ): Promise<PropertyResponseDto> {
    // Procesar subida de imágenes si existen archivos
    let imageUrls: string[] = createPropertyDto.image_urls || [];

    if (files && Array.isArray(files) && files.length > 0) {
      // Subir cada imagen y obtener su URL pública
      const uploadPromises = files.map(file =>
        this.uploadPropertyImagesToSupabase(file, createPropertyDto.owner_id),
      );
      const uploadedUrls = await Promise.all(uploadPromises);
      imageUrls = imageUrls.concat(uploadedUrls);
    }

    const property = this.propertyRepository.create({
      ...createPropertyDto,
      image_urls: imageUrls,
      isActive: true,
    });

    const createdProperty = await this.propertyRepository.save(property);

    return this.toPropertyResponse(createdProperty);
  }

  //funciones privadas

  private toPropertyResponse(property: Property): PropertyResponseDto {
    return property;
  }

  private async uploadPropertyImagesToSupabase(
    file: { buffer: Buffer; mimetype: string; originalname: string },
    userIdentifier: string,
  ): Promise<string> {
    // Verificar que el bucket existe
    await this.ensurePropertyImagesBucketExists();

    // Crear nombre único para el archivo usando timestamp
    const timestamp = Date.now();
    const fileExtension = file.originalname.split('.').pop();
    const filePath = `${userIdentifier}-${timestamp}.${fileExtension}`;

    const { data, error: uploadError } = await this.supabase.storage
      .from('files-bucket')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true, // Sobrescribir si ya existe
      });

    if (uploadError) {
      throw new BadRequestException(
        `Storage upload error: ${uploadError.message}`,
      );
    }

    // Obtener la URL pública del archivo
    const { data: publicUrlData } = this.supabase.storage
      .from('files-bucket')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  }

  private async ensurePropertyImagesBucketExists(): Promise<void> {
    const { data: buckets, error } = await this.supabase.storage.listBuckets();

    if (error) {
      console.error('Error listing buckets:', error);
      return;
    }

    const propertyBucket = buckets.find(
      bucket => bucket.name === 'files-bucket',
    );

    if (!propertyBucket) {
      const { error: createError } = await this.supabase.storage.createBucket(
        'properties',
        {
          public: true,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
          fileSizeLimit: 5 * 1024 * 1024, // 5MB
        },
      );

      if (createError) {
        console.error('Error creating properties bucket:', createError);
        throw new BadRequestException(
          'Error setting up storage. Please try again.',
        );
      }

      console.log('✅ Properties bucket created successfully');
    }
  }
}
