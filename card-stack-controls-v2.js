// Direct card toggles for the experimental card-stack hierarchy.
// Clicking a card itself shows/hides that card's child layer. The current/bottom
// card defaults on; historical cards default off. If a node is selected from a
// temporarily reopened historical layer, the path change closes that old layer.
(() => {
  if (typeof render !== 'function' || typeof stage === 'undefined') return;

  const childVisibility = new Map();
  let previousPath = [];

  const style = document.createElement('style');
  style.textContent = `
    body.card-stack-mode.has-card-stack .context-cluster.card-stack-layer-visible{display:inline!important}
    body.card-stack-mode.has-card-stack .child-cluster.card-stack-layer-hidden{display:none!important}
    body.card-stack-mode .layer-context-entry foreignObject:not(.layer-kind-toggle-host){pointer-events:auto}
    body.card-stack-mode .layer-context-card{pointer-events:auto;cursor:pointer;transition:box-shadow .18s ease,background-color .18s ease}
    body.card-stack-mode .layer-context-card.children-visible{box-shadow:0 5px 14px rgba(20,30,40,.08)}
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
  const samePath = path => path.length === previousPath.length && path.every((id,index) => id === previousPath[index]);

  function syncDefaults() {
    const path = Array.isArray(focusPath) ? focusPath : [];
    if (samePath(path)) return;

    // Every navigation change resets the stack to the simple default:
    // historical cards closed, newest/current card open.
    childVisibility.clear();
    path.forEach((id,index) => childVisibility.set(id,index === path.length - 1));
    previousPath = [...path];
  }

  function targetLayer(index,lastIndex) {
    return index === lastIndex
      ? stage.select('.child-cluster').node()
      : stage.select(`.context-cluster.depth-${index + 1}`).node();
  }

  function setY(node,y,animate) {
    if (!node) return;
    const t = translate(node);
    const value = `translate(${t.x},${y})`;
    const selection = d3.select(node).interrupt();
    if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      selection.transition().duration(220).ease(d3.easeCubicOut).attr('transform',value);
    } else {
      node.setAttribute('transform',value);
    }
  }

  function setCardY(card,y,animate) {
    if (!card) return;
    const selection = d3.select(card).interrupt();
    if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      selection.transition().duration(200).ease(d3.easeCubicOut).attr('y',y);
    } else {
      selection.attr('y',y);
    }
  }

  function configureCard(entry,nodeId) {
    const cardFO = entry.querySelector('foreignObject:not(.layer-kind-toggle-host)');
    const card = cardFO?.querySelector('.layer-context-card');
    const node = nodeById.get(nodeId);
    if (!cardFO || !card || !node) return null;

    const hasChildren = (node.children || []).length > 0;
    const visible = hasChildren && childVisibility.get(nodeId) === true;
    card.classList.toggle('children-visible',visible);
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    card.setAttribute('aria-pressed',String(visible));
    card.setAttribute('aria-label',`${visible ? 'Hide' : 'Show'} child layer for ${node.name}`);

    const toggle = () => {
      if (!hasChildren) return;
      childVisibility.set(nodeId,childVisibility.get(nodeId) !== true);
      layout(true);
    };
    card.onclick = event => {
      event.preventDefault();
      event.stopPropagation();
      toggle();
    };
    card.onkeydown = event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    };
    return cardFO;
  }

  function layout(animate=false) {
    if (!Array.isArray(focusPath) || !focusPath.length || !document.body.classList.contains('card-stack-mode')) return;
    syncDefaults();

    const entries = stage.selectAll('.layer-context-entry').nodes();
    stage.selectAll('.context-cluster').classed('card-stack-layer-visible',false);
    stage.select('.child-cluster').classed('card-stack-layer-hidden',false);
    stage.selectAll('.card-stack-controls-host-v2').remove();

    let y = width < 720 ? 132 : 98;

    entries.forEach((entry,index) => {
      const id = focusPath[index];
      const cardFO = configureCard(entry,id);
      if (!id || !cardFO) return;

      entry.removeAttribute('transform');
      cardFO.removeAttribute('transform');
      setCardY(cardFO,y,animate);

      const cardH = Number(cardFO.getAttribute('height')) || 66;
      const node = nodeById.get(id);
      const show = childVisibility.get(id) === true && (node?.children || []).length > 0;
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
        const toggleY = y + cardH + 4;
        if (kindToggle) d3.select(kindToggle).attr('y',toggleY);
        const layerTop = toggleY + toggleHeight / 2;
        setY(layer,layerTop,animate);
        y = layerTop + clusterHeight(layer) + 12;
      } else {
        if (index === entries.length - 1 && layer) layer.classList.add('card-stack-layer-hidden');
        y += cardH + 10;
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

  window.atlasChildrenVisibleFor = nodeId => childVisibility.get(nodeId) === true;

  const baseRender = render;
  render = function(...args) {
    const result = baseRender(...args);
    layout(false);
    return result;
  };

  requestAnimationFrame(() => layout(false));
})();