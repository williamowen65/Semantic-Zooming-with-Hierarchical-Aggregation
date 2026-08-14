// Expands Solution child navigation to Challenges, Implementations, Yay, and Nay.
(() => {
  if (typeof render !== 'function' || !window.__atlasLayerKinds) return;

  const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const plural = (count, singular, pluralForm = `${singular}s`) => `${count} ${count === 1 ? singular : pluralForm}`;

  function upgradeSolutionToggles() {
    document.querySelectorAll('.layer-context-entry').forEach(entry => {
      const card = entry.querySelector('.layer-context-card.is-solution');
      const host = entry.querySelector('foreignObject.layer-kind-toggle-host');
      if (!card || !host) return;

      const name = card.querySelector('.layer-context-name')?.textContent;
      const node = [...nodeById.values()].find(candidate => candidate.kind === 'solution' && candidate.name === name);
      if (!node || !(node.children || []).length) return;

      const counts = window.__atlasLayerKinds.kindCounts(node);
      const mode = window.atlasLayerKindModeFor?.(node.id) || window.__atlasLayerKinds.availableMode(node);
      const options = [
        ['challenge', plural(counts.challenges, 'challenge')],
        ['implementation', plural(counts.implementations, 'implementation')],
        ['yay', plural(counts.yays, 'yay')],
        ['nay', plural(counts.nays, 'nay')]
      ];

      const width = Math.min(window.innerWidth < 720 ? Math.max(300, window.innerWidth - 28) : 430, Number(host.getAttribute('width')) * 2 || 430);
      const cardFo = entry.querySelector('foreignObject:not(.layer-kind-toggle-host)');
      const cardX = Number(cardFo?.getAttribute('x')) || 0;
      const cardW = Number(cardFo?.getAttribute('width')) || width;
      host.setAttribute('width', width);
      host.setAttribute('x', cardX + (cardW - width) / 2);

      host.innerHTML = `<div xmlns="http://www.w3.org/1999/xhtml" class="layer-kind-toggle solution-four-way-toggle" role="group" aria-label="Show solution challenges, implementations, yays, or nays">${options.map(([kind,label]) => `<button type="button" class="${mode === kind ? 'is-active' : ''}" ${window.__atlasLayerKinds.countForMode(counts, kind) ? '' : 'disabled'} data-kind="${kind}">${esc(label)}</button>`).join('')}</div>`;
      host.querySelectorAll('button[data-kind]').forEach(button => {
        button.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          window.atlasSetLayerKind?.(node.id, button.dataset.kind);
        });
      });
    });
  }

  const baseRender = render;
  render = function(...args) {
    const result = baseRender(...args);
    upgradeSolutionToggles();
    return result;
  };

  const style = document.createElement('style');
  style.textContent = `.solution-four-way-toggle{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr));width:100%!important}.solution-four-way-toggle button{min-width:0!important;padding-left:5px!important;padding-right:5px!important;font-size:11px!important}`;
  document.head.appendChild(style);
  render();
})();