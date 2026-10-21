export const ssrSafeWindow: Window | null =
  typeof window !== "undefined" ? window : null;
