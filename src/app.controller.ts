import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app') // 🏷️ Etiqueta para agrupar endpoints en Swagger
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() //indica el metodo
  @ApiResponse({
    status: 200,
    description: 'Welcome message returned successfully',
    schema: {
      type: 'string',
      example: 'Hello World!',
    },
  }) //indicamos acerca de que tipo de respuesta da este metodo
  getHello(): string {
    return this.appService.getInitPage();
  }
}
