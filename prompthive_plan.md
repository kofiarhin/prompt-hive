# PromptHive — Production Build Plan

## Source Alignment
- **Project brief** = product intent, user flows, pages, MVP scope
- **Production spec** = canonical system contract, API, data models, validation, permissions
- **Build plan** = implementation order only

---

## 1. Root Architecture Baseline

```bash
/package.json
/server
/client
```

### Server
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

### Client
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

## 2. Non-Negotiable Product Rules
- No duplicate saves
- No duplicate votes
- Private content never appears in public discovery
- Private content is readable only by owner or admin
- Public-to-private changes remove content from discovery immediately
- Soft delete in production
- Deleted content cannot be saved, voted on, or copied
- Slug generation must be collision-safe
- Rating is display-only and derived from votes
- Only owners can edit/delete their content unless admin
- Saving content does not grant edit rights
- API logic stays out of components
- Server state stays out of Redux

---

## 3. Phase Plan

### Phase 1 — Foundation
Deliver:
- root project setup
- env validation
- DB connection
- shared metadata/constants
- shared validation strategy
- JWT auth with httpOnly cookies
- centralized error handling
- standard API response contract

Exit criteria:
- app boots cleanly
- auth session restore works
- metadata is available to both frontend and backend

---

### Phase 2 — Content Core
Deliver:
- User model
- Content model
- slug generation
- create/update/delete content
- owner/admin authorization
- soft delete
- visibility enforcement

Exit criteria:
- users can CRUD only their own content
- admins can manage all content
- private and deleted content are properly blocked

---

### Phase 3 — Discovery
Deliver:
- public explore API
- search/filter/sort
- pagination
- detail page access control
- homepage featured/top-rated feeds

Exit criteria:
- only public non-deleted content is discoverable
- detail route does not leak private content
- sort behavior is deterministic

---

### Phase 4 — Engagement
Deliver:
- save system
- vote toggle/switch logic
- copy tracking
- aggregate counter updates
- rating calculation

Exit criteria:
- save duplicates blocked
- vote duplicates blocked by unique index + service logic
- counters remain consistent
- rating safely handles zero votes

---

### Phase 5 — Frontend Core
Deliver:
- app providers
- auth state
- public routes
- protected routes
- homepage
- explore page
- cards
- detail page
- loading/error/empty states

Exit criteria:
- clean browse → detail → auth flow works
- API calls live in `services/`
- TanStack Query manages server state

---

### Phase 6 — Dashboard
Deliver:
- saved items page
- drag-and-drop reorder with dnd-kit
- reorder persistence API integration
- safe handling for missing/deleted saved references

Exit criteria:
- reorder persists correctly
- only current user items are reordered
- deleted references do not break the UI

---

### Phase 7 — Creation Flows
Deliver:
- create prompt flow
- create skill flow
- edit owned content
- metadata-driven form inputs
- visibility controls

Exit criteria:
- prompt and skill creation both work
- public content appears in explore immediately
- private content remains owner/admin only

---

### Phase 8 — Admin
Deliver:
- admin content management
- admin create content
- admin users list
- role updates
- suspend/reactivate flows

Exit criteria:
- admin routes are protected
- admin-created content defaults to public
- user management basics are functional

---

### Phase 9 — Production Hardening
Deliver:
- backend Jest tests
- frontend Vitest tests
- rate limiting
- indexing
- async failure handling
- cleanup of edge cases
- docs for env/setup

Exit criteria:
- critical flows have passing tests
- invalid input and permission failures are covered
- performance baseline is acceptable

---

## 4. API/Contract Decisions To Lock Before Build
- Explore sorts:
  - `newest` → `createdAt desc`
  - `rating` → `rating desc`, `upvoteCount desc`, `createdAt desc`
  - `upvotes` → `upvoteCount desc`, `createdAt desc`
- Vote endpoint:
  - same vote removes
  - opposite vote switches
- Save reorder payload:
```json
{
  "items": [
    { "contentId": "abc", "order": 0 }
  ]
}
```
- Private detail access:
  - owner/admin only
  - unauthorized lookups return 404
- Delete behavior:
  - soft delete only in production

---

## 5. MVP Success Loop
1. Discover
2. Open
3. Copy
4. Save
5. Reorder
6. Create
7. Publish
8. Vote

---

## Final
This build plan is aligned to the project brief and production spec and should be treated as the implementation sequence, not an independent source of product rules.
