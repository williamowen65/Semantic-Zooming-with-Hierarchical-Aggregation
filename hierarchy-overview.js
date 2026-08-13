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

  function overviewLabelScaleFactor() {
    const id = presets[presetIndex]?.id;
    if (id === 'far') return .88;
    if (id === 'wide') return .94;
    if (id === 'overview') return .97;
    return 1;
  }

  function overviewSafePadding() {
    const id = presets[presetIndex]?.id;
    if (id === 'far') return 14;
    if (id === 'wide') return 11;
    if (id === 'overview') return 8;
    return 0;
  }

  function labelFitsPolygon(text, anchorX, anchorY, scale, padding) {
    const cell = text.closest('g.cell');
    const datum = cell && typeof d3 !== 'undefined' ? d3.select(cell).datum() : null;
    const polygon = datum?.polygon;
    if (!polygon?.length || typeof d3?.polygonContains !== 'function') return true;

    let box;
    try { box = text.getBBox(); } catch (_) { return true; }

    const left = anchorX + (box.x - anchorX) * scale - padding;
    const right = anchorX + (box.x + box.width - anchorX) * scale + padding;
    const top = anchorY + (box.y - anchorY) * scale - padding;
    const bottom = anchorY + (box.y + box.height - anchorY) * scale + padding;
    const midX = (left + right) / 2;
    const midY = (top + bottom) / 2;
    const probes = [
      [left, top], [midX, top], [right, top],
      [right, midY], [right, bottom], [midX, bottom],
      [left, bottom], [left, midY]
    ];
    return probes.every(point => d3.polygonContains(polygon, point));
  }

  function paddedOverviewScale(text, anchorX, anchorY, requestedScale, fitScale) {
    const padding = overviewSafePadding();
    if (!padding) return requestedScale;

    // Prefer shrinking over moving. This preserves the title's centered anchor
    // and creates a consistent visual buffer between all label text and the tile
    // perimeter. Small or awkward cells simply use a slightly smaller label.
    const minimumScale = Math.max(.08, fitScale * .48);
    let scale = requestedScale;
    while (scale > minimumScale && !labelFitsPolygon(text, anchorX, anchorY, scale, padding)) {
      scale *= .95;
    }
    return Math.max(minimumScale, scale);
  }

  let fixingLabels = false;
  let labelFixQueued = false;
  function restoreOverviewLabelAnchors() {
    labelFixQueued = false;
    const preset = presets[presetIndex];
    if (!preset || preset.id === 'standard') return;

    fixingLabels = true;
    const overviewFactor = overviewLabelScaleFactor();
    host.querySelectorAll('text.cell-label').forEach(text => {
      const x = Number(text.getAttribute('data-fit-anchor-x'));
      const y = Number(text.getAttribute('data-fit-anchor-y'));
      const fitScale = Number(text.getAttribute('data-fit-scale')) || 1;
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;

      // Keep the title's fitted polygon centroid as the authoritative anchor.
      // At wider overview levels, start slightly smaller and then shrink only as
      // much as necessary to maintain a clean inset from the polygon boundary.
      const requestedScale = fitScale * overviewFactor;
      const scale = paddedOverviewScale(text, x, y, requestedScale, fitScale);
      const desired = `translate(${x},${y}) scale(${scale}) translate(${-x},${-y})`;
      if (text.getAttribute('transform') !== desired) text.setAttribute('transform', desired);
    });
    fixingLabels = false;
  }

  function queueOverviewLabelFix() {
    if (fixingLabels || labelFixQueued || presets[presetIndex]?.id === 'standard') return;
    labelFixQueued = true;
    requestAnimationFrame(restoreOverviewLabelAnchors);
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
    queueOverviewLabelFix();
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

  // semantic-icons.js intentionally tracks labels with a panned/zoomed layer.
  // Keep that behavior at Standard, but restore the polygon-centered anchor after
  // any later transform mutation while an overview preset is active.
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(mutations => {
      if (fixingLabels || presets[presetIndex]?.id === 'standard') return;
      if (mutations.some(m => m.type === 'childList' || (m.type === 'attributes' && m.target?.matches?.('text.cell-label')))) {
        queueOverviewLabelFix();
      }
    });
    observer.observe(host, { subtree: true, childList: true, attributes: true, attributeFilter: ['transform', 'data-fit-anchor-x', 'data-fit-anchor-y', 'data-fit-scale'] });
  }

  window.addEventListener('resize', () => requestAnimationFrame(renderAtPreset));

  updateReadout();
  if (presetIndex !== presets.length - 1) {
    requestAnimationFrame(renderAtPreset);
  }
})();