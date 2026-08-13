// Preserve polygon-centered title anchors at hierarchy overview presets.
// semantic-icons.js intentionally repositions labels toward the visible viewport
// while a layer is zoomed/panned. That behavior is useful at standard hierarchy
// scale, but at overview presets it recenters the whole title+metadata block and
// visually pulls titles away from the polygon center. This late-loaded guard
// restores the fitted polygon anchor only while the hierarchy itself is zoomed out.
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
      if (desired && text.getAttribute('transform') !== desired) {
        text.setAttribute('transform', desired);
      }
    });
    correcting = false;
  }

  function queueRestore() {
    if (queued || correcting) return;
    queued = true;
    requestAnimationFrame(restoreOverviewAnchors);
  }

  const observer = new MutationObserver(mutations => {
    if (correcting || !isHierarchyOverview()) return;
    if (mutations.some(m =>
      m.type === 'childList' ||
      (m.type === 'attributes' && (
        m.target?.matches?.('text.cell-label') ||
        m.target === document.body
      ))
    )) queueRestore();
  });

  observer.observe(host, { subtree: true, childList: true, attributes: true, attributeFilter: ['transform', 'data-fit-anchor-x', 'data-fit-anchor-y', 'data-fit-scale'] });
  observer.observe(document.body, { attributes: true, attributeFilter: ['data-hierarchy-zoom'] });

  window.addEventListener('resize', queueRestore);
  requestAnimationFrame(queueRestore);
})();
