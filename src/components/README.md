# Components Folder (`src/components/`)

## Purpose
Contains reusable UI, form, and business components. Divided into domains to keep responsibilities separated.

## Subdirectories
- `auth/`: Reusable route guards, authentication components, and login/register widgets.
  - `ProtectedRoute/`: Guard component wrapping protected dashboard routes.
- `dashboard/`: Merchant dashboard modules (e.g. Products, Categories, Inventory).
  - `CategoryManager/` & `CategoryForm/`: Administrative panel and form to configure categories.
  - `ProductManager/` & `ProductForm/`: Administrative panel and form to configure listings.
  - `InventoryManager/`: Panel to adjust stock levels.

## Architectural Rules
- Avoid placing direct router navigation redirections in low-level UI components; return callbacks to page controllers instead.
- Standardize on `useForm` for all inputs validation.
- Centralize styling overrides using index.css glassmorphism tokens.
