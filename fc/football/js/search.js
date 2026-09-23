import { $, el, button } from "./utils.js";
import { CONFIG } from "./config.js";
import { provider } from "./provider.js";
import { historyItems, clearHistory } from "./favorites.js";
import { skeleton, entityButton } from "./ui.js";
import { errorMessage } from "./api.js";
export function setupSearch(open) {
  const input = $("#search"),
    results = $("#search-results"),
    wrap = $("#search-wrap");
  let timer,
    controller,
    seq = 0,
    lastKey = "",
    lastAt = 0,
    page = 1;
  let season = Number(
    new Intl.DateTimeFormat("en", {
      year: "numeric",
      timeZone: CONFIG.TIMEZONE,
    }).format(new Date()),
  );
  const hide = () => {
    results.hidden = true;
    input.setAttribute("aria-expanded", "false");
    controller?.abort();
    clearTimeout(timer);
    seq++;
  };
  const show = () => {
    results.hidden = false;
    input.setAttribute("aria-expanded", "true");
  };
  const select = (type, id) => {
    hide();
    input.value = "";
    open(type, id, { season });
  };
  function history() {
    show();
    results.replaceChildren();
    const top = el("div", "search-top");
    top.append(
      el("h3", "", "Son baxılanlar"),
      button(
        "Təmizlə",
        () => {
          clearHistory();
          history();
        },
        "text-button",
      ),
    );
    results.append(top);
    const items = historyItems();
    items.forEach((x) => results.append(entityButton(x.type, x, select)));
    if (!items.length)
      results.append(
        el("p", "notice", "Axtarış üçün ən azı 3 simvol daxil edin."),
      );
  }
  async function search(append = false) {
    const q = input.value.trim();
    if (q.length < CONFIG.MIN_QUERY) {
      history();
      return;
    }
    const key = `${q}:${season}:${page}`;
    if (key === lastKey && Date.now() - lastAt < 5000) return;
    lastKey = key;
    lastAt = Date.now();
    controller?.abort();
    controller = new AbortController();
    const signal = controller.signal,
      token = ++seq;
    show();
    if (!append) skeleton(results, "profile");
    const responses = await Promise.allSettled([
      provider.searchPlayers(q, season, page, { signal }),
      ...(append ? [] : [provider.searchTeams(q, { signal })]),
    ]);
    if (token !== seq || signal.aborted) return;
    if (!append) {
      results.replaceChildren();
      const top = el("div", "search-top"),
        label = el("label", "", "Futbolçu mövsümü "),
        picker = el("select");
      picker.setAttribute("aria-label", "Futbolçu axtarış mövsümü");
      for (
        let y = new Date().getFullYear();
        y >= new Date().getFullYear() - 8;
        y--
      ) {
        const op = el("option", "", `${y} / ${y + 1}`);
        op.value = y;
        op.selected = y === season;
        picker.append(op);
      }
      picker.addEventListener("change", () => {
        season = +picker.value;
        page = 1;
        search();
      });
      label.append(picker);
      top.append(el("h3", "", "Axtarış nəticələri"), label);
      results.append(top);
      results.append(
        el(
          "p",
          "notice",
          "Futbolçu axtarışı soyad üzrə, seçilmiş mövsümdə aparılır. Nəticə yoxdursa əvvəlki mövsümü seçin.",
        ),
      );
    }
    responses.forEach((r, i) => {
      const type = i === 0 ? "player" : "team";
      results.append(el("h3", "", i === 0 ? "Futbolçular" : "Komandalar"));
      if (r.status === "rejected") {
        results.append(el("p", "notice warning", errorMessage(r.reason)));
        return;
      }
      if (!r.value.data.length) {
        results.append(el("p", "notice", "Nəticə tapılmadı."));
        return;
      }
      if (r.value.meta.stale)
        results.append(
          el("p", "notice warning", "Son saxlanılmış məlumat göstərilir."),
        );
      r.value.data.forEach((item) =>
        results.append(
          entityButton(type, item, select, item.nationality || item.country),
        ),
      );
    });
    if (responses.some((r) => r.status === "rejected")) {
      results.append(
        button(
          "Yenidən cəhd et",
          () => {
            lastKey = "";
            page = 1;
            search();
          },
          "button load-more",
        ),
      );
    }
    const p = responses[0];
    if (
      p.status === "fulfilled" &&
      p.value.paging.current < p.value.paging.total
    ) {
      results.append(
        button(
          "Daha çox futbolçu",
          (event) => {
            event.currentTarget.remove();
            page++;
            search(true);
          },
          "button load-more",
        ),
      );
    }
  }
  input.addEventListener("input", () => {
    controller?.abort();
    seq++;
    clearTimeout(timer);
    page = 1;
    if (input.value.trim().length < CONFIG.MIN_QUERY) {
      history();
      return;
    }
    timer = setTimeout(() => search(), CONFIG.SEARCH_DEBOUNCE_MS);
  });
  input.addEventListener("focus", () => {
    if (!input.value.trim()) history();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hide();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      results.querySelector("button")?.focus();
    }
    if (e.key === "Enter") {
      clearTimeout(timer);
      search();
    }
  });
  results.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hide();
      input.focus();
    }
    if (["ArrowDown", "ArrowUp"].includes(e.key)) {
      const bs = [...results.querySelectorAll("button")],
        idx = bs.indexOf(document.activeElement);
      e.preventDefault();
      bs[
        (idx + (e.key === "ArrowDown" ? 1 : -1) + bs.length) % bs.length
      ]?.focus();
    }
  });
  document.addEventListener("pointerdown", (e) => {
    if (!wrap.contains(e.target)) hide();
  });
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "/" &&
      !["INPUT", "SELECT", "TEXTAREA"].includes(
        document.activeElement.tagName,
      ) &&
      !$("#detail").open
    ) {
      e.preventDefault();
      input.focus();
    }
  });
}
