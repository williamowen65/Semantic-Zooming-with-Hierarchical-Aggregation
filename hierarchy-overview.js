// Layer-height control for the hierarchy.
//
// The former hierarchy-wide zoom behavior has been removed. This control now
// changes only the vertical height assigned to each depth layer before the
// Voronoi layout is rendered. Width, viewport scale, header, breadcrumbs,
// cards, legend, and floating tools stay completely unchanged.
(() => {
  if (typeof render !== 'function' || typeof levelGeometry !== 'function') return;

  const minus = document.querySelector('#hierarchy-zoom-out');
  const plus = document.querySelector('#hierarchy-zoom-in');
  const readout = document.querySelector('#hierarchy-zoom-readout');
  if (!minus || !plus || !readout) return;

  // Update the existing half-pill markup in place so this change does not depend
  // on a new HTML structure.
  const setting = readout.closest('.hierarchy-zoom-setting');
  const settingLabel = setting?.querySelector('.theme-setting-label');
  if (settingLabel) settingLabel.textContent = 'Layer height';
  minus.setAttribute('aria-label', 'Decrease layer height');
  plus.setAttribute('aria-label', 'Increase layer height');

  const presets = [
    { id: 'compact', label: 'Compact', percent: 55, factor: .55 },
    { id: 'short', label: 'Short', percent: 72, factor: .72 },
    { id: 'medium', label: 'Medium', percent: 86, factor: .86 },
    { id: 'standard', label: 'Standard', percent: 100, factor: 1 }
  ];

  const storageKey = 'atlas-layer-height';
  let saved = null;
  try { saved = localStorage.getItem(storageKey); } catch (_) {}
  let presetIndex = presets.findIndex(p => p.id === saved);
  if (presetIndex < 0) presetIndex = presets.length - 1;

  const baseLevelGeometry = levelGeometry;
  levelGeometry = function(compactMobile, contentTop) {
    const geometry = baseLevelGeometry(compactMobile, contentTop);
    const factor = presets[presetIndex]?.factor || 1;
    return { ...geometry, h: Math.max(120, geometry.h * factor) };
  };

  function updateReadout() {
    const preset = presets[presetIndex];
    readout.textContent = `${preset.label} · ${preset.percent}%`;
    minus.disabled = presetIndex === 0;
    plus.disabled = presetIndex === presets.length - 1;
    document.body.dataset.layerHeight = preset.id;
    if (document.body.dataset.hierarchyZoom) delete document.body.dataset.hierarchyZoom;
  }

  function applyPreset(index, persist = true) {
    presetIndex = Math.max(0, Math.min(presets.length - 1, index));
    updateReadout();
    render();
    if (typeof applyCamera === 'function') applyCamera(false);
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

  updateReadout();
  requestAnimationFrame(() => {
    render();
    if (typeof applyCamera === 'function') applyCamera(false);
  });
})();