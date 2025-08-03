import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import type { UserResponseDto } from './dto/user-response.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;
  private supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  );
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {} //con esto le pedimos a la bd hacer consultas de sus datos

  async findAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
    return users.map((user: User) => this.toUserResponse(user));
  }

  async createUser(
    createUser: CreateUserDto,
    file?: {
      buffer: Buffer;
      mimetype: string;
      originalname: string;
      size: number;
    },
  ): Promise<UserResponseDto> {
    await this.validateUserEmail(createUser.email);

    const hashedPassword = await this.hashPassword(createUser.password);

    // Procesar subida de avatar si existe
    let avatarUrl: string | undefined = undefined;
    if (file) {
      this.validateFile(file);
      avatarUrl = await this.uploadAvatarToSupabase(file, createUser.email);
    }

    const createdUser = await this.userRepository.save({
      ...createUser,
      password: hashedPassword,
      avatar: avatarUrl,
    }); // si no existe, guardamos el user en la bbdd

    return this.toUserResponse(createdUser);
  }

  async findUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
    });

    if (!user) {
      throw new NotFoundException('El usuario no existe en la base de datos');
    }

    return this.toUserResponse(user);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    file?: {
      buffer: Buffer;
      mimetype: string;
      originalname: string;
      size: number;
    },
  ): Promise<UserResponseDto> {
    const userExists = await this.findUserByIdOrError(id);

    if (!userExists) {
      throw new NotFoundException('El usuario no existe en la base de datos');
    }

    // Procesar subida de avatar si existe
    let avatarUrl: string | undefined = undefined;
    if (file) {
      this.validateFile(file);
      avatarUrl = await this.uploadAvatarToSupabase(
        file,
        updateUserDto.email as string,
      );
    }

    // Preparar datos de actualización
    const updateData = { ...updateUserDto };
    if (avatarUrl) {
      updateData.avatar = avatarUrl;
    }

    // Encriptar contraseña si se está actualizando
    if (updateUserDto.password) {
      updateData.password = await this.hashPassword(updateUserDto.password);
    }

    await this.userRepository.update(id, updateData); //actualizamos el usuario
    const updatedUser = await this.findUserByIdOrError(id);
    return this.toUserResponse(updatedUser);
  }

  async deleteUser(id: string): Promise<void> {
    const userExists = await this.findUserByIdOrError(id);

    if (!userExists) {
      throw new NotFoundException('El usuario no existe en la base de datos');
    }

    await this.userRepository.update(id, { isActive: false });
  }

  //funciones privadas

  private toUserResponse(user: User): UserResponseDto {
    //pasamos el user json a la funcion

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResponse } = user; //destructuramos el usuario en userResponse y password
    return {
      ...userResponse,
    }; //devolvemos por seguridad unicamente el userResponse
  }

  private async findUserByIdOrError(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
    });

    if (!user) {
      throw new NotFoundException('El usuario no existe en la base de datos');
    }

    return user;
  }

  private async validateUserEmail(email: string): Promise<void> {
    const userExists = await this.userRepository.findOne({
      where: { email: email },
    }); //validar que exista el user

    if (userExists) {
      throw new ConflictException('El usuario ya existe');
    } //si existe lanza un error
  }

  private async hashPassword(password: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await bcrypt.hash(password, this.saltRounds); //encripta el password
  }
  private validateFile(file: { mimetype: string; size: number }): void {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
      );
    }

    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 5MB limit.');
    }
  }

  private async uploadAvatarToSupabase(
    file: { buffer: Buffer; mimetype: string; originalname: string },
    userIdentifier: string,
  ): Promise<string> {
    // Verificar que el bucket existe
    await this.ensureAvatarBucketExists();

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

  private async ensureAvatarBucketExists(): Promise<void> {
    const { data: buckets, error } = await this.supabase.storage.listBuckets();

    if (error) {
      console.error('Error listing buckets:', error);
      return;
    }

    const avatarBucket = buckets.find(bucket => bucket.name === 'files-bucket');

    if (!avatarBucket) {
      const { error: createError } = await this.supabase.storage.createBucket(
        'avatars',
        {
          public: true,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
          fileSizeLimit: 5 * 1024 * 1024, // 5MB
        },
      );

      if (createError) {
        console.error('Error creating avatars bucket:', createError);
        throw new BadRequestException(
          'Error setting up storage. Please try again.',
        );
      }

      console.log('✅ Avatars bucket created successfully');
    }
  }

  async testStorageConfiguration(): Promise<{
    status: string;
    message: string;
    bucketExists?: boolean;
  }> {
    try {
      const { data: buckets, error } =
        await this.supabase.storage.listBuckets();

      if (error) {
        return {
          status: 'error',
          message: `Error connecting to Supabase: ${error.message}`,
        };
      }

      const avatarBucket = buckets.find(
        bucket => bucket.name === 'files-bucket',
      );

      return {
        status: 'success',
        message: 'Supabase storage connection successful',
        bucketExists: !!avatarBucket,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Configuration error: ${error}`,
      };
    }
  }
}
