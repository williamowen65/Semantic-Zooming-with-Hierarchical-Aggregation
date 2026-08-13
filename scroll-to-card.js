// Align automatic hierarchy navigation to the selected node's context card.
// Manual panning remains unchanged; this only affects click/breadcrumb scroll-to.
(() => {
  if (typeof scrollToDepth !== 'function' || typeof applyCamera !== 'function') return;

  const fallbackScrollToDepth = scrollToDepth;
  const host = document.querySelector('#viz');
  const breadcrumbs = document.querySelector('#breadcrumbs');

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

  function breadcrumbBottom() {
    if (breadcrumbs) {
      const rect = breadcrumbs.getBoundingClientRect();
      if (Number.isFinite(rect.bottom) && rect.bottom > 0) return rect.bottom;
    }
    return window.innerWidth < 720 ? 126 : 76;
  }

  scrollToDepth = function(index, animate = true) {
    const cardY = selectedCardTop();
    if (cardY == null) {
      fallbackScrollToDepth(index, animate);
      return;
    }

    // Use the actual rendered breadcrumb row as the anchor. This matters on
    // mobile because the header can be taller than its CSS minimum height and
    // because browser chrome / responsive wrapping can move the breadcrumb.
    const desiredPhysicalTop = breadcrumbBottom() + 12;
    const hostTop = host ? host.getBoundingClientRect().top : 0;
    const scaleY = hierarchyScaleY();

    cameraY = (desiredPhysicalTop - hostTop) / scaleY - cardY;
    applyCamera(animate);
  };
})();
