# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project: TocToc API (NestJS + TypeScript + TypeORM + PostgreSQL)

- Primary package scripts are defined in package.json and work with npm/yarn/pnpm/bun. Examples below use npm; adapt to your package manager as needed. A bun.lock is present, so bun can be used if installed.

Common commands

- Install dependencies
  - npm install
  - bun install

- Start app (development, watch mode)
  - npm run start:dev
  - bun run start:dev

- Build (TypeScript → dist/)
  - npm run build
  - bun run build

- Start in production (after build)
  - npm run start:prod
  - bun run start:prod

- Lint (ESLint with TypeScript + Prettier integration)
  - npm run lint
  - bun run lint

- Format (Prettier)
  - npm run format
  - bun run format

- Test (Jest unit tests)
  - All unit tests: npm test
  - Watch: npm run test:watch
  - Coverage: npm run test:cov
  - E2E tests: npm run test:e2e

- Run a single test file
  - npx jest src/users/users.service.spec.ts
  - bunx jest src/users/users.service.spec.ts

- Run tests by name pattern
  - npx jest -t "should create user"
  - bunx jest -t "should create user"

- Run tests matching a file/path pattern
  - npx jest --testPathPattern=users
  - bunx jest --testPathPattern=users

Runtime and developer endpoints

- API base (as configured in main.ts/README): http://localhost:3000/api/v1
- Swagger UI: http://localhost:3000/api

Environment configuration

- Create a .env file in the repo root before running the app. See README.md for the exact variable names and descriptions (database connection, Supabase, PORT, etc.).

High-level architecture

- Framework and Composition
  - NestJS modular architecture. AppModule wires feature modules and infrastructure.
  - src/main.ts bootstraps the HTTP server, sets the global prefix /api/v1, enables CORS for local development, and configures Swagger.

- Configuration and Infrastructure
  - src/config/database.config.ts centralizes TypeORM datasource settings (PostgreSQL via pg). Development uses sync; production expects SSL and disabled sync (see README for intent). TypeORM is integrated through @nestjs/typeorm.
  - @nestjs/config is used for environment-based configuration (env file support).

- Persistence and Domain
  - TypeORM entities define the data model and indexes:
    - users/entities/users.entity.ts: User with UUID PK, unique email, role (buyer|seller), soft-delete timestamps, relations to properties, and multiple single/compound indexes optimized for common queries.
    - properties/entities/properties.entity.ts: Property with core fields (title, description, address, price, currency, city, region, category, type), owner relation, images (array/JSON), soft-delete, and several single/compound indexes for typical marketplace queries.
    - likes/entities/like.entity.ts: Like with unique constraint on (user_id, property_id) to enforce toggle semantics.
    - views/entities/view.entity.ts: View tracking entity prepared for analytics (no public endpoints yet).

- Feature Modules (HTTP + Service + DTOs)
  - Users Module (src/users): CRUD endpoints for users, optional avatar upload via Supabase Storage, DTO validation via class-validator/class-transformer. Service encapsulates business logic and repository access.
  - Properties Module (src/properties): Create property with multiple images (Supabase Storage integration). Read/list endpoints are planned; internal service includes retrieval helpers (e.g., getAllHouses()).
  - Likes Module (src/likes): Toggle endpoint to like/unlike a property, enforced by the unique index.
  - Views (src/views): Entity present; endpoints pending.
  - Controllers expose RESTful routes under /api/v1/<resource>; DTOs live under each module’s dto/; persistence models in entities/.

- API Documentation
  - @nestjs/swagger used in main.ts to expose Swagger UI at /api with project metadata, tags, and examples.

- Validation, Style, and Quality
  - class-validator and class-transformer power DTO validation and serialization.
  - ESLint configuration (eslint.config.mjs) uses typescript-eslint recommended configs with Prettier integration; key rules: no-explicit-any off, warns for floating promises and unsafe arguments.
  - Prettier config in .prettierrc (singleQuote, trailingComma=all, etc.).

- Testing
  - Jest configuration embedded in package.json (rootDir=src, testRegex=*.spec.ts, ts-jest transform). Unit tests live alongside modules as *.spec.ts. E2E tests are under test/ with its own jest-e2e.json.

Development workflow notes

- Use npm run start:dev for local development; code changes in src/ will hot-reload via Nest CLI.
- When adding a new module, follow the existing pattern: module.ts, controller.ts, service.ts, dto/, entities/. Register entities with TypeORM in the module and export providers as needed.
- For file uploads (avatars/images), services integrate with Supabase Storage; ensure the related environment variables are present in .env before exercising those endpoints.

Cross-tooling notes

- If you prefer bun:
  - bun run start:dev, bun run build, bun run start:prod, bun run test, etc., mirror the npm scripts.

Source-of-truth documents

- README.md: Contains endpoints, environment variables, setup steps, and feature descriptions. Keep this in sync when adding modules or changing API paths.

