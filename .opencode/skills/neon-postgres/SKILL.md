---
name: neon-postgres
description: >-
  Guides and best practices for working with Lakebase Postgres on Neon:
  connections, pooled vs direct, schema migrations, branching, autoscaling,
  scale-to-zero, instant restore, read replicas, IP allow lists, logical
  replication, and Lakebase Search. Use when the work is an existing
  DATABASE_URL, SQL, schema, inspect, or search. New backends, Auth, files,
  Functions, and LLM calls go to the parent `neon` skill. Also use for
  "@neondatabase/serverless", "@neondatabase/neon-js", "neon inspect db",
  "semantic search", "vector search", "full-text search", "BM25", or
  "hybrid search".
metadata:
  parent: neon
  source: https://github.com/neondatabase/agent-skills/tree/main/skills/neon-postgres
---

**FIRST**: Use the parent `neon` skill for a Neon overview, getting started with Neon, Neon development best practices, and more.

If the `neon` skill is not installed, fetch it from https://neon.com/docs/ai/skills/neon/SKILL.md or install it with:

```bash
neon skills -s neon -y
```

# Lakebase Postgres

Lakebase Postgres is the database at the core of Neon. It runs on the lakebase architecture — OLTP built directly on cloud object storage — which decouples storage from compute to offer autoscaling, branching, instant restore, and scale-to-zero. It's fully compatible with Postgres and works with any language, framework, or ORM that supports Postgres.

Login, users, sessions, and `@neondatabase/auth` belong in `neon-auth`.

## Setup Flow

### 1. Select the organization and project

If a `DATABASE_URL` is already supplied (prompt, environment, or repo) or a `.neon` file points at a project, use it. Do not list organizations or create a second project for schema work.

Otherwise use the CLI (default) or MCP server to list organizations and projects. Let the user select an existing project or create a new one.

### 2. Get the connection string

If a `DATABASE_URL` is already supplied, use it. Do not fetch another through the CLI or MCP.

Otherwise use the CLI (default), `neon env pull`, or the MCP server to get the connection string. Store it in `.env` as `DATABASE_URL`. Read the file first before modifying it, to avoid overwriting existing values.

#### When to use pooled vs direct connections

| Use case | Connection type |
| --- | --- |
| Web applications, serverless functions | Pooled (-pooler) |
| Schema migrations | Direct |
| pg_dump / pg_restore | Direct |
| Logical replication | Direct |
| Long-running analytics with temp tables | Direct |
| Admin tasks needing SET or session state | Direct |
| LISTEN / NOTIFY | Direct |

### 3. Pick the connection method and driver

Preserve the existing ORM and driver. For new TypeScript schema work with no established choice, Drizzle is a suggestion: https://neon.com/docs/guides/drizzle.md.

Driver notes:

- On Vercel, use `node-postgres` (`npm install pg`) with Vercel Fluid compute and `import { attachDatabasePool } from "@vercel/functions";`
- Use the `@neondatabase/serverless` driver for serverless and edge environments — HTTP transport for one-shot queries, WebSocket for transaction support. Link: https://neon.com/docs/serverless/serverless-driver.md

### 4. Set up the schema

Manage schemas and migrations as code. Avoid running ad hoc schema migrations against your database, since they're hard to manage.

## Branching

Use this when the user is planning isolated environments, schema migration testing, preview deployments, or branch lifecycle automation.

Key points:

- Branches are instant, copy-on-write clones (no full data copy).
- Each branch has its own compute endpoint.
- Use the neon CLI or MCP server to create, inspect, and compare branches.

Link: https://neon.com/docs/introduction/branching.md

## Migrations

Test a migration on a branch of production, against production-like data, before applying it to production.

Use a **direct (non-pooled)** connection string when you run the migration, not a pooled one. `neon connection-string` returns the direct string by default; make sure the hostname does not include the `-pooler` suffix.

## Troubleshooting and Neon-Specific Performance

Use Neon's predefined, read-only diagnostics before writing catalog queries by hand: `neon inspect db <check>` or the MCP server's `inspect_database` tool.

| Symptom or question | Checks |
| --- | --- |
| Which relations consume storage? | `table-sizes`, `index-sizes` |
| Is an index unused or a table scanned heavily? | `unused-indexes`, `seq-scans` |
| What has run for 5+ minutes or holds locks? | `long-running-queries`, `locks` |
| Which queries consume the most total time? | `outliers` |
| Which queries run most often? | `calls` |

`outliers` and `calls` require `pg_stat_statements`. If a check reports a missing extension, ask before running the suggested `CREATE EXTENSION` statement because installing an extension modifies the database.

### Interpret Results Safely

- Treat `unused-indexes` as a candidate list, not permission to drop indexes.
- A sequential scan can be correct for a small table. Check table size and selectivity before adding an index.
- Cache and Postgres statistics reset when compute restarts, including scale-to-zero suspension.

## Autoscaling

Link: https://neon.com/docs/introduction/autoscaling.md

## Scale to Zero

Idle computes suspend automatically after a default of 5 minutes; the timeout is configurable. First query after suspend typically has a cold-start penalty (around hundreds of ms). Storage remains active while compute is suspended.

Link: https://neon.com/docs/introduction/scale-to-zero.md

## Connection Pooling

Neon pooling uses PgBouncer. Add `-pooler` to endpoint hostnames to use pooled connections — required for serverless runtimes with bursty concurrency.

Link: https://neon.com/docs/connect/connection-pooling.md

## Gotchas

### Pooled vs direct connections: use the direct URL for migrations, dumps, and replication

Neon gives you two connection strings for the same database: a **pooled** one (hostname with the `-pooler` suffix) and a **direct/unpooled** one. `neon env pull` writes them as `DATABASE_URL` and `DATABASE_URL_UNPOOLED`. The pooled connection routes through PgBouncer in transaction mode, which doesn't support session-level operations.

- **Pooled (`DATABASE_URL`)** — application query traffic, especially serverless.
- **Direct (`DATABASE_URL_UNPOOLED`)** — schema migrations, `pg_dump` / `pg_restore`, logical replication, `LISTEN`/`NOTIFY`, session state.

## Project rules applied here (ProDesk)

- Driver is `@neondatabase/serverless` (HTTP transport, Vercel/edge-safe) — do not swap drivers unless asked.
- Tables self-create at runtime (`admin_users`, `product_images`, `site_content`); there is no migration runner — keep that pattern.
- Pooled `DATABASE_URL` for all app traffic.
