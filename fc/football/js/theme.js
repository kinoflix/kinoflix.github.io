// Uses the existing KINOFLIX theme key and attribute. No second theme system.
(() => {
  let theme = "dark";
  try {
    theme = localStorage.getItem("flix-theme") === "light" ? "light" : "dark";
  } catch {}
  document.documentElement.setAttribute("data-theme", theme);
})();
