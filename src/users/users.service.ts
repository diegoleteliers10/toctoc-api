import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import type { UserResponseDto } from './dto/user-response.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;
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

  async createUser(createUser: CreateUserDto): Promise<UserResponseDto> {
    await this.validateUserEmail(createUser.email);

    const hashedPassword = await this.hashPassword(createUser.password);

    const createdUser = await this.userRepository.save({
      ...createUser,
      password: hashedPassword,
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
  ): Promise<UserResponseDto> {
    const userExists = await this.findUserByIdOrError(id);

    if (!userExists) {
      throw new NotFoundException('El usuario no existe en la base de datos');
    }

    await this.userRepository.update(id, updateUserDto); //actualizamos el usuario
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
    return bcrypt.hash(password, this.saltRounds); //encripta el password
  }
}
