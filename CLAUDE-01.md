# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

PromptHive is a platform for sharing, discovering, and saving AI prompts and skills. Users can browse public content, vote, save to a personal dashboard, and create their own prompts/skills. Admins can manage all content and users.

## Commands

### Development

```bash
npm run dev           # Start both client and server concurrently
npm run dev:server    # Server only (nodemon)
npm run dev:client    # Client only (Vite)
```

### Testing

```bash
npm test                    # Run all tests (server then client)
npm run test:server         # Jest backend tests only
npm run test:client         # Vitest frontend tests only

# Run a single backend test file
npx jest server/__tests__/auth.test.js --forceExit

# Run a single frontend test file
cd client && npx vitest run test/path/to/file.test.jsx
```

### Build & Lint

```bash
npm run start               # Production server
cd client && npm run build  # Vite production build
cd client && npm run lint    # ESLint
```

## Architecture

### Request Flow

```
Client (Vite/React) → services/ → api.js (Axios, withCredentials) → Express → controllers → MongoDB
```

Auth uses **httpOnly cookies** (JWT). `withCredentials: true` is set on the Axios client. The shared API client lives at `client/src/services/api.js` — all service files import from there.

### Frontend State Split

- **Redux** (`client/src/app/store.js`) — auth state only (`features/auth/authSlice.js`). Thunks: `restoreSession`, `loginUser`, `registerUser`, `logoutUser`.
- **TanStack Query** — all server data (content, metadata, saved items, votes). Queries in `hooks/queries/`, mutations in `hooks/mutations/`.

`restoreSession` is dispatched on app load from `app/providers.jsx` to hydrate auth from the existing cookie.

### Backend Structure

- `server/server.js` — entry point: loads env, connects DB, starts Express
- `server/app.js` — Express setup: routes, middleware, error handler
- `server/config/env.js` — env validation module; exports `validateEnv()` (call once at startup) and `getEnv()` (call anywhere after). Fails fast on missing `MONGO_URI` or `JWT_SECRET`.
- `server/middleware/auth.js` — `authenticate` (required), `authorize(...roles)`, `optionalAuth` (attaches user if token present, never blocks)
- `server/middleware/errorHandler.js` — centralized error handler; handles Mongoose errors, JWT errors, and `AppError` instances
- `server/utils/AppError.js` — custom error class with `statusCode` and `code`
- `server/utils/apiResponse.js` / `apiError.js` — standard response shape helpers

### Shared Module

`shared/` contains `constants.js` and `metadata.js` (content types, categories, etc.) used by both frontend and backend. Import from `shared/metadata.js` or `shared/constants.js` — do not duplicate these values.

### API Routes

| Prefix | File |
|---|---|
| `/api/auth` | `server/routes/auth.js` |
| `/api/metadata` | `server/routes/metadata.js` |
| `/api/content` | `server/routes/content.js` |
| `/api/vote` | `server/routes/vote.js` |
| `/api/save` | `server/routes/save.js` |
| `/api/admin` | `server/routes/admin.js` |
| `POST /api/content/:id/copy` | `server/controllers/copyController.js` (inline) |

### Content Rules

- **Soft delete only** — never hard-delete content in production
- Private content is only visible to owner or admin; unauthorized lookups return 404
- Votes: same vote removes, opposite vote switches (toggle/switch logic)
- Saves: no duplicates (enforced at DB + service level)
- Rating is derived from votes — never stored directly, display-only

### Environment Variables

Root `.env` for backend. `client/.env` (or `client/.env.development` / `.env.production`) for frontend.

Required backend vars: `MONGO_URI`, `JWT_SECRET`  
Required frontend var: `VITE_API_URL`

See `.env.example` for the full list.

### Test Setup

Backend tests use a global setup/teardown (`server/__tests__/globalSetup.js`, `globalTeardown.js`) that manages the test DB connection. Individual test files use helpers from `server/__tests__/helpers.js`.

Frontend tests live under `client/test/` and use Vitest + React Testing Library.
