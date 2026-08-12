// User-selectable presentation themes for the Atlas visualization.
// Theme selection now lives in a floating tools panel instead of the header.
(() => {
  const themes = [
    { id: "calm-earthy", name: "Calm & Earthy", scale: 1.12 },
    { id: "clean-modern", name: "Clean & Modern", scale: 1.12 },
    { id: "bold-contrast", name: "Bold & High Contrast", scale: 1.08 },
    { id: "minimal-neutral", name: "Minimal & Neutral", scale: 1.10 },
    { id: "vibrant-distinct", name: "Vibrant & Distinct", scale: 1.08 },
    { id: "soft-refined", name: "Soft & Refined", scale: 1.10 }
  ];

  const storageKey = "atlas-theme";
  const control = document.querySelector("#theme-control");
  const toolsTrigger = document.querySelector("#tools-trigger");
  const toolsPanel = document.querySelector("#tools-panel");
  const toolsClose = document.querySelector("#tools-close");
  const themeTrigger = control?.querySelector(".theme-trigger");
  const readout = document.querySelector("#current-theme-name");
  if (!control || !toolsTrigger || !toolsPanel || !themeTrigger) return;

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

  let saved = null;
  try { saved = localStorage.getItem(storageKey); } catch (_) {}
  let currentIndex = themes.findIndex(theme => theme.id === saved);
  if (currentIndex < 0) currentIndex = 0;
  let current = themes[currentIndex];

  function updateThemeLabels() {
    if (readout) readout.textContent = current.name;
    themeTrigger.setAttribute("aria-label", `Current theme ${current.name}. Activate for next theme.`);
    themeTrigger.title = `Current theme: ${current.name}. Click for next theme.`;
  }

  function applyTheme(index, persist = true) {
    currentIndex = ((index % themes.length) + themes.length) % themes.length;
    current = themes[currentIndex];
    document.body.dataset.theme = current.id;
    themes.forEach(theme => document.body.classList.toggle(`theme-${theme.id}`, theme.id === current.id));
    updateThemeLabels();
    applyFontScale(current);
    if (persist) {
      try { localStorage.setItem(storageKey, current.id); } catch (_) {}
    }
  }

  function advanceTheme() { applyTheme(currentIndex + 1); }

  function setToolsOpen(open) {
    toolsPanel.hidden = !open;
    toolsTrigger.setAttribute("aria-expanded", String(open));
    toolsTrigger.setAttribute("aria-label", open ? "Close visualization tools" : "Open visualization tools");
    if (open) requestAnimationFrame(() => themeTrigger.focus({ preventScroll: true }));
  }

  toolsTrigger.addEventListener("pointerup", event => {
    if (event.button != null && event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    setToolsOpen(toolsPanel.hidden);
  }, { capture: true });

  toolsTrigger.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    if (event.detail === 0) setToolsOpen(toolsPanel.hidden);
  });

  toolsClose?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    setToolsOpen(false);
    toolsTrigger.focus({ preventScroll: true });
  });

  themeTrigger.addEventListener("pointerup", event => {
    if (event.button != null && event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    advanceTheme();
  }, { capture: true });

  themeTrigger.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();
    if (event.detail === 0) advanceTheme();
  });

  document.addEventListener("pointerdown", event => {
    if (!toolsPanel.hidden && !control.contains(event.target)) setToolsOpen(false);
  }, { capture: true });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !toolsPanel.hidden) {
      setToolsOpen(false);
      toolsTrigger.focus({ preventScroll: true });
    }
  });

  let queued = false;
  const viz = document.querySelector("#viz");
  if (viz && typeof MutationObserver !== "undefined") {
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; applyFontScale(current); });
    }).observe(viz, { childList: true, subtree: true });
  }

  setToolsOpen(false);
  applyTheme(currentIndex, false);
})();