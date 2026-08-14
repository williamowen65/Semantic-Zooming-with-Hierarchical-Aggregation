(() => {
  if (typeof renderCluster !== 'function') return;
  const state = window.__atlasLayerKinds;
  const baseRenderCluster = renderCluster;
  const semanticKind = item => state?.semanticKind ? state.semanticKind(item) : (item?.semanticKind || item?.kind);
  const hierarchyKind = item => state?.hierarchyKind ? state.hierarchyKind(item) : semanticKind(item);

  renderCluster = function(options) {
    const name = String(options?.className || '');
    if (!Array.isArray(options?.items)) return baseRenderCluster(options);
    if (name === 'root-overview' || name.includes('depth-0')) {
      return baseRenderCluster({ ...options, items: options.items.filter(item => semanticKind(item) !== 'solution') });
    }

    let parent = null;
    let preferred = null;
    const match = name.match(/depth-(\d+)/);
    if (match) {
      const depth = Number(match[1]);
      parent = focusPath?.[depth - 1] ? nodeById.get(focusPath[depth - 1]) : null;
      preferred = focusPath?.[depth] ? semanticKind(nodeById.get(focusPath[depth])) : null;
    } else if (name === 'child-cluster') parent = currentNode();
    else return baseRenderCluster(options);

    if (!parent) return baseRenderCluster(options);
    const mode = state.availableMode(parent, preferred);
    const parentKind = hierarchyKind(parent);
    const items = options.items.filter(item => {
      const kind = semanticKind(item);
      if (mode === 'connection') return kind === 'relationship';
      if (parentKind === 'solution') return kind === mode;
      return (kind === 'solution' ? 'solution' : 'issue') === mode;
    });
    return baseRenderCluster({ ...options, items });
  };
})();