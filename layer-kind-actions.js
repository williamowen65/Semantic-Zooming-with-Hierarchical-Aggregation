(() => {
  const state = window.__atlasLayerKinds;
  if (!state) return;

  window.atlasSetLayerKind = function(parentId, kind) {
    const parent = nodeById.get(parentId);
    if (!parent) return;
    const counts = state.kindCounts(parent);
    const desired = kind === 'solution' ? 'solution' : 'issue';
    if ((desired === 'issue' && !counts.issues) || (desired === 'solution' && !counts.solutions)) return;

    state.layerKindByParent.set(parentId, desired);
    if (window.stopHierarchyMomentum) window.stopHierarchyMomentum();
    if (typeof pathForNode === 'function') focusPath = pathForNode(parentId);
    render();
    if (typeof window.atlasSyncUrlState === 'function') window.atlasSyncUrlState();
    requestAnimationFrame(() => {
      if (typeof scrollToDepth === 'function') scrollToDepth(Math.max(0, focusPath.length - 1), true);
    });
  };
})();