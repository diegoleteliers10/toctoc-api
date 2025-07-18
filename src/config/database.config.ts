import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/users.entity';
import { Property } from '../properties/entities/properties.entity';
import { View } from '../views/entities/view.entity';
import { Like } from '../likes/entities/like.entity';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  console.log('👉 DB config being used:');
  console.log('DB_HOST:', configService.get('DB_HOST'));
  console.log('DB_PORT:', configService.get('DB_PORT'));
  console.log('DB_USERNAME:', configService.get('DB_USERNAME'));
  console.log('DB_PASSWORD:', configService.get('DB_PASSWORD'));
  console.log('DB_NAME:', configService.get('DB_NAME'));

  return {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: parseInt(configService.get('DB_PORT') || '5432'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),

    // 📦 Entidades registradas
    entities: [User, Property, View, Like],

    // 🔄 Sincronización automática (solo en desarrollo)
    synchronize: configService.get('NODE_ENV') !== 'production',

    // 📝 Logging de queries (útil para debugging)
    logging: configService.get('NODE_ENV') === 'development',

    // 🔧 Configuraciones adicionales
    ssl:
      configService.get('NODE_ENV') === 'production'
        ? { rejectUnauthorized: false }
        : false,
    extra: {
      // Pool de conexiones
      max: 20,
      min: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    },
  };
};
