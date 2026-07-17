# Pages Folder (`src/pages/`)

## Purpose
Contains top-level route components rendered by React Router. Each file represents a discrete page view in the SPA.

## Contents
- `BrowseStores.jsx`: SUPER_ADMIN administrative view for reviewing all tenant stores.
- `SuperAdminRequests.jsx`: SUPER_ADMIN approvals dashboard for store requests.
- `PublicMarketplace.jsx`: Public landing page / marketplace directory.
- `Login.jsx` & `Register.jsx`: Public authentication entry points.
- `Profile.jsx`: User profile, membership listings, and store registration requests.
- `StoreDashboard.jsx`: Protected merchant panel containing catalog management tabs.
- `PublicStore.jsx` & `ProductDetails.jsx`: Public guest-facing tenant storefront and item detail sheets.
- `RootRedirect.jsx`: Root url redirection guard deciding initial landing paths.
- `NotFound.jsx`: Catch-all fallback error page.

## Architectural Rules
- Pages are target endpoints for React Router configuration in `App.jsx`.
- Pages should contain minimal reusable UI styling; delegate catalog tables, forms, and widgets to the `components/` directory.
- Pages coordinate API state fetching and pass properties downwards to components.
