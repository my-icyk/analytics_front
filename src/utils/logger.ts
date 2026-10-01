const isDev = import.meta.env.DEV;

export const createLogger = (scope: string) => ({
  debug: (...args: unknown[]) => {
    if (isDev) {
      console.debug(`[${scope}]`, ...args);
    }
  },

  info: (...args: unknown[]) => {
    if (isDev) {
      console.info(`[${scope}]`, ...args);
    }
  },

  warn: (...args: unknown[]) => {
    console.warn(`[${scope}]`, ...args);
  },

  error: (...args: unknown[]) => {
    console.error(`[${scope}]`, ...args);
  },
});
