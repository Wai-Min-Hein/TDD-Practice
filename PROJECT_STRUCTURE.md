# Project Structure

This project is a TypeScript Express API backed by MongoDB and Mongoose. The code is organized by responsibility so that HTTP handling, business logic, database access, and shared infrastructure remain separate.

## Repository Layout

```text
.
├── src/
│   ├── app.ts
│   ├── builders/
│   │   ├── filter.builder.ts
│   │   ├── index.ts
│   │   └── pagination.builder.ts
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── constants/
│   │   └── http.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user-role.controller.ts
│   │   └── user.controller.ts
│   ├── filters/
│   │   ├── index.ts
│   │   ├── user-role.filter.ts
│   │   └── user.filter.ts
│   ├── helpers/
│   │   ├── password.helper.ts
│   │   └── response-message.helper.ts
│   ├── localization/
│   │   ├── en.json
│   │   ├── index.ts
│   │   └── mm.json
│   ├── middlewares/
│   │   ├── async-handler.middleware.ts
│   │   ├── auth.middleware.ts
│   │   ├── controller-async-wrapper.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── localization.middleware.ts
│   │   ├── not-found.middleware.ts
│   │   ├── pagination.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   └── validate-data.middleware.ts
│   ├── models/
│   │   ├── user-role.model.ts
│   │   └── user.model.ts
│   ├── repositories/
│   │   ├── user-role.repository.ts
│   │   └── user.repository.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── index.ts
│   │   ├── user-role.routes.ts
│   │   └── user.routes.ts
│   ├── schema/
│   │   ├── auth.schema.ts
│   │   ├── user-role.schema.ts
│   │   └── user.schema.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user-role.service.ts
│   │   └── user.service.ts
│   └── utilities/
│       ├── errors/
│       │   ├── already-exist-error.ts
│       │   ├── custom-api-error.ts
│       │   ├── forbidden-error.ts
│       │   ├── index.ts
│       │   ├── not-found-error.ts
│       │   └── unauthorized-error.ts
│       ├── get-request-pagination.ts
│       └── wrappers/
│           ├── index.ts
│           └── service-async-wrapper.ts
├── tests/
│   └── health.test.ts
├── index.ts
├── seed.ts
├── package.json
├── tsconfig.json
├── vitest.config.mts
├── Dockerfile
└── docker-compose.yml
```

Generated files in `dist/` are compiled output and should not be edited directly. Environment files such as `.env` contain local configuration; use `.env.example` as the template.

## Source Directories

| Directory | Responsibility |
| --- | --- |
| `config/` | Loads environment variables and establishes the database connection. |
| `constants/` | Shared fixed values, such as HTTP status constants. |
| `controllers/` | Handles request and response objects and delegates work to services. |
| `routes/` | Defines API endpoints, middleware order, validation, and controller bindings. |
| `services/` | Contains application and business logic. |
| `repositories/` | Encapsulates database queries and persistence operations. |
| `models/` | Defines Mongoose schemas and models. |
| `schema/` | Defines request validation schemas, currently using Zod. |
| `middlewares/` | Cross-cutting Express request processing, authentication, pagination, and error handling. |
| `helpers/` | Small reusable functions for tasks such as password handling and response messages. |
| `builders/` | Builds reusable query filters and pagination options. |
| `filters/` | Defines resource-specific filtering rules. |
| `localization/` | Provides translations and request-level language support. |
| `utilities/` | Shared infrastructure, including custom errors, pagination parsing, and async wrappers. |

## Application Entry Points

- `index.ts` is the runtime entry point. It connects to MongoDB and starts the HTTP server.
- `src/app.ts` creates and configures the Express application. It registers security, parsing, localization, rate limiting, routes, and final error handlers.
- `seed.ts` is a standalone database seeding script for initial roles and users.
- `tests/` contains Vitest tests.

## Request Flow

Requests generally move through the application in this order:

```text
HTTP request
  -> global middleware in src/app.ts
  -> route in src/routes/
  -> validation/auth/pagination middleware
  -> controller in src/controllers/
  -> service in src/services/
  -> repository in src/repositories/
  -> model in src/models/
  -> database
```

The result then travels back through the service and controller. Unknown routes are handled by `not-found.middleware.ts`, while errors are normalized by `error.middleware.ts`.

## Adding a Feature

For a new resource, follow the existing resource pattern:

1. Add a Mongoose model in `src/models/`.
2. Add database operations in `src/repositories/`.
3. Add business logic in `src/services/`.
4. Add request validation in `src/schema/`.
5. Add resource-specific filters or query builders when needed.
6. Add HTTP handlers in `src/controllers/`.
7. Add endpoints in `src/routes/` and register the route in `src/routes/index.ts`.
8. Add or update tests in `tests/`.

Keep controllers focused on HTTP concerns. Put business rules in services and keep direct database access inside repositories or model-specific persistence code.

## Common Commands

```bash
pnpm dev       # Start the development server
pnpm build     # Compile TypeScript to dist/
pnpm start     # Run the compiled server
pnpm typecheck # Check types without emitting files
pnpm lint      # Run ESLint
pnpm test      # Run Vitest
pnpm seed      # Seed the database
```
