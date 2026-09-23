import {
  el,
  button,
  safeImage,
  time,
  minute,
  statusText,
  isLive,
  isScheduled,
  sortMatches,
  icon,
  facts,
  formatDate,
  clock,
} from "./utils.js";
import { CONFIG } from "./config.js";
import { isFavorite, toggleFavorite } from "./favorites.js";
import { errorMessage } from "./api.js";
export function skeleton(target, type = "matches") {
  const fragment = document.createDocumentFragment();
  for (let j = 0; j < (type === "profile" ? 1 : 3); j++) {
    const box = el("div", "skeleton-group");
    box.setAttribute("aria-label", "Məlumat yüklənir");
    box.setAttribute("role", "status");
    box.append(el("div", "skeleton skeleton-heading"));
    for (let i = 0; i < 3; i++) {
      const row = el("div", "skeleton-row");
      row.append(
        el("div", "skeleton skeleton-round"),
        el("div", "skeleton skeleton-fill"),
      );
      box.append(row);
    }
    fragment.append(box);
  }
  target.replaceChildren(fragment);
}
export function empty(
  target,
  title = "Nəticə tapılmadı.",
  description = "",
  retry,
) {
  const box = el("div", "panel empty");
  box.append(icon("futbol"), el("h3", "", title));
  if (description) box.append(el("p", "", description));
  if (retry) box.append(button("Yenidən cəhd et", retry));
  target.replaceChildren(box);
}
export function showError(target, error, retry) {
  empty(target, errorMessage(error), "", retry);
}
export function favoriteButton(type, item) {
  const b = button("", null, "favorite");
  const update = () => {
    const active = isFavorite(type, item.id);
    b.setAttribute("aria-pressed", String(active));
    b.setAttribute(
      "aria-label",
      active ? "Favoritlərdən çıxar" : "Favoritlərə əlavə et",
    );
    b.replaceChildren(icon("star"));
  };
  update();
  b.addEventListener("click", () => {
    toggleFavorite(type, item);
    update();
  });
  return b;
}
export function entityButton(type, item, open, subtitle) {
  const b = button("", () => open(type, item.id), "entity-button");
  const text = el("div");
  text.append(el("strong", "", item.name));
  if (subtitle) text.append(el("small", "", subtitle));
  b.append(safeImage(item.photo || item.logo, type, item.name), text);
  return b;
}
export function entityGrid(items, type, open) {
  const grid = el("div", "entity-grid");
  items.forEach((item) => {
    const card = el("div", "favorite-card");
    card.append(
      entityButton(
        type,
        item,
        open,
        item.country || item.position || item.nationality,
      ),
      favoriteButton(type, item),
    );
    grid.append(card);
  });
  return grid;
}
export function matchCard(m, open, stale = false) {
  const card = button(
    "",
    () => open("match", m.id),
    `match-card${isLive(m) ? " is-live" : ""}${stale ? " saved-score" : ""}`,
  );
  card.dataset.matchId = m.id;
  const when = el("div", "match-time");
  if (isLive(m)) {
    when.append(el("strong", "", minute(m.minute, m.extra) || statusText(m)));
    const badge = el("span", "live-badge");
    if (!stale) badge.append(el("span", "live-dot"));
    badge.append(document.createTextNode(stale ? "SAXLANILIB" : "CANLI"));
    when.append(badge);
  } else {
    when.append(document.createTextNode(time(m.kickoff)));
    when.append(el("small", "", statusText(m)));
  }
  const teams = el("div", "teams"),
    scores = el("div", "scores");
  for (const side of ["home", "away"]) {
    const t = m[`${side}Team`],
      line = el("div", "team-line");
    line.append(safeImage(t.logo, "team", ""), el("span", "", t.name));
    if (m.redCards?.[side] > 0) {
      const red = el("span", "red-card", m.redCards[side]);
      red.setAttribute("aria-label", `${m.redCards[side]} qırmızı kart`);
      line.append(red);
    }
    teams.append(line);
    scores.append(
      el("span", "", isScheduled(m) ? "–" : (m.score?.[side] ?? "–")),
    );
  }
  const meta = el("div", "match-meta", m.competition?.round || statusText(m));
  if (m.venue) meta.append(el("small", "", m.venue));
  when.append(el("small", "", formatDate(m.kickoff, { month: "short" })));
  card.append(when, teams, scores, meta);
  card.setAttribute(
    "aria-label",
    `${m.homeTeam.name} – ${m.awayTeam.name}, ${statusText(m)}, ${isScheduled(m) ? time(m.kickoff) : `${m.score?.home ?? "—"} : ${m.score?.away ?? "—"}`}`,
  );
  return card;
}
export function matchGroups(target, matches, open, stale = false) {
  if (!matches.length) {
    empty(
      target,
      "Bu seçim üzrə oyun yoxdur.",
      "Tarixi və ya filtrləri dəyişə bilərsiniz.",
    );
    return;
  }
  const groups = new Map();
  [...matches].sort(sortMatches).forEach((m) => {
    const id = m.competition.id;
    if (!groups.has(id))
      groups.set(id, { competition: m.competition, matches: [] });
    groups.get(id).matches.push(m);
  });
  const priority = (id) => {
    const p = CONFIG.PRIORITY_LEAGUES.indexOf(Number(id));
    return p < 0 ? 999 : p;
  };
  const ordered = [...groups.values()].sort(
    (a, b) =>
      Number(b.matches.some(isLive)) - Number(a.matches.some(isLive)) ||
      priority(a.competition.id) - priority(b.competition.id) ||
      a.competition.name.localeCompare(b.competition.name, "az"),
  );
  const fragment = document.createDocumentFragment();
  for (const g of ordered) {
    const section = el("section", "league-group");
    const heading = el("div", "league-heading");
    const name = button(
      g.competition.name,
      () => open("league", g.competition.id),
      "league-name",
    );
    if (g.competition.country)
      name.append(el("small", "", g.competition.country));
    heading.append(
      safeImage(g.competition.logo, "team", ""),
      name,
      favoriteButton("league", g.competition),
    );
    section.append(heading);
    g.matches.forEach((m) => section.append(matchCard(m, open, stale)));
    fragment.append(section);
  }
  target.replaceChildren(fragment);
}
export function dataStatus(target, meta) {
  target.replaceChildren();
  if (!meta) return;
  target.append(
    el(
      "span",
      "",
      `Son yenilənmə: ${clock(meta.fetchedAt)} · ${formatDate(meta.fetchedAt, { year: "numeric" })}`,
    ),
  );
  if (meta.stale) {
    target.append(
      el(
        "div",
        "notice warning",
        `Son saxlanılmış məlumat göstərilir. ${errorMessage({ code: meta.warning })}`,
      ),
    );
  } else if (meta.mode === "economy") {
    target.append(
      el(
        "div",
        "notice warning",
        "Pulsuz qənaət rejimi · məlumatlar 30 dəqiqəyədək gecikə bilər. Canlı status son alınmış məlumata aiddir.",
      ),
    );
  }
}
export function standings(groups, open) {
  const box = el("div");
  for (const g of groups) {
    box.append(el("h3", "subheading", g.name));
    const scroll = el("div", "table-scroll"),
      table = el("table"),
      thead = el("thead"),
      tr = el("tr");
    const heads = [
      ["#", "Sıra"],
      ["Komanda", "Komanda"],
      ["O", "Oyun"],
      ["Q", "Qələbə"],
      ["H", "Heç-heçə"],
      ["M", "Məğlubiyyət"],
      ["VQ", "Vurulan qol"],
      ["BQ", "Buraxılan qol"],
      ["F", "Qol fərqi"],
      ["X", "Xal"],
    ];
    heads.forEach(([t, title]) => {
      const th = el("th", "", t);
      th.scope = "col";
      th.title = title;
      tr.append(th);
    });
    thead.append(tr);
    table.append(thead);
    const tbody = el("tbody");
    for (const r of g.rows) {
      const row = el("tr");
      if (r.zone) {
        row.title = r.zone;
        row.dataset.zone = /relegation/i.test(r.zone)
          ? "relegation"
          : /promotion|champions|europa|conference/i.test(r.zone)
            ? "promotion"
            : "";
      }
      row.append(el("td", "", r.rank));
      const t = el("td");
      t.append(entityButton("team", r.team, open));
      row.append(t);
      [
        "played",
        "won",
        "drawn",
        "lost",
        "goalsFor",
        "goalsAgainst",
        "goalDifference",
        "points",
      ].forEach((k) => row.append(el("td", "", r[k] ?? "—")));
      tbody.append(row);
    }
    table.append(tbody);
    scroll.append(table);
    box.append(scroll);
    const zones = [...new Set(g.rows.map((r) => r.zone).filter(Boolean))];
    if (zones.length) box.append(el("p", "zone-note", zones.join(" · ")));
  }
  return box;
}
export function scorers(players, open, leagueId) {
  const scroll = el("div", "table-scroll"),
    table = el("table"),
    thead = el("thead"),
    tr = el("tr");
  ["#", "Futbolçu", "Oyun", "Qol", "Assist"].forEach((x) => {
    const th = el("th", "", x);
    th.scope = "col";
    tr.append(th);
  });
  thead.append(tr);
  table.append(thead);
  const body = el("tbody");
  players.forEach((p, i) => {
    const s =
        p.stats?.find((x) => String(x.competition.id) === String(leagueId)) ||
        p.stats?.[0] ||
        {},
      row = el("tr"),
      name = el("td");
    name.append(entityButton("player", p, open, s.team?.name));
    row.append(
      el("td", "", i + 1),
      name,
      el("td", "", s.appearances ?? "—"),
      el("td", "", s.goals ?? "—"),
      el("td", "", s.assists ?? "—"),
    );
    body.append(row);
  });
  table.append(body);
  scroll.append(table);
  return scroll;
}
export const statsFacts = (s) =>
  facts([
    ["Oyun", s.appearances],
    ["İlk 11", s.starts],
    ["Dəqiqə", s.minutes],
    ["Qol", s.goals],
    ["Assist", s.assists],
    ["Sarı kart", s.yellow],
    ["Qırmızı kart", s.red],
    ["Zərbə", s.shots],
    ["Dəqiq zərbə", s.shotsOn],
    ["Pas", s.passes],
    ["Pas dəqiqliyi (API)", s.passAccuracy],
  ]);
