import { ApiError } from "./provider.js";
const invalid = () => {
  throw new ApiError("INVALID_INPUT", 400);
};
function integer(value, min = 1, max = 99999999) {
  if (!/^\d+$/.test(value || "") || +value < min || +value > max) invalid();
  return +value;
}
export function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) invalid();
  const d = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value)
    invalid();
  return value;
}
export function today() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Baku",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
export function resolveRoute(url, env = {}) {
  const path = url.pathname,
    q = url.searchParams;
  let upstream,
    params = {},
    kind,
    ttl = 21600,
    core = false;
  let allowed = [],
    m;
  const season = () =>
    integer(q.get("season"), 2000, new Date().getUTCFullYear() + 1);
  const search = () => {
    const term = (q.get("q") || "").trim().normalize("NFKC");
    if (
      term.length < 3 ||
      term.length > 60 ||
      !/^[\p{L}\p{N}\s.'’\-]+$/u.test(term)
    )
      invalid();
    return term;
  };
  if (path === "/api/live") {
    upstream = "fixtures";
    params = { live: "all", timezone: "Asia/Baku" };
    kind = "matches";
    ttl = 30;
    core = true;
  } else if (path === "/api/matches") {
    allowed = ["date"];
    const date = validDate(q.get("date"));
    upstream = "fixtures";
    params = { date, timezone: "Asia/Baku" };
    kind = "matches";
    ttl = date === today() ? 90 : 1800;
    core = true;
  } else if (
    (m = path.match(/^\/api\/match\/(\d+)(?:\/(events|statistics|lineups))?$/))
  ) {
    const id = integer(m[1]);
    upstream = m[2] ? `fixtures/${m[2]}` : "fixtures";
    params = m[2] ? { fixture: id } : { id };
    kind = m[2] || "matches";
    ttl = m[2] === "lineups" ? 600 : 60;
  } else if (path === "/api/h2h") {
    allowed = ["home", "away"];
    upstream = "fixtures/headtohead";
    params = {
      h2h: `${integer(q.get("home"))}-${integer(q.get("away"))}`,
      last: 5,
    };
    kind = "matches";
    ttl = 21600;
  } else if (path === "/api/player/search") {
    allowed = ["q", "season", "page"];
    const query = search();
    upstream = "players";
    params = {
      search: query.split(/\s+/).at(-1),
      season: season(),
      page: integer(q.get("page") || "1", 1, 100),
    };
    kind = "players";
  } else if ((m = path.match(/^\/api\/player\/(\d+)\/teams$/))) {
    upstream = "players/squads";
    params = { player: integer(m[1]) };
    kind = "teams";
  } else if ((m = path.match(/^\/api\/player\/(\d+)(?:\/(stats))?$/))) {
    allowed = ["season"];
    upstream = "players";
    params = { id: integer(m[1]), season: season() };
    kind = "players";
  } else if (path === "/api/team/search") {
    allowed = ["q"];
    upstream = "teams";
    params = {
      search: search()
        .replace(/ə/gi, "e")
        .replace(/ı/g, "i")
        .normalize("NFD")
        .replace(/\p{M}/gu, ""),
    };
    kind = "teams";
  } else if (
    (m = path.match(
      /^\/api\/team\/(\d+)(?:\/(squad|matches|competitions|coaches))?$/,
    ))
  ) {
    const id = integer(m[1]);
    if (m[2] === "squad") {
      upstream = "players/squads";
      params = { team: id };
      kind = "squad";
    } else if (m[2] === "matches") {
      allowed = ["mode"];
      const mode = q.get("mode") || "next";
      if (!["next", "last"].includes(mode)) invalid();
      upstream = "fixtures";
      params = { team: id, [mode]: 10, timezone: "Asia/Baku" };
      kind = "matches";
      ttl = 900;
    } else if (m[2] === "competitions") {
      upstream = "leagues";
      params = { team: id, current: true };
      kind = "competitions";
    } else if (m[2] === "coaches") {
      upstream = "coachs";
      params = { team: id };
      kind = "coaches";
    } else {
      upstream = "teams";
      params = { id };
      kind = "teams";
    }
  } else if (path === "/api/competitions") {
    upstream = "leagues";
    params = { current: true };
    kind = "competitions";
    ttl = 86400;
  } else if ((m = path.match(/^\/api\/competition\/(\d+)$/))) {
    upstream = "leagues";
    params = { id: integer(m[1]) };
    kind = "competitions";
    ttl = 86400;
  } else if ((m = path.match(/^\/api\/(standings|scorers)\/(\d+)$/))) {
    allowed = ["season"];
    upstream = m[1] === "scorers" ? "players/topscorers" : "standings";
    params = { league: integer(m[2]), season: season() };
    kind = m[1] === "scorers" ? "players" : "standings";
    ttl = 1800;
  } else throw new ApiError("NOT_FOUND", 404);
  for (const key of q.keys())
    if (!allowed.includes(key) || q.getAll(key).length !== 1) invalid();
  // Safe default: no subscription, no short live interval silently consuming 100/day.
  const economy = env.DATA_MODE !== "realtime";
  if (economy) ttl = Math.max(ttl, kind === "matches" ? 1800 : 3600);
  const canonical = new URLSearchParams(
    Object.entries(params).sort(([a], [b]) => a.localeCompare(b)),
  ).toString();
  return {
    upstream,
    params,
    kind,
    ttl,
    core,
    key: `${upstream}?${canonical}`,
    mode: economy ? "economy" : "realtime",
  };
}
