// User-selectable presentation themes and display controls for the Atlas visualization.
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
  const legendStorageKey = "atlas-legend-visible";
  const verbosityStorageKey = "atlas-verbosity";
  const toolsPositionKey = "atlas-tools-position";
  const control = document.querySelector("#theme-control");
  const toolsTrigger = document.querySelector("#tools-trigger");
  const toolsPanel = document.querySelector("#tools-panel");
  const toolsClose = document.querySelector("#tools-close");
  const themeTrigger = control?.querySelector(".theme-trigger");
  const readout = document.querySelector("#current-theme-name");
  const legendToggle = document.querySelector("#legend-toggle");
  const legendToggleLabel = document.querySelector("#legend-toggle-label");
  const verbosityToggle = document.querySelector("#verbosity-toggle");
  const verbosityToggleLabel = document.querySelector("#verbosity-toggle-label");
  if (!control || !toolsTrigger || !toolsPanel || !themeTrigger) return;

  const gradientSets = {
    "clean-modern": [
      ["#79a8c8", "#b6d5e8"], ["#648fb4", "#9fc4dd"], ["#8db9cf", "#c9e0ec"], ["#527fa8", "#8eb4ce"]
    ],
    "bold-contrast": [
      ["#102f3a", "#24566a"], ["#29323f", "#5a4a47"], ["#5f352d", "#c1703f"], ["#173845", "#8b6137"]
    ],
    "calm-earthy": [
      ["#6f8f7a", "#a7b89f"], ["#83956f", "#c0b88f"], ["#8b8069", "#c6ad7d"], ["#658a7a", "#9eb5a9"], ["#728f91", "#a9bbba"], ["#7e8875", "#b7b49a"]
    ],
    "vibrant-distinct": [
      ["#1486aa", "#54c5d8"], ["#3866b1", "#68a8e2"], ["#5d54b5", "#9a7ee0"], ["#814d96", "#d279ba"],
      ["#c94f48", "#ef8664"], ["#618b3e", "#9cc561"], ["#cc791c", "#f2b84d"], ["#a93643", "#e26455"]
    ],
    "soft-refined": [
      ["#668f95", "#a7c0bd"], ["#748e9e", "#b7c7cf"], ["#718c84", "#aabfb1"], ["#5e8288", "#9fb8b8"]
    ]
  };

  function ensureThemeGradients() {
    const svg = document.querySelector('#viz svg');
    if (!svg) return;
    let defs = svg.querySelector('defs.atlas-theme-gradients');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.setAttribute('class', 'atlas-theme-gradients');
      svg.insertBefore(defs, svg.firstChild);
    }
    Object.entries(gradientSets).forEach(([themeId, gradients]) => {
      gradients.forEach((stops, index) => {
        const id = `atlas-${themeId}-gradient-${index + 1}`;
        if (defs.querySelector(`#${id}`)) return;
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', id);
        gradient.setAttribute('x1', index % 2 ? '0%' : '8%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', index % 2 ? '100%' : '92%');
        gradient.setAttribute('y2', '100%');
        const start = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        start.setAttribute('offset', '0%');
        start.setAttribute('stop-color', stops[0]);
        const end = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        end.setAttribute('offset', '100%');
        end.setAttribute('stop-color', stops[1]);
        gradient.append(start, end);
        defs.appendChild(gradient);
      });
    });
  }

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
    ensureThemeGradients();
    document.body.dataset.theme = current.id;
    themes.forEach(theme => document.body.classList.toggle(`theme-${theme.id}`, theme.id === current.id));
    updateThemeLabels();
    applyFontScale(current);
    if (persist) {
      try { localStorage.setItem(storageKey, current.id); } catch (_) {}
    }
  }

  function advanceTheme() { applyTheme(currentIndex + 1); }

  function getLegend() { return document.getElementById("visual-key"); }

  function setLegendVisible(visible, persist = true) {
    const legend = getLegend();
    if (!legend) return;
    const show = Boolean(visible);
    legend.style.display = show ? "flex" : "none";
    legend.hidden = !show;
    legend.setAttribute("aria-hidden", String(!show));
    if (legendToggle) {
      legendToggle.setAttribute("aria-pressed", String(show));
      legendToggle.setAttribute("aria-label", show ? "Hide legend" : "Show legend");
      legendToggle.classList.toggle("is-off", !show);
    }
    if (legendToggleLabel) legendToggleLabel.textContent = show ? "Shown" : "Hidden";
    if (persist) {
      try { localStorage.setItem(legendStorageKey, String(show)); } catch (_) {}
    }
  }

  function legendIsVisible() {
    const legend = getLegend();
    return !!legend && !legend.hidden && legend.style.display !== "none";
  }

  function toggleLegend() { setLegendVisible(!legendIsVisible()); }

  let verbosity = "high";
  try {
    const storedVerbosity = localStorage.getItem(verbosityStorageKey);
    if (storedVerbosity === "low" || storedVerbosity === "high") verbosity = storedVerbosity;
  } catch (_) {}

  function setVerbosity(value, persist = true) {
    verbosity = value === "low" ? "low" : "high";
    document.body.dataset.verbosity = verbosity;
    if (verbosityToggle) {
      verbosityToggle.setAttribute("aria-pressed", String(verbosity === "high"));
      verbosityToggle.setAttribute("aria-label", `Verbosity ${verbosity}. Activate for ${verbosity === "high" ? "low" : "high"} verbosity.`);
      verbosityToggle.title = verbosity === "high" ? "High: title plus stats" : "Low: title only";
    }
    if (verbosityToggleLabel) verbosityToggleLabel.textContent = verbosity === "high" ? "High" : "Low";
    if (persist) {
      try { localStorage.setItem(verbosityStorageKey, verbosity); } catch (_) {}
    }
  }

  function toggleVerbosity() { setVerbosity(verbosity === "high" ? "low" : "high"); }

  function setToolsOpen(open) {
    toolsPanel.hidden = !open;
    toolsTrigger.setAttribute("aria-expanded", String(open));
    toolsTrigger.setAttribute("aria-label", open ? "Close visualization tools" : "Open visualization tools");
    if (open) requestAnimationFrame(() => themeTrigger.focus({ preventScroll: true }));
  }

  let toolsSide = "right";
  let toolsTop = null;
  let dragState = null;
  let suppressTriggerActivation = false;

  function triggerHeight() {
    return toolsTrigger.getBoundingClientRect().height || (window.innerWidth < 720 ? 54 : 58);
  }

  function verticalLimits() {
    const h = triggerHeight();
    return { min: 12, max: Math.max(12, window.innerHeight - h - 12) };
  }

  function clampTop(top) {
    const limits = verticalLimits();
    return Math.max(limits.min, Math.min(limits.max, top));
  }

  function defaultTop() {
    const h = triggerHeight();
    return clampTop(window.innerHeight - h - (window.innerWidth < 720 ? 78 : 88));
  }

  function applyToolsPosition(side = toolsSide, top = toolsTop, persist = false) {
    toolsSide = side === "left" ? "left" : "right";
    toolsTop = clampTop(Number.isFinite(top) ? top : defaultTop());
    control.dataset.side = toolsSide;
    control.style.top = `${toolsTop}px`;
    control.style.bottom = "auto";
    if (persist) {
      try { localStorage.setItem(toolsPositionKey, JSON.stringify({ side: toolsSide, top: toolsTop })); } catch (_) {}
    }
  }

  function restoreToolsPosition() {
    let stored = null;
    try { stored = JSON.parse(localStorage.getItem(toolsPositionKey) || "null"); } catch (_) {}
    if (stored && (stored.side === "left" || stored.side === "right") && Number.isFinite(stored.top)) {
      applyToolsPosition(stored.side, stored.top, false);
    } else {
      applyToolsPosition("right", defaultTop(), false);
    }
  }

  toolsTrigger.addEventListener("pointerdown", event => {
    if (event.button != null && event.button !== 0) return;
    dragState = { pointerId:event.pointerId, startX:event.clientX, startY:event.clientY, startTop:toolsTop ?? defaultTop(), moved:false };
    toolsTrigger.setPointerCapture?.(event.pointerId);
  });

  toolsTrigger.addEventListener("pointermove", event => {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    const dx = event.clientX - dragState.startX;
    const dy = event.clientY - dragState.startY;
    if (!dragState.moved && Math.hypot(dx, dy) < 7) return;
    dragState.moved = true;
    suppressTriggerActivation = true;
    control.classList.add("is-dragging");
    setToolsOpen(false);
    const side = event.clientX < window.innerWidth / 2 ? "left" : "right";
    applyToolsPosition(side, dragState.startTop + dy, false);
    event.preventDefault();
  });

  toolsTrigger.addEventListener("pointerup", event => {
    if (dragState && event.pointerId === dragState.pointerId && dragState.moved) {
      event.preventDefault();
      event.stopImmediatePropagation();
      applyToolsPosition(toolsSide, toolsTop, true);
      control.classList.remove("is-dragging");
      dragState = null;
      requestAnimationFrame(() => { suppressTriggerActivation = false; });
      return;
    }
    dragState = null;
    if (event.button != null && event.button !== 0) return;
    if (suppressTriggerActivation) return;
    event.preventDefault(); event.stopPropagation(); setToolsOpen(toolsPanel.hidden);
  }, { capture: true });

  toolsTrigger.addEventListener("pointercancel", () => {
    control.classList.remove("is-dragging");
    dragState = null;
    suppressTriggerActivation = false;
  });

  toolsTrigger.addEventListener("click", event => {
    event.preventDefault(); event.stopPropagation();
    if (event.detail === 0 && !suppressTriggerActivation) setToolsOpen(toolsPanel.hidden);
  });

  toolsClose?.addEventListener("click", event => {
    event.preventDefault(); event.stopPropagation(); setToolsOpen(false); toolsTrigger.focus({ preventScroll: true });
  });
  themeTrigger.addEventListener("pointerup", event => {
    if (event.button != null && event.button !== 0) return;
    event.preventDefault(); event.stopPropagation(); advanceTheme();
  }, { capture: true });
  themeTrigger.addEventListener("click", event => {
    event.preventDefault(); event.stopPropagation(); if (event.detail === 0) advanceTheme();
  });

  legendToggle?.addEventListener("pointerup", event => {
    if (event.button != null && event.button !== 0) return;
    event.preventDefault(); event.stopPropagation(); toggleLegend();
  }, { capture: true });
  legendToggle?.addEventListener("click", event => {
    event.preventDefault(); event.stopPropagation(); if (event.detail === 0) toggleLegend();
  });

  verbosityToggle?.addEventListener("pointerup", event => {
    if (event.button != null && event.button !== 0) return;
    event.preventDefault(); event.stopPropagation(); toggleVerbosity();
  }, { capture: true });
  verbosityToggle?.addEventListener("click", event => {
    event.preventDefault(); event.stopPropagation(); if (event.detail === 0) toggleVerbosity();
  });

  document.addEventListener("pointerdown", event => {
    if (!toolsPanel.hidden && !control.contains(event.target)) setToolsOpen(false);
  }, { capture: true });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !toolsPanel.hidden) { setToolsOpen(false); toolsTrigger.focus({ preventScroll: true }); }
  });

  window.addEventListener("resize", () => applyToolsPosition(toolsSide, toolsTop, false));

  let queued = false;
  const viz = document.querySelector("#viz");
  if (viz && typeof MutationObserver !== "undefined") {
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; ensureThemeGradients(); applyFontScale(current); });
    }).observe(viz, { childList: true, subtree: true });
  }

  let initialLegendVisible = true;
  try {
    const storedLegend = localStorage.getItem(legendStorageKey);
    if (storedLegend !== null) initialLegendVisible = storedLegend !== "false";
  } catch (_) {}

  restoreToolsPosition();
  setToolsOpen(false);
  applyTheme(currentIndex, false);
  setLegendVisible(initialLegendVisible, false);
  setVerbosity(verbosity, false);
})();