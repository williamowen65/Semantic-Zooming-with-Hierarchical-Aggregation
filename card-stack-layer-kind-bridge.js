// Lets historical cards render their chosen child category without forcing the
// deeper selected child to determine the visible layer. Toggle actions themselves
// use atlasSetLayerKind's standard behavior: switching either side makes that
// parent the active end of the path and discards all deeper selections.
(() => {
  if (typeof renderCluster !== 'function' || typeof window.atlasSetLayerKind !== 'function') return;

  const baseRenderCluster = renderCluster;
  renderCluster = function(options) {
    const match = String(options?.className || '').match(/context-cluster\s+depth-(\d+)/);
    if (!match || !document.body.classList.contains('card-stack-mode')) return baseRenderCluster(options);

    const depth = Number(match[1]);
    const parentId = focusPath?.[depth - 1];
    const explicitMode = parentId && window.atlasGetLayerKindState?.()[parentId];
    if (!explicitMode || !focusPath?.[depth]) return baseRenderCluster(options);

    const selectedId = focusPath[depth];
    focusPath[depth] = null;
    try {
      return baseRenderCluster(options);
    } finally {
      focusPath[depth] = selectedId;
    }
  };
})();