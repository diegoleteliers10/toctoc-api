import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🌍 Configuración de CORS para desarrollo (DEBE estar antes de listen)
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // 🔧 Configurar prefijo global de la API
  app.setGlobalPrefix('api/v1');

  // 📚 Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('TocToc API')
    .setDescription('API documentation for TocToc application')
    .setVersion('1.0')
    .addTag('users', 'User management endpoints')
    .addTag('properties', 'Property management endpoints')
    .addTag('likes', 'Like management endpoints')
    .addServer('http://localhost:3000', 'Development server') //definimos el servidor de la api que usemos, como vemos abajo indicamos el de prod
    // .addServer('https://xxxxxx.com', 'Production server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
  console.log(
    `📚 Swagger documentation available at: http://localhost:${port}/api`,
  );
}
bootstrap();
