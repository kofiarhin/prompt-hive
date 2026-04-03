# PromptHive — Unified Production Spec (v1)

## 1. System Modules
- Auth System
- Content Engine (Prompt + Skill)
- Discovery Engine (Explore/Search)
- Engagement Layer (Save, Vote, Copy)
- User Workspace (Dashboard)
- Admin Panel
- Metadata System (central source of truth)

---

## 2. Root Architecture

```bash
/package.json
/server
/client
```

### Backend
```bash
server/
  config/
  controllers/
  middleware/
  models/
  routes/
  utils/
  validators/
```

### Frontend
```bash
client/
  src/
    app/
    features/
    services/
    hooks/
      queries/
      mutations/
    components/
    pages/
    routes/
    lib/
    utils/
  test/
    setup/
    mocks/
    fixtures/
    utils/
    components/
    pages/
    routes/
    hooks/
    integration/
```

---

## 3. Core Data Models (Final)

### User
```js
{
  name: String,
  username: { type: String, unique: true, index: true },
  email: { type: String, unique: true, index: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: String,
  bio: String,
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  createdAt: Date,
  updatedAt: Date
}
```

### Content
```js
{
  title: String,
  slug: { type: String, unique: true, index: true },
  description: String,
  type: { type: String, enum: ['prompt', 'skill'] },
  skillProvider: { type: String, enum: ['claude', 'codex', null], default: null },
  contentText: String,
  category: String,
  tags: [String],
  useCase: String,
  visibility: { type: String, enum: ['public', 'private'], default: 'private', index: true },
  ownerType: { type: String, enum: ['admin', 'user'] },
  createdBy: { type: ObjectId, ref: 'User', index: true },
  copyCount: { type: Number, default: 0 },
  saveCount: { type: Number, default: 0 },
  upvoteCount: { type: Number, default: 0 },
  downvoteCount: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false, index: true },
  featuredOrder: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false, index: true },
  createdAt: Date,
  updatedAt: Date
}
```

Recommended indexes:
```js
{ visibility: 1, isDeleted: 1, createdAt: -1 }
{ visibility: 1, isDeleted: 1, type: 1, skillProvider: 1 }
{ visibility: 1, isDeleted: 1, category: 1, useCase: 1 }
{ title: 'text', description: 'text', contentText: 'text', tags: 'text' }
```

### Vote
```js
{
  user: { type: ObjectId, ref: 'User' },
  content: { type: ObjectId, ref: 'Content' },
  voteType: { type: String, enum: ['up', 'down'] },
  createdAt: Date,
  updatedAt: Date
}
```

Unique index:
```js
{ user: 1, content: 1 }
```

### SavedContent
```js
{
  user: { type: ObjectId, ref: 'User' },
  content: { type: ObjectId, ref: 'Content' },
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

Unique index:
```js
{ user: 1, content: 1 }
```

---

## 4. Central Metadata System

Shared metadata objects must support:
```js
{
  value: 'debugging',
  label: 'Debugging',
  description: 'Prompts and skills for identifying and fixing issues.',
  useCases: ['code-review', 'bug-fixing']
}
```

Recommended shared exports:
```js
export const CONTENT_TYPES = [...]
export const SKILL_PROVIDERS = [...]
export const CATEGORIES = [...]
export const TAGS = [...]
export const USE_CASES = [...]
export const VISIBILITY_OPTIONS = [...]
export const ROLES = [...]
```

Recommended endpoint:
```bash
GET /api/metadata
```

The metadata source of truth must drive:
- backend validation
- frontend dropdowns
- filter labels
- badges
- helper copy

---

## 5. API Response Contract

### Success
```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

### Error
```json
{
  "success": false,
  "error": {
    "message": "",
    "code": "",
    "details": []
  }
}
```

---

## 6. Auth API

```bash
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

Rules:
- JWT in httpOnly cookie
- `/api/auth/me` restores session on refresh
- suspended users cannot authenticate into protected flows

---

## 7. Content API

### Explore
```bash
GET /api/content
```

Query:
```bash
search=
type=prompt|skill
provider=claude|codex
category=
tags=tag1,tag2
useCase=
sort=newest|rating|upvotes
page=
limit=
```

Explore rules:
- only `visibility=public`
- only `isDeleted=false`
- pagination required
- consistent meta required

### Detail
```bash
GET /api/content/:slug
```

Detail rules:
- public content is readable by anyone
- private content is readable only by owner or admin
- if requester is not allowed to view private content, return 404
- deleted content is not publicly readable

### Create
```bash
POST /api/content
```

### Update
```bash
PUT /api/content/:id
```

### Delete
```bash
DELETE /api/content/:id
```

Mutation rules:
- users can create/update/delete only their own content
- admins can create/update/delete any content
- delete is soft delete in production: set `isDeleted=true`
- when visibility changes `public -> private`, remove from public discovery immediately
- saving content does not grant edit rights

---

## 8. Save API

```bash
POST   /api/save/:contentId
DELETE /api/save/:contentId
GET    /api/save?page=&limit=
PUT    /api/save/reorder
```

Rules:
- auth required
- no duplicate saves
- cannot save deleted content
- cannot save inaccessible private content
- saved list should be sorted by `order asc`

Reorder body:
```json
{
  "items": [
    { "contentId": "abc", "order": 0 },
    { "contentId": "def", "order": 1 }
  ]
}
```

Reorder rules:
- user can reorder only their own saved items
- operation should use bulk update semantics
- response returns normalized saved list

---

## 9. Vote API

```bash
POST /api/vote/:contentId
```

Body:
```json
{
  "voteType": "up"
}
```

Rules:
- auth required
- only public, non-deleted content can be voted on
- no duplicate vote documents per user/content pair
- same vote again removes the vote
- opposite vote switches direction
- response returns updated vote state and aggregates

Recommended response payload:
```json
{
  "success": true,
  "data": {
    "currentUserVote": "up",
    "upvoteCount": 10,
    "downvoteCount": 3,
    "score": 7,
    "rating": 3.85
  }
}
```

---

## 10. Copy Tracking API

```bash
POST /api/content/:id/copy
```

Rules:
- public content copy tracking can be incremented by anyone
- private content copy tracking allowed only for owner or admin
- deleted content cannot be copied
- endpoint should fail safely on invalid content ids

---

## 11. Admin API

```bash
GET    /api/admin/content?page=&limit=
POST   /api/admin/content
PUT    /api/admin/content/:id
DELETE /api/admin/content/:id
GET    /api/admin/users?page=&limit=
PATCH  /api/admin/users/:id/role
PATCH  /api/admin/users/:id/status
```

Rules:
- admin only
- admin-created content defaults to public
- admins can manage all content
- admins can list users
- admins can change role
- admins can suspend/reactivate users

---

## 12. Business Logic

```js
const totalVotes = upvoteCount + downvoteCount

score = upvoteCount - downvoteCount

rating = totalVotes === 0
  ? 0
  : Math.min(5, Math.max(0, (upvoteCount / totalVotes) * 5))
```

MVP sort behavior:
```js
newest => createdAt desc
rating => rating desc, upvoteCount desc, createdAt desc
upvotes => upvoteCount desc, createdAt desc
```

Homepage logic:
- Featured = `isFeatured=true`, then `featuredOrder asc`
- Trending is optional beyond MVP unless formula is finalized

---

## 13. Authorization Rules

- authentication and authorization must be separate concerns
- users can manage only their own content
- admins can manage all content
- private content is owner/admin only
- voting requires authentication
- save requires authentication
- admin routes require admin role
- frontend route guards are convenience only; server is source of truth

---

## 14. Validation Contracts

Required validators:
- env validation at startup
- auth register schema
- auth login schema
- content create schema
- content update schema
- content query schema
- vote schema
- save reorder schema
- admin role/status update schema
- route param validation for ids/slugs

Validation rules:
- never trust client input
- backend validates body, params, and query
- frontend and backend validation should stay aligned where practical

---

## 15. Pagination Contract

Paginated endpoints return:
```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 200,
    "pages": 10
  }
}
```

Endpoints that should paginate:
- `GET /api/content`
- `GET /api/save`
- `GET /api/admin/content`
- `GET /api/admin/users`

---

## 16. Deletion and Reference Handling

Deletion behavior:
- content deletion is soft delete in production
- deleted content remains in database for integrity and audit support
- public queries always filter `isDeleted=false`

Reference handling:
- vote/save/copy mutations reject deleted content
- saved dashboard should either hide deleted content or show a safe unavailable state with remove action
- missing references must not crash list endpoints

---

## 17. Production Requirements

### Security
- httpOnly cookies
- secure cookie config by environment
- input validation
- centralized error handling
- rate limiting
- ownership and role checks on server

### Reliability
- idempotent delete/save semantics where practical
- safe reorder behavior
- error-safe copy tracking
- no unhandled promise rejections

### Performance
- pagination
- indexes
- avoid N+1 query patterns
- lean list responses where appropriate

### Testing
- Jest for backend
- Vitest for frontend
- edge cases, permissions, invalid input, empty states, and async failure cases required

---

## 18. Build Path

1. Metadata + validation contracts
2. Auth
3. Content core
4. Discovery
5. Engagement
6. Frontend core
7. Dashboard reorder
8. Creation flows
9. Admin
10. Production hardening

---

## Final
Production-ready unified spec for PromptHive.
