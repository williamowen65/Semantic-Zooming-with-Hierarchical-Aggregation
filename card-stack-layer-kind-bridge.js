// Lets a historical card switch its restored child layer between sub-issues and
// solutions without truncating the deeper card stack.
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
    try { return baseRenderCluster(options); }
    finally { focusPath[depth] = selectedId; }
  };

  const baseSetLayerKind = window.atlasSetLayerKind;
  window.atlasSetLayerKind = function(parentId, kind) {
    const depth = Array.isArray(focusPath) ? focusPath.indexOf(parentId) : -1;
    const historical = document.body.classList.contains('card-stack-mode') && depth >= 0 && depth < focusPath.length - 1;
    if (!historical) return baseSetLayerKind(parentId, kind);

    const parent = nodeById.get(parentId);
    if (!parent) return;
    const desired = kind === 'solution' ? 'solution' : 'issue';
    const hasDesired = (parent.children || []).some(child => (child.kind === 'solution' ? 'solution' : 'issue') === desired);
    if (!hasDesired) return;

    const state = window.atlasGetLayerKindState?.() || {};
    state[parentId] = desired;
    window.atlasRestoreLayerKindState?.(state);
    render();
    window.atlasSyncUrlState?.();
    requestAnimationFrame(() => {
      if (typeof scrollToDepth === 'function') scrollToDepth(depth, true);
    });
  };
})();