import { request } from "./api.js";
const qs = (params) => new URLSearchParams(params).toString();
/** Provider-neutral frontend interface. Responses contain normalized DTOs only. */
export class FootballProvider {
  getLiveMatches(o) {
    return request("/api/live", o);
  }
  getMatchesByDate(date, o) {
    return request(`/api/matches?${qs({ date })}`, o);
  }
  getMatch(id, o) {
    return request(`/api/match/${id}`, o);
  }
  getMatchEvents(id, o) {
    return request(`/api/match/${id}/events`, o);
  }
  getMatchStatistics(id, o) {
    return request(`/api/match/${id}/statistics`, o);
  }
  getLineups(id, o) {
    return request(`/api/match/${id}/lineups`, o);
  }
  getH2H(home, away, o) {
    return request(`/api/h2h?${qs({ home, away })}`, o);
  }
  searchPlayers(q, season, page = 1, o) {
    return request(`/api/player/search?${qs({ q, season, page })}`, o);
  }
  getPlayer(id, season, o) {
    return request(`/api/player/${id}?${qs({ season })}`, o);
  }
  getPlayerStats(id, season, o) {
    return this.getPlayer(id, season, o);
  }
  getPlayerTeams(id, o) {
    return request(`/api/player/${id}/teams`, o);
  }
  searchTeams(q, o) {
    return request(`/api/team/search?${qs({ q })}`, o);
  }
  getTeam(id, o) {
    return request(`/api/team/${id}`, o);
  }
  getTeamSquad(id, o) {
    return request(`/api/team/${id}/squad`, o);
  }
  getTeamMatches(id, mode = "next", o) {
    return request(`/api/team/${id}/matches?${qs({ mode })}`, o);
  }
  getTeamCompetitions(id, o) {
    return request(`/api/team/${id}/competitions`, o);
  }
  getTeamCoaches(id, o) {
    return request(`/api/team/${id}/coaches`, o);
  }
  getCompetitions(o) {
    return request("/api/competitions", o);
  }
  getCompetition(id, o) {
    return request(`/api/competition/${id}`, o);
  }
  getStandings(id, season, o) {
    return request(`/api/standings/${id}?${qs({ season })}`, o);
  }
  getTopScorers(id, season, o) {
    return request(`/api/scorers/${id}?${qs({ season })}`, o);
  }
}
export const provider = new FootballProvider();
