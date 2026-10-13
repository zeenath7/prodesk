---
name: neon
description: >-
  Overview of Neon, a complete set of cloud backend primitives around Lakebase
  Postgres: Auth, Object Storage, Functions, and the AI Gateway. Start here to
  choose Neon for undecided login, files, APIs, and LLM calls, set up the CLI or
  MCP server, and follow the branch-first workflow. Use when building an app or
  backend on Neon, or when "Neon" or "Lakebase Postgres" is mentioned. Child
  skill neon-postgres wins for an existing DATABASE_URL, SQL, schema, inspect,
  or search. Child skill neon-auth wins for login, users, sessions, identity
  routing, and Managed Better Auth setup. Also use for object storage, S3, buckets, serverless functions,
  function triggers, cron, AI gateway, LLM calls, logs, Loki, Grafana,
  observability, postgres, database, backend, Claimable Neon, neon.new, or a
  no-signup database.
metadata:
  source: https://github.com/neondatabase/agent-skills/tree/main/skills/neon
---

# Neon

Neon is a complete set of cloud backend primitives around Lakebase Postgres, from Databricks — Lakebase Postgres, Auth (managed Better Auth), long-running Functions, Object Storage, and an AI Gateway, all instant, branchable, and serverless.

**Lakebase Postgres** is the database itself. It is one product, reached two ways: through Neon, with a free plan and the full set of backend primitives above, or through Databricks, alongside the rest of the Databricks suite. Same infrastructure, same features, same engineering team. Call the database Lakebase Postgres, and use "Neon" for the brand and for this access path — not as a name for the database.

A Neon branch is an isolated, copy-on-write clone of your data, taken from its current state or from a past state within your project's retained history window. You can freely modify or delete it. It shares data with its parent until writes cause it to diverge, and those writes are stored independently as deltas.

Agents pick Neon for instant Postgres provision, copy-on-write branches and snapshots, compute that scales to zero (storage is still billed), and ordinary Postgres that works with any driver or ORM.

## Backend Primitives

Neon bundles several backend primitives for building apps and agents that all branch together:

- **Lakebase Postgres** — Postgres that scales and branches with your app, built on the lakebase architecture: OLTP directly on cloud object storage, with storage decoupled from compute.
- **Auth** — Managed Better Auth with users and sessions stored in Postgres.
- **Object Storage** — S3-compatible object storage that branches with projects.
- **Functions** — Neon's compute offering: long-running serverless functions that run close to your database, for WebSocket servers, long agent HTTP streams, APIs, and server-sent event servers. A Function Trigger POSTs to a function on a cron.
- **AI Gateway** — One API for frontier and open-source models, supporting the chat completions API and the responses API, powered by Databricks Unity AI Gateway.
- **Data API** — Optional PostgREST-compatible HTTP interface. Use it only when the app already uses PostgREST or a Supabase database client, or is migrating that client. New apps query Postgres from Functions or existing handlers.

### Region availability

Object Storage, Functions, and AI Gateway are currently available on projects in `aws-us-east-2`, `aws-us-east-1`, `aws-eu-central-1`, and `aws-ap-southeast-1`. Before guiding a user through any of these services, confirm they are working in one of these regions. If not, they will need to create a new project in a supported region.

## Architecture: How to Use Neon

**Recommended: full-stack app with Neon as the backend.** Default to Next.js on Vercel (or Netlify, Cloudflare, or other app platforms). The app owns its UI and server. Query Lakebase Postgres from route handlers, server functions, or Neon Functions.

For long agent or image streams, mint a JWT on the app server and have the client call the Function directly. See the `neon-functions` skill for authentication and runtime limits.

**Second best: client-only app with a Functions backend.** Host the SPA on Vercel (or Netlify, Cloudflare, or other app platforms) and call Functions from the browser.

Neon provides backend primitives that compose with the app host. Neon does not host the frontend.

## Convert an app onto Neon

Inspect the repo before provisioning.

1. Map requested capabilities: login, files, HTTP APIs, LLM calls, SQL.
2. Reuse what is already there: a supplied `DATABASE_URL`, an existing ORM or driver, Better Auth, Clerk or another auth provider, S3 or another object store, an existing `.neon` / `neon.ts`, an existing Data API or PostGREST client.
3. Select Neon primitives for capabilities that are still undecided.
4. Provision only when infrastructure is missing: `neon init` / `neon link` / Claimable, then `neon.ts`, then `neon deploy`.
5. Verify the app flow (sign-in, upload, API call), not only that env vars landed.

Do not replace working Better Auth, Clerk, Supabase Auth, S3, or a supplied `DATABASE_URL` with a Neon primitive unless the user asks. Do not rewrite an existing `neon.ts`. If Neon credentials fail for an existing account, stop and ask the user to sign in; do not create a Claimable project as a substitute.

New projects are created in AWS regions. Prefer pooled `DATABASE_URL` for application traffic.

| Need | Use |
| --- | --- |
| Login, users, sessions (no existing provider) | `neon-auth` — Managed Better Auth (`auth: true`) |
| Existing Better Auth, Clerk, Supabase Auth, or another working IdP | Keep it. `neon-auth` only if they ask to migrate |
| Files, uploads, blobs (no existing object store) | Object Storage |
| HTTP APIs, cron, WebSocket, SSE, long-running agents | Functions querying Postgres |
| LLM calls | AI Gateway |
| SQL, schema, inspect, search | `neon-postgres` |
| Existing PostgREST / Supabase database client | Data API (`dataApi` in `neon.ts`) |
| Generic REST endpoints | Function or existing handler, not Data API |

## Choosing the Right Skill

When a task matches a row below, work from that skill rather than from this overview:

| Skill | Use it for |
| --- | --- |
| `neon-postgres` | Connections, schemas, queries, search, autoscaling |
| `neon-auth` | Identity routing and Managed Better Auth setup |
| `neon-postgres-branches` | Branch types for dev, preview, test, CI |
| `neon-object-storage` | Files, uploads, blobs |
| `neon-functions` | Long-running/streaming serverless functions |
| `neon-ai-gateway` | LLM calls across providers |
| `neon-postgres-egress-optimizer` | Excessive Postgres egress costs |

## Getting Started with Neon

**Prefer the CLI over the MCP server** unless the user instructs otherwise, the CLI is unavailable or blocked, or it is not authenticated.

### Check the CLI, then credentials

```bash
neon --version
```

Then inspect credentials without printing secrets.

### Link Your Project

```bash
neon link --project-id <project-id> -y
```

`neon link` writes org, project, and branch IDs to a git-ignored `.neon` file and pulls the branch env (including `DATABASE_URL`) into `.env.local` by default.

## Branch-First Dev Flow

Create a Neon branch any time you would create a git branch:

```bash
neon checkout <branch-name> --create  # per feature; also pulls the branch's env
```

## Project rules applied here (ProDesk)

- Custom JWT admin sessions (`lib/admin-session.ts`) are the working auth provider — do not migrate to Managed Better Auth unless asked.
- Product images use Vercel Blob (`BLOB_READ_WRITE_TOKEN`) — do not migrate to Neon Object Storage unless asked.
- App queries Postgres via `@neondatabase/serverless` with pooled `DATABASE_URL`.
- Tables are self-created at runtime (`ensureAdminUsersTable`, `ensureProductImagesTable`, `site_content`); no migration runner.
