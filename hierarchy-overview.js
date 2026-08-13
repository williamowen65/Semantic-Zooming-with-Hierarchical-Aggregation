// Hierarchy-wide overview zoom. This is deliberately separate from each layer's
// own pan/zoom. Overview zoom now compresses only the hierarchy's vertical axis,
// so every layer continues to span the full viewport width while more levels fit
// on screen. Cell labels are counter-scaled vertically so their letterforms stay
// readable instead of being squashed by the hierarchy compression.
(() => {
  if (typeof stage === 'undefined' || typeof applyCamera !== 'function') return;

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

  function labelCounterScale() {
    const scale = window.atlasHierarchyScale || 1;
    return 1 / scale;
  }

  function updateReadout() {
    const preset = presets[presetIndex];
    readout.textContent = `${preset.label} · ${Math.round(preset.scale * 100)}%`;
    minus.disabled = presetIndex === 0;
    plus.disabled = presetIndex === presets.length - 1;
    document.body.dataset.hierarchyZoom = preset.id;
  }

  function hierarchyCameraBounds() {
    const scale = window.atlasHierarchyScale || 1;
    const bottomAllowance = 54;
    return {
      min: Math.min(0, height - worldHeight * scale - bottomAllowance),
      max: 0
    };
  }

  cameraBounds = hierarchyCameraBounds;
  clampCamera = function(value) {
    const { min, max } = hierarchyCameraBounds();
    return Math.max(min, Math.min(max, value));
  };

  applyCamera = function(animate = false) {
    const scale = window.atlasHierarchyScale || 1;
    cameraY = clampCamera(cameraY);

    // Keep the hierarchy at full viewport width. Only vertical distances are
    // compressed/expanded so zooming out reveals more of the path without
    // shrinking the treemaps and cards into a narrow centered column.
    const transform = `translate(0,${cameraY}) scale(1,${scale})`;
    stage.interrupt();
    if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      stage.transition().duration(520).ease(d3.easeCubicOut).attr('transform', transform);
    } else {
      stage.attr('transform', transform);
    }
  };

  scrollToDepth = function(index, animate = true) {
    if (!levelCenters.length) return;
    const scale = window.atlasHierarchyScale || 1;
    const safeIndex = Math.max(0, Math.min(levelCenters.length - 1, index));
    const viewportTarget = height * (width < 720 ? .48 : .5);
    cameraY = viewportTarget - levelCenters[safeIndex] * scale;
    applyCamera(animate);
  };

  function applyLabelReadability() {
    const counterY = labelCounterScale();
    document.querySelectorAll('#viz text.cell-label').forEach(text => {
      const fit = Number(text.dataset.fitScale || 1);
      const ax = Number(text.dataset.fitAnchorX || text.getAttribute('x') || 0);
      const ay = Number(text.dataset.fitAnchorY || text.getAttribute('y') || 0);
      text.setAttribute('transform', `translate(${ax},${ay}) scale(${fit},${fit * counterY}) translate(${-ax},${-ay})`);
    });
  }

  function applyPreset(index, persist = true) {
    const previousScale = window.atlasHierarchyScale || 1;
    presetIndex = Math.max(0, Math.min(presets.length - 1, index));
    const nextScale = presets[presetIndex].scale;

    // Keep the same world position near the viewport center while changing the
    // vertical hierarchy scale, instead of jumping back to the top.
    const viewportCenter = height * .5;
    const worldAtCenter = (viewportCenter - cameraY) / previousScale;
    window.atlasHierarchyScale = nextScale;
    cameraY = viewportCenter - worldAtCenter * nextScale;

    updateReadout();
    applyLabelReadability();
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

  // Rendering recreates cell labels, so restore counter-scaling after every
  // hierarchy render. A mutation observer also catches late expansion scripts.
  let queued = false;
  const viz = document.querySelector('#viz');
  if (viz && typeof MutationObserver !== 'undefined') {
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        applyLabelReadability();
        applyCamera(false);
      });
    }).observe(viz, { childList: true, subtree: true });
  }

  window.addEventListener('resize', () => requestAnimationFrame(() => applyCamera(false)));
  updateReadout();
  requestAnimationFrame(() => {
    applyLabelReadability();
    applyCamera(false);
  });
})();