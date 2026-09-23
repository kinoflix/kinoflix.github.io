import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import worker, { FootballHub } from "../worker/worker.js";
import {
  ApiFootballProvider,
  ApiError,
  match,
  normalize,
} from "../worker/provider.js";
import { resolveRoute } from "../worker/routes.js";
import {
  bakuDate,
  shiftDate,
  age,
  minute,
  sortMatches,
} from "../football/js/utils.js";
const route = (path, env = {}) =>
  resolveRoute(new URL(path, "https://test.invalid"), env);
const fixture = (status = "1H", id = 1) => ({
  fixture: {
    id,
    date: "2026-09-22T20:30:00Z",
    status: { short: status, elapsed: 90, extra: 4 },
  },
  league: { id: 39, name: "TEST liqa", season: 2026 },
  teams: {
    home: { id: 1, name: "TEST Əli Şəfəq" },
    away: { id: 2, name: "TEST Komanda" },
  },
  goals: { home: null, away: 0 },
  score: { halftime: { home: 0, away: 0 } },
});
function sqlite() {
  const db = new DatabaseSync(":memory:");
  return {
    storage: {
      sql: {
        exec(q, ...args) {
          const rows = db.prepare(q).all(...args);
          return { toArray: () => rows };
        },
      },
    },
    db,
  };
}
test("Baku date boundary, tomorrow, leap year", () => {
  assert.equal(bakuDate(new Date("2026-09-22T20:30:00Z")), "2026-09-23");
  assert.equal(shiftDate("2026-12-31", 1), "2027-01-01");
  assert.equal(shiftDate("2024-02-28", 1), "2024-02-29");
});
test("age changes on birthday; stoppage time", () => {
  assert.equal(age("2000-09-23", "2026-09-22"), 25);
  assert.equal(age("2000-09-23", "2026-09-23"), 26);
  assert.equal(age(null), null);
  assert.equal(minute(90, 4), "90+4′");
});
test("nullable scores and media, AZ text preserved", () => {
  const m = match(fixture());
  assert.equal(m.homeTeam.logo, null);
  assert.equal(m.score.home, null);
  assert.equal(m.score.away, 0);
  assert.equal(m.redCards.home, null);
  assert.equal(m.homeTeam.name, "TEST Əli Şəfəq");
});
test("red card counters only derive from supplied events", () => {
  const x = fixture();
  x.events = [
    { team: { id: 1 }, detail: "Red Card" },
    { team: { id: 1 }, detail: "Yellow Card" },
  ];
  assert.equal(match(x).redCards.home, 1);
});
test("zero, one, many live matches", () => {
  for (const count of [0, 1, 1200])
    assert.equal(
      normalize(
        "matches",
        Array.from({ length: count }, (_, i) => fixture("1H", i + 1)),
      ).length,
      count,
    );
});
test("live / upcoming / finished sorting", () => {
  const a = [
    match(fixture("FT", 1)),
    match(fixture("NS", 2)),
    match(fixture("HT", 3)),
  ].sort(sortMatches);
  assert.deepEqual(
    a.map((m) => m.id),
    [3, 2, 1],
  );
});
test("postponed and cancelled statuses preserved", () => {
  assert.equal(match(fixture("PST")).status, "PST");
  assert.equal(match(fixture("CANC")).status, "CANC");
});
test("whitelist and validation fail closed", () => {
  for (const path of [
    "/api/proxy?url=https://evil.test",
    "/api/live?url=x",
    "/api/matches?date=2026-02-30",
    "/api/match/0",
    "/api/live?x=1",
    "/api/team/search?q=Arsenal&q=Other",
    "/api/team/search?q=%3Cscript%3E",
  ])
    assert.throws(() => route(path));
});
test("correct params, Unicode, free and realtime TTLs", () => {
  assert.deepEqual(route("/api/matches?date=2026-09-22").params, {
    date: "2026-09-22",
    timezone: "Asia/Baku",
  });
  assert.equal(
    route("/api/team/search?q=Qaraba%C4%9F").params.search,
    "Qarabag",
  );
  assert.equal(
    route("/api/player/search?q=Lionel%20Messi&season=2026").params.search,
    "Messi",
  );
  assert.equal(route("/api/standings/39?season=2026").params.league, 39);
  assert.equal(route("/api/live").ttl, 1800);
  assert.equal(route("/api/live", { DATA_MODE: "realtime" }).ttl, 30);
});
test("HTTP429, HTTP500 and API200 error envelopes", async () => {
  for (const [status, body, expected] of [
    [429, {}, "RATE_LIMIT"],
    [500, {}, "UPSTREAM"],
    [200, { errors: { requests: "limit reached" } }, "RATE_LIMIT"],
    [200, { errors: { plan: "not available" } }, "PLAN_OR_KEY"],
    [200, { response: "bad" }, "UPSTREAM"],
  ]) {
    const p = new ApiFootballProvider("TEST_ONLY", async () =>
      Response.json(body, { status }),
    );
    await assert.rejects(
      () => p.request(route("/api/live")),
      (e) => e.code === expected,
    );
  }
});
test("API secret only in upstream header", async () => {
  const p = new ApiFootballProvider("TEST_ONLY", async (url, options) => {
    assert.equal(options.headers["x-apisports-key"], "TEST_ONLY");
    assert.equal(url.origin, "https://v3.football.api-sports.io");
    return Response.json({
      errors: [],
      response: [fixture()],
      paging: { current: 1, total: 1 },
    });
  });
  assert.equal(
    JSON.stringify(await p.request(route("/api/live"))).includes("TEST_ONLY"),
    false,
  );
});
test("CORS rejects unknown origin", async () => {
  assert.equal(
    (
      await worker.fetch(
        new Request("https://worker.test/api/live", {
          headers: { Origin: "https://evil.test" },
        }),
        {},
      )
    ).status,
    403,
  );
  const r = await worker.fetch(
    new Request("https://worker.test/api/live", {
      method: "OPTIONS",
      headers: { Origin: "https://kinoflix.github.io" },
    }),
    {},
  );
  assert.equal(r.status, 204);
  assert.equal(
    r.headers.get("Access-Control-Allow-Origin"),
    "https://kinoflix.github.io",
  );
});
test("shared cache, concurrent coalescing, persistent restart", async () => {
  const ctx = sqlite(),
    env = { FOOTBALL_API_KEY: "TEST", DAILY_BUDGET: "95" };
  const hub = new FootballHub(ctx, env);
  let calls = 0;
  hub.provider = {
    request: async () => {
      calls++;
      await new Promise((r) => setTimeout(r, 5));
      return { data: [], paging: { current: 1, total: 1 } };
    },
  };
  const query = () =>
    new Request("https://internal/query", {
      method: "POST",
      body: JSON.stringify({ route: route("/api/live"), client: "test" }),
    });
  const out = await Promise.all(
    Array.from({ length: 10 }, () => hub.fetch(query())),
  );
  assert(out.every((r) => r.status === 200));
  assert.equal(calls, 1);
  const next = new FootballHub(ctx, env);
  next.provider = {
    request: async () => {
      throw Error("Must use persistent cache");
    },
  };
  assert.equal((await next.fetch(query())).status, 200);
  ctx.db.close();
});
test("concurrent budget respects core reserve and daily ceiling", async () => {
  const ctx = sqlite(),
    hub = new FootballHub(ctx, {
      FOOTBALL_API_KEY: "TEST",
      DAILY_BUDGET: "3",
      CORE_RESERVE: "1",
      UPSTREAM_PER_MINUTE: "100",
    });
  let calls = 0;
  hub.provider = {
    request: async () => {
      calls++;
      return { data: [], paging: { current: 1, total: 1 } };
    },
  };
  const send = (path) =>
    hub.fetch(
      new Request("https://internal/query", {
        method: "POST",
        body: JSON.stringify({ route: route(path), client: "test" }),
      }),
    );
  const outputs = await Promise.all(
    [1, 2, 3, 4].map((id) => send(`/api/team/${id}`)),
  );
  assert.equal(outputs.filter((r) => r.status === 200).length, 2);
  assert.equal((await send("/api/live")).status, 200);
  assert.equal((await send("/api/matches?date=2026-09-22")).status, 429);
  assert.equal(calls, 3);
  ctx.db.close();
});
test("stale fallback retains timestamp", async () => {
  const ctx = sqlite(),
    hub = new FootballHub(ctx, { FOOTBALL_API_KEY: "TEST" });
  const r = route("/api/live"),
    fetchedAt = new Date(Date.now() - 3600000).toISOString();
  ctx.storage.sql.exec(
    "INSERT INTO cache VALUES (?, ?, ?, ?)",
    r.key,
    JSON.stringify({
      data: [match(fixture())],
      paging: { current: 1, total: 1 },
      fetchedAt,
      expires: Date.now() - 1000,
    }),
    Date.now() - 1000,
    Date.now() - 3600000,
  );
  hub.provider = {
    request: async () => {
      throw new ApiError("UPSTREAM", 502);
    },
  };
  const response = await hub.fetch(
    new Request("https://internal/query", {
      method: "POST",
      body: JSON.stringify({ route: r, client: "test" }),
    }),
  );
  const data = await response.json();
  assert.equal(data.meta.stale, true);
  assert.equal(data.meta.fetchedAt, fetchedAt);
  assert.equal(data.meta.warning, "UPSTREAM");
  ctx.db.close();
});

test("player registered teams route and malformed birthday", () => {
  assert.deepEqual(route("/api/player/123/teams").params, { player: 123 });
  assert.equal(route("/api/player/123/teams").upstream, "players/squads");
  assert.equal(age("2000-13-22"), null);
  assert.doesNotThrow(() =>
    match({ ...fixture(), teams: { home: null, away: null } }),
  );
});

test("no-live realtime response slows polling to three minutes", async () => {
  const ctx = sqlite(),
    hub = new FootballHub(ctx, { FOOTBALL_API_KEY: "TEST" });
  hub.provider = {
    request: async () => ({ data: [], paging: { current: 1, total: 1 } }),
  };
  const response = await hub.fetch(
    new Request("https://internal/query", {
      method: "POST",
      body: JSON.stringify({
        route: route("/api/live", { DATA_MODE: "realtime" }),
        client: "test",
      }),
    }),
  );
  const data = await response.json();
  assert(data.meta.refreshAfter >= 179);
  ctx.db.close();
});
