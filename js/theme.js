const STORAGE_KEY = "huc-theme";

export function initTheme() {
  const toggle = document.querySelector("#theme-toggle");
  const icon = document.querySelector("#theme-icon");
  const label = document.querySelector("#theme-label");

  const savedTheme = localStorage.getItem(STORAGE_KEY);
  let isDark = savedTheme !== "light";

  function applyTheme() {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    toggle.setAttribute("aria-checked", String(isDark));
    icon.textContent = isDark ? "☾" : "☀";
    label.textContent = isDark ? "Escuro" : "Claro";
  }

  toggle.addEventListener("click", () => {
    isDark = !isDark;
    localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    applyTheme();
  });

  applyTheme();
}
