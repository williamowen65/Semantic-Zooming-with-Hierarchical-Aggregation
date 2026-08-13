(() => {
  if (typeof render !== 'function' || typeof focusNode !== 'function') return;

  function addLeafEndState() {
    stage.selectAll('.leaf-end-layer').remove();
    document.querySelectorAll('.leaf-end-flow').forEach(el => el.remove());

    const selected = typeof currentNode === 'function' ? currentNode() : null;
    if (!selected || (selected.children || []).length) return;

    const hosts = stage.selectAll('.layer-context-entry foreignObject:not(.layer-kind-toggle-host)').nodes();
    const host = hosts[hosts.length - 1];
    const card = host && host.querySelector('.layer-context-card');
    if (!host || !card) return;

    const cardHeight = Number(host.getAttribute('height')) || 66;
    const flowHeight = Math.max(320, height - cardHeight - 24);
    card.style.height = `${cardHeight}px`;
    host.classList.add('leaf-flow-host');
    host.setAttribute('height', String(cardHeight + flowHeight));

    const end = document.createElement('section');
    end.className = 'leaf-end-flow';
    end.style.height = `${flowHeight}px`;
    end.setAttribute('role', 'status');
    end.innerHTML = `<div class="leaf-end-flow-copy"><div class="leaf-end-title">This branch ends here for now</div><div class="leaf-end-message-copy">No sub-issues or solutions have been added beneath this ${selected.kind === 'solution' ? 'solution' : 'issue'} yet.</div></div>`;
    host.appendChild(end);
  }

  const baseRender = render;
  render = function(...args) {
    const result = baseRender(...args);
    addLeafEndState();
    return result;
  };

  const baseFocusNode = focusNode;
  focusNode = function(id) {
    document.querySelectorAll('.leaf-end-flow').forEach(el => el.remove());
    stage.selectAll('.leaf-end-layer').remove();
    baseFocusNode(id);
  };
})();