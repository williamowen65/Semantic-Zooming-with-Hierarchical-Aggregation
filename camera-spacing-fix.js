// Keep the first hierarchy layer flush with its intended top position.
// The camera may scroll upward into deeper levels, but it should never translate
// the entire hierarchy downward and create blank space above the first layer.
(() => {
  if (typeof cameraBounds !== 'function' || typeof applyCamera !== 'function') return;

  cameraBounds = function() {
    const bottomAllowance = 54;
    return {
      min: Math.min(0, height - worldHeight - bottomAllowance),
      max: 0
    };
  };

  if (typeof cameraY === 'number' && cameraY > 0) cameraY = 0;
  applyCamera(false);
})();

// At hierarchy overview presets, title centering takes precedence over the
// viewport-following label behavior added later by semantic-icons.js. That
// tracker is still active at Standard zoom, where it remains useful while the
// user pans/zooms into a layer. In overview mode we continually restore each
// label's polygon-fit anchor so metadata cannot pull the title off-center.
(() => {
  const host = document.querySelector('#viz');
  if (!host || typeof MutationObserver === 'undefined') return;

  let correcting = false;
  let queued = false;

  function isHierarchyOverview() {
    const mode = document.body?.dataset?.hierarchyZoom;
    return !!mode && mode !== 'standard';
  }

  function fittedTransform(text) {
    const x = Number(text.getAttribute('data-fit-anchor-x'));
    const y = Number(text.getAttribute('data-fit-anchor-y'));
    const scale = Number(text.getAttribute('data-fit-scale')) || 1;
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    return `translate(${x},${y}) scale(${scale}) translate(${-x},${-y})`;
  }

  function restoreOverviewAnchors() {
    queued = false;
    if (!isHierarchyOverview()) return;
    correcting = true;
    host.querySelectorAll('text.cell-label').forEach(text => {
      const desired = fittedTransform(text);
      if (desired && text.getAttribute('transform') !== desired) text.setAttribute('transform', desired);
    });
    correcting = false;
  }

  function queueRestore() {
    if (queued || correcting) return;
    queued = true;
    requestAnimationFrame(restoreOverviewAnchors);
  }

  const hostObserver = new MutationObserver(mutations => {
    if (correcting || !isHierarchyOverview()) return;
    if (mutations.some(m => m.type === 'childList' || (m.type === 'attributes' && m.target?.matches?.('text.cell-label')))) queueRestore();
  });
  hostObserver.observe(host, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['transform', 'data-fit-anchor-x', 'data-fit-anchor-y', 'data-fit-scale']
  });

  const modeObserver = new MutationObserver(queueRestore);
  modeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-hierarchy-zoom'] });

  window.addEventListener('resize', queueRestore);
  requestAnimationFrame(queueRestore);
})();
