(() => {
  if (typeof renderCluster !== 'function') return;
  const state = window.__atlasLayerKinds;
  const baseRenderCluster = renderCluster;

  renderCluster = function(options) {
    const name = String(options?.className || '');
    if (!Array.isArray(options?.items)) return baseRenderCluster(options);
    if (name === 'root-overview' || name.includes('depth-0')) {
      return baseRenderCluster({ ...options, items:options.items.filter(item => item.kind !== 'solution') });
    }

    let parent = null;
    let preferred = null;
    const match = name.match(/depth-(\d+)/);
    if (match) {
      const depth = Number(match[1]);
      parent = focusPath?.[depth - 1] ? nodeById.get(focusPath[depth - 1]) : null;
      preferred = focusPath?.[depth] ? nodeById.get(focusPath[depth])?.kind : null;
    } else if (name === 'child-cluster') parent = currentNode();
    else return baseRenderCluster(options);

    if (!parent) return baseRenderCluster(options);
    const mode = state.availableMode(parent, preferred);
    const items = options.items.filter(item => (item.kind === 'solution' ? 'solution' : 'issue') === mode);
    return baseRenderCluster({ ...options, items });
  };
})();