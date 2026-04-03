# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PromptHive is a community-driven platform for sharing, discovering, and organizing AI prompts and skills. Users can browse public content, save/vote/copy prompts, create their own, and manage a personal dashboard. Admins manage all content and users.

The canonical product rules live in `prompthive_spec.md` (data models, API contracts, permissions, business logic). The implementation sequence lives in `prompthive_plan.md` (9-phase build). The project brief in `prompthive_project_brief.md` covers user flows and pages.

## Commands

```bash
# Run both client and server concurrently
npm run dev

# Run server only (nodemon, auto-reload)
npm run server

# Run client only (Vite dev server)
npm run client

# Production server start
npm start

# Client build
npm run build --prefix client

# Client lint
npm run lint --prefix client
```

Tests are not yet configured. When added: Vitest for frontend (`client/`), Jest for backend (`server/`).

## Architecture

**Monorepo with root orchestration:**
- `package.json` — root scripts using concurrently; server deps (express, mongoose, cors, dotenv)
- `client/` — Vite + React 19, Tailwind CSS v4 (via `@tailwindcss/vite` plugin), React Router v7
- `server/` — Express app split into `app.js` (routes/middleware) and `server.js` (listener on PORT 5000)

**Server entry point:** `server/server.js` requires `server/app.js`. The app module exports the Express instance for testability with Supertest.

**Deployment:** Backend is deployed on Heroku. Frontend deployment TBD. The deployed server URL is tracked in `notes.txt` (gitignored).

## Key Spec Decisions

These are non-obvious rules from the spec that affect implementation:

- **Content model is unified** — prompts and skills share one `Content` model, distinguished by `type` field. Skills also have `skillProvider` (claude/codex).
- **Metadata is centralized** — categories, tags, use cases, content types, etc. are shared constants that drive backend validation, frontend forms, and filter UI. Served via `GET /api/metadata`.
- **Soft delete only** — `isDeleted` flag, never hard delete. All public queries filter `isDeleted: false`.
- **Vote toggle semantics** — same vote again removes it, opposite vote switches direction. One Vote document per user/content pair (unique index).
- **Rating formula** — `rating = (upvoteCount / totalVotes) * 5`, clamped 0–5. Zero votes = rating 0.
- **Auth uses httpOnly cookies** with JWT, not Authorization headers.
- **Private content returns 404** (not 403) to unauthorized users.
- **Save reorder** uses bulk update with explicit `order` values, not positional insert.
- **`ownerType`** on Content distinguishes admin-created vs user-created content.

## API Response Contract

All endpoints follow this shape:

```js
// Success
{ success: true, data: {}, meta: {} }

// Error
{ success: false, error: { message: "", code: "", details: [] } }

// Paginated
{ success: true, data: [], meta: { page, limit, total, pages } }
```
