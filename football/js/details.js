import {
  $,
  el,
  button,
  safeImage,
  facts,
  formatDate,
  time,
  minute,
  age,
  statusText,
  isLive,
  icon,
  bakuDate,
} from "./utils.js";
import { provider } from "./provider.js";
import { remember } from "./favorites.js";
import {
  skeleton,
  empty,
  showError,
  entityButton,
  entityGrid,
  favoriteButton,
  matchGroups,
  dataStatus,
  standings,
  scorers,
  statsFacts,
} from "./ui.js";
const POSITION = {
  Goalkeeper: "Qapıçı",
  Defender: "Müdafiəçi",
  Midfielder: "Yarımmüdafiəçi",
  Attacker: "Hücumçu",
  G: "Qapıçı",
  D: "Müdafiəçi",
  M: "Yarımmüdafiəçi",
  F: "Hücumçu",
};
const STAT = {
  "Ball Possession": "Topa sahibolma",
  "Total Shots": "Zərbələr",
  "Shots on Goal": "Qapıya dəqiq zərbələr",
  "Shots off Goal": "Qapıdan kənar zərbələr",
  "Blocked Shots": "Bloklanan zərbələr",
  "Shots insidebox": "Cərimə meydanından zərbələr",
  "Shots outsidebox": "Cərimə meydanından kənar zərbələr",
  Fouls: "Qayda pozuntuları",
  "Corner Kicks": "Kornerlər",
  Offsides: "Ofsayd",
  "Yellow Cards": "Sarı kartlar",
  "Red Cards": "Qırmızı kartlar",
  "Goalkeeper Saves": "Qurtarışlar",
  "Total passes": "Paslar",
  "Passes accurate": "Dəqiq paslar",
  "Passes %": "Pas dəqiqliyi",
};
const EVENT = {
  "Normal Goal": "Qol",
  "Own Goal": "Avtoqol",
  Penalty: "Penalti",
  "Missed Penalty": "Qaçırılan penalti",
  "Yellow Card": "Sarı kart",
  "Red Card": "Qırmızı kart",
  "Yellow-Red Card": "İkinci sarı kart",
  Substitution: "Əvəzetmə",
  "Goal cancelled": "Qol ləğv edildi",
};
export function setupDetails(open) {
  const dialog = $("#detail"),
    body = $("#detail-body"),
    title = $("#detail-title"),
    actions = $("#detail-actions");
  let control,
    partControl,
    entity = null,
    trigger = null,
    partVersion = 0;
  let noticeTimer;
  function toast(text) {
    const t = $("#toast");
    t.textContent = text;
    t.hidden = false;
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => (t.hidden = true), 3500);
  }
  async function share() {
    try {
      if (navigator.share)
        await navigator.share({
          title: `${title.textContent} • KINOFLIX`,
          url: location.href,
        });
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(location.href);
        toast("Keçid kopyalandı.");
      } else {
        const box = el("input");
        box.value = location.href;
        box.readOnly = true;
        box.setAttribute("aria-label", "Paylaşım keçidi");
        body.prepend(box);
        box.focus();
        box.select();
        toast("Keçidi seçib kopyalayın.");
      }
    } catch (e) {
      if (e.name !== "AbortError")
        toast("Keçidi brauzerin ünvan sətrindən kopyalaya bilərsiniz.");
    }
  }
  function close() {
    if (history.state?.footballEntity) history.back();
    else {
      const u = new URL(location.href);
      ["match", "player", "team", "league", "season", "detail"].forEach((k) =>
        u.searchParams.delete(k),
      );
      history.replaceState({}, "", u);
      sync(u);
    }
  }
  $("#close-detail").addEventListener("click", close);
  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    close();
  });
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        close();
    }
  });
  function header(type, item) {
    title.textContent = item.name || "Oyun detalları";
    actions.replaceChildren();
    if (type !== "match") actions.append(favoriteButton(type, item));
    const b = button("", share, "icon-button");
    b.setAttribute("aria-label", "Paylaş");
    b.append(icon("share-nodes"));
    actions.append(b);
  }
  function note(meta) {
    const box = el("div", "data-status");
    dataStatus(box, meta);
    body.append(box);
  }
  function profile(item, type, subtitle) {
    const row = el("div", "profile-hero"),
      text = el("div");
    text.append(el("h3", "", item.fullName || item.name));
    if (subtitle) text.append(el("p", "", subtitle));
    row.append(safeImage(item.photo || item.logo, type, item.name), text);
    body.append(row);
  }
  function tabs(definitions) {
    const nav = el("nav", "detail-tabs");
    nav.setAttribute("aria-label", "Profil bölmələri");
    const content = el("section");
    body.append(nav, content);
    definitions.forEach(([label, loader], idx) => {
      const b = button(label, async () => {
        partControl?.abort();
        partControl = new AbortController();
        const signal = partControl.signal,
          version = ++partVersion;
        nav
          .querySelectorAll("button")
          .forEach((x) => x.setAttribute("aria-current", String(x === b)));
        skeleton(content, "profile");
        try {
          await loader(
            content,
            signal,
            () => version === partVersion && !signal.aborted,
          );
        } catch (error) {
          if (error.name !== "AbortError" && version === partVersion)
            showError(content, error, () => b.click());
        }
      });
      nav.append(b);
      if (idx === 0)
        queueMicrotask(() => {
          if (nav.isConnected) b.click();
        });
    });
    return { nav, content };
  }
  async function drawPlayer(id, season, signal) {
    const r = await provider.getPlayer(id, season, { signal });
    if (signal.aborted) return;
    const p = r.data[0];
    body.replaceChildren();
    if (!p) {
      empty(
        body,
        "Futbolçu məlumatı tapılmadı.",
        `${season} mövsümü üçün məlumat yoxdur. Başqa mövsümü axtarışdan seçin.`,
      );
      return;
    }
    remember("player", p);
    header("player", p);
    profile(p, "player", p.nationality);
    note(r.meta);
    const registeredTeams = el("section", "favorite-block");
    const loadTeams = async () => {
      skeleton(registeredTeams, "profile");
      try {
        const response = await provider.getPlayerTeams(id, { signal });
        if (signal.aborted) return;
        if (!response.data.length)
          return empty(registeredTeams, "Komanda qeydiyyatı tapılmadı.");
        const stamp = el("div", "data-status");
        dataStatus(stamp, response.meta);
        registeredTeams.replaceChildren(
          el("h3", "subheading", "Heyət qeydiyyatına görə komandalar"),
          stamp,
          entityGrid(response.data, "team", open),
        );
      } catch (error) {
        if (!signal.aborted) showError(registeredTeams, error, loadTeams);
      }
    };
    registeredTeams.append(
      button("Cari komanda qeydiyyatını göstər", loadTeams),
    );
    body.append(registeredTeams);
    body.append(
      facts([
        [
          "Doğum tarixi",
          p.birthDate ? formatDate(p.birthDate, { year: "numeric" }) : null,
        ],
        ["Yaş", age(p.birthDate)],
        ["Milliyyət", p.nationality],
        ["Boy", p.height],
        ["Çəki", p.weight],
        ["Mövqe", POSITION[p.position] || p.position],
        ["Forma nömrəsi", p.number],
      ]),
    );
    if (p.stats?.length) {
      body.append(
        el("h3", "subheading", `${season} mövsümü · komanda və turnir üzrə`),
      );
      for (const s of p.stats) {
        const box = el("section", "stat-block");
        box.append(
          entityButton("team", s.team, open, s.competition.name),
          facts([
            ["Mövqe", POSITION[s.position] || s.position],
            ["Forma nömrəsi", s.number],
          ]),
          statsFacts(s),
        );
        body.append(box);
      }
    }
  }
  async function drawTeam(id, signal) {
    const r = await provider.getTeam(id, { signal });
    if (signal.aborted) return;
    const t = r.data[0];
    body.replaceChildren();
    if (!t) {
      empty(body, "Komanda tapılmadı.");
      return;
    }
    remember("team", t);
    header("team", t);
    profile(t, "team", t.country);
    note(r.meta);
    tabs([
      [
        "Ümumi",
        async (c) => {
          c.replaceChildren(
            facts([
              ["Ölkə", t.country],
              ["Yaradılma ili", t.founded],
              ["Stadion", t.venue],
              ["Şəhər", t.city],
              ["Tutum", t.capacity],
            ]),
          );
          const extra = el("div");
          c.append(extra);
          extra.append(
            button("Məşqçi və cari turnirləri göstər", async (e) => {
              e.currentTarget.disabled = true;
              const current = ++partVersion;
              const results = await Promise.allSettled([
                provider.getTeamCoaches(id, { signal: control.signal }),
                provider.getTeamCompetitions(id, { signal: control.signal }),
              ]);
              if (control.signal.aborted || current !== partVersion) return;
              extra.replaceChildren();
              results.forEach((x, i) => {
                if (x.status === "rejected") {
                  showError(extra, x.reason);
                  return;
                }
                if (i === 0 && x.value.data.length)
                  extra.append(
                    facts([
                      ["Məşqçi", x.value.data.map((v) => v.name).join(", ")],
                    ]),
                  );
                if (i === 1)
                  extra.append(entityGrid(x.value.data, "league", open));
              });
            }),
          );
        },
      ],
      [
        "Heyət",
        async (c, s, valid) => {
          const x = await provider.getTeamSquad(id, { signal: s });
          if (!valid()) return;
          if (!x.data.length) return empty(c, "Heyət məlumatı mövcud deyil.");
          c.replaceChildren(
            entityGrid(
              x.data.map((p) => ({
                ...p,
                position: [p.number, POSITION[p.position] || p.position]
                  .filter((v) => v != null)
                  .join(" · "),
              })),
              "player",
              open,
            ),
          );
        },
      ],
      [
        "Oyunlar",
        async (c, s, valid) => {
          const x = await provider.getTeamMatches(id, "next", { signal: s });
          if (valid()) matchGroups(c, x.data, open, x.meta.stale);
        },
      ],
      [
        "Nəticələr",
        async (c, s, valid) => {
          const x = await provider.getTeamMatches(id, "last", { signal: s });
          if (valid()) matchGroups(c, x.data, open, x.meta.stale);
        },
      ],
      [
        "Cədvəl",
        async (c, s, valid) => {
          const x = await provider.getTeamCompetitions(id, { signal: s });
          if (!valid()) return;
          const available = x.data.filter((l) =>
            l.seasons?.some((z) => z.current && z.coverage?.standings),
          );
          if (!available.length)
            return empty(c, "Cədvəl məlumatı mövcud deyil.");
          c.replaceChildren(
            el("p", "notice", "Cədvəlini görmək üçün turniri seçin."),
            entityGrid(available, "league", (type, lid) =>
              open(type, lid, { detail: "standings" }),
            ),
          );
        },
      ],
    ]);
  }
  function renderScoreboard(m, target) {
    target.replaceChildren();
    const home = entityButton("team", m.homeTeam, open),
      away = entityButton("team", m.awayTeam, open),
      score = el("div");
    score.append(
      el("div", "big-score", `${m.score.home ?? "–"} : ${m.score.away ?? "–"}`),
      el(
        "p",
        "muted",
        `${statusText(m)} ${isLive(m) ? minute(m.minute, m.extra) : ""}`,
      ),
    );
    target.append(home, score, away);
  }
  async function drawMatch(id, signal) {
    const r = await provider.getMatch(id, { signal });
    if (signal.aborted) return;
    const m = r.data[0];
    body.replaceChildren();
    if (!m) {
      empty(body, "Oyun tapılmadı.");
      return;
    }
    entity.match = m;
    header("match", { name: `${m.homeTeam.name} – ${m.awayTeam.name}` });
    body.append(
      button(
        m.competition.name,
        () => open("league", m.competition.id),
        "text-button",
      ),
    );
    const board = el("div", "scoreboard");
    board.id = "match-scoreboard";
    renderScoreboard(m, board);
    body.append(board);
    note(r.meta);
    const general = async (c) => {
      const x = entity.match || m;
      c.replaceChildren(
        facts([
          [
            "Başlanma vaxtı",
            `${formatDate(x.kickoff, { year: "numeric" })}, ${time(x.kickoff)}`,
          ],
          ["Turnir", x.competition.name],
          ["Mərhələ", x.competition.round],
          ["Stadion", x.venue],
          ["Hakim", x.referee],
          ["İlk hissə", pair(x.periods?.halftime)],
          ["Final", pair(x.periods?.fulltime)],
          ["Əlavə vaxt", pair(x.periods?.extratime)],
          ["Penaltilər", pair(x.periods?.penalty)],
        ]),
      );
    };
    const definitions = [["Ümumi", general]];
    let coverage;
    try {
      const comp = await provider.getCompetition(m.competition.id, { signal });
      coverage = comp.data[0]?.seasons?.find(
        (s) => s.year === m.competition.season,
      )?.coverage;
    } catch (e) {
      if (e.name === "AbortError") return;
    }
    if (signal.aborted) return;
    if (coverage?.events !== false)
      definitions.push([
        "Hadisələr",
        async (c, s, valid) => {
          const x = await provider.getMatchEvents(id, { signal: s });
          if (!valid()) return;
          if (!x.data.length)
            return empty(c, "Hadisə məlumatı hələ mövcud deyil.");
          const ul = el("ol", "timeline");
          x.data.forEach((e) => {
            const li = el("li"),
              info = el("div");
            li.append(
              el("span", "event-minute", minute(e.minute, e.extra)),
              icon(
                e.type === "Goal"
                  ? "futbol"
                  : e.type === "subst"
                    ? "arrows-rotate"
                    : e.type === "Card"
                      ? "square"
                      : "circle-info",
              ),
            );
            info.append(
              el(
                "strong",
                "",
                e.type === "subst"
                  ? `${e.player.name || ""} → ${e.assist.name || ""}`
                  : e.player.name || e.team.name,
              ),
              el(
                "small",
                "",
                `${EVENT[e.detail] || (e.type === "subst" ? "Əvəzetmə" : e.detail) || e.type} · ${e.team.name}`,
              ),
            );
            li.append(info);
            ul.append(li);
          });
          c.replaceChildren(ul);
        },
      ]);
    if (coverage?.statistics !== false)
      definitions.push([
        "Statistika",
        async (c, s, valid) => {
          const x = await provider.getMatchStatistics(id, { signal: s });
          if (!valid()) return;
          const home = x.data.find((t) => t.team.id === m.homeTeam.id),
            away = x.data.find((t) => t.team.id === m.awayTeam.id);
          const labels = [
            ...new Set(
              [...(home?.values || []), ...(away?.values || [])].map(
                (v) => v.label,
              ),
            ),
          ];
          if (!labels.length) return empty(c, "Statistika hələ mövcud deyil.");
          const box = el("div", "statistics");
          labels.forEach((label) => {
            const row = el("div", "stat-row");
            row.append(
              el(
                "strong",
                "",
                home?.values.find((x) => x.label === label)?.value ?? "—",
              ),
              el("span", "", STAT[label] || label),
              el(
                "strong",
                "",
                away?.values.find((x) => x.label === label)?.value ?? "—",
              ),
            );
            box.append(row);
          });
          c.replaceChildren(box);
        },
      ]);
    if (coverage?.lineups !== false)
      definitions.push([
        "Heyətlər",
        async (c, s, valid) => {
          const x = await provider.getLineups(id, { signal: s });
          if (!valid()) return;
          if (!x.data.length) return empty(c, "Heyətlər hələ açıqlanmayıb.");
          c.replaceChildren();
          x.data.forEach((t) => {
            const box = el("section", "squad-section");
            box.append(
              el(
                "h3",
                "",
                `${t.team.name}${t.formation ? ` · ${t.formation}` : ""}`,
              ),
            );
            if (t.coach) box.append(el("p", "muted", `Məşqçi: ${t.coach}`));
            [
              ["İlk 11", t.starters],
              ["Ehtiyat oyunçular", t.substitutes],
            ].forEach(([label, players]) => {
              if (!players.length) return;
              box.append(el("h3", "subheading", label));
              players.forEach((p) =>
                box.append(
                  entityButton(
                    "player",
                    p,
                    open,
                    [p.number, POSITION[p.position] || p.position]
                      .filter((v) => v != null)
                      .join(" · "),
                  ),
                ),
              );
            });
            c.append(box);
          });
        },
      ]);
    definitions.push([
      "H2H",
      async (c, s, valid) => {
        const x = await provider.getH2H(m.homeTeam.id, m.awayTeam.id, {
          signal: s,
        });
        if (valid()) matchGroups(c, x.data, open, x.meta.stale);
      },
    ]);
    tabs(definitions);
  }
  function pair(p) {
    return p?.home != null && p?.away != null ? `${p.home} : ${p.away}` : null;
  }
  async function drawLeague(id, signal, requested) {
    const r = await provider.getCompetition(id, { signal });
    if (signal.aborted) return;
    const l = r.data[0];
    body.replaceChildren();
    if (!l) {
      empty(body, "Liqa tapılmadı.");
      return;
    }
    header("league", l);
    profile(l, "team", l.country);
    note(r.meta);
    const seasons = [...(l.seasons || [])].sort((a, b) => b.year - a.year);
    let selected = seasons.find((s) => s.current) || seasons[0];
    if (!selected) {
      empty(body, "Mövsüm məlumatı tapılmadı.");
      return;
    }
    const picker = el("select");
    picker.setAttribute("aria-label", "Liqa mövsümü");
    seasons.forEach((s) => {
      const o = el("option", "", s.year);
      o.value = s.year;
      o.selected = s.year === selected.year;
      picker.append(o);
    });
    const row = el("div", "selector-row");
    row.append(el("label", "", "Mövsüm"), picker);
    body.append(row);
    const host = el("div");
    body.append(host);
    async function load(kind) {
      partControl?.abort();
      partControl = new AbortController();
      const local = partControl.signal;
      const version = ++partVersion;
      skeleton(host, "table");
      try {
        if (kind === "standings" && !selected.coverage?.standings)
          return empty(host, "Bu mövsüm üçün cədvəl təqdim edilmir.");
        if (kind === "scorers" && !selected.coverage?.scorers)
          return empty(
            host,
            "Bu mövsüm üçün bombardir məlumatı təqdim edilmir.",
          );
        const x = await (kind === "scorers"
          ? provider.getTopScorers(id, selected.year, { signal: local })
          : provider.getStandings(id, selected.year, { signal: local }));
        if (local.aborted || version !== partVersion) return;
        if (!x.data.length) return empty(host, "Məlumat hələ mövcud deyil.");
        const meta = el("div", "data-status");
        dataStatus(meta, x.meta);
        host.replaceChildren(
          meta,
          kind === "scorers"
            ? scorers(
                x.data,
                (type, pid) => open(type, pid, { season: selected.year }),
                id,
              )
            : standings(x.data, open),
        );
      } catch (error) {
        if (error.name !== "AbortError")
          showError(host, error, () => load(kind));
      }
    }
    let kind = requested === "scorers" ? "scorers" : "standings";
    const nav = el("nav", "detail-tabs");
    const items = [
      ["standings", "Cədvəl"],
      ["scorers", "Bombardirlər"],
    ];
    const refresh = () => {
      nav
        .querySelectorAll("button")
        .forEach((b) =>
          b.setAttribute("aria-current", String(b.dataset.kind === kind)),
        );
      load(kind);
    };
    items.forEach(([k, label]) => {
      const b = button(label, () => {
        kind = k;
        refresh();
      });
      b.dataset.kind = k;
      nav.append(b);
    });
    body.insertBefore(nav, host);
    picker.addEventListener("change", () => {
      selected = seasons.find((s) => s.year === +picker.value);
      refresh();
    });
    refresh();
  }
  async function sync(url = new URL(location.href)) {
    control?.abort();
    partControl?.abort();
    partVersion++;
    control = new AbortController();
    const signal = control.signal;
    const type = ["match", "player", "team", "league"].find((k) =>
      url.searchParams.has(k),
    );
    if (!type) {
      entity = null;
      if (dialog.open) dialog.close();
      document.body.classList.remove("modal-open");
      trigger?.focus?.();
      return;
    }
    const id = url.searchParams.get(type);
    if (!/^\d+$/.test(id || "")) {
      if (!dialog.open) dialog.showModal();
      empty(body, "Keçid düzgün deyil.");
      return;
    }
    entity = { type, id };
    if (!dialog.open) {
      trigger = document.activeElement;
      dialog.showModal();
      document.body.classList.add("modal-open");
    }
    title.textContent = "Məlumat yüklənir";
    actions.replaceChildren();
    skeleton(body, "profile");
    try {
      const rawSeason = url.searchParams.get("season");
      const season = /^20\d{2}$/.test(rawSeason || "")
        ? +rawSeason
        : +bakuDate().slice(0, 4);
      if (type === "player") await drawPlayer(id, season, signal);
      else if (type === "team") await drawTeam(id, signal);
      else if (type === "match") await drawMatch(id, signal);
      else await drawLeague(id, signal, url.searchParams.get("detail"));
    } catch (error) {
      if (!signal.aborted) showError(body, error, () => sync(url));
    }
  }
  return {
    sync,
    toast,
    async refreshMatch(signal) {
      if (entity?.type !== "match") return;
      const id = entity.id;
      const r = await provider.getMatch(id, { signal });
      if (signal.aborted || entity?.id !== id || !r.data[0]) return;
      entity.match = r.data[0];
      const board = $("#match-scoreboard");
      if (board) renderScoreboard(r.data[0], board);
      const noteBox = $(".data-status", body);
      if (noteBox) dataStatus(noteBox, r.meta);
    },
  };
}
