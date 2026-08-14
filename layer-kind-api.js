(() => {
  const state = window.__atlasLayerKinds;
  if (!state) return;

  window.atlasLayerKindModeFor = parentId => {
    const parent = nodeById.get(parentId);
    if (!parent) return 'issue';
    const depth = focusPath.indexOf(parentId);
    const selected = depth >= 0 && focusPath[depth + 1] ? nodeById.get(focusPath[depth + 1]) : null;
    const selectedKind = selected ? state.semanticKind(selected) : null;
    return state.availableMode(parent, selectedKind);
  };

  window.atlasGetLayerKindState = () => Object.fromEntries(state.layerKindByParent.entries());

  window.atlasRestoreLayerKindState = saved => {
    state.layerKindByParent.clear();
    Object.entries(saved || {}).forEach(([parentId, kind]) => {
      const parent = nodeById.get(parentId);
      if (!parent) return;
      const counts = state.kindCounts(parent);
      if (state.modesFor(parent).includes(kind) && state.countForMode(counts, kind)) {
        state.layerKindByParent.set(parentId, kind);
      }
    });
  };

  if (window.__atlasPendingLayerKinds) window.atlasRestoreLayerKindState(window.__atlasPendingLayerKinds);
})();