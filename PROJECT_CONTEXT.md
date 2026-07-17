# Project Context

## Overview
E-Com Lite is a multi-tenant e-commerce platform. It provides a central marketplace directory where platform administrators (SUPER_ADMIN) approve and manage store tenants (STORE_ADMIN). Tenants can manage their own store catalogs and inventory.

## Architecture
- **Backend**: Express.js + Prisma + PostgreSQL. Acts as the definitive source of truth for all business rules, authorization context, and data validation.
- **Frontend**: React + Vite + TailwindCSS. A lightweight SPA that reflects the backend state. It NEVER infers permissions or invents business logic.

## Core Rules
1. **Source of Truth**: The Backend API is the absolute source of truth. If the frontend contradicts the backend, the frontend is wrong.
2. **One Concern, One Home**: Code should be organized logically without duplication.
3. **One User = One Store**: A merchant user is tied to at most one store. Multi-store management is deliberately excluded.
4. **Data Minimization**: Endpoints strictly return only the data required for the UI, minimizing exposure of internal fields.

## File Naming Convention
**Rule:** Avoid generic names unless the concept itself is generic within the application. A generic name is acceptable when there is exactly ONE instance of that concept in the app. A generic name is a violation when it obscures which of several similar things a file is (e.g., Dashboard, Panel, Home used for non-generic routing shells).
*Note*: `StoreDashboard.jsx` is deferred for renaming. Revisit and rename to `StoreAdminDashboard.jsx` if a second dashboard-type page is introduced.
