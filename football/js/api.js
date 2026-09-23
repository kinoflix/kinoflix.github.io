import { CONFIG } from "./config.js";
import { readStore, writeStore } from "./utils.js";
const STORE = "kinoflixFootballCacheV1";
const stored = readStore(STORE, {});
const cache = new Map(
  Object.entries(stored && typeof stored === "object" ? stored : {}),
);
export class FootballError extends Error {
  constructor(code, retryAfter = 60) {
    super(code);
    this.code = code;
    this.retryAfter = retryAfter;
  }
}
export const errorMessage = (error) =>
  ({
    NOT_CONFIGURED:
      "Məlumat xidməti hələ qoşulmayıb. Quraşdırma təlimatına baxın.",
    RATE_LIMIT: "API sorğu limiti müvəqqəti olaraq dolub.",
    DAILY_LIMIT:
      "Bugünkü məlumat sorğusu limiti dolub. Son saxlanılmış məlumatdan istifadə edin.",
    PLAN_OR_KEY:
      "Bu məlumat API paketində əlçatan deyil və ya xidmət açarı təsdiqlənmədi.",
    OFFLINE: "İnternet bağlantısını yoxlayın.",
    INVALID_INPUT: "Axtarış və ya tarix məlumatını yoxlayın.",
    TIMEOUT: "Məlumat xidməti gec cavab verir. Yenidən cəhd edin.",
  })[error?.code] || "Məlumatları yükləmək mümkün olmadı.";
function saveCache() {
  while (cache.size > CONFIG.CACHE_ITEMS)
    cache.delete(cache.keys().next().value);
  writeStore(STORE, Object.fromEntries(cache));
}
export async function request(path, { signal, force = false } = {}) {
  if (!CONFIG.WORKER_BASE_URL) throw new FootballError("NOT_CONFIGURED");
  const base = CONFIG.WORKER_BASE_URL.replace(/\/$/, "");
  const key = base + path,
    old = cache.get(key),
    now = Date.now();
  if (
    !force &&
    old &&
    Date.parse(old.meta?.expiresAt) > now &&
    !old.meta?.stale
  )
    return old;
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort, { once: true });
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, CONFIG.TIMEOUT_MS);
  try {
    if (!navigator.onLine) throw new FootballError("OFFLINE");
    const response = await fetch(key, {
      signal: controller.signal,
      credentials: "omit",
      cache: "no-store",
    });
    let body;
    try {
      body = await response.json();
    } catch {
      throw new FootballError("UNAVAILABLE");
    }
    if (!response.ok || body.error)
      throw new FootballError(
        body.error?.code ||
          (response.status === 429 ? "RATE_LIMIT" : "UNAVAILABLE"),
        body.error?.retryAfter,
      );
    if (!Array.isArray(body.data) || !body.meta?.fetchedAt)
      throw new FootballError("UNAVAILABLE");
    cache.delete(key);
    cache.set(key, body);
    saveCache();
    return body;
  } catch (error) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const safeError = timedOut
      ? new FootballError("TIMEOUT")
      : error instanceof FootballError
        ? error
        : new FootballError(navigator.onLine ? "UNAVAILABLE" : "OFFLINE");
    if (old && now - Date.parse(old.meta?.fetchedAt) < 7 * 86400000)
      return {
        ...old,
        meta: {
          ...old.meta,
          stale: true,
          warning: safeError.code,
          refreshAfter: Math.max(safeError.retryAfter, 300),
        },
      };
    throw safeError;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
  }
}
