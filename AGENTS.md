# AGENTS.md instructions for /workspace/prompt-hive

## Stack defaults
- Assume MERN stack: React (latest Vite), Node.js, Express, MongoDB.
- Default styling: Tailwind CSS (use SCSS only if explicitly requested).

## Response style
- Be concise, practical, and execution-focused.
- No fluff or unnecessary explanations.

## Code rules
- Always provide copy-paste ready code.
- When fixing code, return full updated file(s), not partial snippets.
- Keep `package.json` at project root by default.

## Architecture
- Keep API logic out of React components.
- Use Redux Toolkit for global client state only.
- Use TanStack Query for server state.

## Testing (TDD-first)
- Frontend: Vitest.
- Backend: Jest.

## Environment
- Use `.env` for all secrets.
- Never hard-code credentials.

## General
- Prefer clean, production-ready patterns.
- Follow consistent structure and naming.
