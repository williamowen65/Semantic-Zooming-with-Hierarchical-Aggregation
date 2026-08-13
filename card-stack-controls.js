// Expandable controls for the experimental card-stack hierarchy.
// Cards keep their normal compact appearance until clicked. Historical cards
// default to hiding their graphical children; the newest card defaults to showing
// them. Turning Show children on restores that card's graphical child layer.
(() => {
  if (typeof render !== 'function' || typeof stage === 'undefined') return;

  const expanded = new Set();
  const childVisibility = new Map();
  const explicitVisibility = new Set();
  let previousPath = [];

  const style = document.createElement('style');
  style.textContent = `
    body.card-stack-mode.has-card-stack .context-cluster.card-stack-layer-visible{display:inline!important}
    body.card-stack-mode.has-card-stack .child-cluster.card-stack-layer-hidden{display:none!important}
    body.card-stack-mode .layer-context-entry foreignObject:not(.layer-kind-toggle-host){pointer-events:auto}
    body.card-stack-mode .layer-context-card{pointer-events:auto;cursor:pointer;transition:background-color .2s ease,box-shadow .2s ease}
    body.card-stack-mode .layer-context-card.card-controls-open{flex-wrap:wrap;background:rgba(255,255,255,.92);box-shadow:0 7px 18px rgba(20,30,40,.08)}
    .card-stack-controls{width:100%;flex:0 0 100%;height:0;opacity:0;overflow:hidden;display:flex;align-items:center;justify-content:flex-end;transition:height .22s ease,opacity .16s ease,margin-top .22s ease;pointer-events:none}
    .layer-context-card.card-controls-open .card-stack-controls{height:28px;opacity:1;margin-top:5px;pointer-events:auto}
    .card-stack-show-children{height:26px;display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(27,43,61,.12);border-radius:999px;padding:2px 4px 2px 10px;background:rgba(247,247,244,.92);color:var(--muted);font:750 9.5px/1 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer;touch-action:manipulation}
    .card-stack-show-children .switch-track{width:31px;height:18px;padding:2px;border-radius:999px;background:rgba(27,43,61,.16);display:flex;align-items:center;box-sizing:border-box;transition:background .18s ease}
    .card-stack-show-children .switch-knob{width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(20,30,40,.22);transform:translateX(0);transition:transform .18s ease}
    .card-stack-show-children.is-on{color:var(--ink)}
    .card-stack-show-children.is-on .switch-track{background:var(--ink)}
    .card-stack-show-children.is-on .switch-knob{transform:translateX(13px)}
    @media(max-width:720px){body.card-stack-mode .layer-context-card.card-controls-open{display:flex}.layer-context-card.card-controls-open .card-stack-controls{height:25px;margin-top:3px}.card-stack-show-children{height:23px;font-size:9px}}
  `;
  document.head.appendChild(style);

  const translate = node => {
    const match = (node?.getAttribute('transform') || '').match(/translate\(\s*([-\d.]+)(?:[ ,]+)([-\d.]+)/);
    return match ? { x:Number(match[1]), y:Number(match[2]) } : { x:0, y:0 };
  };
  const clusterHeight = node => {
    const declared = Number(node?.dataset?.layerHeight);
    if (Number.isFinite(declared) && declared > 0) return declared;
    try { return node?.querySelector('.cluster-outline')?.getBBox?.().height || 0; } catch (_) { return 0; }
  };
  const samePath = path => path.length === previousPath.length && path.every((id,i) => id === previousPath[i]);

  function syncDefaults() {
    const path = Array.isArray(focusPath) ? focusPath : [];
    if (samePath(path)) return;
    const oldLast = previousPath[previousPath.length - 1];
    const newLast = path[path.length - 1];
    if (oldLast && oldLast !== newLast && !explicitVisibility.has(oldLast)) childVisibility.set(oldLast, false);
    path.forEach((id,index) => {
      if (explicitVisibility.has(id)) return;
      childVisibility.set(id, index === path.length - 1);
    });
    previousPath = [...path];
  }

  function ensureControls(card,nodeId) {
    let controls = card.querySelector('.card-stack-controls');
    if (controls) return controls;
    controls = document.createElement('div');
    controls.className = 'card-stack-controls';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'card-stack-show-children';
    button.innerHTML = '<span>Show children</span><span class="switch-track" aria-hidden="true"><span class="switch-knob"></span></span>';
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      window.atlasToggleCardChildren?.(nodeId);
    });
    controls.appendChild(button);
    card.appendChild(controls);
    return controls;
  }

  function configureCard(entry,nodeId) {
    const card = entry.querySelector('.layer-context-card');
    const node = nodeById.get(nodeId);
    if (!card || !node) return 66;
    const open = expanded.has(nodeId);
    const visible = childVisibility.get(nodeId) === true;
    const controls = ensureControls(card,nodeId);
    card.classList.toggle('card-controls-open',open);
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    card.setAttribute('aria-expanded',String(open));
    card.onclick = event => {
      if (event.target.closest('.card-stack-show-children')) return;
      window.atlasToggleCardControls?.(nodeId);
    };
    card.onkeydown = event => {
      if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('.card-stack-show-children')) {
        event.preventDefault();
        window.atlasToggleCardControls?.(nodeId);
      }
    };
    const button = controls.querySelector('.card-stack-show-children');
    const hasChildren = (node.children || []).length > 0;
    button.disabled = !hasChildren;
    button.classList.toggle('is-on',visible && hasChildren);
    button.setAttribute('aria-pressed',String(visible && hasChildren));
    button.setAttribute('aria-label',`${visible ? 'Hide' : 'Show'} children for ${node.name}`);
    return open ? 100 : 66;
  }

  function targetLayer(index,lastIndex) {
    return index === lastIndex ? stage.select('.child-cluster').node() : stage.select(`.context-cluster.depth-${index + 1}`).node();
  }

  function setY(node,y,animate) {
    if (!node) return;
    const t = translate(node);
    const value = `translate(${t.x},${y})`;
    if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) d3.select(node).interrupt().transition().duration(220).ease(d3.easeCubicOut).attr('transform',value);
    else node.setAttribute('transform',value);
  }

  function setForeignObject(fo,y,height,animate) {
    if (!fo) return;
    const selection = d3.select(fo).interrupt();
    if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) selection.transition().duration(220).ease(d3.easeCubicOut).attr('y',y).attr('height',height);
    else selection.attr('y',y).attr('height',height);
  }

  function layout(animate=false) {
    if (!Array.isArray(focusPath) || !focusPath.length || !document.body.classList.contains('card-stack-mode')) return;
    syncDefaults();
    const entries = stage.selectAll('.layer-context-entry').nodes();
    stage.selectAll('.context-cluster').classed('card-stack-layer-visible',false);
    stage.select('.child-cluster').classed('card-stack-layer-hidden',false);
    let y = width < 720 ? 132 : 98;

    entries.forEach((entry,index) => {
      const nodeId = focusPath[index];
      const cardFO = entry.querySelector('foreignObject:not(.layer-kind-toggle-host)');
      if (!nodeId || !cardFO) return;
      entry.removeAttribute('transform');
      cardFO.removeAttribute('transform');
      const cardHeight = configureCard(entry,nodeId);
      setForeignObject(cardFO,y,cardHeight,animate);

      const node = nodeById.get(nodeId);
      const show = childVisibility.get(nodeId) === true && (node?.children || []).length > 0;
      const layer = targetLayer(index,entries.length - 1);
      const kindToggle = entry.querySelector('foreignObject.layer-kind-toggle-host');
      if (kindToggle) {
        kindToggle.removeAttribute('transform');
        kindToggle.style.display = show && layer ? '' : 'none';
      }

      if (show && layer) {
        if (index < entries.length - 1) layer.classList.add('card-stack-layer-visible');
        else layer.classList.remove('card-stack-layer-hidden');
        const toggleHeight = kindToggle ? (Number(kindToggle.getAttribute('height')) || 24) : 0;
        const toggleY = y + cardHeight + 4;
        if (kindToggle) d3.select(kindToggle).attr('y',toggleY);
        const layerTop = toggleY + toggleHeight / 2;
        setY(layer,layerTop,animate);
        y = layerTop + clusterHeight(layer) + 12;
      } else {
        if (index === entries.length - 1 && layer) layer.classList.add('card-stack-layer-hidden');
        y += cardHeight + 10;
      }
    });

    if (Array.isArray(levelCenters)) {
      levelCenters.length = 0;
      entries.forEach(entry => {
        const card = entry.querySelector('foreignObject:not(.layer-kind-toggle-host)');
        if (card) levelCenters.push((Number(card.getAttribute('y')) || 0) + (Number(card.getAttribute('height')) || 66) / 2);
      });
    }
    worldHeight = Math.max(height,y + 96);
    if (typeof applyCamera === 'function') applyCamera(false);
  }

  window.atlasToggleCardControls = nodeId => {
    if (expanded.has(nodeId)) expanded.delete(nodeId); else expanded.add(nodeId);
    layout(true);
  };
  window.atlasToggleCardChildren = nodeId => {
    explicitVisibility.add(nodeId);
    childVisibility.set(nodeId,childVisibility.get(nodeId) !== true);
    layout(true);
  };
  window.atlasChildrenVisibleFor = nodeId => childVisibility.get(nodeId) === true;

  const baseRender = render;
  render = function(...args) {
    const result = baseRender(...args);
    layout(false);
    return result;
  };
  requestAnimationFrame(() => layout(false));
})();