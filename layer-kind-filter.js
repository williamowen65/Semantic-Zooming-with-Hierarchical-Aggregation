(() => {
  if (typeof renderCluster !== 'function') return;
  const state = window.__atlasLayerKinds;
  const baseRenderCluster = renderCluster;

  renderCluster = function(options) {
    const name = String(options?.className || '');
    if (!Array.isArray(options?.items)) return baseRenderCluster(options);

    // Roots are intentionally heterogeneous and always shown together.
    if (name === 'root-overview' || name.includes('depth-0')) return baseRenderCluster(options);

    let parent = null;
    let preferred = null;
    const match = name.match(/depth-(\d+)/);
    if (match) {
      const depth = Number(match[1]);
      parent = focusPath?.[depth - 1] ? nodeById.get(focusPath[depth - 1]) : null;
      const selected = focusPath?.[depth] ? nodeById.get(focusPath[depth]) : null;
      preferred = selected ? state.responseTypeForChild(selected) : null;
    } else if (name === 'child-cluster') {
      parent = currentNode();
    } else {
      return baseRenderCluster(options);
    }

    if (!parent) return baseRenderCluster(options);
    const mode = state.availableMode(parent, preferred);
    if (!mode) return baseRenderCluster({ ...options, items:[] });
    return baseRenderCluster({ ...options, items:options.items.filter(item => state.responseTypeForChild(item) === mode) });
  };
})();