// Makes the page itself own vertical scrolling while the Atlas SVG remains a
// sticky viewport. The scroll shell grows to the rendered hierarchy's true
// height, so the footer naturally follows the hierarchy instead of behaving
// like an independently positioned overlay.
(() => {
  if (typeof render !== 'function' || typeof applyCamera !== 'function') return;

  const shell = document.querySelector('#viz-flow-shell');
  const viz = document.querySelector('#viz');
  if (!shell || !viz) return;

  let maxShellHeight = Math.max(window.innerHeight, shell.getBoundingClientRect().height || 0);
  let scrollFrame = 0;

  function shellTop() {
    const rect = shell.getBoundingClientRect();
    return rect.top + (window.scrollY || document.documentElement.scrollTop || 0);
  }

  function viewportHeight() {
    return window.visualViewport?.height || window.innerHeight || height;
  }

  function measuredHierarchyHeight() {
    let measured = Number(worldHeight) || viewportHeight();
    try {
      const box = stage?.node?.()?.getBBox?.();
      if (box && Number.isFinite(box.height)) measured = Math.max(measured, box.y + box.height + 28);
    } catch (_) {}
    return Math.max(viewportHeight(), measured + 84);
  }

  function syncShellHeight() {
    // Never shrink the shell during a context switch. Shrinking underneath the
    // current browser scroll position is what causes the visible jump/clamp.
    maxShellHeight = Math.max(
      maxShellHeight,
      measuredHierarchyHeight(),
      (window.scrollY || 0) - shellTop() + viewportHeight()
    );
    shell.style.height = `${Math.ceil(maxShellHeight)}px`;
  }

  function syncCameraFromDocument() {
    const offset = Math.max(0, (window.scrollY || document.documentElement.scrollTop || 0) - shellTop());
    cameraY = clampCamera(-offset);
    applyCamera(false);
  }

  function scheduleDocumentSync() {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      syncCameraFromDocument();
    });
  }

  // Prevent the older internal hierarchy wheel/touch handlers from consuming
  // vertical scrolling. Do not preventDefault: the browser should perform its
  // normal document scroll, and the hierarchy camera follows that scroll.
  window.addEventListener('wheel', event => {
    if (event.target instanceof Element && event.target.closest('#viz')) event.stopPropagation();
  }, { capture: true, passive: true });

  window.addEventListener('touchmove', event => {
    if (event.target instanceof Element && event.target.closest('#viz')) event.stopPropagation();
  }, { capture: true, passive: true });

  window.addEventListener('scroll', scheduleDocumentSync, { passive: true });

  // Existing focus/navigation code asks for a camera target. Convert that target
  // into a normal page scroll instead, keeping all vertical movement in one
  // coordinate system.
  scrollToDepth = function(index, animate = true) {
    if (!levelCenters.length) return;
    const safeIndex = Math.max(0, Math.min(levelCenters.length - 1, index));
    const targetInViewport = viewportHeight() * (width < 720 ? .48 : .5);
    const targetCamera = clampCamera(targetInViewport - levelCenters[safeIndex]);
    const targetScroll = shellTop() - targetCamera;
    window.scrollTo({ top: Math.max(0, targetScroll), left: 0, behavior: animate ? 'smooth' : 'auto' });
  };

  if (typeof scrollSelectedContextIntoView === 'function') {
    scrollSelectedContextIntoView = function(animate = true) {
      const entries = stage.selectAll('g.layer-context-entry').nodes();
      const entry = entries[focusPath.length - 1] || entries[entries.length - 1];
      const card = entry?.querySelector('foreignObject');
      if (!card) {
        scrollToDepth(Math.max(0, Math.min(levelCenters.length - 1, focusPath.length)), animate);
        return;
      }
      const rect = card.getBoundingClientRect();
      const desiredTop = width < 720 ? 140 : 94;
      const targetCamera = clampCamera(cameraY + desiredTop - rect.top);
      window.scrollTo({ top: Math.max(0, shellTop() - targetCamera), left: 0, behavior: animate ? 'smooth' : 'auto' });
    };
  }

  const baseRender = render;
  render = function(...args) {
    const result = baseRender(...args);
    requestAnimationFrame(() => {
      syncShellHeight();
      syncCameraFromDocument();
    });
    return result;
  };

  window.addEventListener('resize', () => {
    maxShellHeight = Math.max(maxShellHeight, viewportHeight());
    requestAnimationFrame(() => {
      syncShellHeight();
      syncCameraFromDocument();
    });
  }, { passive: true });

  syncShellHeight();
  syncCameraFromDocument();
  render();
})();