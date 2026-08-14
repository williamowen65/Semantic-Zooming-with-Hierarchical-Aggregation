(() => {
  const host = document.querySelector('#viz');
  if (!host) return;

  host.addEventListener('click', event => {
    const button = event.target?.closest?.('.layer-kind-toggle button');
    if (!button || button.disabled || typeof atlasSetLayerKind !== 'function') return;

    const entry = button.closest('.layer-context-entry');
    const entries = [...document.querySelectorAll('#viz .layer-context-entry')];
    const depth = entries.indexOf(entry);
    const parentId = button.dataset.parentId || (depth >= 0 ? focusPath?.[depth] : null);
    if (!parentId) return;

    let kind = button.dataset.kind;
    if (!kind) {
      const buttons = [...button.parentElement.querySelectorAll('button')];
      kind = buttons.indexOf(button) === 1 ? 'solution' : 'issue';
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    atlasSetLayerKind(parentId, kind);
  }, true);
})();