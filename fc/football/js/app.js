import { CONFIG } from "./config.js";
import {
  $,
  el,
  button,
  bakuDate,
  shiftDate,
  formatDate,
  isLive,
  isFinished,
  isScheduled,
  icon,
} from "./utils.js";
import { provider } from "./provider.js";
import { favorites } from "./favorites.js";
import {
  skeleton,
  empty,
  showError,
  entityButton,
  entityGrid,
  matchGroups,
  dataStatus,
} from "./ui.js";
import { PollingManager } from "./polling.js";
import { setupSearch } from "./search.js";
import { setupDetails } from "./details.js";
const content = $("#content"),
  status = $("#data-status");
const state = {
  view: "today",
  date: bakuDate(),
  matches: [],
  meta: null,
  leagues: [],
  signature: "",
  filter: "all",
  league: "all",
  generation: 0,
};
function open(type, id, options = {}) {
  const url = new URL(location.href);
  ["match", "player", "team", "league", "season", "detail"].forEach((k) =>
    url.searchParams.delete(k),
  );
  url.searchParams.set(type, id);
  for (const [k, v] of Object.entries(options)) url.searchParams.set(k, v);
  history.pushState({ footballEntity: true }, "", url);
  details.sync(url);
}
const details = setupDetails(open);
setupSearch(open);
function sidebar() {
  const target = $("#favorite-teams"),
    teams = favorites().teams;
  target.replaceChildren();
  if (!teams.length) {
    target.append(el("p", "empty", "Favorit komandalarınız burada görünəcək."));
    return;
  }
  teams
    .slice(0, 8)
    .forEach((t) => target.append(entityButton("team", t, open)));
  target.append(
    button("Oyunlarını göstər", () => navigate("favorites"), "text-button"),
  );
}
sidebar();
window.addEventListener("football:favorites", sidebar);
function renderMatches() {
  const filtered = state.matches.filter(
    (m) =>
      (state.league === "all" || String(m.competition.id) === state.league) &&
      (state.filter === "all" ||
        (state.filter === "live" && isLive(m)) ||
        (state.filter === "finished" && isFinished(m)) ||
        (state.filter === "scheduled" && isScheduled(m))),
  );
  matchGroups(content, filtered, open, Boolean(state.meta?.stale));
}
function updateFilters() {
  const select = $("#league-filter"),
    value = state.league;
  select.replaceChildren(el("option", "", "Bütün liqalar"));
  select.firstChild.value = "all";
  const leagues = new Map(
    state.matches.map((m) => [m.competition.id, m.competition]),
  );
  [...leagues.values()]
    .sort((a, b) => a.name.localeCompare(b.name, "az"))
    .forEach((l) => {
      const o = el("option", "", l.name);
      o.value = l.id;
      select.append(o);
    });
  select.value = [...select.options].some((x) => x.value === value)
    ? value
    : "all";
  state.league = select.value;
}
function viewTitle() {
  return {
    today: "Bugünkü oyunlar",
    tomorrow: "Sabahkı oyunlar",
    live: "Canlı oyunlar",
    date: formatDate(`${state.date}T12:00:00Z`, { year: "numeric" }),
    leagues: "Liqalar və turnirlər",
    standings: "Turnir cədvəlləri",
    scorers: "Bombardirlər",
    favorites: "Favoritlərim",
  }[state.view];
}
function drawShell() {
  document.querySelectorAll("[data-view]").forEach((b) => {
    if (b.dataset.view === state.view) b.setAttribute("aria-current", "page");
    else b.removeAttribute("aria-current");
  });
  $("#view-title").textContent = viewTitle();
  $("#view-kicker").textContent = ["leagues", "standings", "scorers"].includes(
    state.view,
  )
    ? "TURNİRLƏR"
    : state.view === "favorites"
      ? "SƏNİN FUTBOLUN"
      : "OYUN TƏQVİMİ";
  $("#match-toolbar").hidden = !["today", "tomorrow", "date", "live"].includes(
    state.view,
  );
  $("#match-date").value = state.date;
  $("#baku-date").textContent = formatDate(new Date(), { weekday: "long" });
}
async function loadFavorites(signal, valid) {
  const f = favorites();
  content.replaceChildren();
  for (const [key, type, label] of [
    ["teams", "team", "Komandalar"],
    ["players", "player", "Futbolçular"],
    ["leagues", "league", "Liqalar"],
  ]) {
    if (f[key].length) {
      const section = el("section", "favorite-block");
      section.append(el("h3", "", label), entityGrid(f[key], type, open));
      content.append(section);
    }
  }
  if (!f.teams.length && !f.players.length && !f.leagues.length)
    return empty(
      content,
      "Hələ favorit yoxdur.",
      "Komanda, futbolçu və ya liqa profilində ulduza toxunun.",
    );
  if (!f.teams.length) return;
  const feed = el("section");
  feed.append(el("h3", "subheading", "Mənim komandalarım · oyunlar"));
  content.append(feed);
  // Explicit opt-in: don't spend 2 calls per favorite automatically on every refresh.
  feed.append(
    button("Növbəti oyunları və son nəticələri yüklə", async (e) => {
      e.currentTarget.remove();
      for (const t of f.teams.slice(0, 10)) {
        if (!valid()) return;
        const box = el("section", "panel my-team");
        box.append(el("h3", "", t.name));
        feed.append(box);
        const live = state.matches.filter(
          (m) =>
            isLive(m) && (m.homeTeam.id === t.id || m.awayTeam.id === t.id),
        );
        if (live.length) {
          const liveBox = el("div");
          matchGroups(liveBox, live, open, state.meta?.stale);
          box.append(liveBox);
        }
        for (const mode of ["next", "last"]) {
          if (!valid()) return;
          const area = el("div");
          box.append(
            el("p", "label", mode === "next" ? "Növbəti oyun" : "Son nəticə"),
            area,
          );
          try {
            const r = await provider.getTeamMatches(t.id, mode, { signal });
            if (!valid()) return;
            matchGroups(area, r.data.slice(0, 1), open, r.meta.stale);
            const stamp = el("div", "data-status");
            dataStatus(stamp, r.meta);
            area.prepend(stamp);
          } catch (error) {
            if (error.name !== "AbortError") showError(area, error);
          }
        }
      }
      if (f.teams.length > 10)
        feed.append(
          el(
            "p",
            "notice",
            "İlk 10 komanda göstərilir. Digər komandaların oyunlarına profillərindən baxın.",
          ),
        );
    }),
  );
}
async function load(signal, force) {
  const generation = state.generation,
    valid = () => !signal.aborted && generation === state.generation;
  const o = { signal, force };
  $("#refresh").disabled = true;
  try {
    if (["today", "tomorrow", "date", "live"].includes(state.view)) {
      if (state.view === "today") state.date = bakuDate();
      if (state.view === "tomorrow") state.date = shiftDate(bakuDate(), 1);
      drawShell();
      const r = await (state.view === "live"
        ? provider.getLiveMatches(o)
        : provider.getMatchesByDate(state.date, o));
      if (!valid()) return;
      state.matches = r.data;
      state.meta = r.meta;
      dataStatus(status, r.meta);
      updateFilters();
      const count = r.data.filter(isLive).length;
      $("#live-count").hidden = count === 0;
      $("#live-count").textContent = count;
      const signature = JSON.stringify([r.data, !!r.meta.stale]);
      if (signature !== state.signature) {
        state.signature = signature;
        renderMatches();
      }
      if (state.view === "live" && !r.data.length)
        empty(
          content,
          "Hazırda canlı oyun yoxdur.",
          "Bugünkü və ya sabahkı oyunların təqviminə baxa bilərsiniz.",
        );
      try {
        await details.refreshMatch(signal);
      } catch {
        /* Main feed remains usable when detail refresh is unavailable. */
      }
      return r.meta;
    }
    if (state.view === "favorites") {
      await loadFavorites(signal, valid);
      status.replaceChildren();
      return { refreshAfter: 3600 };
    }
    const r = await provider.getCompetitions(o);
    if (!valid()) return;
    state.leagues = r.data;
    dataStatus(status, r.meta);
    const priority = (l) => {
      const i = CONFIG.PRIORITY_LEAGUES.indexOf(l.id);
      return i < 0 ? 999 : i;
    };
    const leagues = [...r.data].sort(
      (a, b) => priority(a) - priority(b) || a.name.localeCompare(b.name, "az"),
    );
    const search = el("input");
    search.type = "search";
    search.placeholder = "Liqa və ya ölkə axtar...";
    search.setAttribute("aria-label", "Liqalar arasında axtar");
    search.className = "button";
    const grid = el("div");
    const render = () => {
      const q = search.value.toLocaleLowerCase("az");
      const filtered = leagues.filter((l) =>
        `${l.name} ${l.country}`.toLocaleLowerCase("az").includes(q),
      );
      if (!filtered.length) empty(grid, "Nəticə tapılmadı.");
      else {
        const shown = filtered.slice(0, 80);
        grid.replaceChildren(
          entityGrid(shown, "league", (type, id) =>
            open(type, id, {
              detail: state.view === "scorers" ? "scorers" : "standings",
            }),
          ),
        );
        if (filtered.length > 80)
          grid.append(
            button(
              `Qalan ${filtered.length - 80} liqanı göstər`,
              (e) => {
                e.currentTarget.remove();
                grid.append(
                  entityGrid(filtered.slice(80), "league", (type, id) =>
                    open(type, id, {
                      detail:
                        state.view === "scorers" ? "scorers" : "standings",
                    }),
                  ),
                );
              },
              "button load-more",
            ),
          );
      }
    };
    const selector = el("div", "selector-row");
    selector.append(search);
    content.replaceChildren(
      el(
        "p",
        "notice",
        state.view === "scorers"
          ? "Bombardirləri görmək üçün liqa seçin."
          : state.view === "standings"
            ? "Cədvəli görmək üçün liqa seçin."
            : "Əsas liqalar əvvəl göstərilir. Mövcudluq API paketinizdən asılıdır.",
      ),
      selector,
      grid,
    );
    search.addEventListener("input", render);
    render();
    return r.meta;
  } catch (error) {
    if (valid()) {
      if (
        state.matches.length &&
        ["today", "live", "date", "tomorrow"].includes(state.view) &&
        state.signature
      ) {
        dataStatus(status, { ...state.meta, stale: true, warning: error.code });
      } else showError(content, error, () => poller.change());
    }
    throw error;
  } finally {
    if (valid()) $("#refresh").disabled = false;
  }
}
const poller = new PollingManager(load);
function navigate(view, date) {
  state.view = view;
  state.date =
    date || (view === "tomorrow" ? shiftDate(bakuDate(), 1) : bakuDate());
  state.generation++;
  state.matches = [];
  state.meta = null;
  state.signature = "";
  state.filter = "all";
  state.league = "all";
  $("#status-filter").value = "all";
  drawShell();
  skeleton(content);
  const u = new URL(location.href);
  u.searchParams.set("view", view);
  if (view === "date") u.searchParams.set("date", state.date);
  else u.searchParams.delete("date");
  history.pushState({ footballView: true }, "", u);
  poller.change();
}
document.querySelector(".main-tabs").addEventListener("click", (e) => {
  const b = e.target.closest("[data-view]");
  if (b) navigate(b.dataset.view);
});
$("#prev-day").addEventListener("click", () =>
  navigate("date", shiftDate(state.date, -1)),
);
$("#next-day").addEventListener("click", () =>
  navigate("date", shiftDate(state.date, 1)),
);
$("#jump-today").addEventListener("click", () => navigate("today"));
$("#match-date").addEventListener("change", (e) => {
  if (e.target.value) navigate("date", e.target.value);
});
$("#status-filter").addEventListener("change", (e) => {
  state.filter = e.target.value;
  renderMatches();
});
$("#league-filter").addEventListener("change", (e) => {
  state.league = e.target.value;
  renderMatches();
});
let manualAt = 0;
$("#refresh").addEventListener("click", () => {
  if (Date.now() - manualAt < CONFIG.MIN_REFRESH_MS) {
    details.toast("Yeniləmələr arasında bir neçə saniyə gözləyin.");
    return;
  }
  manualAt = Date.now();
  poller.refresh(true);
});
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("flix-theme", theme);
  } catch {}
  $("#theme-toggle").replaceChildren(icon(theme === "dark" ? "sun" : "moon"));
  $("#theme-toggle").setAttribute(
    "aria-label",
    theme === "dark" ? "Açıq rejimə keç" : "Tünd rejimə keç",
  );
}
$("#theme-toggle").addEventListener("click", () =>
  applyTheme(
    document.documentElement.dataset.theme === "dark" ? "light" : "dark",
  ),
);
applyTheme(document.documentElement.dataset.theme);
window.addEventListener("storage", (e) => {
  if (e.key === "flix-theme")
    applyTheme(e.newValue === "light" ? "light" : "dark");
  if (e.key === "kinoflixFootballFavorites") sidebar();
});
function syncURL() {
  const u = new URL(location.href),
    v = u.searchParams.get("view") || "today";
  const next = [
    "today",
    "tomorrow",
    "live",
    "leagues",
    "standings",
    "scorers",
    "favorites",
    "date",
  ].includes(v)
    ? v
    : "today";
  const date = u.searchParams.get("date");
  if (state.view !== next || (next === "date" && date !== state.date)) {
    state.view = next;
    state.date =
      next === "tomorrow"
        ? shiftDate(bakuDate(), 1)
        : /^\d{4}-\d{2}-\d{2}$/.test(date || "")
          ? date
          : bakuDate();
    state.generation++;
    state.signature = "";
    state.matches = [];
    drawShell();
    skeleton(content);
    poller.change();
  }
  details.sync(u);
}
window.addEventListener("popstate", syncURL);
drawShell();
skeleton(content);
syncURL();
poller.refresh();
