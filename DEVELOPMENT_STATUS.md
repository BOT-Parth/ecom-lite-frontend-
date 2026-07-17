# Development Status

## Current Implementation Status
The frontend is actively being developed to achieve 1:1 feature parity with the completed backend milestones.

### Completed Frontend Milestones
- **F1: Foundation & Tooling** (Vite, Tailwind, React Router setup)
- **F2: Authentication, Landing Pages & Business Rule Parity**
  - Unified Login & Registration flows with client-side password visibility toggles.
  - Role-based routing and protection (`SUPER_ADMIN` vs `STORE_ADMIN`).
  - Implemented `PublicMarketplace.jsx` for unauthenticated visitors. Correct landing flow implemented.
  - Implemented `SuperAdminRequests.jsx` and `BrowseStores.jsx` for platform administrators.
  - Implemented strict "One User = One Store" behavior, removing multi-store switching.
  - Configured `StoreResolver` for tiered store slug fetching. Improvements made to store resolver.
  - Navigation changes and naming convention updates.
- **F3: Store Settings & Profile Management**
  - Store Settings implementation & Store Settings tab added to merchant dashboard.
  - Backend contract used and Settings API (`PATCH /stores/:storeId/settings`) integrated.
- **F3.1: Store Branding Integration**
  - Store branding integration with Avatar and Description rendering.
  - `refreshProfile()` propagation implemented for real-time updates.
  - Product image audit completed confirming MVP single-image behaviour.
  - Documented remaining parity gaps (unsupported settings fields, text URLs for media).

### In-Progress / Upcoming Frontend Milestones
- **F4: Catalog & Inventory Management**
  - Building merchant dashboard tabs for Products, Categories, and Inventory management.

## Current Technical Debt & Limitations
- **StoreDashboard.jsx**: Name is deferred. Needs rename to `StoreAdminDashboard.jsx` once a second dashboard exists.
- **Types/JSDoc**: Shared type definitions are not fully centralized yet.

## Frontend Folder Structure
- `src/context/`: `AuthContext`, `ToastContext`.
- `src/hooks/`: Hooks to consume context.
- `src/services/`: Axios instance (`api.js`) and resolvers.
- `src/pages/`: Route endpoints (`PublicMarketplace`, `SuperAdminRequests`, `BrowseStores`, `StoreDashboard`, etc.).
- `src/components/`: Reusable widgets (Navbar, Route Guards, Settings Forms).
- `src/layouts/`: Shared UI shells.
