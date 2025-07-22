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
├── config/              # Configuraciones de base de datos
├── users/               # Módulo de usuarios
│   └── entities/        # Entidades de usuarios
├── propoerties/         # Módulo de propiedades
│   └── entities/        # Entidades de propiedades
├── app.module.ts        # Módulo principal
├── main.ts             # Punto de entrada con Swagger
└── app.controller.ts   # Controlador de bienvenida
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
- [ ] Módulos completos de Users y Properties con CRUD
- [ ] Sistema de autenticación JWT
- [ ] Filtros avanzados para búsqueda de propiedades
- [ ] Sistema de favoritos
- [ ] Upload de imágenes
- [ ] Paginación y ordenamiento
- [ ] Validaciones con class-validator
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
