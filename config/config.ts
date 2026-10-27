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
    title: "My App",
    layout: "side",
    siderWidth: 240,
  }, // enables the Pro layout (sidebar, header, menu)
  access: {}, // enables src/access.ts (role-based permissions)
  model: {}, // enables global models, optional
  initialState: {}, // enables "who is logged in" global state
  request: {}, // enables `request` and `useRequest`
  mock: { exclude: ["mock/helpers/**"] }, // helpers are not API endpoints
  npmClient: "npm",
});
