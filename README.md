# Multi-Tenant AI Assistant

A full-stack Next.js multi-tenant AI chat assistant with a **MongoDB config-driven admin dashboard**.

## Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + TanStack Query
- **Backend**: Next.js Route Handlers with layered architecture
- **Database**: MongoDB + Mongoose
- **Validation**: Zod on all API inputs
- **AI**: OpenRouter (Gemini free-tier) with mock fallback

---

## Architecture

```
Access (pure DB)  →  Services (auth + business logic)  →  API Routes (thin)  →  TanStack Query Hooks  →  UI
```

### Directory Structure
```
src/
├── app/
│   ├── api/                   # Route handlers (thin, delegate to services)
│   ├── [projectSlug]/chat/    # Chat UI with dynamic project/instance/conversation routing
│   └── [projectSlug]/admin/   # Admin dashboard (admin-only)
├── lib/
│   ├── db/models/             # Mongoose models (7 total)
│   ├── access/                # Pure data functions — no business logic
│   ├── services/              # Auth checks + business logic
│   └── validations/           # Zod schemas
├── hooks/                     # TanStack Query hooks — no direct DB calls
└── components/
    ├── chat/                  # MessageList, ChatInput, ConversationSidebar, IntegrationPanel
    └── admin/                 # DashboardRenderer, Widgets (5 types)
```

### Multi-Tenant Model

| Entity | Description |
|---|---|
| **Project** | Tenant boundary — identified by slug |
| **User** | Belongs to one or more projects, has `admin` or `member` role |
| **ProductInstance** | Links a product type (sales-assistant, support-bot) to a project |
| **Conversation** | Scoped to `projectId + productInstanceId + userId` |
| **Message** | Scoped to a conversation; roles: `user`, `assistant`, `step` |
| **DashboardConfig** | One per project — drives admin dashboard layout |
| **Integration** | One per instance per type (shopify, crm) — toggleable |

---

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI

### Install
```bash
npm install
```

### Environment
Make `.env.local` and update:
```env
MONGODB_URI=mongodb://localhost:27017/multi-tenant-ai-assistant
OPENROUTER_API_KEY=your-key-here   # optional — app works without it (mock responses)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get a free OpenRouter API key at [openrouter.ai](https://openrouter.ai) to enable real Gemini responses.

### Seed the database
```bash
npm run seed
```
This creates:
- 2 projects: `acme-corp`, `beta-startup`
- 3 users: `alice@acme.com` (admin), `bob@acme.com` (member), `charlie@beta.com` (admin)
- Product instances, conversations, messages, integration mock data
- Dashboard configs with sections and widgets

### Run dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## Authentication

No password needed. On the login page, select any user:
- **Alice Johnson** (admin) — can access Acme Corp admin dashboard
- **Bob Smith** (member) — chat only, no admin access
- **Charlie Davis** (admin) — can access Beta Startup admin dashboard

---

## Config-Driven Admin Dashboard

The admin dashboard is driven entirely by the `dashboardconfigs` MongoDB collection.

**Which collection/document drives it:** `dashboardconfigs` — one document per project, referenced by `projectId`.

### How to prove it:
1. Log in as `alice@acme.com`
2. Navigate to `/acme-corp/admin`
3. Open MongoDB Compass (or Mongosh) and edit the `dashboardconfigs` document for Acme Corp
4. Change a widget title, add/remove a widget, change `welcomeMessage`, or toggle `showWelcomeBanner`
5. Refresh the admin dashboard — changes appear immediately, **no code change needed**

### Example edits to try:
```js
// Change welcome message
db.dashboardconfigs.updateOne(
  { projectId: ObjectId("...") },
  { $set: { "theme.welcomeMessage": "Hello World!" } }
)

// Add a widget to a section
db.dashboardconfigs.updateOne(
  { projectId: ObjectId("...") },
  { $push: { "sections.0.widgets": {
    id: "new-widget", type: "stats-card", title: "New Metric",
    order: 5, config: { value: "42", change: "+100%", trend: "up", icon: "star" }
  }}}
)
```

---

## AI Integration

- Service layer controls when to call AI (`src/lib/services/ai.ts`)
- When Shopify integration is enabled on a product instance → product catalog + recent orders are included in AI context
- When CRM integration is enabled → contacts + deals are included in AI context
- Chat flow reflects toggled integrations in real time
- Rate limit / API errors fall back to intelligent mock responses

---

## Evaluation Checklist

| Criterion | Implementation |
|---|---|
| Multi-tenant model | Project → ProductInstance → Conversation → Message hierarchy |
| Access/authorization | Service layer enforces user→project access; admin check for dashboard |
| Layered API | Access → Services → Routes → Hooks → UI |
| Zod validation | All API inputs validated |
| Chat + AI | Controlled flow, integration context, fallback mocks |
| Config-driven admin | `DashboardRenderer` maps MongoDB sections/widgets to React components |
| Loading/error/empty states | All states handled with skeletons, spinners, and empty UI |
| data-testid | Applied on all major regions |
