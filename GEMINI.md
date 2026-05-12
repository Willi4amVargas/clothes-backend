# Clothes Store ERP - Backend

This is the backend for a Clothes Store ERP system, built with Node.js, Express, and TypeScript. It follows a modular, layered architecture and uses PostgreSQL for data persistence.

## Project Overview

- **Core Technologies:** Node.js (v22+), TypeScript, Express.
- **Database:** PostgreSQL (using `pg` pool, no ORM).
- **Validation:** Zod for request body and DTO validation.
- **Authentication:** JWT-based using the `jose` library. Public routes (like `/api/signin`) are defined in `src/config/publicRoutes.ts`.
- **Architecture:** Layered approach (Controller -> Service -> Database) with manual Dependency Injection managed in `src/containers.ts`.
- **API Prefix:** All routes are prefixed with `/api`.

## Building and Running

### Development
- **Install dependencies:** `npm install`
- **Run in development mode:** `npm run dev` (uses `tsx` with watch mode).
- **Environment variables:** Copy `.env.example` to `.env` and fill in the values.

### Testing
- **Run tests:** `npm run test` (uses `jest`).
- **Test files:** Located alongside source files with `.test.ts` extension (e.g., `src/app.test.ts`, `src/products/products.route.test.ts`).

### Production
- **Build:** `npm run build` (uses `esbuild`).
- **Run:** `npm run start`.

## Development Conventions

### Code Structure
- **Directories:** Modularized by domain (e.g., `src/products`, `src/clients`, `src/auth`).
- **Layers:**
  - `*.controller.ts`: Handles HTTP requests, validation, and responses.
  - `*.service.ts`: Contains business logic and database interactions.
  - `dto/*.dto.ts`: Zod schemas and TypeScript types for Data Transfer Objects.
  - `models/*.ts`: TypeScript interfaces for database entities.
- **Manual DI:** All services and controllers are instantiated in `src/containers.ts`.

### Coding Style
- **Naming:** Kebab-case for directories, `domain.type.ts` for files.
- **Imports:** Use `@/` alias for `src/` directory.
- **Validation:** Always use Zod schemas from DTOs to validate incoming request data in controllers.
- **Error Handling:** Services should throw meaningful errors; controllers should catch them and return appropriate HTTP status codes and JSON messages.
- **Linting:** Follow ESLint rules (configured in `eslint.config.js`).

### Special Features
- **Dry Run:** The application includes a `dryRun` middleware. If enabled (e.g., via header or logic), it sets `res.locals.dry_run = true`, allowing controllers to simulate operations without persisting changes to the database.
- **Database Schema:** Managed via `db_schema.sql`. Raw SQL queries are preferred over an ORM.

## Key Files
- `src/server.ts`: Entry point of the application.
- `src/app.ts`: Express application setup and middleware configuration.
- `src/containers.ts`: Central location for dependency injection.
- `db_schema.sql`: Database table definitions and relationships.
- `src/config/db.ts`: PostgreSQL pool configuration.
