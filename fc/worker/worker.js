import { ApiFootballProvider, ApiError } from "./provider.js";
import { resolveRoute } from "./routes.js";
const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
const failure = (error) =>
  json(
    {
      error: {
        code: error.code || "UNAVAILABLE",
        retryAfter: error.retryAfter || 60,
      },
    },
    error.status || 503,
    { "Retry-After": String(error.retryAfter || 60) },
  );
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const allowed = (env.ALLOWED_ORIGINS || "https://kinoflix.github.io")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    // CORS is a browser boundary, not authentication. Persistent quotas also protect the API key.
    if (!origin || !allowed.includes(origin))
      return failure(new ApiError("ORIGIN", 403));
    const cors = {
      "Access-Control-Allow-Origin": origin,
      Vary: "Origin",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };
    if (request.method === "OPTIONS")
      return new Response(null, { status: 204, headers: cors });
    let response;
    try {
      if (request.method !== "GET") throw new ApiError("METHOD", 405);
      const route = resolveRoute(new URL(request.url), env);
      if (!env.FOOTBALL_API_KEY || !env.FOOTBALL_HUB)
        throw new ApiError("NOT_CONFIGURED", 503);
      const ip = request.headers.get("CF-Connecting-IP") || "local";
      const hash = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(ip),
      );
      const client = [...new Uint8Array(hash)]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("");
      const hub = env.FOOTBALL_HUB.get(
        env.FOOTBALL_HUB.idFromName("global-v1"),
      );
      response = await hub.fetch(
        new Request("https://internal/query", {
          method: "POST",
          body: JSON.stringify({ route, client }),
        }),
      );
    } catch (error) {
      response = failure(error);
    }
    const headers = new Headers(response.headers);
    Object.entries(cors).forEach(([key, value]) => headers.set(key, value));
    return new Response(response.body, { status: response.status, headers });
  },
};
/** One SQLite Durable Object shares cache, in-flight work and a hard quota globally.
 * SQL increments run synchronously before upstream I/O: concurrent cache misses
 * cannot overspend the daily budget. Free plan uses new_sqlite_classes.
 */
export class FootballHub {
  constructor(ctx, env) {
    this.sql = ctx.storage.sql;
    this.env = env;
    this.pending = new Map();
    this.provider = new ApiFootballProvider(env.FOOTBALL_API_KEY);
    this.sql.exec(
      "CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, value TEXT, expires INTEGER, saved INTEGER)",
    );
    this.sql.exec(
      "CREATE TABLE IF NOT EXISTS budget (day TEXT PRIMARY KEY, used INTEGER, extras INTEGER)",
    );
    this.sql.exec(
      "CREATE TABLE IF NOT EXISTS rates (key TEXT PRIMARY KEY, until INTEGER, used INTEGER)",
    );
  }
  takeRate(key, limit, now) {
    const row = this.sql
      .exec("SELECT * FROM rates WHERE key = ?", key)
      .toArray()[0];
    if (row && row.until > now && row.used >= limit)
      throw new ApiError(
        "RATE_LIMIT",
        429,
        Math.max(1, Math.ceil((row.until - now) / 1000)),
      );
    const until = row?.until > now ? row.until : now + 60000;
    const used = row?.until > now ? row.used + 1 : 1;
    this.sql.exec(
      "INSERT OR REPLACE INTO rates VALUES (?, ?, ?)",
      key,
      until,
      used,
    );
  }
  envelope(value, route, stale = false, reason = null) {
    const remaining = Math.max(
      10,
      Math.ceil((value.expires - Date.now()) / 1000),
    );
    return {
      data: value.data,
      paging: value.paging,
      meta: {
        provider: "API-Football",
        mode: route.mode,
        fetchedAt: value.fetchedAt,
        expiresAt: new Date(value.expires).toISOString(),
        stale,
        warning: reason,
        refreshAfter: stale ? Math.max(route.ttl, 300) : remaining,
      },
    };
  }
  async fetch(request) {
    try {
      const { route, client } = await request.json();
      const now = Date.now();
      this.sql.exec("DELETE FROM rates WHERE until < ?", now);
      this.takeRate(`client:${client}`, 60, now);
      const row = this.sql
        .exec("SELECT * FROM cache WHERE key = ?", route.key)
        .toArray()[0];
      const old = row ? JSON.parse(row.value) : null;
      if (old && old.expires > now) return json(this.envelope(old, route));
      if (!this.pending.has(route.key)) {
        const promise = this.load(route, old).finally(() =>
          this.pending.delete(route.key),
        );
        this.pending.set(route.key, promise);
      }
      return json(await this.pending.get(route.key));
    } catch (error) {
      return failure(error);
    }
  }
  async load(route, old) {
    try {
      const now = Date.now(),
        day = new Date(now).toISOString().slice(0, 10);
      const daily = Math.max(1, Number(this.env.DAILY_BUDGET) || 95);
      const reserve = Math.min(
        daily,
        Math.max(0, Number(this.env.CORE_RESERVE) || 35),
      );
      const budget = this.sql
        .exec("SELECT * FROM budget WHERE day = ?", day)
        .toArray()[0] || { used: 0, extras: 0 };
      if (
        budget.used >= daily ||
        (!route.core && budget.extras >= daily - reserve)
      )
        throw new ApiError("DAILY_LIMIT", 429, 3600);
      this.takeRate(
        "upstream",
        Number(this.env.UPSTREAM_PER_MINUTE) || 10,
        now,
      );
      this.sql.exec(
        "INSERT OR REPLACE INTO budget VALUES (?, ?, ?)",
        day,
        budget.used + 1,
        budget.extras + (route.core ? 0 : 1),
      );
      this.sql.exec("DELETE FROM budget WHERE day < ?", day);
      const result = await this.provider.request(route);
      const saved = Date.now();
      const noLive = route.params.live && !result.data.length;
      const effectiveTtl = noLive ? Math.max(route.ttl, 180) : route.ttl;
      const value = {
        ...result,
        fetchedAt: new Date(saved).toISOString(),
        expires: saved + effectiveTtl * 1000,
      };
      this.sql.exec(
        "INSERT OR REPLACE INTO cache VALUES (?, ?, ?, ?)",
        route.key,
        JSON.stringify(value),
        value.expires,
        saved,
      );
      // Bounded cache: prevent uncontrolled storage from unique search strings.
      this.sql.exec("DELETE FROM cache WHERE saved < ?", saved - 7 * 86400000);
      this.sql.exec(
        "DELETE FROM cache WHERE key IN (SELECT key FROM cache ORDER BY saved DESC LIMIT -1 OFFSET 256)",
      );
      return this.envelope(value, route);
    } catch (error) {
      if (old && Date.now() - Date.parse(old.fetchedAt) < 7 * 86400000)
        return this.envelope(old, route, true, error.code || "UPSTREAM");
      throw error;
    }
  }
}
