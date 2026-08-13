// Align automatic hierarchy navigation to the selected node's context card.
// Manual panning remains unchanged; this only affects click/breadcrumb scroll-to.
(() => {
  if (typeof scrollToDepth !== 'function' || typeof applyCamera !== 'function') return;

  const fallbackScrollToDepth = scrollToDepth;
  const host = document.querySelector('#viz');
  const toolbar = document.querySelector('.toolbar');

  function hierarchyScaleY() {
    if (!host) return 1;
    const rendered = host.getBoundingClientRect();
    const logicalHeight = host.offsetHeight || host.clientHeight || rendered.height || 1;
    const scale = rendered.height / logicalHeight;
    return Number.isFinite(scale) && scale > 0 ? scale : 1;
  }

  function selectedCardTop() {
    if (!Array.isArray(focusPath) || !focusPath.length) return null;
    const entries = stage.selectAll('.layer-context-entry').nodes();
    const entry = entries[focusPath.length - 1];
    const foreignObject = entry && entry.querySelector('foreignObject');
    if (!foreignObject) return null;
    const y = Number(foreignObject.getAttribute('y'));
    return Number.isFinite(y) ? y : null;
  }

  scrollToDepth = function(index, animate = true) {
    const cardY = selectedCardTop();
    if (cardY == null) {
      fallbackScrollToDepth(index, animate);
      return;
    }

    // The toolbar contains the breadcrumb and is fixed at normal UI size.
    // Put the selected card directly beneath it, with a small breathing gap.
    const toolbarBottom = toolbar ? toolbar.getBoundingClientRect().bottom : (window.innerWidth < 720 ? 126 : 76);
    const desiredPhysicalTop = toolbarBottom + 8;
    const hostTop = host ? host.getBoundingClientRect().top : 0;
    const scaleY = hierarchyScaleY();

    cameraY = (desiredPhysicalTop - hostTop) / scaleY - cardY;
    applyCamera(animate);
  };
})();
