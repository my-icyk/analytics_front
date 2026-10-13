# My App

Web app blueprint: **UmiJS Max + Ant Design Pro (ProComponents)**.
Every page requires login. The only public page is `/login`.
You do not need to write CSS: look and feel come from Ant Design components
and theme settings.

## Run it

```bash
npm install
npm run dev        # http://localhost:8000
```

Demo accounts (fake backend in `/mock`):

| Username | Password   | Role  | Can see                      |
| -------- | ---------- | ----- | ---------------------------- |
| `admin`  | `admin123` | admin | Dashboard, Users, Settings   |
| `user`   | `user123`  | user  | Dashboard, Settings          |

Other commands: `npm run build` (production files in `dist/`),
`npm run typecheck` (find type errors).

## Folder map: who is responsible for what

```
my-app/
├── config/                 BUILD-TIME settings (read when the app is built)
│   ├── config.ts             Main config; only plugs the files below together
│   ├── routes.ts             Every page URL, its menu name/icon, who may open it
│   ├── theme.ts              Colors / roundness of the whole app (no CSS)
│   └── proxy.ts              Where /api/* goes when you have a real backend
│
├── mock/                   FAKE BACKEND for development (delete when you have a real one)
│   ├── auth.ts               login, "who am I", logout
│   ├── users.ts              users list (admin only)
│   ├── dashboard.ts          dashboard numbers
│   └── helpers/              fake data + token check shared by the files above
│
└── src/                    THE APP
    ├── app.tsx               Entry that only CONNECTS the 4 runtime pieces below
    ├── runtime/              RUN-TIME behavior, one concern per file
    │   ├── initialState.ts     On app start: "is someone logged in?"
    │   ├── layout.tsx          Sidebar/header/footer + THE LOGIN GUARD
    │   └── rootContainer.tsx   Language of Ant Design texts (English)
    ├── requestConfig.ts      Rules for EVERY backend call: send token, handle 401/errors
    ├── access.ts             Permissions (canAdmin...) used by routes and components
    │
    ├── pages/                One folder per screen (what the URL shows)
    │   ├── Login/              The only public page
    │   ├── Dashboard/          Page fetches data; components/ only draw it
    │   │   └── components/
    │   ├── Users/              index.tsx = the page, columns.tsx = table columns
    │   ├── Settings/
    │   └── 404.tsx
    │
    ├── components/           Reusable pieces used by the layout or several pages
    │   ├── AvatarDropdown/     User menu with "Log out"
    │   └── Footer/
    │
    ├── services/             Functions that call the backend. Nothing else.
    │   ├── auth.ts             login / logout / fetchCurrentUser
    │   ├── users.ts
    │   └── dashboard.ts
    │
    ├── types/                TypeScript shapes of backend data (User, LoginResult...)
    ├── constants/app.ts      Fixed values used in many places (paths, token key)
    └── utils/                Small helpers without UI
        ├── token.ts            The ONLY file that touches the token in localStorage
        ├── navigation.ts       Build/read the ?redirect= address safely
        └── error.ts            Turn a request error into a message / status
```

Rule of thumb: **a page never calls the network or localStorage directly.**
Page -> `services/` (talks to backend) -> `requestConfig.ts` (token + errors).

## How login protection works

1. `config/routes.ts`: `/login` has `layout: false`; every other route is
   rendered inside the layout.
2. On start, `runtime/initialState.ts` reads the stored token and asks the
   backend `GET /api/auth/me`. Success = logged in; failure = token removed.
3. `runtime/layout.tsx` guards everything inside the layout. No logged-in user
   means redirect to `/login?redirect=<where you wanted to go>`, and the page
   content is not rendered at all.
4. After a successful login (`pages/Login`) the token is saved
   (`utils/token.ts`), the user is stored in global state, and you are sent back
   to the page you asked for.
5. If the backend ever answers `401` (token expired), `requestConfig.ts`
   clears the token and sends you to `/login`.

Important: this protects the **screens**. Real security is your backend
checking the token on every request (the mock does it in `mock/helpers/guard.ts`).

## Everyday tasks

**Add a page** (example: "Orders")
1. Create `src/pages/Orders/index.tsx`.
2. Add to `config/routes.ts`:
   `{ path: '/orders', name: 'Orders', icon: 'shopping', component: './Orders' }`
   It is protected automatically.
3. Only for admins? Add `access: 'canAdmin'` to that route.

**Call a new API endpoint**
1. Add the data shape in `src/types/`.
2. Add a function in `src/services/` (copy `users.ts`).
3. In the page use it with `useRequest` (single data) or ProTable's
   `request` prop (tables, see `pages/Users`).

**Cache data with `useRequest`** (see `pages/Dashboard`)
```tsx
const { data, loading } = useRequest(fetchDashboardStats, {
  formatResult: (res) => res, // required, see warning below
  cacheKey: 'dashboard-stats', // same key = shared cache
  staleTime: 30_000,           // fresh for 30 s, no new request
});
```
Warning: Umi's `useRequest` assumes the backend answers `{ data: ... }` and
returns only that `data`. Our API answers with the plain object, so always
pass `formatResult: (res) => res`; otherwise `data` stays empty.

**Add a role/permission**: add a line in `src/access.ts`, then use
`access: 'yourPermission'` on a route.

**Change colors**: edit `config/theme.ts` (`colorPrimary`, ...).

**Connect your real backend**
1. Set the `target` in `config/proxy.ts`.
2. Delete the files in `mock/` (or run with `MOCK=none npm run dev`).
3. Make your API match `src/types/` and `src/services/`:
   - `POST /api/auth/login` -> `{ token, user }`; wrong credentials -> `401 { message }`
   - `GET  /api/auth/me` -> `user`
   - `GET  /api/users?page=1&pageSize=10` -> `{ list, total }`
   - `GET  /api/dashboard/stats` -> `{ totalUsers, activeUsers, newThisWeek }`
   - any protected call without a valid token -> `401`

## Good to know

- The token is kept in `localStorage`. That is simple and fine to start with;
  for higher security, switch to an httpOnly cookie set by your backend
  (change only `utils/token.ts`, `requestConfig.ts`, `services/auth.ts`).
- Admin-only data must also be protected by the backend (the mock returns
  `403` for `/api/users` to non-admins). Hiding a menu item is not security.
- `src/.umi/` is generated automatically (`npm run setup`). Never edit it.
