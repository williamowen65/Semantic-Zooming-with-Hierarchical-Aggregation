// Prototype first-class cross-branch relationships. Relationship content is stored
// once, while lightweight appearances let the current single-parent hierarchy show
// the same connection from more than one branch.
(() => {
  if (typeof render !== 'function' || !window.__atlasLayerKinds) return;

  const state = window.__atlasLayerKinds;
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const plural = (count, singular, pluralForm = `${singular}s`) => `${count} ${count === 1 ? singular : pluralForm}`;

  function optionsFor(node, counts) {
    const kind = state.semanticKind(node);
    if (kind === 'solution') {
      return [
        ['challenge', plural(counts.challenges, 'challenge')],
        ['implementation', plural(counts.implementations, 'implementation')],
        ['yay', plural(counts.yays, 'yay')],
        ['nay', plural(counts.nays, 'nay')],
        ['connection', plural(counts.connections, 'connection')]
      ];
    }
    return [
      ['issue', plural(counts.issues, 'sub-issue', 'sub-issues')],
      ['solution', plural(counts.solutions, 'solution')],
      ['connection', plural(counts.connections, 'connection')]
    ];
  }

  function upgradeConnectionToggles() {
    const entries = [...document.querySelectorAll('#viz .layer-context-entry')];
    entries.forEach((entry, index) => {
      const node = focusPath?.[index] ? nodeById.get(focusPath[index]) : null;
      const host = entry.querySelector('foreignObject.layer-kind-toggle-host');
      if (!node || !host) return;

      const counts = state.kindCounts(node);
      if (!counts.connections) return;

      const mode = window.atlasLayerKindModeFor?.(node.id) || state.availableMode(node);
      const options = optionsFor(node, counts);
      const cardFo = entry.querySelector('foreignObject:not(.layer-kind-toggle-host)');
      const cardX = Number(cardFo?.getAttribute('x')) || 0;
      const cardW = Number(cardFo?.getAttribute('width')) || Math.max(300, window.innerWidth - 28);
      const visibleWidth = Math.min(cardW, window.innerWidth < 720 ? Math.max(250, window.innerWidth - 32) : 460);
      host.setAttribute('width', visibleWidth);
      host.setAttribute('x', cardX + (cardW - visibleWidth) / 2);
      host.style.overflow = 'hidden';

      host.innerHTML = `<div xmlns="http://www.w3.org/1999/xhtml" class="relationship-toggle-scroll"><div class="layer-kind-toggle relationship-aware-toggle" role="group" aria-label="Show child content by relationship to this node">${options.map(([kind,label]) => `<button type="button" class="${mode === kind ? 'is-active' : ''}" ${state.countForMode(counts, kind) ? '' : 'disabled'} data-parent-id="${esc(node.id)}" data-kind="${kind}">${esc(label)}</button>`).join('')}</div></div>`;

      const scroller = host.querySelector('.relationship-toggle-scroll');
      const active = host.querySelector('button.is-active');
      if (scroller && active) requestAnimationFrame(() => active.scrollIntoView({ block:'nearest', inline:'center', behavior:'auto' }));
    });
  }

  function renderRelationshipCards() {
    const entries = [...document.querySelectorAll('#viz .layer-context-entry')];
    entries.forEach((entry, index) => {
      const node = focusPath?.[index] ? nodeById.get(focusPath[index]) : null;
      if (!node || state.semanticKind(node) !== 'relationship') return;

      const card = entry.querySelector('.layer-context-card');
      const kindEl = entry.querySelector('.layer-context-kind');
      const nameEl = entry.querySelector('.layer-context-name');
      if (kindEl) kindEl.textContent = 'Connection';
      if (card) {
        card.classList.remove('is-issue', 'is-solution', 'is-challenge', 'is-implementation');
        card.classList.add('is-relationship');
      }
      if (nameEl) {
        nameEl.classList.add('relationship-title');
        nameEl.innerHTML = `<span class="relationship-endpoint">${esc(node.sourceLabel)}</span> <span class="relationship-vocabulary">${esc(node.relationshipLabel)}</span> <span class="relationship-endpoint">${esc(node.targetLabel)}</span>`;
      }
    });
  }

  function sync() {
    upgradeConnectionToggles();
    renderRelationshipCards();
  }

  const baseRender = render;
  render = function(...args) {
    const result = baseRender(...args);
    sync();
    return result;
  };

  const style = document.createElement('style');
  style.textContent = `
    .relationship-toggle-scroll{width:100%;height:24px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-ms-overflow-style:none;overscroll-behavior-x:contain;touch-action:pan-x;border-radius:999px}
    .relationship-toggle-scroll::-webkit-scrollbar{display:none}
    .relationship-aware-toggle{display:flex!important;width:100%!important;min-width:max-content!important;grid-template-columns:none!important;padding:2px!important;box-sizing:border-box!important}
    .relationship-aware-toggle button{flex:1 0 max-content!important;min-width:max-content!important;padding-left:11px!important;padding-right:11px!important;font-size:9.5px!important;white-space:nowrap!important}
    .layer-context-card.is-relationship .layer-context-kind{letter-spacing:.08em}
    .relationship-title{display:inline!important;line-height:1.45!important}
    .relationship-title .relationship-endpoint{display:inline}
    .relationship-title .relationship-vocabulary{display:inline-block;padding:1px 7px;margin:0 3px;border:1px solid currentColor;border-radius:999px;font-size:.82em;font-weight:750;line-height:1.35;white-space:nowrap;vertical-align:.05em}
  `;
  document.head.appendChild(style);
  sync();
})();