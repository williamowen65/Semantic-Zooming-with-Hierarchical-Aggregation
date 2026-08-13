// Align automatic hierarchy navigation to the selected node's context card.
// Manual panning remains unchanged; this only affects click/breadcrumb scroll-to.
(() => {
  if (typeof scrollToDepth !== 'function' || typeof applyCamera !== 'function') return;

  const fallbackScrollToDepth = scrollToDepth;
  const host = document.querySelector('#viz');
  const toolbar = document.querySelector('.toolbar');
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

  function measuredHeaderAndBreadcrumbHeight() {
    const toolbarRect = toolbar?.getBoundingClientRect();
    const breadcrumbRect = breadcrumbs?.getBoundingClientRect();
    if (!toolbarRect || !breadcrumbRect) return null;

    // Measure, don't estimate: header portion above the breadcrumb + breadcrumb row.
    const headerHeight = Math.max(0, breadcrumbRect.top - toolbarRect.top);
    const breadcrumbHeight = Math.max(0, breadcrumbRect.height);
    const total = headerHeight + breadcrumbHeight;
    return Number.isFinite(total) && total > 0 ? total : null;
  }

  scrollToDepth = function(index, animate = true) {
    const cardY = selectedCardTop();
    const occupiedHeight = measuredHeaderAndBreadcrumbHeight();
    if (cardY == null || occupiedHeight == null) {
      fallbackScrollToDepth(index, animate);
      return;
    }

    const toolbarTop = toolbar.getBoundingClientRect().top;
    const buffer = 20;
    const desiredPhysicalTop = toolbarTop + occupiedHeight + buffer;
    const hostTop = host ? host.getBoundingClientRect().top : 0;
    const scaleY = hierarchyScaleY();

    cameraY = (desiredPhysicalTop - hostTop) / scaleY - cardY;
    applyCamera(animate);
  };
})();
