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

## 2. Core Data Models (Final)

### User
```js
{
  name: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: String,
  bio: String,
  status: { type: String, enum: ['active', 'suspended'], default: 'active' }
}
```

### Content
```js
{
  title: String,
  slug: { type: String, unique: true },
  description: String,
  type: { type: String, enum: ['prompt', 'skill'] },
  skillProvider: { type: String, enum: ['claude', 'codex', null] },
  contentText: String,
  category: String,
  tags: [String],
  useCase: String,
  visibility: { type: String, enum: ['public', 'private'], default: 'private' },
  ownerType: { type: String, enum: ['admin', 'user'] },
  createdBy: ObjectId,
  copyCount: { type: Number, default: 0 },
  saveCount: { type: Number, default: 0 },
  upvoteCount: { type: Number, default: 0 },
  downvoteCount: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  featuredOrder: Number,
  isDeleted: { type: Boolean, default: false },
  createdAt: Date,
  updatedAt: Date
}
```

### Vote
```js
{
  user: ObjectId,
  content: ObjectId,
  voteType: { type: String, enum: ['up', 'down'] }
}
```

Unique Index:
```js
{ user: 1, content: 1 }
```

### SavedContent
```js
{
  user: ObjectId,
  content: ObjectId,
  order: Number
}
```

Unique Index:
```js
{ user: 1, content: 1 }
```

---

## 3. Central Metadata System

```js
export const CONTENT_TYPES = [...]
export const SKILL_PROVIDERS = [...]
export const CATEGORIES = [...]
export const TAGS = [...]
export const USE_CASES = [...]
```

Optional:
```
GET /api/metadata
```

---

## 4. API Spec

### Auth
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Content

#### Explore
```
GET /api/content
```

Query:
```
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

#### Detail
```
GET /api/content/:slug
```

#### Create
```
POST /api/content
```

#### Update
```
PUT /api/content/:id
```

#### Delete
```
DELETE /api/content/:id
```

### Save
```
POST   /api/save/:contentId
DELETE /api/save/:contentId
GET    /api/save
PUT    /api/save/reorder
```

### Vote
```
POST /api/vote/:contentId
BODY: { voteType: 'up' | 'down' }
```

### Copy Tracking
```
POST /api/content/:id/copy
```

### Admin
```
GET    /api/admin/content
POST   /api/admin/content
PUT    /api/admin/content/:id
DELETE /api/admin/content/:id
GET    /api/admin/users
PATCH  /api/admin/users/:id/role
PATCH  /api/admin/users/:id/status
```

---

## 5. Business Logic

```js
const totalVotes = upvoteCount + downvoteCount

score = upvoteCount - downvoteCount

rating = totalVotes === 0
  ? 0
  : Math.min(5, Math.max(0, (upvoteCount / totalVotes) * 5))
```

---

## 6. Authorization Rules

- Users can manage only their own content
- Admins can manage all content
- Private content is owner-only
- Voting requires authentication

---

## 7. Homepage Logic

- Featured → isFeatured + featuredOrder
- Trending → score + recency boost

---

## 8. Response Contract

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
    "code": ""
  }
}
```

---

## 9. Pagination

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 200,
    "pages": 10
  }
}
```

---

## 10. Architecture

### Backend
```
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
```
src/
  app/
  features/
  services/
  hooks/
  components/
  pages/
  routes/
  lib/
  utils/
```

---

## 11. Critical Rules

- No duplicate votes
- No duplicate saves
- Private content must not leak
- Soft delete enabled
- API logic outside components

---

## 12. Production Requirements

### Security
- httpOnly cookies
- rate limiting
- validation

### Performance
- pagination
- indexing

### Reliability
- idempotent operations
- safe reorder
- error-safe tracking

---

## 13. Build Path

1. Metadata + Auth
2. Content Core
3. Discovery
4. Engagement
5. Frontend Core
6. Dashboard
7. Creation
8. Admin
9. Production Hardening

---

## Final

Production-ready unified spec for PromptHive.
