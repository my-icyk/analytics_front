import { defineConfig } from "@umijs/max";
import routes from "./routes";
import proxy from "./proxy";
import theme from "./theme";

/**
 * Main Umi config: it only wires the other config files together.
 * Edit the small files next to this one instead of growing this file.
 */
export default defineConfig({
  hash: true, // cache-friendly file names in production
  routes,
  proxy,
  antd: { theme }, // colors / sizes live in config/theme.ts (no CSS needed)
  layout: {
    title: "Analytics Department",
    layout: "mix", // header on top, menu in the sider
    fixedHeader: true,
    fixSiderbar: true,
    splitMenus: true, // header: Auth / Finance, sider: their children
    contentWidth: "Fluid", // or "Fixed" for a centered, narrower page
    siderWidth: 240,
    locale: false, // you use plain names, no i18n
  }, // enables the Pro layout (sidebar, header, menu)
  access: {}, // enables src/access.ts (role-based permissions)
  model: {}, // enables global models, optional
  initialState: {}, // enables "who is logged in" global state
  request: {}, // enables `request` and `useRequest`
  mock: { exclude: ["mock/helpers/**"] }, // helpers are not API endpoints
  npmClient: "npm",
});
