import {
  Controller,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserFormDataDto } from './dto/create-user-with-file.dto';
import { UpdateUserFormDataDto } from './dto/update-user-with-file.dto';

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

  @Get('test-storage')
  @ApiOperation({ summary: 'Probar configuración de storage' })
  @ApiResponse({ status: HttpStatus.OK })
  testStorage() {
    return this.usersService.testStorageConfiguration();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por su ID' })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  findOne(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUserFormDataDto })
  @ApiOperation({
    summary: 'Actualizar un usuario por su ID',
    description: 'Actualiza los datos de un usuario y opcionalmente su avatar',
  })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile()
    file?: {
      buffer: Buffer;
      mimetype: string;
      originalname: string;
      size: number;
    },
  ) {
    return this.usersService.updateUser(id, updateUserDto, file);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un usuario por su ID' })
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserFormDataDto })
  @ApiOperation({
    summary: 'Crear un nuevo usuario',
    description:
      'Crea un nuevo usuario con datos básicos y opcionalmente un avatar',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserResponseDto })
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile()
    file?: {
      buffer: Buffer;
      mimetype: string;
      originalname: string;
      size: number;
    },
  ) {
    return this.usersService.createUser(createUserDto, file);
  }

  @Get('me/:id')
  @ApiOperation({ summary: 'Obtener mi usuario' })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  getMe(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }
}
