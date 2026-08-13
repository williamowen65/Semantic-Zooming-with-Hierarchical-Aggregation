// Hierarchy-wide overview zoom. Instead of stretching the rendered SVG on one
// axis, overview zoom asks each hierarchy layer to lay itself out again at a
// shorter/taller height. That keeps the visualization full-width without making
// circles, text, cards, or Voronoi cells look vertically squashed.
(() => {
  if (typeof stage === 'undefined' || typeof applyCamera !== 'function' || typeof render !== 'function') return;

  const presets = [
    { id: 'wide', label: 'Wide overview', scale: 0.64 },
    { id: 'overview', label: 'Overview', scale: 0.80 },
    { id: 'standard', label: 'Standard', scale: 1.00 },
    { id: 'detail', label: 'Detail', scale: 1.15 }
  ];
  const storageKey = 'atlas-hierarchy-zoom';
  const minus = document.querySelector('#hierarchy-zoom-out');
  const plus = document.querySelector('#hierarchy-zoom-in');
  const readout = document.querySelector('#hierarchy-zoom-readout');
  if (!minus || !plus || !readout) return;

  let saved = null;
  try { saved = localStorage.getItem(storageKey); } catch (_) {}
  let presetIndex = presets.findIndex(p => p.id === saved);
  if (presetIndex < 0) presetIndex = 2;
  window.atlasHierarchyScale = presets[presetIndex].scale;

  // Reflow each treemap at the requested height instead of applying a
  // non-uniform SVG scale after rendering. Width stays exactly viewport width.
  const baseLevelGeometry = levelGeometry;
  levelGeometry = function(compactMobile, contentTop) {
    const geometry = baseLevelGeometry(compactMobile, contentTop);
    const scale = window.atlasHierarchyScale || 1;
    return { ...geometry, h: geometry.h * scale };
  };

  function updateReadout() {
    const preset = presets[presetIndex];
    readout.textContent = `${preset.label} · ${Math.round(preset.scale * 100)}%`;
    minus.disabled = presetIndex === 0;
    plus.disabled = presetIndex === presets.length - 1;
    document.body.dataset.hierarchyZoom = preset.id;
  }

  // The reflowed render already changes worldHeight and levelCenters, so camera
  // math remains in ordinary screen/world coordinates. No stage scaling here.
  function hierarchyCameraBounds() {
    const bottomAllowance = 54;
    return {
      min: Math.min(0, height - worldHeight - bottomAllowance),
      max: 0
    };
  }

  cameraBounds = hierarchyCameraBounds;
  clampCamera = function(value) {
    const { min, max } = hierarchyCameraBounds();
    return Math.max(min, Math.min(max, value));
  };

  applyCamera = function(animate = false) {
    cameraY = clampCamera(cameraY);
    const transform = `translate(0,${cameraY})`;
    stage.interrupt();
    if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      stage.transition().duration(420).ease(d3.easeCubicOut).attr('transform', transform);
    } else {
      stage.attr('transform', transform);
    }
  };

  scrollToDepth = function(index, animate = true) {
    if (!levelCenters.length) return;
    const safeIndex = Math.max(0, Math.min(levelCenters.length - 1, index));
    const viewportTarget = height * (width < 720 ? .48 : .5);
    cameraY = viewportTarget - levelCenters[safeIndex];
    applyCamera(animate);
  };

  function applyPreset(index, persist = true) {
    const previousScale = window.atlasHierarchyScale || 1;
    const oldWorldHeight = Math.max(1, worldHeight);
    const viewportCenter = height * .5;
    const oldWorldAtCenter = viewportCenter - cameraY;
    const oldProgress = oldWorldAtCenter / oldWorldHeight;

    presetIndex = Math.max(0, Math.min(presets.length - 1, index));
    window.atlasHierarchyScale = presets[presetIndex].scale;
    updateReadout();

    // Re-rendering recomputes the Voronoi cells for the new aspect ratio. This
    // is the key difference from the previous "squishy" vertical transform.
    render();

    // Keep approximately the same place in the hierarchy under the viewport
    // center after the reflow rather than jumping to the top.
    const newWorldAtCenter = oldProgress * Math.max(1, worldHeight);
    cameraY = viewportCenter - newWorldAtCenter;
    applyCamera(true);

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

  window.addEventListener('resize', () => requestAnimationFrame(() => {
    render();
    applyCamera(false);
  }));

  updateReadout();
  // app.js rendered once before this file loaded. Re-render once so a stored
  // non-standard preset is applied as geometry, not as a stale transform.
  requestAnimationFrame(() => {
    render();
    applyCamera(false);
  });
})();