(() => {
  const state = window.__atlasLayerKinds;
  if (!state) return;

  window.atlasLayerKindModeFor = parentId => {
    const parent = nodeById.get(parentId);
    if (!parent) return null;
    const depth = focusPath.indexOf(parentId);
    const selected = depth >= 0 && focusPath[depth + 1] ? nodeById.get(focusPath[depth + 1]) : null;
    const selectedResponse = selected ? state.responseTypeForChild(selected) : null;
    return state.availableMode(parent, selectedResponse);
  };

  window.atlasGetLayerKindState = () => Object.fromEntries(state.responseTypeByParent.entries());

  window.atlasRestoreLayerKindState = saved => {
    state.responseTypeByParent.clear();
    Object.entries(saved || {}).forEach(([parentId, responseType]) => {
      const parent = nodeById.get(parentId);
      if (!parent) return;
      if (state.modesFor(parent).includes(responseType)) state.responseTypeByParent.set(parentId, responseType);
    });
  };

  if (window.__atlasPendingLayerKinds) window.atlasRestoreLayerKindState(window.__atlasPendingLayerKinds);
})();