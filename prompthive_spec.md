# PromptHive — Detailed Product Spec

> Source: PromptHive Project Brief

---

# 1. System Overview

## Core Modules
- Auth System
- Content Engine (Prompts + Skills)
- Discovery Engine (Explore/Search)
- Engagement Layer (Save, Vote, Copy)
- User Workspace (Dashboard)
- Admin Panel

---

# 2. Data Contracts (Strict)

## Content Schema (Mongoose)
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

  score: Number,
  rating: Number,

  createdAt: Date,
  updatedAt: Date
}
```

## Vote Schema
```js
{
  user: ObjectId,
  content: ObjectId,
  voteType: { type: String, enum: ['up', 'down'] }
}
```

## SavedContent Schema
```js
{
  user: ObjectId,
  content: ObjectId,
  order: Number
}
```

---

# 3. Backend API Spec (REST)

## Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

## Content

### Public Discovery
```
GET /api/content
```

Query params:
```
?search=
&type=prompt|skill
&provider=claude|codex
&category=
&tags=
&sort=newest|rating
&page=
&limit=
```

### Detail
```
GET /api/content/:slug
```

### Create
```
POST /api/content
```

### Update
```
PUT /api/content/:id
```

### Delete
```
DELETE /api/content/:id
```

## Save
```
POST   /api/save/:contentId
DELETE /api/save/:contentId
GET    /api/save
PUT    /api/save/reorder
```

## Vote
```
POST /api/vote/:contentId
BODY: { voteType: 'up' | 'down' }
```

## Copy Tracking
```
POST /api/content/:id/copy
```

## Admin
```
GET    /api/admin/content
POST   /api/admin/content
DELETE /api/admin/content/:id
GET    /api/admin/users
```

---

# 4. Business Logic Rules

## Voting Engine
```js
score = upvoteCount - downvoteCount

rating = clamp(
  ((upvoteCount / (upvoteCount + downvoteCount)) * 5),
  0,
  5
)
```

---

# 5. Frontend Architecture

## Folder Structure
```
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
```

---

# 6. MVP Build Order (Critical Path)

## Phase 1 — Core Backend
- auth
- content CRUD
- visibility rules

## Phase 2 — Discovery
- explore endpoint
- filtering + sorting

## Phase 3 — Engagement
- save
- vote
- copy tracking

## Phase 4 — Frontend Core
- explore page
- card component
- detail page

## Phase 5 — Dashboard
- saved content
- drag reorder

## Phase 6 — Creation
- create/edit content

## Phase 7 — Admin
- admin create/manage

---

# Final Summary

PromptHive is a Prompt + Skill discovery and organization platform focused on:

- discovery
- saving
- organizing
- community ranking
