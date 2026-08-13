// Hierarchy-wide overview zoom.
//
// The overview control emulates a wider screen. It does NOT scale or reflow the
// hierarchy vertically. Each preset only increases/decreases the logical layout
// width, while the SVG maps that wider x-axis back into the physical viewport.
// Vertical coordinates, layer heights, gaps, cards, and scrolling remain at
// their normal size.
(() => {
  if (typeof stage === 'undefined' || typeof applyCamera !== 'function' || typeof render !== 'function') return;

  const host = document.querySelector('#viz');
  const svgNode = host && host.querySelector('svg');
  if (!host || !svgNode) return;

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

  // Preserve the app's original layer-height calculation. During a widened
  // render the global `width` is intentionally larger, so temporarily restore
  // the physical width only while the layer height is calculated. Then return
  // the widened logical width with the untouched physical-screen height.
  const baseLevelGeometry = levelGeometry;
  levelGeometry = function(compactMobile, contentTop) {
    const logicalWidth = width;
    const physicalWidth = host.getBoundingClientRect().width || logicalWidth;
    width = physicalWidth;
    const geometry = baseLevelGeometry(compactMobile, contentTop);
    width = logicalWidth;
    return { ...geometry, x: 0, w: logicalWidth };
  };

  function updateReadout() {
    const preset = presets[presetIndex];
    readout.textContent = `${preset.label} · ${Math.round(preset.scale * 100)}%`;
    minus.disabled = presetIndex === 0;
    plus.disabled = presetIndex === presets.length - 1;
    document.body.dataset.hierarchyZoom = preset.id;
  }

  // Render as though #viz itself were wider. `clientWidth` is read once at the
  // beginning of app.js render(), so an own-property override is enough. The
  // property is immediately restored after rendering.
  function renderAtPreset() {
    const scale = window.atlasHierarchyScale || 1;
    const physicalWidth = host.getBoundingClientRect().width || host.clientWidth;
    const logicalWidth = physicalWidth / scale;
    const ownDescriptor = Object.getOwnPropertyDescriptor(host, 'clientWidth');

    try {
      Object.defineProperty(host, 'clientWidth', {
        configurable: true,
        value: logicalWidth
      });
      render();
    } finally {
      if (ownDescriptor) Object.defineProperty(host, 'clientWidth', ownDescriptor);
      else delete host.clientWidth;
    }

    // A wider viewBox with preserveAspectRatio="none" changes x only. The SVG
    // viewport's y-axis is still exactly the physical viewport height, so there
    // is no vertical stretching, shrinking, or reflow at any zoom preset.
    svgNode.setAttribute('viewBox', `0 0 ${logicalWidth} ${height}`);
    svgNode.setAttribute('preserveAspectRatio', 'none');
  }

  // Camera math stays entirely vertical and therefore uses the same coordinates
  // at every hierarchy-width preset.
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
    const physicalWidth = host.getBoundingClientRect().width || 0;
    const viewportTarget = height * (physicalWidth < 720 ? .48 : .5);
    cameraY = viewportTarget - levelCenters[safeIndex];
    applyCamera(animate);
  };

  function applyPreset(index, persist = true) {
    presetIndex = Math.max(0, Math.min(presets.length - 1, index));
    window.atlasHierarchyScale = presets[presetIndex].scale;
    updateReadout();

    // Width is the only geometry dimension changed. Preserve the current
    // vertical camera position exactly.
    const oldCameraY = cameraY;
    renderAtPreset();
    cameraY = oldCameraY;
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
    const oldCameraY = cameraY;
    renderAtPreset();
    cameraY = oldCameraY;
    applyCamera(false);
  }));

  updateReadout();
  requestAnimationFrame(() => {
    renderAtPreset();
    applyCamera(false);
  });
})();