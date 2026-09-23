import { readStore, writeStore } from "./utils.js";
const KEY = "kinoflixFootballFavorites",
  HISTORY = "kinoflixFootballHistory";
function clean(items) {
  return Array.isArray(items)
    ? items
        .filter(
          (x) => x && /^\d+$/.test(String(x.id)) && typeof x.name === "string",
        )
        .slice(0, 100)
    : [];
}
export function favorites() {
  const x = readStore(KEY, {});
  return {
    teams: clean(x?.teams),
    players: clean(x?.players),
    leagues: clean(x?.leagues),
  };
}
const bucket = (type) =>
  ({ team: "teams", player: "players", league: "leagues" })[type];
export function isFavorite(type, id) {
  return favorites()[bucket(type)]?.some((x) => String(x.id) === String(id));
}
export function toggleFavorite(type, item) {
  const f = favorites(),
    key = bucket(type);
  if (!key) return;
  f[key] = isFavorite(type, item.id)
    ? f[key].filter((x) => String(x.id) !== String(item.id))
    : [
        ...f[key],
        { id: item.id, name: item.name, logo: item.logo, photo: item.photo },
      ].slice(-100);
  writeStore(KEY, f);
  window.dispatchEvent(new Event("football:favorites"));
}
export function historyItems() {
  return clean(readStore(HISTORY, []))
    .filter((x) => ["team", "player"].includes(x.type))
    .slice(0, 8);
}
export function remember(type, item) {
  writeStore(
    HISTORY,
    [
      {
        type,
        id: item.id,
        name: item.name,
        logo: item.logo,
        photo: item.photo,
      },
      ...historyItems().filter((x) => x.type !== type || x.id !== item.id),
    ].slice(0, 8),
  );
}
export function clearHistory() {
  writeStore(HISTORY, []);
}
