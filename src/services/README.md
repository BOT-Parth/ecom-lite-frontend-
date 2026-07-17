# Services Folder (`src/services/`)

## Purpose
Exposes API interfaces, third-party clients configurations, and general utility services.

## Contents
- `api.js`: Standardized Axios client configured with authorization headers interceptors and response payload unwrappers.
- `storeResolver.js`: Tiered resolver matching human-readable slugs against local user memberships, platform registers, and public API registries.

## Architectural Rules
- All HTTP requests to the backend must traverse the `api.js` client rather than native fetch or custom axios setups.
- Keep business rules (e.g. mapping slug resolver tiers) documented and central.
