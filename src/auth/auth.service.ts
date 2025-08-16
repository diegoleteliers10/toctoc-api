import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { User } from '../users/entities/users.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;
  private supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  );
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{
    access_token: string;
    user: Omit<User, 'password'>;
  }> {
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestException('El usuario ya existe con ese email');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      this.saltRounds,
    );

    // Crear usuario
    const userEntity = this.userRepository.create({
      ...registerDto,
      email: registerDto.email.toLowerCase(),
      password: hashedPassword,
    });

    const user = await this.userRepository.save(userEntity);

    // Generar JWT
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      access_token,
      user: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password: inputPassword } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      select: ['id', 'email', 'password', 'name', 'role', 'isActive'],
    });

    if (!user || !bcrypt.compareSync(inputPassword, user.password)) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Usuario inactivo, contacta al administrador',
      );
    }

    // Generar JWT
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      access_token,
      user: userWithoutPassword,
    };
  }

  // async validateUser(id: string): Promise<Omit<User, 'password'>> {
  //   const user = await this.userRepository.findOne({
  //     where: { id },
  //   });

  //   if (!user || !user.isActive) {
  //     throw new UnauthorizedException('Usuario no válido');
  //   }

  //   return user;
  // }

  async getCurrentUser(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'email',
        'name',
        'role',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    return user;
  }

  refreshToken(user: Omit<User, 'password'>) {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
