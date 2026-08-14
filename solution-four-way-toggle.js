// Expands solution-like child navigation to Challenges, Implementations, Yay, and Nay.
(() => {
  if (typeof render !== 'function' || !window.__atlasLayerKinds) return;

  const state = window.__atlasLayerKinds;
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const plural = (count, singular, pluralForm = `${singular}s`) => `${count} ${count === 1 ? singular : pluralForm}`;

  function upgradeSolutionToggles() {
    const entries = [...document.querySelectorAll('.layer-context-entry')];
    entries.forEach((entry, index) => {
      const host = entry.querySelector('foreignObject.layer-kind-toggle-host');
      const node = focusPath?.[index] ? nodeById.get(focusPath[index]) : null;
      if (!host || !node || state.hierarchyKind(node) !== 'solution') return;

      const counts = state.kindCounts(node);
      const mode = window.atlasLayerKindModeFor?.(node.id) || state.availableMode(node);
      const options = [
        ['challenge', plural(counts.challenges, 'challenge')],
        ['implementation', plural(counts.implementations, 'implementation')],
        ['yay', plural(counts.yays, 'yay')],
        ['nay', plural(counts.nays, 'nay')]
      ];

      const cardFo = entry.querySelector('foreignObject:not(.layer-kind-toggle-host)');
      const cardX = Number(cardFo?.getAttribute('x')) || 0;
      const cardW = Number(cardFo?.getAttribute('width')) || Math.max(300, window.innerWidth - 28);
      const visibleWidth = Math.min(cardW, window.innerWidth < 720 ? Math.max(240, window.innerWidth - 32) : 430);
      host.setAttribute('width', visibleWidth);
      host.setAttribute('x', cardX + (cardW - visibleWidth) / 2);
      host.style.overflow = 'hidden';

      host.innerHTML = `<div xmlns="http://www.w3.org/1999/xhtml" class="solution-toggle-scroll"><div class="layer-kind-toggle solution-four-way-toggle" role="group" aria-label="Show solution challenges, implementations, yays, or nays">${options.map(([kind,label]) => `<button type="button" class="${mode === kind ? 'is-active' : ''}" ${state.countForMode(counts, kind) ? '' : 'disabled'} data-parent-id="${esc(node.id)}" data-kind="${kind}">${esc(label)}</button>`).join('')}</div></div>`;

      const scroller = host.querySelector('.solution-toggle-scroll');
      const active = host.querySelector('button.is-active');
      if (scroller && active) requestAnimationFrame(() => active.scrollIntoView({ block:'nearest', inline:'center', behavior:'auto' }));
    });
  }

  const baseRender = render;
  render = function(...args) {
    const result = baseRender(...args);
    upgradeSolutionToggles();
    return result;
  };

  const style = document.createElement('style');
  style.textContent = `
    .solution-toggle-scroll{width:100%;height:24px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-ms-overflow-style:none;overscroll-behavior-x:contain;touch-action:pan-x;border-radius:999px}
    .solution-toggle-scroll::-webkit-scrollbar{display:none}
    .solution-four-way-toggle{display:flex!important;width:100%!important;min-width:max-content!important;grid-template-columns:none!important;padding:2px!important;box-sizing:border-box!important}
    .solution-four-way-toggle button{flex:1 0 max-content!important;min-width:max-content!important;padding-left:12px!important;padding-right:12px!important;font-size:10px!important;white-space:nowrap!important}
    @media(max-width:720px){.solution-four-way-toggle button{padding-left:11px!important;padding-right:11px!important;font-size:9.5px!important}}
  `;
  document.head.appendChild(style);
  render();
})();