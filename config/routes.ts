import { PERMISSIONS } from "./permissions";

/**
 * Every page of the app is declared here.
 *
 * - `component` is relative to src/pages
 * - `name` is the label shown in the sidebar menu
 * - `access` hides the page (and menu item) unless the permission in src/access.ts is true
 * - `layout: false` renders the page WITHOUT sidebar/header (used by the login page)
 *
 * Protection: every route EXCEPT /login is guarded by src/runtime/layout.tsx.
 * Anyone who is not logged in is redirected to /login automatically.
 */
export default [
  {
    path: '/login',
    component: './Login',
    layout: false,
  },
  {
    path: '/',
    redirect: '/404',
  },
  {
    path: '/users',
    name: 'Users',
    icon: 'team',
    component: './Users',
    access: PERMISSIONS.AUTH.USERS.READ,
  },
  {
    path: '/groups',
    name: 'Groups',
    icon: 'team',
    component: './Groups',
    access: PERMISSIONS.FINANCE.GROUP.READ,
  },
  {
    // Unknown URL. Inside the layout, so it is guarded too.
    path: '*',
    component: './404',
  },
];
