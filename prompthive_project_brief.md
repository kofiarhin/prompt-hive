# PromptHive — Full Project Brief

## Overview
**PromptHive** is a web platform where users can discover, view, copy, save, rate, and organize **AI prompts** and **AI skills**.

The platform supports two main content types:

- **Prompts** — plain copy/paste prompt text
- **Skills** — structured reusable AI workflows, including:
  - Claude skills
  - Codex skills

PromptHive combines:
- a **public discovery layer**
- a **personal saved workspace**
- a **user-generated content system**
- a **community-ranked catalog**
- an **admin-managed seed content layer**

This version uses a simple visibility model:
- **public**
- **private**

There is **no approval workflow** in this version.  
Admin-created content is **public by default**.

---

# 1. Product Vision
PromptHive should let users:

- search prompts and skills
- browse cards in a clean public catalog
- click any card to open a full detail page
- copy content quickly
- save content to a personal dashboard
- drag and reorder saved items
- create their own prompts and skills
- publish content as public or private
- upvote or downvote public content
- see star-based rating display on cards
- discover the best content through community ranking

Admins should be able to:

- create public platform content
- seed the platform with high-quality prompts and skills
- manage content
- manage users
- shape discovery and quality over time

---

# 2. MVP Goal
The MVP should prove this core loop:

1. user discovers a useful prompt or skill
2. user opens the detail page
3. user copies it
4. user saves it
5. user returns to their dashboard
6. user organizes saved items
7. user creates and publishes their own content
8. community voting improves ranking

That is the smallest useful version of PromptHive.

---

# 3. Target Users

## Primary users
- developers
- content creators
- marketers
- founders
- students
- researchers
- AI power users

## Secondary users
- people building reusable AI workflows
- users sharing Claude or Codex skills
- users curating personal AI toolkits

---

# 4. Core Content Types

## Prompt
A plain reusable text prompt meant for direct use in an AI tool.

### Examples
- React debugging prompt
- SEO keyword prompt
- blog writing prompt
- YouTube script prompt

## Skill
A structured reusable workflow or instruction block for AI-powered work.

### Skill providers
- Claude
- Codex

### Examples
- Claude code review skill
- Codex refactor skill
- Claude research workflow
- Codex bug triage skill

---

# 5. Core Product Features

## Public features
- homepage
- unified explore page
- searchable public content catalog
- card-based browsing
- star rating display on cards
- full content detail pages
- public voting visibility
- public copy access

## Logged-in user features
- register/login/logout
- save content
- draggable saved dashboard
- create prompts and skills
- edit owned content
- public/private publishing choice
- upvote/downvote public content

## Admin features
- create public content
- manage all content
- manage users
- seed platform inventory

---

# 6. Product Rules

## Visibility
Content can only be:
- `public`
- `private`

## Public content
Public content:
- appears in explore/discovery
- can be viewed by everyone
- can be copied by anyone
- can be saved by logged-in users
- can be upvoted/downvoted by logged-in users

## Private content
Private content:
- is visible only to its owner
- does not appear in public discovery
- cannot be publicly voted on
- can only be used inside the owner’s account

## Admin content
Admin-created content:
- is public by default
- appears in discovery immediately

---

# 7. Main User Flows

## Visitor flow
1. visitor lands on homepage
2. searches or browses public content
3. sees cards with rating stars
4. clicks a card
5. opens detail page
6. reads full prompt/skill
7. copies content
8. signs up if they want to save or vote

## Logged-in user flow
1. user logs in
2. browses public cards
3. clicks a card
4. opens detail page
5. saves it
6. upvotes or downvotes it
7. later opens dashboard
8. sees saved items as cards
9. drags cards into a preferred order
10. creates their own prompt or skill
11. chooses public or private
12. if public, it appears immediately in public explore

## Admin flow
1. admin logs in
2. creates public prompts or skills
3. content appears immediately in public catalog
4. admin continues seeding and managing content

---

# 8. Pages Needed

## Public pages
- `/` — homepage
- `/explore` — unified public content discovery
- `/content/:slug` — unified content detail page
- `/login`
- `/register`

## Protected user pages
- `/dashboard` — overview
- `/dashboard/saved` — saved draggable cards
- `/dashboard/content` — user-created content list
- `/dashboard/content/new` — create new prompt or skill
- `/dashboard/content/:id/edit` — edit owned content

## Admin pages
- `/admin/content` — admin content list/manage
- `/admin/content/new` — create admin content

For MVP, this is enough.

---

# 9. Homepage Requirements
The homepage should:
- explain PromptHive quickly
- show the value clearly
- direct users into search/discovery
- showcase a few featured public prompts/skills
- push sign-up for saving and rating

## Homepage sections
- navbar
- hero section
- main search bar
- quick content filters:
  - All
  - Prompts
  - Claude Skills
  - Codex Skills
- featured content section
- top-rated or trending section
- CTA section
- footer

---

# 10. Explore Page Requirements
The explore page is the main discovery engine.

## Functions
- search public prompts and skills
- filter by type/provider/category/tag
- sort content
- show cards with star display
- open detail pages from cards

## Filters
- content type
- skill provider
- category
- tags
- use case

## Sort options
- Newest
- Highest Rated
- Most Upvoted

MVP can start with:
- newest
- highest rated

---

# 11. Card Requirements
Cards should be the main browsing unit.

## Each card should show
- title
- short description
- type badge: Prompt or Skill
- provider badge if skill: Claude or Codex
- tags
- star rating display
- optional rating/vote count
- save button or save state

## Card behavior
- clicking the card opens the detail page
- clicking inner actions like save should not navigate away

---

# 12. Detail Page Requirements
Use one unified detail route:

```bash
/content/:slug
```

The page should adapt based on content type.

## Detail page content
- title
- description
- type badge
- provider badge if skill
- category
- tags
- use case
- creator/source
- rating display
- upvote count
- downvote count
- save button
- upvote button
- downvote button
- copy button
- full content body
- related content

## Actions on detail page
- save
- upvote
- downvote
- copy

This should be the main conversion page.

---

# 13. Voting and Rating System

## Goal
Allow logged-in users to express quality preference on public content and use that for ranking.

## Rules
Only logged-in users can vote on public content.

Users can:
- upvote once
- downvote once
- remove their vote
- switch vote direction

## Vote logic
### Upvote
- if no vote exists, create upvote
- if already upvoted, remove it
- if downvoted, switch to upvote

### Downvote
- if no vote exists, create downvote
- if already downvoted, remove it
- if upvoted, switch to downvote

## Star display
Stars are **display-only**, derived from the vote balance or rating formula.

Users are not submitting 1–5 stars directly.  
Users interact only through upvote/downvote.

## Ranking impact
Voting should influence public ranking so stronger content appears earlier.

---

# 14. Saved Dashboard Requirements
The saved dashboard is one of the key MVP features.

## Purpose
Let users keep a personal collection of useful prompts and skills.

## UI
Saved items appear as cards.

## Each saved card includes
- title
- short description
- type badge
- provider badge if skill
- tags
- star rating if public
- remove button
- drag handle

## User actions
- drag and reorder cards
- open detail page
- remove saved item

The order must persist in the database.

---

# 15. Content Creation Requirements
Users must be able to create:
- a prompt
- a skill

## Create flow
Step 1:
Choose content type:
- Prompt
- Skill

If Skill:
Choose provider:
- Claude
- Codex

## Prompt fields
- title
- description
- prompt text
- category
- tags
- use case
- visibility: public/private

## Skill fields
- title
- description
- provider
- skill content/instructions
- category
- tags
- use case
- visibility: public/private

## Publish behavior
### Public
- appears immediately in public catalog
- can be voted on
- can be saved by others

### Private
- stays visible only to owner

---

# 16. Admin Content Requirements
Admin should be able to:
- create public prompts
- create public skills
- manage platform seed content

Admin content should:
- be public by default
- appear in explore immediately

---

# 17. Centralized Metadata / Source of Truth
PromptHive should use centralized constants/config for:
- content types
- skill providers
- categories
- tags
- use cases
- visibility
- roles

Each controlled option should support metadata such as:
- `value`
- `label`
- `description`
- `useCases`

This metadata should be used for:
- backend validation
- frontend dropdowns
- helper descriptions
- filter labels
- badges

Example:
When a user selects a category, the UI should be able to show what that category means and what it can be used for.

---

# 18. Required Data Models

## User
Fields:
- name
- username
- email
- password
- role
- avatar
- bio

## Content
Fields:
- title
- slug
- description
- type (`prompt` | `skill`)
- skillProvider (`claude` | `codex` | `null`)
- contentText
- category
- tags
- useCase
- visibility (`public` | `private`)
- ownerType (`admin` | `user`)
- createdBy
- copyCount
- saveCount
- upvoteCount
- downvoteCount
- score
- rating
- timestamps

## SavedContent
Fields:
- user
- content
- order
- timestamps

## Vote
Fields:
- user
- content
- voteType (`up` | `down`)
- timestamps

---

# 19. Authentication Requirements

## Required auth features
- register
- login
- logout
- current session check
- protected routes
- admin-only route protection

## Recommended auth approach
- JWT
- httpOnly cookies
- `/api/auth/me` for session restore

---

# 20. Technical Stack

## Frontend
- React + Vite
- Tailwind CSS
- React Router
- TanStack Query
- Redux Toolkit only if needed for global auth/UI state
- dnd-kit for drag and drop

## Backend
- Node.js
- Express
- MongoDB
- Mongoose
- Zod or similar request validation
- centralized error handling

## Testing
- Vitest for frontend
- Jest for backend

---

# 21. Architecture Requirements

## Frontend structure
- `services/` for raw API calls
- `hooks/queries/` for read operations
- `hooks/mutations/` for write operations
- `components/` for reusable UI
- `pages/` for route pages

## Backend structure
- `config/`
- `controllers/`
- `middleware/`
- `models/`
- `routes/`
- `utils/`

## Rules
- keep API logic out of components
- keep server state out of Redux
- keep components focused on rendering and interaction

---

# 22. Important MVP Edge Rules

## Recommended MVP decisions
- prevent duplicate saves for the same user/content pair
- prevent duplicate votes for the same user/content pair
- use soft handling for missing/deleted content references
- stars are display-only
- private content must never appear in public search
- if a public item becomes private, remove it from public discovery immediately
- keep slug generation collision-safe

---

# 23. MVP Scope

## Must-have
- auth
- public homepage
- public explore page
- content cards
- unified detail page
- copy action
- save action
- upvote/downvote
- draggable saved dashboard
- create prompt/skill
- admin create content

## Not in MVP
- libraries
- public creator profiles
- taxonomy admin UI
- advanced analytics
- notifications
- moderation system
- comments
- premium plans
- teams

These can come later.

---

# 24. Success Criteria for MVP
The MVP is successful if users can:

- discover public prompts and skills
- click into detail pages
- copy useful content
- save it to their dashboard
- reorder saved items
- create and publish their own content
- vote on public content
- see ranking improve discovery

---

# 25. Product Summary
PromptHive is a **Prompt + Skill discovery and organization platform** where users can:

- search public prompts and skills
- open full detail views
- copy, save, and rate content
- organize saved items in a draggable dashboard
- create public or private prompts and skills
- help rank content through voting

Admins can:
- seed the public catalog with platform content
- manage the initial content base

For MVP, PromptHive should focus on one core promise:

**Discover useful AI prompts and skills, save the best ones, and organize them in your own workspace.**
