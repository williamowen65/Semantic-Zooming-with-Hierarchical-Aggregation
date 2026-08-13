// Hierarchy-only overview zoom.
//
// The visualization can emulate progressively wider desktop canvases on a phone,
// but the surrounding UI chrome stays at the real device viewport size. That
// means the header/title, breadcrumbs, floating tools pill/panel, and legend do
// not shrink when the hierarchy is zoomed out.
(() => {
  if (typeof render !== 'function') return;

  const host = document.querySelector('#viz');
  const minus = document.querySelector('#hierarchy-zoom-out');
  const plus = document.querySelector('#hierarchy-zoom-in');
  const readout = document.querySelector('#hierarchy-zoom-readout');
  if (!host || !minus || !plus || !readout) return;

  const presets = [
    { id: 'far', label: 'Far overview', percent: 52, width: 1200 },
    { id: 'wide', label: 'Desktop width', percent: 64, width: 980 },
    { id: 'overview', label: 'Wide overview', percent: 80, width: 720 },
    { id: 'standard', label: 'Standard', percent: 100, width: null }
  ];

  const storageKey = 'atlas-hierarchy-zoom';
  let saved = null;
  try { saved = localStorage.getItem(storageKey); } catch (_) {}
  let presetIndex = presets.findIndex(p => p.id === saved);
  if (presetIndex < 0) presetIndex = presets.length - 1;

  function physicalViewport() {
    return {
      width: window.innerWidth || document.documentElement.clientWidth || 1,
      height: window.innerHeight || document.documentElement.clientHeight || 1
    };
  }

  function updateReadout() {
    const preset = presets[presetIndex];
    readout.textContent = `${preset.label} · ${preset.percent}%`;
    minus.disabled = presetIndex === 0;
    plus.disabled = presetIndex === presets.length - 1;
    document.body.dataset.hierarchyZoom = preset.id;
  }

  function clearHierarchyViewport() {
    host.style.position = '';
    host.style.left = '';
    host.style.top = '';
    host.style.width = '';
    host.style.height = '';
    host.style.transform = '';
    host.style.transformOrigin = '';
  }

  function renderAtPreset() {
    const preset = presets[presetIndex];
    const physical = physicalViewport();

    if (!preset.width) {
      clearHierarchyViewport();
      render();
      if (typeof applyCamera === 'function') applyCamera(false);
      return;
    }

    // Render #viz as a genuinely wider canvas, then uniformly fit that canvas
    // back to the phone width. Because both width and height are enlarged by the
    // same factor, Voronoi cells, cards, text, connectors, and spacing retain
    // their natural proportions: no horizontal or vertical stretching.
    const logicalWidth = Math.max(physical.width, preset.width);
    const scale = physical.width / logicalWidth;
    const logicalHeight = physical.height / scale;

    host.style.position = 'fixed';
    host.style.left = '0';
    host.style.width = `${logicalWidth}px`;
    host.style.height = `${logicalHeight}px`;
    host.style.transformOrigin = '0 0';

    // A wide hierarchy uses app.js's desktop content inset (98 logical px).
    // Offset only the visualization so its first layer remains below the normal
    // mobile header even though the header itself is no longer being scaled.
    const logicalContentTop = logicalWidth < 720 ? 132 : 98;
    const desiredPhysicalTop = physical.width < 720 ? 132 : 98;
    const topOffset = Math.max(0, desiredPhysicalTop - logicalContentTop * scale);
    host.style.top = `${topOffset}px`;
    host.style.transform = `scale(${scale})`;

    render();
    if (typeof applyCamera === 'function') applyCamera(false);
  }

  function applyPreset(index, persist = true) {
    presetIndex = Math.max(0, Math.min(presets.length - 1, index));
    updateReadout();
    renderAtPreset();

    if (persist) {
      try { localStorage.setItem(storageKey, presets[presetIndex].id); } catch (_) {}
    }
  }

  minus.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    applyPreset(presetIndex - 1);
  });

  plus.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    applyPreset(presetIndex + 1);
  });

  window.addEventListener('resize', () => requestAnimationFrame(renderAtPreset));

  updateReadout();
  if (presetIndex !== presets.length - 1) {
    requestAnimationFrame(renderAtPreset);
  }
})();