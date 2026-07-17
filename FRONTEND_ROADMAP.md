# Frontend Roadmap

## Completed Work (F1, F2, F3, F3.1)
- ✅ Project Scaffold
- ✅ Global Toast & Auth Contexts
- ✅ Unified Login & Register Pages with password visibility
- ✅ Role-Based Protected Routes
- ✅ Super Admin: Requests Approvals Page
- ✅ Super Admin: Browse Stores Directory
- ✅ Public: Marketplace Directory (Correct landing flow)
- ✅ Strict Business Rule Parity (One User = One Store)
- ✅ Architecture Documentation & Naming Conventions enforced
- ✅ Store resolver improvements
- ✅ Navigation changes
- ✅ F3: Store Settings implementation & tab
- ✅ F3: Settings API integration & backend contract used
- ✅ F3.1: Store branding integration (Avatar & Description rendering)
- ✅ F3.1: `refreshProfile()` propagation
- ✅ F3.1: Product image audit & MVP single-image behaviour confirmed

## Outstanding Frontend Work (To-Do)

### F4: Merchant Dashboard (Catalog & Stock)
- [ ] Implement `CategoryManager` component (CRUD for store categories).
- [ ] Implement `ProductManager` component (CRUD for store products).
- [ ] Implement `InventoryManager` component (Stock tracking and updates).
- [ ] Connect all above components into the `StoreDashboard.jsx` tab interface.

### F5: Public Storefront
- [ ] Implement `PublicStore.jsx` to render a tenant's approved storefront.
- [ ] Implement `ProductDetails.jsx` for individual item views.
- [ ] Implement shopping cart / session state (if applicable).

### Outstanding Architecture Debt
- ⚠️ Monitor `StoreDashboard.jsx` for conditional rename to `StoreAdminDashboard.jsx`.
- ⚠️ Centralize form validation rules (e.g. via Zod in frontend) to mirror backend schemas.
- ⚠️ Address remaining parity gaps: Settings fields (`slug`, `contactEmail`, `phone`, `address`, `website`, `logoUrl`, `bannerUrl`, `operationalStatus`) are currently excluded from the UI. Media upload is not supported by the backend, so Avatar URLs must be pasted as text URLs.
