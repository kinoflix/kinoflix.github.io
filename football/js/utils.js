import { CONFIG } from "./config.js";
export const $ = (s, root = document) => root.querySelector(s);
export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
}
export function readStore(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
export function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
export function bakuDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: CONFIG.TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type) => parts.find((p) => p.type === type).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
// Calendar arithmetic, not a timezone offset. Noon UTC avoids date boundaries.
export function shiftDate(ymd, days) {
  const date = new Date(`${ymd}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
const AZ_MONTHS = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avqust",
  "sentyabr",
  "oktyabr",
  "noyabr",
  "dekabr",
];
const AZ_WEEKDAYS = {
  Monday: "Bazar ertəsi",
  Tuesday: "Çərşənbə axşamı",
  Wednesday: "Çərşənbə",
  Thursday: "Cümə axşamı",
  Friday: "Cümə",
  Saturday: "Şənbə",
  Sunday: "Bazar",
};
export function formatDate(value, options = {}) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "—";
  const settings = {
    timeZone: CONFIG.TIMEZONE,
    day: "numeric",
    month: "long",
    ...options,
  };
  // Some browsers have incomplete az locale data ("M09", English weekdays).
  // Intl still performs all timezone conversion; local labels ensure AZ text.
  if (
    CONFIG.LOCALE.startsWith("az") &&
    (settings.day || settings.month || settings.year)
  ) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: CONFIG.TIMEZONE,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).formatToParts(date);
    const part = (type) => parts.find((p) => p.type === type).value;
    const fields = [];
    if (settings.day)
      fields.push(
        settings.day === "2-digit" ? part("day") : String(Number(part("day"))),
      );
    if (settings.month) {
      const name = AZ_MONTHS[Number(part("month")) - 1];
      fields.push(
        settings.month === "long"
          ? name
          : settings.month === "short"
            ? name.slice(0, 3)
            : settings.month === "2-digit"
              ? part("month")
              : String(Number(part("month"))),
      );
    }
    if (settings.year)
      fields.push(
        settings.year === "2-digit" ? part("year").slice(-2) : part("year"),
      );
    let result = fields.join(
      ["numeric", "2-digit"].includes(settings.month) ? "." : " ",
    );
    if (settings.weekday) {
      const weekday = new Intl.DateTimeFormat("en-US", {
        timeZone: CONFIG.TIMEZONE,
        weekday: "long",
      }).format(date);
      result += `, ${AZ_WEEKDAYS[weekday]}`;
    }
    if (settings.hour || settings.minute || settings.second) {
      result += `, ${new Intl.DateTimeFormat(CONFIG.LOCALE, { timeZone: CONFIG.TIMEZONE, hour: settings.hour, minute: settings.minute, second: settings.second, hourCycle: "h23" }).format(date)}`;
    }
    return result;
  }
  return new Intl.DateTimeFormat(CONFIG.LOCALE, settings).format(date);
}
export const time = (value) =>
  formatDate(value, {
    day: undefined,
    month: undefined,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
export const clock = (value) =>
  formatDate(value, {
    day: undefined,
    month: undefined,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
export function age(birth, today = bakuDate()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birth || "")) return null;
  const birthDate = new Date(`${birth}T12:00:00Z`);
  if (
    Number.isNaN(birthDate.getTime()) ||
    birthDate.toISOString().slice(0, 10) !== birth
  )
    return null;
  const [y, m, d] = birth.split("-").map(Number);
  const [cy, cm, cd] = today.split("-").map(Number);
  const result = cy - y - (cm < m || (cm === m && cd < d) ? 1 : 0);
  return result >= 0 ? result : null;
}
export const minute = (m, extra) =>
  m == null ? "" : `${m}${extra ? `+${extra}` : ""}′`;
export const STATUS = {
  NS: "Başlamayıb",
  TBD: "Vaxtı dəqiqləşir",
  "1H": "Canlı",
  HT: "Fasilə",
  "2H": "Canlı",
  ET: "Əlavə vaxt",
  BT: "Fasilə",
  P: "Penaltilər",
  FT: "Bitib",
  AET: "Əlavə vaxtda bitib",
  PEN: "Penaltilərlə bitib",
  SUSP: "Dayandırılıb",
  INT: "Fasilə verilib",
  PST: "Təxirə salınıb",
  CANC: "Ləğv edilib",
  ABD: "Yarımçıq dayandırılıb",
  AWD: "Texniki nəticə",
  WO: "Texniki qələbə",
  LIVE: "Canlı",
};
export const isLive = (m) =>
  ["1H", "HT", "2H", "ET", "BT", "P", "LIVE"].includes(m.status);
export const isFinished = (m) =>
  ["FT", "AET", "PEN", "AWD", "WO"].includes(m.status);
export const isScheduled = (m) => ["NS", "TBD"].includes(m.status);
export const statusText = (m) => STATUS[m.status] || "Status dəqiqləşir";
export function sortMatches(a, b) {
  const rank = (m) =>
    isLive(m) ? 0 : isScheduled(m) ? 1 : isFinished(m) ? 3 : 2;
  return rank(a) - rank(b) || new Date(a.kickoff) - new Date(b.kickoff);
}
export function safeImage(url, kind = "team", name = "") {
  const image = el("img", `avatar ${kind}`);
  const fallback = new URL(
    `../assets/${kind === "player" ? "player" : "team"}.svg`,
    import.meta.url,
  ).href;
  let safe = fallback;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:") safe = parsed.href;
  } catch {
    /* local fallback */
  }
  image.src = safe;
  image.alt = name;
  image.loading = "lazy";
  image.decoding = "async";
  image.addEventListener(
    "error",
    () => {
      image.src = fallback;
    },
    { once: true },
  );
  return image;
}
export function button(text, action, className = "button") {
  const b = el("button", className, text);
  b.type = "button";
  if (action) b.addEventListener("click", action);
  return b;
}
export function icon(name) {
  const i = el("i", `fa-solid fa-${name}`);
  i.setAttribute("aria-hidden", "true");
  return i;
}
export function facts(entries) {
  const dl = el("dl", "facts");
  for (const [label, value] of entries) {
    if (value == null || value === "") continue;
    const pair = el("div");
    pair.append(el("dt", "", label), el("dd", "", value));
    dl.append(pair);
  }
  return dl;
}
