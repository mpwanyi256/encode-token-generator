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

## Quick Start

**⚠️ Important:** You must install Encore CLI first. Encore handles all infrastructure including Docker and PostgreSQL automatically.

```bash
# 1. Install Encore CLI (if not already installed)
# macOS:
brew install encoredev/tap/encore

# Linux:
curl -L https://encore.dev/install.sh | bash

# Windows:
iwr https://encore.dev/install.ps1 | iex

# 2. Install dependencies
npm install

# 3. Run the service (Encore handles Docker and database automatically)
encore run

# 4. Run tests
encore test
```

**The service will be available at:**
- **API:** http://localhost:4000
- **Dashboard:** http://localhost:9400

**What Encore does automatically:**
- ✅ Starts Docker containers for PostgreSQL
- ✅ Creates and migrates the database
- ✅ Provides a beautiful development dashboard
- ✅ Handles hot reload during development
- ✅ No manual Docker or database setup needed!

## Prerequisites

Before you can run this service, you need to install the following:

1. **Encore CLI** - Required to run Encore applications
2. **Docker** - Required for local database (must be running)
3. **Node.js** - v20+ required to run Encore.ts apps

## Installation

### Step 1: Install Encore CLI

**You must install the Encore CLI first.** This is what provisions your local development environment and runs the Local Development Dashboard.

Follow the official Encore installation guide: **[https://encore.dev/docs/ts/install](https://encore.dev/docs/ts/install)**

**Quick install commands:**

**macOS:**
```bash
brew install encoredev/tap/encore
```

**Linux:**
```bash
curl -L https://encore.dev/install.sh | bash
```

**Windows (PowerShell):**
```powershell
iwr https://encore.dev/install.ps1 | iex
```

**Verify installation:**
```bash
encore version
```

You should see output like: `encore version v1.28.0`

**Update Encore (if needed):**
```bash
encore version update
```

> 📚 **For detailed installation instructions, troubleshooting, and build-from-source options, see the [official Encore installation documentation](https://encore.dev/docs/ts/install)**

### Step 2: Install Docker

Docker is required for Encore to set up local databases. Make sure Docker Desktop (or Docker Engine) is installed and running.

- **macOS/Windows**: Download [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: Install Docker Engine via your distribution's package manager

Verify Docker is running:
```bash
docker --version
docker ps
```

### Step 3: Install Node.js

Node.js v20 or higher is required to run Encore.ts applications.

- Download from [nodejs.org](https://nodejs.org/) or use a version manager like `nvm`

Verify Node.js installation:
```bash
node --version  # Should be v20.x or higher
npm --version
```

## Getting Started

### 1. Install Prerequisites

**Make sure you have completed the [Installation](#installation) steps above:**
- ✅ Encore CLI installed and verified
- ✅ Docker installed and running
- ✅ Node.js v20+ installed

If you haven't installed Encore CLI yet, follow the [Installation](#installation) section above or visit the [official Encore installation guide](https://encore.dev/docs/ts/install).

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API Key (Optional)

The API uses an API key for authentication. For development, the default key is `dev-api-key-12345`.

For production, set a secure API key using Encore secrets:
```bash
# Generate a secure key
openssl rand -hex 32

# Set the secret (for production deployments)
encore secret set API_KEY
```

### 4. Run the Application

**Start the Encore development server:**
```bash
encore run
```

Encore automatically:
- ✅ Starts the development server on port 4000
- ✅ Creates PostgreSQL database in Docker
- ✅ Runs all migrations
- ✅ Opens the development dashboard at http://localhost:9400
- ✅ Enables hot reload for code changes

**No manual database setup required!** Encore handles everything.

### 5. Access the Development Dashboard

Once `encore run` is executing, open your browser to:
- **Dashboard:** http://localhost:9400
- **API Base URL:** http://localhost:4000

The dashboard provides:
- API documentation and testing interface
- Request traces and logs
- Database management
- Service architecture visualization

### 6. Running Tests

**Run all tests:**
```bash
encore test
```

Or use npm directly:
```bash
npm test
```

**Run tests in watch mode:**
```bash
npm test -- --watch
```

**Run tests with coverage:**
```bash
npm test -- --coverage
```

## API Endpoints

All endpoints require the `X-API-Key` header for authentication.

**Default API Key (development):** `dev-api-key-12345`

### POST /api/tokens

Create a new access token for a user.

**Headers:**
```
X-API-Key: dev-api-key-12345
Content-Type: application/json
```

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

**Example using cURL:**
```bash
curl -X POST http://localhost:4000/api/tokens \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-api-key-12345" \
  -d '{
    "userId": "123",
    "scopes": ["read", "write"],
    "expiresInMinutes": 60
  }'
```

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

**Headers:**
```
X-API-Key: dev-api-key-12345
```

**Query Parameters:**
- `userId`: Required string

**Example using cURL:**
```bash
curl -X GET "http://localhost:4000/api/tokens?userId=123" \
  -H "X-API-Key: dev-api-key-12345"
```

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

### Testing with Encore Dashboard

The easiest way to test the API is through the Encore Development Dashboard:

1. Start the service: `encore run`
2. Open http://localhost:9400
3. Navigate to the "Service Catalog"
4. Select the `token` service
5. Click on an endpoint to test it interactively
6. The dashboard will automatically include the required headers

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

### Running the Service

**Start development server:**
```bash
encore run
```

**Stop the server:**
Press `Ctrl+C` in the terminal where `encore run` is executing.

**View logs:**
Logs are automatically displayed in the terminal and available in the dashboard at http://localhost:9400

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

**Run all tests:**
```bash
encore test
# or
npm test
```

**Run tests in watch mode:**
```bash
npm test -- --watch
```

**Run specific test file:**
```bash
npm test -- src/token/token.service.test.ts
```

**Run tests with coverage:**
```bash
npm test -- --coverage
```

### Encore CLI Commands

**View service architecture:**
```bash
encore app graph
```

**Database commands:**
```bash
# Open database shell
encore db shell token_gen

# Get database connection string
encore db conn-uri token_gen

# Set up database proxy
encore db proxy token_gen
```

**Generate TypeScript clients:**
```bash
encore gen client typescript
```

**View API documentation:**
```bash
encore docs
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

## Design Decisions & Notes

1. **User Management**: No user table exists; `userId` is just a string identifier
2. **Scope Validation**: Scopes are validated at multiple levels:
   - TypeScript type: `TokenScopes = "read" | "write" | "delete"`
   - Service layer validation
   - Database constraint
3. **Token Generation**: Uses Node.js `crypto.randomBytes` (32 bytes, hex-encoded)
4. **API Key Middleware**: Protects endpoints with `X-API-Key` header validation
5. **Response Format**: GET endpoint returns `{ tokens: [...] }` (Encore requirement for named interface types)
6. **Infrastructure**: Encore manages all infrastructure (Docker, PostgreSQL) automatically


## Deployment

### Local Development

**Run locally with Encore:**
```bash
encore run
```

Encore automatically:
- Starts development server on port 4000
- Creates PostgreSQL database (via Docker)
- Opens development dashboard on port 9400
- Applies all migrations

### Production Deployment

**Option 1: Encore Cloud (Recommended)**

```bash
# Link your app (first time only)
encore app create

# Deploy
git push encore
```

Encore Cloud:
- Builds and deploys automatically
- Provisions infrastructure (PostgreSQL, etc.)
- Provides preview environments
- Includes monitoring and observability
- Free tier available

**Option 2: Docker Build**

```bash
# Build Docker image
encore build docker token-gen:latest

# Run container
docker run -p 4000:4000 \
  -e API_KEY=your-production-api-key \
  token-gen:latest
```

### Encore Cloud Deployment

**Prerequisites:**
1. Create an Encore Cloud account (free tier available)
2. Link your app: `encore app create` (if not already linked)

**Deploy to Encore Cloud:**
```bash
# Commit your changes
git add .
git commit -m "Deploy to Encore Cloud"

# Push to deploy
git push encore
```

Encore will:
- Build your application
- Run tests automatically
- Provision infrastructure (database, etc.)
- Deploy to cloud
- Provide a production URL

**View deployment status:**
Check the Encore Cloud dashboard or the URL provided after deployment.

### Self-Hosting with Docker

**Build production Docker image:**
```bash
encore build docker token-gen:v1.0.0
```

**Run the container:**
```bash
docker run -p 4000:4000 \
  -e API_KEY=your-production-api-key \
  token-gen:v1.0.0
```

**With external database:**

Create `infra-config.json`:
```json
{
  "$schema": "https://encore.dev/schemas/infra.schema.json",
  "sql_servers": [
    {
      "host": "your-db-host:5432",
      "databases": {
        "token_gen": {
          "username": "db-user",
          "password": {"$env": "DB_PASSWORD"}
        }
      }
    }
  ]
}
```

Set environment variables:
- `API_KEY`: Production API key (generate: `openssl rand -hex 32`)
- `DB_PASSWORD`: Database password

## Configuration

- **Database**: Configured via `src/db/index.ts`
- **TypeScript**: Path aliases configured in `tsconfig.json`
- **ESLint**: Configured in `.eslintrc.json`
- **Prettier**: Configured in `.prettierrc.json`

## License

MPL-2.0
