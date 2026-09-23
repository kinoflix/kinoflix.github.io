// Simulated DOM integration only. Synthetic data exists exclusively in tests.
// These are NOT screenshots or a substitute for a real browser acceptance run.
import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { readFile, cp, mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function until(fn) {
  for (let i = 0; i < 100; i++) {
    if (fn()) return;
    await sleep(10);
  }
  assert.fail("DOM condition timed out");
}
test("DOM integration: matches, search, profiles, favorites, theme, history and offline", async (t) => {
  const root = await mkdtemp(`${tmpdir()}/football-dom-`);
  await cp(new URL("../football", import.meta.url), `${root}/football`, {
    recursive: true,
  });
  await writeFile(`${root}/package.json`, '{"type":"module"}');
  const configPath = `${root}/football/js/config.js`;
  await writeFile(
    configPath,
    (await readFile(configPath, "utf8")).replace(
      /WORKER_BASE_URL:\s*["']{2}/,
      'WORKER_BASE_URL: "https://test-api.invalid"',
    ),
  );
  const html = await readFile(`${root}/football/index.html`, "utf8");
  const dom = new JSDOM(html, {
    url: "https://kinoflix.github.io/football/",
    pretendToBeVisual: true,
  });
  const w = dom.window;
  for (const k of [
    "window",
    "document",
    "navigator",
    "localStorage",
    "history",
    "location",
    "Event",
    "DOMException",
    "HTMLElement",
  ])
    Object.defineProperty(globalThis, k, { value: w[k], configurable: true });
  w.HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  w.HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
  const timers = new Set(),
    nativeSet = globalThis.setTimeout,
    nativeClear = globalThis.clearTimeout;
  globalThis.setTimeout = (f, ms, ...args) => {
    const id = nativeSet(f, ms, ...args);
    timers.add(id);
    return id;
  };
  globalThis.clearTimeout = (id) => {
    timers.delete(id);
    nativeClear(id);
  };
  const home = { id: 86, name: "TEST Qarabağ", logo: null },
    away = { id: 87, name: "TEST Şəfəq", logo: null },
    league = {
      id: 39,
      name: "TEST Liqa",
      country: "Azərbaycan",
      logo: null,
      season: 2026,
      round: "TEST 1",
    };
  const m = {
    id: 1234,
    competition: league,
    homeTeam: home,
    awayTeam: away,
    kickoff: new Date().toISOString(),
    status: "1H",
    minute: 67,
    extra: null,
    score: { home: 2, away: 1 },
    redCards: { home: null, away: null },
    periods: { halftime: { home: 1, away: 0 } },
  };
  const p = {
    id: 123,
    name: "TEST Messi",
    fullName: "TEST Lionel Messi",
    photo: null,
    birthDate: "2000-09-23",
    nationality: "TEST",
    stats: [],
  };
  const comp = {
    ...league,
    seasons: [
      {
        year: 2026,
        current: true,
        coverage: {
          standings: true,
          scorers: true,
          events: true,
          lineups: true,
          statistics: true,
        },
      },
    ],
  };
  const meta = {
    fetchedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1800000).toISOString(),
    mode: "economy",
    refreshAfter: 1800,
    stale: false,
  };
  let mode = "normal",
    requests = [];
  globalThis.fetch = async (input) => {
    const url = new URL(input);
    requests.push(url.href);
    let data = [];
    if (mode === "offline") throw new TypeError("network");
    if (url.pathname === "/api/matches" || url.pathname === "/api/live")
      data = mode === "empty" ? [] : [m];
    else if (url.pathname === "/api/match/1234") data = [m];
    else if (
      url.pathname === "/api/competition/39" ||
      url.pathname === "/api/competitions" ||
      url.pathname === "/api/team/86/competitions"
    )
      data = [comp];
    else if (url.pathname === "/api/team/86")
      data = [{ ...home, country: "TEST", venue: "TEST Arena", founded: 2000 }];
    else if (url.pathname === "/api/team/search")
      data = url.searchParams.get("q") === "zzzz" ? [] : [home];
    else if (url.pathname === "/api/player/search")
      data = url.searchParams.get("q") === "zzzz" ? [] : [p];
    else if (url.pathname === "/api/player/123") data = [p];
    else if (url.pathname === "/api/team/86/squad") data = [p];
    return Response.json({ data, paging: { current: 1, total: 1 }, meta });
  };
  const click = (selector) => w.document.querySelector(selector).click();
  try {
    await import(pathToFileURL(`${root}/football/js/app.js`));
    await until(() => w.document.querySelector(".match-card"));
    await t.test(
      "one live match with null logos and real AZ characters",
      () => {
        assert.equal(w.document.querySelectorAll(".match-card").length, 1);
        assert.match(
          w.document.querySelector("#content").textContent,
          /TEST Qarabağ/,
        );
        assert.match(
          w.document.querySelector("#data-status").textContent,
          /30 dəqiqə/,
        );
        assert.equal(
          w.document.querySelector("#content img").src.endsWith("team.svg"),
          true,
        );
        assert(!w.document.body.textContent.includes("undefined"));
      },
    );
    await t.test("match deep link and close/back", async () => {
      click(".match-card");
      await until(() => w.document.querySelector("#match-scoreboard"));
      assert.equal(w.location.search, "?match=1234");
      assert.match(
        w.document.querySelector("#detail-body").textContent,
        /2 : 1/,
      );
      click("#close-detail");
      await until(() => !w.document.querySelector("#detail").open);
      assert.equal(w.location.search, "");
    });
    await t.test("team deep link, favorites and dynamic theme", async () => {
      w.history.pushState({ footballEntity: true }, "", "?team=86");
      w.dispatchEvent(new w.PopStateEvent("popstate"));
      await until(
        () =>
          w.document.querySelector("#detail-title").textContent ===
          "TEST Qarabağ",
      );
      click("#detail-actions .favorite");
      assert.equal(
        JSON.parse(w.localStorage.getItem("kinoflixFootballFavorites")).teams[0]
          .id,
        86,
      );
      click("#close-detail");
      await until(() => !w.document.querySelector("#detail").open);
      click("#theme-toggle");
      assert.equal(w.document.documentElement.dataset.theme, "light");
      assert.equal(w.localStorage.getItem("flix-theme"), "light");
      click("#theme-toggle");
      assert.equal(w.document.documentElement.dataset.theme, "dark");
    });
    await t.test("player deep link, null photo, history", async () => {
      w.history.pushState(
        { footballEntity: true },
        "",
        "?player=123&season=2026",
      );
      w.dispatchEvent(new w.PopStateEvent("popstate"));
      await until(
        () =>
          w.document.querySelector("#detail-title").textContent ===
          "TEST Messi",
      );
      assert.match(
        w.document.querySelector("#detail-body").textContent,
        /TEST Lionel Messi/,
      );
      assert.match(
        w.document.querySelector("#detail-body img").src,
        /player.svg$/,
      );
      assert.equal(
        JSON.parse(w.localStorage.getItem("kinoflixFootballHistory"))[0].id,
        123,
      );
      click("#close-detail");
      await until(() => !w.document.querySelector("#detail").open);
    });
    await t.test("debounced Unicode search and empty results", async () => {
      const input = w.document.querySelector("#search");
      input.value = "zzzz";
      input.dispatchEvent(new w.Event("input", { bubbles: true }));
      await until(() =>
        w.document
          .querySelector("#search-results")
          .textContent.includes("Nəticə tapılmadı."),
      );
      assert(requests.some((x) => x.includes("/api/player/search")));
      input.dispatchEvent(new w.KeyboardEvent("keydown", { key: "Escape" }));
      assert.equal(w.document.querySelector("#search-results").hidden, true);
    });
    await t.test("HTML from data is rendered as text", async () => {
      const ui = await import(pathToFileURL(`${root}/football/js/ui.js`));
      const target = w.document.createElement("div");
      ui.matchGroups(
        target,
        [{ ...m, homeTeam: { ...home, name: "<img src=x onerror=alert(1)>" } }],
        () => {},
      );
      assert.equal(target.querySelectorAll("img[onerror]").length, 0);
      assert.match(target.textContent, /<img src=x onerror=alert\(1\)>/);
    });
    await t.test("no live matches and cached offline fallback", async () => {
      mode = "empty";
      click("[data-view=live]");
      await until(() =>
        w.document
          .querySelector("#content")
          .textContent.includes("Hazırda canlı oyun yoxdur."),
      );
      mode = "offline";
      click("[data-view=today]");
      await until(() => w.document.querySelector(".match-card"));
      const api = await import(pathToFileURL(`${root}/football/js/api.js`));
      const response = await api.request("/api/live", { force: true });
      assert.equal(response.meta.stale, true);
      assert.equal(response.meta.fetchedAt, meta.fetchedAt);
    });
  } finally {
    for (const id of timers) nativeClear(id);
    globalThis.setTimeout = nativeSet;
    globalThis.clearTimeout = nativeClear;
    dom.window.close();
    await rm(root, { recursive: true, force: true });
  }
});
