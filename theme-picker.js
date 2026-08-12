// User-selectable presentation themes for the Atlas visualization.
// This file changes presentation only; hierarchy data and geometry stay untouched.
(() => {
  const themes = [
    { id: "clean-modern", name: "Clean & Modern", note: "Airy blue · thin borders", scale: 1.12 },
    { id: "bold-contrast", name: "Bold & High Contrast", note: "Dark tiles · strongest contrast", scale: 1.08 },
    { id: "calm-earthy", name: "Calm & Earthy", note: "Muted natural palette", scale: 1.12 },
    { id: "minimal-neutral", name: "Minimal & Neutral", note: "Quiet grayscale", scale: 1.10 },
    { id: "vibrant-distinct", name: "Vibrant & Distinct", note: "Color-coded variety", scale: 1.08 },
    { id: "soft-refined", name: "Soft & Refined", note: "Rounded, subtle, calm", scale: 1.10 }
  ];

  const storageKey = "atlas-theme";
  const toolbar = document.querySelector(".toolbar");
  if (!toolbar) return;

  const control = document.createElement("div");
  control.className = "theme-control";
  control.innerHTML = `
    <button class="theme-trigger" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="theme-menu">
      <span aria-hidden="true">◐</span><span>Theme</span>
    </button>
    <div id="theme-menu" class="theme-menu" role="menu" aria-label="Atlas theme" hidden></div>`;
  document.body.appendChild(control);

  const trigger = control.querySelector(".theme-trigger");
  const menu = control.querySelector(".theme-menu");

  themes.forEach(theme => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-option";
    button.dataset.theme = theme.id;
    button.setAttribute("role", "menuitemradio");
    button.innerHTML = `<span class="theme-swatch swatch-${theme.id}" aria-hidden="true"></span><span><strong>${theme.name}</strong><small>${theme.note}</small></span><span class="theme-check" aria-hidden="true">✓</span>`;
    menu.appendChild(button);
  });

  function applyFontScale(theme) {
    document.querySelectorAll("#viz text.cell-label").forEach(text => {
      let base = Number(text.dataset.themeBaseFont);
      if (!base) {
        base = parseFloat(text.style.fontSize || getComputedStyle(text).fontSize) || 12;
        text.dataset.themeBaseFont = String(base);
      }
      text.style.fontSize = `${base * theme.scale}px`;
    });
  }

  let current = themes.find(t => t.id === localStorage.getItem(storageKey)) || themes.find(t => t.id === "calm-earthy") || themes[0];

  function applyTheme(id, persist = true) {
    current = themes.find(t => t.id === id) || themes[0];
    document.body.dataset.theme = current.id;
    themes.forEach(theme => document.body.classList.toggle(`theme-${theme.id}`, theme.id === current.id));
    menu.querySelectorAll(".theme-option").forEach(button => {
      const active = button.dataset.theme === current.id;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-checked", active ? "true" : "false");
    });
    trigger.setAttribute("aria-label", `Theme: ${current.name}`);
    applyFontScale(current);
    if (persist) localStorage.setItem(storageKey, current.id);
  }

  function closeMenu() {
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  }

  trigger.addEventListener("click", event => {
    event.stopPropagation();
    const opening = menu.hidden;
    menu.hidden = !opening;
    trigger.setAttribute("aria-expanded", opening ? "true" : "false");
  });

  menu.addEventListener("click", event => {
    const option = event.target.closest(".theme-option");
    if (!option) return;
    applyTheme(option.dataset.theme);
    closeMenu();
  });

  document.addEventListener("click", event => { if (!control.contains(event.target)) closeMenu(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });

  let queued = false;
  const viz = document.querySelector("#viz");
  if (viz && typeof MutationObserver !== "undefined") {
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; applyFontScale(current); });
    }).observe(viz, { childList: true, subtree: true });
  }

  applyTheme(current.id, false);
})();