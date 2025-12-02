# Token Generation API - Built with Encore TS

A TypeScript backend service built with Encore.ts for managing access tokens with scopes and expiry times.

## Features

- ✅ Create tokens with custom scopes and expiry times
- ✅ List non-expired tokens for a specific user
- ✅ PostgreSQL database with automatic migrations
- ✅ Type-safe API endpoints with built-in validation
- ✅ Clean architecture with Repository and Service patterns
- ✅ Code formatting with Prettier
- ✅ Linting with ESLint
- ✅ Path aliases for cleaner imports

## Tech Stack

- **Framework**: Encore.ts (TypeScript backend framework)
- **Database**: PostgreSQL (via Encore's SQLDatabase)
- **Validation**: Built-in Encore validation with TypeScript types
- **Code Quality**: ESLint + Prettier
- **Testing**: Vitest

## Prerequisites

- **Docker**: Required for local database
- **Node.js**: v20+
- **Encore CLI**: Install via:
  - macOS: `brew install encoredev/tap/encore`
  - Linux: `curl -L https://encore.dev/install.sh | bash`
  - Windows: `iwr https://encore.dev/install.ps1 | iex`

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Application

```bash
encore run
```

This will:
- Start the Encore development server
- Create and migrate the PostgreSQL database (Docker required)
- Make the API available at `http://localhost:4000`
- Open the development dashboard at `http://localhost:9400`

## API Endpoints

### POST /api/tokens

Create a new access token for a user.

**Request Body:**
```json
{
  "userId": "123",
  "scopes": ["read", "write"],
  "expiresInMinutes": 60
}
```

**Validation:**
- `userId`: Required, non-empty string
- `scopes`: Required, non-empty array of strings (valid values: "read", "write", "delete")
- `expiresInMinutes`: Required, positive integer

**Response:**
```json
{
  "id": "token_abc123",
  "userId": "123",
  "scopes": ["read", "write"],
  "createdAt": "2025-01-01T10:00:00.000Z",
  "expiresAt": "2025-01-01T11:00:00.000Z",
  "token": "9f0c2d6a3b..."
}
```

### GET /api/tokens?userId=123

Retrieve all non-expired tokens for a specific user.

**Query Parameters:**
- `userId`: Required string

**Response:**
```json
{
  "tokens": [
    {
      "id": "token_abc123",
      "userId": "123",
      "scopes": ["read", "write"],
      "createdAt": "2025-01-01T10:00:00.000Z",
      "expiresAt": "2025-01-01T11:00:00.000Z",
      "token": "9f0c2d6a3b..."
    }
  ]
}
```

**Note:** Only non-expired tokens are returned (where `expiresAt > current time`).

## Project Structure

```
token-gen/
├── src/
│   ├── api/             # API endpoints
│   │   └── tokens.ts    # Token endpoints (POST, GET)
│   ├── core/            # Core utilities
│   │   └── errors.ts    # Custom error classes
│   ├── db/              # Database setup
│   │   ├── index.ts     # Database instance
│   │   └── migrations/  # SQL migrations
│   ├── repositories/    # Data access layer
│   │   ├── interfaces/  # Repository interfaces
│   │   └── TokenRepository.ts
│   └── token/           # Business logic
│       └── token.service.ts
├── types/               # Centralized type definitions
│   └── index.ts
├── encore.service.ts    # Service definition
└── package.json
```

## Architecture

The project follows clean architecture principles:

1. **API Layer** (`src/api/`): Handles HTTP requests/responses
2. **Service Layer** (`src/token/`): Contains business logic and validation
3. **Repository Layer** (`src/repositories/`): Manages database operations
4. **Types** (`types/`): Centralized type definitions

### Key Design Decisions

- **Repository Pattern**: Separates data access from business logic
- **Service Layer**: Encapsulates business rules and validation
- **Type Safety**: All types defined in centralized `types/` folder
- **Error Handling**: Custom error classes that map to Encore's APIError
- **Database Constraints**: Enforces valid scopes at the database level

## Development

### Code Formatting

```bash
# Format code
npm run format

# Check formatting
npm run format:check
```

### Linting

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

### Testing

```bash
npm test
```

## Database Schema

```sql
CREATE TABLE tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    scopes TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    token TEXT NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_tokens_user_id ON tokens (user_id);
CREATE INDEX idx_tokens_expires_at ON tokens (expires_at);

-- Constraint to ensure valid scopes
ALTER TABLE tokens ADD CONSTRAINT check_scopes CHECK (
    array_length(scopes, 1) > 0 
    AND scopes <@ ARRAY['read', 'write', 'delete']::TEXT[]
);
```

## Assumptions & Simplifications

1. **User Management**: No user table exists; `userId` is just a string identifier
2. **Scope Validation**: Scopes are validated to be one of: "read", "write", "delete"
3. **Token Generation**: Uses cryptographically secure random bytes (32 bytes, hex-encoded)
4. **Authentication**: Endpoints are public (`expose: true`) for demo purposes
5. **Response Format**: GET endpoint returns `{ tokens: [...] }` due to Encore's requirement for named interface types

## Deployment

### Local Development
```bash
encore run
```

### Docker Build
```bash
encore build docker token-gen:latest
```

### Cloud Deployment
```bash
git push encore  # Deploys to Encore Cloud
```

## Configuration

- **Database**: Configured via `src/db/index.ts`
- **TypeScript**: Path aliases configured in `tsconfig.json`
- **ESLint**: Configured in `.eslintrc.json`
- **Prettier**: Configured in `.prettierrc.json`

## License

MPL-2.0
