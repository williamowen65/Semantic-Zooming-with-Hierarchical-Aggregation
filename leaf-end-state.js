// Preserve the normal drill-down experience when the selected node is a leaf.
// A leaf gets a full, spacious next-layer area explaining that the branch has no
// sub-content yet and inviting someone to create it.
(() => {
  if (typeof render !== 'function' || typeof focusNode !== 'function') return;

  const parseTranslateY = element => {
    const transform = element?.getAttribute('transform') || '';
    const match = transform.match(/translate\(\s*[-\d.]+(?:[ ,]+)([-\d.]+)/);
    return match ? Number(match[1]) : 0;
  };

  function renderLeafEndLayer() {
    stage.selectAll('.leaf-end-layer').remove();
    const selected = typeof currentNode === 'function' ? currentNode() : null;
    if (!selected || (selected.children || []).length) return;

    const compactMobile = width < 720;
    const contentTop = compactMobile ? 132 : 98;
    const geometry = levelGeometry(compactMobile, contentTop);
    const gap = compactMobile ? 88 : 110;
    const lastCluster = stage.select(`.context-cluster.depth-${focusPath.length - 1}`).node();
    if (!lastCluster) return;

    // This is intentionally much taller than a compacted graphical layer. A leaf
    // should feel like a real destination/end state rather than a tiny footnote.
    const sectionHeight = Math.max(320, Math.min(compactMobile ? 520 : 560, height * .60));
    const y = parseTranslateY(lastCluster) + geometry.h + gap;
    const group = stage.append('g')
      .attr('class', 'leaf-end-layer')
      .attr('data-layer-height', sectionHeight)
      .attr('transform', `translate(0,${y})`);
    group.node().dataset.layerHeight = String(sectionHeight);

    group.append('rect')
      .attr('class', 'leaf-end-background')
      .attr('x', 0).attr('y', 0).attr('width', width).attr('height', sectionHeight);

    const label = selected.kind === 'solution' ? 'solution' : 'issue';
    const cx = width / 2;
    const cy = sectionHeight / 2;
    const textWidth = compactMobile ? Math.max(250, width - 64) : Math.min(660, width - 96);

    group.append('text')
      .attr('class', 'leaf-end-title')
      .attr('x', cx).attr('y', cy - 54)
      .attr('text-anchor', 'middle')
      .text('Nothing below this yet');

    const kindAndName = group.append('text')
      .attr('class', 'leaf-end-node-name')
      .attr('x', cx).attr('y', cy - 22)
      .attr('text-anchor', 'middle');
    kindAndName.append('tspan').attr('class', 'leaf-end-kind').text(`${label.toUpperCase()}  `);
    kindAndName.append('tspan').text(selected.name);

    const message = group.append('foreignObject')
      .attr('class', 'leaf-end-message-host')
      .attr('x', cx - textWidth / 2)
      .attr('y', cy + 2)
      .attr('width', textWidth)
      .attr('height', 110);
    message.html(`<div xmlns="http://www.w3.org/1999/xhtml" class="leaf-end-message-copy">No more sub-issues or solutions have been created for this ${label}. Someone would need to create the next content for this branch.</div>`);

    levelCenters.push(y + sectionHeight / 2);
    worldHeight = Math.max(worldHeight, y + sectionHeight + 32);
    applyCamera(false);
  }

  const previousRender = render;
  render = function() {
    previousRender();
    renderLeafEndLayer();
  };

  function scrollSelectedContextCardDesktop() {
    if (width < 720) return false;
    const cards = stage.selectAll('.layer-context-entry foreignObject:not(.layer-kind-toggle-host)').nodes();
    const card = cards[cards.length - 1];
    if (!card) return false;
    const cardY = Number(card.getAttribute('y'));
    if (!Number.isFinite(cardY)) return false;

    const toolbar = document.querySelector('.toolbar');
    const toolbarBottom = toolbar ? toolbar.getBoundingClientRect().bottom : 78;
    const viewportTarget = Math.max(88, toolbarBottom + 12);
    cameraY = viewportTarget - cardY;
    applyCamera(true);
    return true;
  }

  focusNode = function(id) {
    const node = nodeById.get(id);
    if (!node) return;
    focusPath = pathForNode(id);
    render();

    if (!scrollSelectedContextCardDesktop()) {
      scrollToDepth(focusPath.length, true);
    }

    const hasChildren = (node.children || []).length > 0;
    statusHost.textContent = hasChildren
      ? `${node.name} selected. Showing ${node.children.length} example children.`
      : `${node.name} selected. No sub-issues or solutions have been created yet.`;
  };
})();