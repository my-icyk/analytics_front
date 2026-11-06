# Access Control

Decision: permissions are checked on the frontend through `useAccess()`.
Admins (`is_admin`) pass all checks.

## API
| Helper | Use when |
|---|---|
| `isAdmin` | admin-only routes/sections |
| `can(p)` | one permission |
| `canAny([...])` | at least one permission |
| `canAll([...])` | all permissions |

## Rules
- Always use `PERMISSION.*` constants, never raw strings.
- Don't read `currentUser.is_admin` directly; use `isAdmin`.
- Routes accept one key only; for combined checks add a named flag in `access.ts`.
- Frontend checks are UX only. The backend must enforce permissions too.

## Adding a permission
1. Add it to `PERMISSION` (and the backend).
2. Use it with `can` / `canAny` / `canAll`.

## Not supported yet
Resource-based checks (e.g. "edit own post only").
