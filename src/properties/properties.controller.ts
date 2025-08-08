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
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyResponseDto } from './dto/property-response.dto';

@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('image_urls'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePropertyDto })
  @ApiOperation({
    summary: 'Crear una nueva propiedad',
    description: 'Crea una nueva propiedad con todos sus datos',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: PropertyResponseDto })
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

  @Get(':id')
  getHouseById(
    @Param('id') propertyId: string,
    @Query('userId') userId: string,
  ) {
    return this.propertiesService.getHouseById(propertyId, userId);
  }
}
