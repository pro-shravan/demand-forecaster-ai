Welcome to your Lovable project
# Foresight — AI-Driven Demand Forecasting (Lovable + TanStack Start)

This project was built with [Lovable](https://lovable.dev).
Detailed documentation covering data models, algorithms, data flows, implementation details, and developer/runtime guidance for the Demand Forecaster AI project.

## Build with Lovable
## Table of Contents
- [Overview](#overview)
- [Data Model & Schema](#data-model--schema)
  - [Public Tables](#public-tables)
  - [Schemas, Enums & Relationships](#schemas-enums--relationships)
  - [Migrations](#migrations)
- [Data Ingestion & CSV Parsing](#data-ingestion--csv-parsing)
- [S&OP Logic & Algorithms](#sop-logic--algorithms)
- [Monthly Forecast & TOP SKUs](#monthly-forecast--top-skus)
- [System Architecture](#system-architecture)
  - [Frontend](#frontend)
  - [Backend / Data Layer](#backend--data-layer)
  - [Authentication & Authorization](#authentication--authorization)
- [Data Flow & User Journeys](#data-flow--user-journeys)
- [Routes & UI Components](#routes--ui-components)
- [Development & Running Locally](#development--running-locally)
- [Testing & Validation](#testing--validation)
- [Deployment & CI/CD](#deployment--cicd)
- [Extensibility & Roadmap](#extensibility--roadmap)
- [Troubleshooting](#troubleshooting)
- [Appendix](#appendix)
- [Contributing & Licensing](#contributing--licensing)

Open your project in the [Lovable editor](https://lovable.dev) and keep building.
---

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.
## Overview
Foresight is an AI-powered inventory and demand forecasting platform designed for modern retailers. It ingests historical sales data via CSV uploads, stores it in a structured data lake (Supabase managed Postgres), computes KPI-driven SOP (Sales & Operations Planning) insights, and presents actionable dashboards for business users.

## Development
Key components:
- Frontend: React + TanStack Start routing, Tailwind for UI, Recharts for charts.
- Backend/Data: Supabase (Postgres) with schema for user data, uploaded sales data, and derived analytics.
- Algorithms: CSV parsing, monthly aggregation, SKU-level analytics, and SOP summary generation.

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).
---

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
## Data Model & Schema
This section documents the core data model, tables, enums, and relationships used by the application. It reflects the migrations under the Supabase migrations folder.

## Built with
### Public Tables
- profiles
  - id: UUID (PK, references auth.users(id))
  - full_name: text
  - avatar_url: text | null
  - company: text | null
  - created_at: timestamptz
  - updated_at: timestamptz
- user_roles
  - id: UUID (PK)
  - user_id: UUID (FK -> auth.users.id)
  - role: app_role (enum: admin | manager | analyst)
  - Unique constraint on (user_id, role)

- TanStack Start
- TypeScript
- React
- Tailwind CSS
- sales_uploads
  - id: UUID (PK)
  - user_id: UUID (FK -> auth.users.id)
  - file_name: text
  - row_count: integer
  - uploaded_at: timestamptz

- sales_records
  - id: UUID (PK)
  - upload_id: UUID (FK -> sales_uploads.id)
  - user_id: UUID (FK -> auth.users.id)
  - sale_date: date
  - sku: text
  - quantity: numeric(12,2)
  - revenue: numeric(14,2)
  - created_at: timestamptz

> All user data is protected by Row-Level Security (RLS). Each user can only view and insert their own records unless explicitly granted otherwise.

### Enums & Functions
- app_role: 'admin' | 'manager' | 'analyst'
- Function: has_role(user_id UUID, _role app_role) -> boolean (used for authorization checks)

### Migrations (high level)
- 20260727093055_386cb531-27b0-4873-8038-3bc0d889101c.sql
  - Create profiles and user_roles with RLS policies and triggers for auto-creating profiles on signup.
- 20260727093115_6855ab7a-05de-4ebe-9514-e05fe959d5e0.sql
  - Access revocation for trigger functions and security wrappers.
- 20260728110000_add_sales_uploads_and_sop.sql
  - New tables: sales_uploads, sales_records
  - RLS, policies and indexes; enables end-to-end data ingestion flow for CSV uploads.

### Data Access Layer (TypeScript Types)
- src/integrations/supabase/types.ts defines the Database type used by the generated client for strongly-typed DB access.

### Helper Queries (Data Layer)
- src/lib/sales-queries.ts
  - saveSalesUpload(params) inserts into sales_uploads and corresponding sales_records rows for the current user.
  - fetchSalesRecords() fetches all records for the current user, ordered by date.
  - fetchLatestSalesUpload() fetches the latest upload for the current user.
- src/lib/sales.ts
  - CSV parsing: parseSalesCsv(text) validates headers, parses rows, validates types, and returns aParsed structure.
  - buildMonthlySeries(records) aggregates monthly sales and a simple trailing forecast.
  - buildTopSkus(records) aggregates top SKUs by units sold.
  - Types: ParsedSalesRow, ParsedCsvResult, SalesRecord.
- src/lib/sop.ts
  - buildSopSummary(records) computes high-level metrics (revenue, units, unique SKUs, latest month, demand change, top SKUs).
  - buildSopCards(records) produces a four-card SOP narrative (Demand review, Supply review, Financial review, Executive recommendation).

## Data Ingestion & CSV Parsing
- Uploads are handled by the UI at /_authenticated/upload.
- CSV is parsed by parseSalesCsv(text) with the following requirements:
  - Required headers: date, sku, quantity, revenue (case-insensitive in code).
  - Date parsing supports ISO-like strings or MM/DD/YYYY placeholders.
  - Quantities and revenues parsed as numbers; sanitizes dollar signs and commas.
- On parse success, preview rows (first 10 data rows) are shown; rows are stored as ParsedSalesRow[] for persistence.
- On Save, data is persisted to Supabase:
  - sales_uploads: stores file metadata (name, row_count).
  - sales_records: stores per-row records linked to the upload and user.

## S&OP Logic & Algorithms
- The S&OP module is implemented in src/lib/sop.ts and depends on src/lib/sales.ts.
- Core computations:
  - buildMonthlySeries(records): aggregates revenue and quantity per month; computes a simple forecast as the average quantity of a trailing window.
  - buildSopSummary(records): derives total revenue, total quantity, unique SKUs, latest month, demand change vs prior month, and top SKUs.
  - buildTopSkus(records, limit): top N SKUs by quantity sold.
  - buildSopCards(records): returns four cards:
    - Demand review: month-over-month demand change with forecast for next cycle.
    - Supply review: suggested focus SKUs for procurement planning.
    - Financial review: revenue and unit totals, SKU count.
    - Executive recommendation: driver SKU-based suggestion.

## Monthly Forecast & Top SKUs (UI & Data Visualization)
- Frontend charts utilize Recharts (via src/routes/_authenticated/dashboard.tsx and SOP page).
- Monthly trends are rendered using a LineChart for quantity and forecast, and a separate chart for top SKUs in a summary card list.
- SOP cards are rendered in the SOP workspace and reflect the latest uploaded data.

## System Architecture
- Frontend: React + TanStack Start router; Tailwind CSS; Recharts for charts.
- Backend/Data Layer: Supabase Postgres with RLS; serverless functions via Supabase for auth helpers.
- Auth: Supabase Auth with onAuthStateChange to invalidate queries and route accordingly.

### Frontend
- Routes under src/routes/_authenticated for dashboard, upload, sop, inventory, predictions, reports, analytics, profile, settings.
- SOP route: /_authenticated/sop (SOP Workspace) implemented in SOP.tsx.
- Upload route: /_authenticated/upload handles parsing and persistence of CSV data.

### Backend / Data Layer
- Supabase migrations including user profiles, user roles, and sales data ingest tables.
- RLS to protect data per-user.
- Helper modules for saving uploads and parsing CSV.

### Authentication & Authorization
- Uses Supabase Auth. The app enforces per-user data isolation via RLS and utility has_role has_role function.

## Data Flow & User Journeys
1. User logs in via Supabase auth.
2. User navigates to Upload Data and uploads a CSV with required headers: date, sku, quantity, revenue.
3. CSV is parsed client-side first for preview; user can fix CSV formatting if needed.
4. User clicks Save to persist the data; a new sales_uploads row is created, and one or more sales_records rows linked to this upload are created.
5. User navigates to S&OP Workspace; the app fetches the latest uploaded records and computes SOP metrics and cards.
6. SOP cards provide a narrative and action items for demand, supply, financials, and executive decisions.

## Development & Running Locally
Prerequisites:
- Node.js (16+ or as required by the repo; npm or bun preferred).
- A running Supabase instance with the database schema as defined by migrations, and environment variables set:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_PUBLISHABLE_KEY

Local steps:
- Install dependencies:
  - npm install or bun install
- Set up environment variables for Supabase in a .env file or via your shell.
- Run the app in development mode:
  - npm run dev (or your project’s start command).

Database steps (one-time):
- Apply SQL migrations in the migrations folder to create the schema:
  - 20260727093055_386cb531-27b0-4873-8038-3bc0d889101c.sql
  - 20260727093115_6855ab7a-05de-4ebe-9514-e05fe959d5e0.sql
  - 20260728110000_add_sales_uploads_and_sop.sql

CSV format example (valid):
"date,sku,quantity,revenue"
"2025-01-15", "WEP-201", 12, 239.40
"2025-01-16", "SW7-114", 8, 199.20

Testing tips:
- Use the built-in UI to upload sample data and verify that the SOP panels render and reflect the uploaded data.
- Validate that the latest upload shows in the sidebar widget on the SOP page, if available.

## Testing & Validation
- Manual testing through UI for upload flow.
- Unit tests can be added for parsing and SOP calculations (currently implemented in TypeScript helpers).
- Linting and type checks are recommended (npm run lint, npm run format).

## Deployment & CI/CD
- The project is designed to be deployed to Lovable, but can be hosted as a standalone Vite app.
- Suggested CI steps:
  - Install dependencies
  - Build test app and run static checks
  - Deploy built assets to your hosting provider
- Supabase migrations should run in CI via your database provisioning step if applicable.

## Extensibility & Roadmap
- Extend SOP with more detailed supply chain constraints (lead times, capacity constraints, safety stock).
- Add automated forecasting algorithms (e.g., ARIMA, Prophet) and compare against baseline forecast.
- Add per-category and per-region SOP views and dashboards.
- Add tests for parsing, aggregations, and SOP calculations.

## Troubleshooting
- Common issues:
  - Missing environment variables for Supabase: ensure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set.
  - Supabase migrations fail: ensure the database user has privileges and the migration files are in the right path.
  - TypeScript compile errors due to missing dependencies: run npm install to fetch dependencies.

## Appendix
- SQL migrations (summary): see migrations folder
- Key files:
  - src/lib/sales.ts
  - src/lib/sop.ts
  - src/lib/sales-queries.ts
  - src/routes/_authenticated/upload.tsx
  - src/routes/_authenticated/sop.tsx
  - src/integrations/supabase/types.ts
  - supabase/migrations/20260728110000_add_sales_uploads_and_sop.sql

## Contributing & Licensing
- This project is part of Lovable tooling; follow the Lovable contribution guidelines if contributing to a shared Lovable repository. See AGENTS.md in root for Lovable-specific rules and history management constraints.
- License: MIT (or your project’s license – replace accordingly)

---
