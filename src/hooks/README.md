# Hooks Folder (`src/hooks/`)

## Purpose
Exposes custom React hooks providing access to application contexts.

## Contents
- `useAuth.js`: Syntactic shortcut to consume `AuthContext` state.
- `useToast.js`: Syntactic shortcut to consume `ToastContext` alerts.

## Architectural Rules
- Hooks should only consume context instances; actual state management logic is isolated inside `context/`.
