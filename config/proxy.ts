/**
 * Dev-server proxy: forwards /api/* calls to your real backend.
 *
 * While you have no backend, the fake API in /mock answers instead
 * (mock has priority over the proxy). When your real backend is ready,
 * delete the files in /mock (or run `MOCK=none npm run dev`) and set
 * the target below.
 */
export default {
  "/api": {
    target: "http://localhost:8000",
    changeOrigin: true,
  },
};
