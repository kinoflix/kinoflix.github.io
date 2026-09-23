// Public configuration only. NEVER put a provider key here.
export const CONFIG = Object.freeze({
  WORKER_BASE_URL: "https://kinoflix-football.kinoflix-aligoshgar.workers.dev", // e.g. https://kinoflix-football.your-name.workers.dev
  TIMEZONE: "Asia/Baku",
  LOCALE: "az-AZ",
  TIMEOUT_MS: 15000,
  SEARCH_DEBOUNCE_MS: 450,
  MIN_QUERY: 3,
  MIN_REFRESH_MS: 10000,
  CACHE_ITEMS: 60,
  HISTORY_ITEMS: 8,
  // The server is authoritative and supplies the effective poll interval.
  DEFAULT_POLL_MS: 1800000,
  MAX_BACKOFF_MS: 3600000,
  PRIORITY_LEAGUES: [2, 3, 848, 39, 140, 135, 78, 61, 419],
});
