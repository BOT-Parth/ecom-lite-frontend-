# Context Folder (`src/context/`)

## Purpose
Provides global state management wrappers enclosing login states and transient UI status messages.

## Contents
- `AuthContext.jsx`: Implements global login, logout, registration, profile refresh, and token lifecycle actions.
- `ToastContext.jsx`: Implements global overlay message queue and auto-dismiss alerts.

## Architectural Rules
- Avoid importing contexts directly; instead access them through matching custom hook bindings in `src/hooks/`.
