// Render an end-of-branch state that participates in the card-stack layout.
(() => {
  if (typeof render !== 'function' || typeof focusNode !== 'function') return;

  function renderLeafEndLayer() {
    stage.selectAll('.leaf-end-layer').remove();
    const selected = typeof currentNode === 'function' ? currentNode() : null;
    if (!selected || (selected.children || []).length) return;

    const compactMobile = width < 720;
    const sectionHeight = Math.max(360, height);
    const group = stage.append('g')
      .attr('class', 'leaf-end-layer')
      .attr('data-layer-height', sectionHeight);
    group.node().dataset.layerHeight = String(sectionHeight);

    group.append('rect')
      .attr('class', 'leaf-end-background')
      .attr('x', 0).attr('y', 0).attr('width', width).attr('height', sectionHeight);

    const label = selected.kind === 'solution' ? 'solution' : 'issue';
    const cx = width / 2;
    const textWidth = compactMobile ? Math.max(250, width - 64) : Math.min(660, width - 96);

    group.append('text')
      .attr('class', 'leaf-end-title')
      .attr('x', cx)
      .attr('text-anchor', 'middle')
      .text('This branch ends here for now');

    const message = group.append('foreignObject')
      .attr('class', 'leaf-end-message-host')
      .attr('x', cx - textWidth / 2)
      .attr('width', textWidth)
      .attr('height', 90);
    message.html(`<div xmlns="http://www.w3.org/1999/xhtml" class="leaf-end-message-copy">No sub-issues or solutions have been added beneath this ${label} yet.</div>`);
  }

  function arrangeLeafEndLayer() {
    const leaf = stage.select('.leaf-end-layer').node();
    if (!leaf) return;

    const cards = stage.selectAll('.layer-context-entry foreignObject:not(.layer-kind-toggle-host)').nodes();
    const lastCard = cards[cards.length - 1];
    if (!lastCard) {
      leaf.remove();
      return;
    }

    const cardY = Number(lastCard.getAttribute('y')) || 0;
    const cardHeight = Number(lastCard.getAttribute('height')) || 66;
    const leafY = cardY + cardHeight + 10;
    const sectionHeight = Math.max(360, height);
    leaf.setAttribute('transform', `translate(0,${leafY})`);
    leaf.dataset.layerHeight = String(sectionHeight);

    const title = leaf.querySelector('.leaf-end-title');
    const message = leaf.querySelector('.leaf-end-message-host');
    const viewportCenterInLeaf = Math.max(120, (height / 2) - leafY - cameraY);
    if (title) title.setAttribute('y', viewportCenterInLeaf - 18);
    if (message) message.setAttribute('y', viewportCenterInLeaf + 4);

    if (Array.isArray(levelCenters)) levelCenters.push(leafY + sectionHeight / 2);
    worldHeight = Math.max(height, leafY + sectionHeight + 32);
    applyCamera(false);
  }

  const previousRender = render;
  render = function(...args) {
    const result = previousRender(...args);
    renderLeafEndLayer();
    requestAnimationFrame(arrangeLeafEndLayer);
    return result;
  };

  const previousFocusNode = focusNode;
  focusNode = function(id) {
    previousFocusNode(id);
    const node = nodeById.get(id);
    if (!node) return;
    const hasChildren = (node.children || []).length > 0;
    statusHost.textContent = hasChildren
      ? `${node.name} selected. Showing ${node.children.length} example children.`
      : `${node.name} selected. No sub-issues or solutions have been created yet.`;
  };
})();