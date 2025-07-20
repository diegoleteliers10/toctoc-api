import {
  Controller,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users') //swagger api tag for users requests
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {} //para poder usar el servicio con sus funciones

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: HttpStatus.OK, type: [UserResponseDto] })
  findAll() {
    return this.usersService.findAllUsers();
  }
}
