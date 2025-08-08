# TocToc API 🏠

Una API RESTful desarrollada con NestJS para una plataforma de compra y arriendo de propiedades inmobiliarias en Chile.

## 🚀 Características Implementadas

### ✅ Arquitectura Base
- **Framework**: NestJS con TypeScript
- **Base de Datos**: PostgreSQL (Supabase)
- **ORM**: TypeORM con migraciones automáticas
- **Documentación**: Swagger UI integrado
- **Testing**: Jest para pruebas unitarias y E2E

### ✅ Funcionalidades Desarrolladas

#### 🏗️ Estructura del Proyecto
```
src/
├── config/               # Configuración (DB, TypeORM)
├── users/                # Módulo de usuarios (CRUD básico + upload avatar)
│   ├── dto/              # DTOs y respuestas
│   └── entities/         # Entidad User
├── properties/           # Módulo de propiedades (crear + upload imágenes)
│   ├── dto/              # DTOs y respuestas
│   └── entities/         # Entidad Property
├── likes/                # Módulo de likes (favoritos básicos)
│   ├── dto/
│   └── entities/         # Entidad Like
├── views/                # Entidad View (conteo de vistas, sin endpoints aún)
│   └── entities/
├── app.module.ts         # Módulo principal
├── main.ts               # Punto de entrada con Swagger
└── app.controller.ts     # Controlador de bienvenida
```

#### 👥 Sistema de Usuarios
**Entidad User** con las siguientes características:
- **ID**: UUID como clave primaria
- **Campos**: name, email (único), password (oculto por defecto), role
- **Roles**: `buyer` (comprador) | `seller` (vendedor)
- **Relaciones**: One-to-Many con Properties
- **Auditoría**: createdAt, updatedAt, deletedAt (soft delete)
- **Índices Optimizados**:
  - Índices simples: name, email, role, createdAt, deletedAt
  - Índices compuestos: email+role, role+createdAt

#### 🏠 Sistema de Propiedades
**Entidad Property** con funcionalidades completas:
- **Información Básica**: title, description, address
- **Categorías**: departamento, casa, comercial
- **Tipos de Operación**: arriendo, compra
- **Ubicación**: city, region (preparado para Chile)
- **Precio**: con soporte para CLP y UF
- **Imágenes**: Array de URLs (JSON)
- **Estado**: isActive para eliminación lógica
- **Relaciones**: Many-to-One con User (owner)
- **Auditoría Completa**: timestamps + soft delete
- **Índices de Alto Rendimiento**:
  - Índices simples: category, type, price, currency, city, region, isActive, owner_id
  - Índices compuestos optimizados para búsquedas frecuentes:
    - city + type + isActive
    - region + category + isActive  
    - price + type + city

#### ❤️ Sistema de Likes (Favoritos)
- **Entidad Like** con índices únicos para evitar duplicados por `user_id + property_id`.
- Toggle de like/unlike vía endpoint dedicado.

#### 👀 Sistema de Vistas
- **Entidad View** preparada con índices para conteo y auditoría de visualizaciones por propiedad y usuario.
- Aún sin endpoints públicos (planificado).

### ✅ Configuración Técnica

#### 🔧 Base de Datos (Supabase)
- Conexión a PostgreSQL configurada
- Pool de conexiones optimizado (5-20 conexiones)
- SSL para producción
- Sincronización automática en desarrollo
- Logging de queries para debugging

#### 📚 Documentación API (Swagger)
- **URL**: `http://localhost:3000/api`
- Configuración completa con:
  - Metadatos del proyecto
  - Etiquetas organizacionales
  - Documentación de endpoints
  - Ejemplos de respuestas
  - Servidor de desarrollo configurado

#### 🌐 Configuración de Servidor
- **Puerto**: 3000 (configurable via ENV)
- **Prefijo Global**: `/api/v1`
- **CORS**: Habilitado para desarrollo (localhost:3000, localhost:3001)
- **Variables de Entorno**: Soporte para `.env` y `.env.local`

#### 🗄️ Storage (Supabase)
- Subida de archivos a Supabase Storage para avatares de usuarios y fotos de propiedades.
- Bucket utilizado: `files-bucket` (el servicio valida/crea buckets cuando corresponde).

#### 🧪 Testing & Quality
- **Jest**: Configurado para pruebas unitarias y E2E
- **ESLint**: Reglas de TypeScript + Prettier
- **Prettier**: Formateo automático de código
- **Scripts disponibles**: build, test, lint, format

## 📋 Endpoints Disponibles

### 🏠 Aplicación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | `/api/v1/` | Mensaje de bienvenida de la API |

### 👥 Usuarios (`/api/v1/users`)
| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET    | `/` | Listar usuarios activos | - |
| GET    | `/test-storage` | Probar configuración de Supabase Storage | - |
| GET    | `/:id` | Obtener usuario por ID | - |
| GET    | `/me/:id` | Obtener mi usuario por ID | - |
| POST   | `/` | Crear usuario (con avatar opcional) | `multipart/form-data` (campos de CreateUserDto + archivo `avatar`) |
| PATCH  | `/:id` | Actualizar usuario (y avatar opcional) | `multipart/form-data` (campos de UpdateUserDto + archivo `avatar`) |
| DELETE | `/:id` | Eliminación lógica del usuario | - |

Campos relevantes DTO:
- CreateUserDto: `name`, `email`, `password`, `role` (buyer|seller), `avatar` (binary opcional)
- UpdateUserDto: todos opcionales + `avatar` (binary opcional)

### 🏠 Propiedades (`/api/v1/properties`)
| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| POST   | `/` | Crear propiedad (con múltiples imágenes) | `multipart/form-data` (campos de CreatePropertyDto + archivos `image_urls[]`)

Campos relevantes DTO (CreatePropertyDto):
`title`, `description`, `price`, `currency` (CLP|UF), `address`, `city`, `region`, `category` (departamento|casa|comercial), `type` (arriendo|compra), `owner_id`, `image_urls[]` (urls o archivos).

Nota: Endpoints de lectura/listado están en preparación; el servicio ya contempla `getAllHouses()` a nivel interno.

### ❤️ Likes (`/api/v1/likes`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST   | `/:propertyId?userId={uuid}` | Toggle like/unlike para una propiedad |

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- npm o yarn o bun
- Base de datos PostgreSQL (Supabase)

### 1. Clonar e instalar dependencias
```bash
git clone <repository-url>
cd toctoc-api
npm install
```

### 2. Configurar variables de entorno
Crear archivo `.env`:
```env
# Database (Supabase)
DB_HOST=your-supabase-host
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_NAME=your-database-name

# Application
NODE_ENV=development
PORT=3000

# Supabase Storage
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Ejecutar la aplicación
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

### 4. Acceder a la documentación
- **API**: http://localhost:3000/api/v1
- **Swagger**: http://localhost:3000/api

## 🧪 Testing

```bash
# Pruebas unitarias
npm run test

# Pruebas E2E
npm run test:e2e

# Coverage
npm run test:cov
```

## 📦 Tecnologías Principales

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| NestJS | ^11.0.1 | Framework principal |
| TypeORM | ^0.3.25 | ORM para base de datos |
| PostgreSQL | - | Base de datos (via Supabase) |
| Swagger | ^11.2.0 | Documentación API |
| Jest | ^29.7.0 | Testing framework |
| TypeScript | ^5.7.3 | Lenguaje de programación |

## 🏗️ Próximos Pasos

### 🔜 Funcionalidades Pendientes
- [ ] Módulos completos de Users y Properties con CRUD (Propiedades: lectura/listado pendientes)
- [ ] Sistema de autenticación JWT
- [ ] Filtros avanzados para búsqueda de propiedades
- [x] Sistema de favoritos (likes) básico
- [x] Upload de imágenes (usuarios: avatar; propiedades: múltiples imágenes)
- [ ] Paginación y ordenamiento
- [x] Validaciones con class-validator en DTOs
- [ ] Rate limiting y seguridad

### 🎯 Optimizaciones Planeadas
- [ ] Cache con Redis
- [ ] Logging estructurado
- [ ] Monitoreo y métricas
- [ ] Dockerización
- [ ] CI/CD Pipeline

## 👥 Equipo de Desarrollo

Desarrollado con ❤️ por Diego Letelier

---

## 📄 Licencia

Este proyecto no tiene licencia pública y esta habilitado a uso publicamente.
