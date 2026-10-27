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
    path: "/login",
    component: "./Login",
    layout: false,
  },
  {
    path: "/me",
    name: "My Profile",
    icon: "user",
    component: "./Me",
  },
  {
    path: "/auth",
    name: "Auth",
    icon: "safety",
    routes: [
      {
        path: "users",
        name: "Users",
        icon: "team",
        component: "./Users",
        access: PERMISSIONS.AUTH.USERS.READ,
      },
      {
        name: "User Details",
        path: "users/:id",
        component: "./Users/Detail",
        hideInMenu: true,
        access: PERMISSIONS.AUTH.USERS.READ,
      },
      {
        path: "roles",
        name: "Roles",
        icon: "team",
        component: "./Roles",
        access: PERMISSIONS.AUTH.ROLES.READ,
      },
      {
        name: "Role Details",
        path: "roles/:id",
        component: "./Roles/Detail",
        hideInMenu: true,
        access: PERMISSIONS.AUTH.ROLES.READ,
      },
    ],
  },
  {
    path: "/finance",
    name: "Finance",
    routes: [
      {
        path: "groups",
        name: "Groups",
        icon: "team",
        component: "./Groups",
        access: PERMISSIONS.FINANCE.GROUP.READ,
      },
      {
        path: "groups/:id",
        name: "Group Details",
        hideInMenu: true,
        component: "./Groups/Details",
        access: PERMISSIONS.FINANCE.GROUP.READ,
      },
      {
        path: "divisions",
        name: "Divisions",
        access: PERMISSIONS.FINANCE.DIVISION.READ,
        component: "./Divisions",
      },
      {
        path: "departments",
        name: "Departments",
        access: PERMISSIONS.FINANCE.DEPARTMENT.READ,
        component: "./Departments",
      },
      {
        path: "snapshots",
        name: "Financial Results",
        access: PERMISSIONS.FINANCE.SNAPSHOT.READ,
        component: "./finance/snapshot",
      },
      {
        path: "snapshots/:id",
        name: "Financial Result Details",
        hideInMenu: true,
        component: "./finance/snapshot/details",
        access: PERMISSIONS.FINANCE.SNAPSHOT.READ,
      },
    ],
  },
  // {
  //   path: "/params",
  //   name: "Params",
  //   routes: [
  //     {
  //       path: "counters",
  //       name: "Counters",
  //     },
  //   ],
  // },

  {
    // Unknown URL. Inside the layout, so it is guarded too.
    path: "*",
    component: "./404",
  },
];
