import {
  Controller,
  Get,
  Body,
  // Param,
  // Patch,
  // Delete,
  // HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
  UploadedFiles,
  Param,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyResponseDto } from './dto/property-response.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserRole } from 'src/users/dto/create-user.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  @ApiOperation({
    summary: 'Crear una nueva propiedad',
    description: 'Crea una nueva propiedad con todos sus datos',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, type: PropertyResponseDto })
  @UseInterceptors(FilesInterceptor('image_urls'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePropertyDto })
  create(
    @Body() createPropertyDto: CreatePropertyDto,
    @UploadedFiles()
    files?: {
      buffer: Buffer;
      mimetype: string;
      originalname: string;
      size: number;
    }[],
  ) {
    return this.propertiesService.createProperty(createPropertyDto, files);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  @ApiOperation({
    summary: 'Actualizar una propiedad',
    description: 'Actualiza una propiedad con todos sus datos',
  })
  @ApiResponse({ status: HttpStatus.OK, type: PropertyResponseDto })
  @UseInterceptors(FilesInterceptor('image_urls'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdatePropertyDto })
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @UploadedFiles()
    files?: {
      buffer: Buffer;
      mimetype: string;
      originalname: string;
      size: number;
    }[],
  ) {
    return this.propertiesService.updateProperty(id, updatePropertyDto, files);
  }

  @Get(':id')
  @Public()
  getHouseById(
    @Param('id') propertyId: string,
    @Query('userId') userId: string,
  ) {
    return this.propertiesService.getHouseById(propertyId, userId);
  }
}
