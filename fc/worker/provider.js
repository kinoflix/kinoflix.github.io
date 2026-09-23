/** API-Football v3 adapter. No provider response is exposed to the frontend.
 * Contracts: docs/SOURCES.md. Optional fields stay null, never fabricated.
 */
export class ApiError extends Error {
  constructor(code, status = 502, retryAfter = 60) {
    super(code);
    this.code = code;
    this.status = status;
    this.retryAfter = retryAfter;
  }
}
const list = (value) => (Array.isArray(value) ? value : []);
const n = (value) =>
  value == null || value === "" || !Number.isFinite(Number(value))
    ? null
    : Number(value);
export const team = (t = {}) => ({
  id: t?.id,
  name: t?.name || "Komanda",
  logo: t?.logo || null,
});
export const competition = (l = {}, c = {}) => ({
  id: l?.id,
  name: l?.name || "Turnir",
  logo: l?.logo || null,
  country: c?.name || l?.country || null,
  flag: c?.flag || l?.flag || null,
  season: l?.season ?? null,
  round: l?.round || null,
});
export function match(x) {
  const f = x.fixture || {},
    s = f.status || {},
    ts = x.teams || {};
  const events = list(x.events);
  const reds = (id) =>
    x.events == null
      ? null
      : events.filter(
          (e) =>
            e.team?.id === id &&
            ["Red Card", "Yellow-Red Card"].includes(e.detail),
        ).length;
  return {
    id: f.id,
    competition: competition(x.league),
    homeTeam: team(ts.home),
    awayTeam: team(ts.away),
    kickoff: f.date || null,
    status: s.short || "TBD",
    minute: n(s.elapsed),
    extra: n(s.extra),
    score: { home: n(x.goals?.home), away: n(x.goals?.away) },
    periods: Object.fromEntries(
      ["halftime", "fulltime", "extratime", "penalty"].map((k) => [
        k,
        { home: n(x.score?.[k]?.home), away: n(x.score?.[k]?.away) },
      ]),
    ),
    venue: f.venue?.name || null,
    city: f.venue?.city || null,
    referee: f.referee || null,
    redCards: { home: reds(ts.home?.id), away: reds(ts.away?.id) },
  };
}
export function player(x = {}) {
  const p = x.player || x;
  return {
    id: p.id,
    name: p.name || [p.firstname, p.lastname].filter(Boolean).join(" "),
    fullName: [p.firstname, p.lastname].filter(Boolean).join(" ") || p.name,
    photo: p.photo || null,
    birthDate: p.birth?.date || null,
    nationality: p.nationality || null,
    height: p.height || null,
    weight: p.weight || null,
    number: p.number ?? null,
    position: p.position || null,
    stats: list(x.statistics).map((s) => ({
      team: team(s.team),
      competition: competition(s.league),
      season: s.league?.season,
      position: s.games?.position,
      number: s.games?.number,
      appearances: n(s.games?.appearences),
      starts: n(s.games?.lineups),
      minutes: n(s.games?.minutes),
      goals: n(s.goals?.total),
      assists: n(s.goals?.assists),
      yellow: n(s.cards?.yellow),
      red: n(s.cards?.red),
      shots: n(s.shots?.total),
      shotsOn: n(s.shots?.on),
      passes: n(s.passes?.total),
      passAccuracy: s.passes?.accuracy ?? null,
    })),
  };
}
export function normalize(kind, raw) {
  const data = list(raw);
  if (kind === "matches") return data.map(match);
  if (kind === "players") return data.map(player);
  if (kind === "teams")
    return data.map((x) => ({
      ...team(x.team),
      country: x.team?.country,
      founded: x.team?.founded,
      venue: x.venue?.name,
      city: x.venue?.city,
      capacity: x.venue?.capacity,
    }));
  if (kind === "competitions")
    return data.map((x) => ({
      ...competition(x.league, x.country),
      seasons: list(x.seasons).map((s) => ({
        year: s.year,
        current: s.current,
        start: s.start,
        end: s.end,
        coverage: {
          standings: !!s.coverage?.standings,
          scorers: !!s.coverage?.top_scorers,
          events: !!s.coverage?.fixtures?.events,
          statistics: !!s.coverage?.fixtures?.statistics_fixtures,
          lineups: !!s.coverage?.fixtures?.lineups,
        },
      })),
    }));
  if (kind === "events")
    return data.map((e) => ({
      minute: n(e.time?.elapsed),
      extra: n(e.time?.extra),
      team: team(e.team),
      player: { id: e.player?.id, name: e.player?.name },
      assist: { id: e.assist?.id, name: e.assist?.name },
      type: e.type,
      detail: e.detail,
      comments: e.comments,
    }));
  if (kind === "statistics")
    return data.map((s) => ({
      team: team(s.team),
      values: list(s.statistics)
        .filter((x) => x.value != null)
        .map((x) => ({ label: x.type, value: x.value })),
    }));
  if (kind === "lineups")
    return data.map((l) => ({
      team: team(l.team),
      formation: l.formation,
      coach: l.coach?.name,
      starters: list(l.startXI).map((x) => ({
        id: x.player?.id,
        name: x.player?.name,
        number: x.player?.number,
        position: x.player?.pos,
      })),
      substitutes: list(l.substitutes).map((x) => ({
        id: x.player?.id,
        name: x.player?.name,
        number: x.player?.number,
        position: x.player?.pos,
      })),
    }));
  if (kind === "squad") return data.flatMap((s) => list(s.players).map(player));
  if (kind === "coaches")
    return data.map((c) => ({
      id: c.id,
      name: c.name,
      photo: c.photo,
      team: team(c.team),
    }));
  if (kind === "standings")
    return data.flatMap((x) =>
      list(x.league?.standings).map((g, i) => ({
        name: g[0]?.group || `Qrup ${i + 1}`,
        competition: competition(x.league),
        rows: list(g).map((r) => ({
          rank: r.rank,
          team: team(r.team),
          played: r.all?.played,
          won: r.all?.win,
          drawn: r.all?.draw,
          lost: r.all?.lose,
          goalsFor: r.all?.goals?.for,
          goalsAgainst: r.all?.goals?.against,
          goalDifference: r.goalsDiff,
          points: r.points,
          form: r.form,
          zone: r.description || null,
        })),
      })),
    );
  throw new ApiError("INVALID_ROUTE", 400);
}
export class FootballProvider {
  async request() {
    throw new ApiError("NOT_CONFIGURED", 503);
  }
}
export class ApiFootballProvider extends FootballProvider {
  constructor(key, fetcher = fetch) {
    super();
    this.key = key;
    this.fetcher = fetcher;
  }
  async request(route) {
    if (!this.key) throw new ApiError("NOT_CONFIGURED", 503);
    const url = new URL(route.upstream, "https://v3.football.api-sports.io/");
    for (const [key, value] of Object.entries(route.params))
      url.searchParams.set(key, String(value));
    const control = new AbortController();
    const timeout = setTimeout(() => control.abort(), 12000);
    try {
      const response = await this.fetcher(url, {
        headers: { "x-apisports-key": this.key },
        signal: control.signal,
      });
      if (response.status === 429) throw new ApiError("RATE_LIMIT", 429, 120);
      if ([401, 403].includes(response.status))
        throw new ApiError("PLAN_OR_KEY", 503, 600);
      if (!response.ok) throw new ApiError("UPSTREAM", 502);
      let body;
      try {
        body = await response.json();
      } catch {
        throw new ApiError("UPSTREAM", 502);
      }
      if (body.errors && Object.keys(body.errors).length) {
        const errors = JSON.stringify(body.errors).toLowerCase();
        if (/limit|requests|quota/.test(errors))
          throw new ApiError("RATE_LIMIT", 429, 120);
        if (/plan|subscription|access|token|key/.test(errors))
          throw new ApiError("PLAN_OR_KEY", 503, 600);
        throw new ApiError("UNAVAILABLE", 422, 300);
      }
      if (!Array.isArray(body.response)) throw new ApiError("UPSTREAM", 502);
      return {
        data: normalize(route.kind, body.response),
        paging: {
          current: body.paging?.current || 1,
          total: body.paging?.total || 1,
        },
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("UPSTREAM", 502);
    } finally {
      clearTimeout(timeout);
    }
  }
}
