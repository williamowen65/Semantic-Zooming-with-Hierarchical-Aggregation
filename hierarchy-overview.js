// Hierarchy-wide overview zoom.
//
// On mobile, the desired "zoom out" effect is the browser's desktop-style
// layout viewport: make the page itself wider and let the browser scale that
// wider page down uniformly to the phone. Nothing inside the hierarchy is
// stretched on one axis, and layer aspect ratios remain natural.
(() => {
  if (typeof render !== 'function') return;

  const viewport = document.querySelector('meta[name="viewport"]');
  const minus = document.querySelector('#hierarchy-zoom-out');
  const plus = document.querySelector('#hierarchy-zoom-in');
  const readout = document.querySelector('#hierarchy-zoom-readout');
  if (!viewport || !minus || !plus || !readout) return;

  const presets = [
    { id: 'wide', label: 'Desktop width', percent: 64, content: 'width=980' },
    { id: 'overview', label: 'Wide overview', percent: 80, content: 'width=720' },
    { id: 'standard', label: 'Standard', percent: 100, content: 'width=device-width, initial-scale=1' },
    { id: 'detail', label: 'Detail', percent: 115, content: 'width=device-width, initial-scale=1.15' }
  ];

  const storageKey = 'atlas-hierarchy-zoom';
  let saved = null;
  try { saved = localStorage.getItem(storageKey); } catch (_) {}
  let presetIndex = presets.findIndex(p => p.id === saved);
  if (presetIndex < 0) presetIndex = 2;

  function updateReadout() {
    const preset = presets[presetIndex];
    readout.textContent = `${preset.label} · ${preset.percent}%`;
    minus.disabled = presetIndex === 0;
    plus.disabled = presetIndex === presets.length - 1;
    document.body.dataset.hierarchyZoom = preset.id;
  }

  function applyViewport(index, persist = true) {
    presetIndex = Math.max(0, Math.min(presets.length - 1, index));
    const preset = presets[presetIndex];

    // This is the important part: change the HTML layout viewport itself.
    // The browser then performs the same kind of uniform fit used by its
    // desktop-site presentation. We do not scale the SVG, alter its viewBox,
    // compress layer heights, or touch x/y transforms.
    viewport.setAttribute('content', preset.content);
    updateReadout();

    if (persist) {
      try { localStorage.setItem(storageKey, preset.id); } catch (_) {}
    }

    // Updating the viewport can change CSS viewport width and therefore the
    // app's responsive breakpoint. Re-render after the browser has applied it.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      render();
      if (typeof applyCamera === 'function') applyCamera(false);
    }));
  }

  minus.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    applyViewport(presetIndex - 1);
  });

  plus.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    applyViewport(presetIndex + 1);
  });

  updateReadout();

  // Restore a saved view on reload. Standard is already present in index.html,
  // so only rewrite the viewport when a different preset was saved.
  if (presetIndex !== 2) {
    requestAnimationFrame(() => applyViewport(presetIndex, false));
  }
})();