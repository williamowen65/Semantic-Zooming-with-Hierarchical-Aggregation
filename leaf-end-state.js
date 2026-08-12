// Preserve the normal child-layer scroll behavior even when the selected node is a leaf.
// A leaf gets an empty next-layer area with a clear end-of-hierarchy message.
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

    const y = parseTranslateY(lastCluster) + geometry.h + gap;
    const group = stage.append('g').attr('class', 'leaf-end-layer').attr('transform', `translate(0,${y})`);

    group.append('rect')
      .attr('class', 'leaf-end-background')
      .attr('x', 0).attr('y', 0).attr('width', width).attr('height', geometry.h);

    const label = selected.kind === 'solution' ? 'solution' : 'issue';
    const cx = width / 2;
    const cy = Math.min(geometry.h * .30, compactMobile ? 108 : 140);
    const panelWidth = compactMobile ? Math.max(260, width - 48) : Math.min(720, width - 80);
    const panelHeight = compactMobile ? 184 : 150;
    const panelX = cx - panelWidth / 2;
    const panelY = cy - 56;

    group.append('rect')
      .attr('class', 'leaf-end-card')
      .attr('x', panelX).attr('y', panelY)
      .attr('width', panelWidth).attr('height', panelHeight)
      .attr('rx', compactMobile ? 18 : 16);

    group.append('text')
      .attr('class', 'leaf-end-title')
      .attr('x', cx).attr('y', panelY + 40)
      .attr('text-anchor', 'middle')
      .text('End of this branch');

    const name = group.append('text')
      .attr('class', 'leaf-end-node-name')
      .attr('x', cx).attr('y', panelY + 70)
      .attr('text-anchor', 'middle');

    // Keep long leaf names inside the card on mobile.
    if (compactMobile && selected.name.length > 32) {
      const words = selected.name.split(/\s+/);
      let first = '', second = '';
      words.forEach(word => {
        if (!second && `${first} ${word}`.trim().length <= 28) first = `${first} ${word}`.trim();
        else second = `${second} ${word}`.trim();
      });
      name.append('tspan').attr('x', cx).attr('dy', 0).text(first);
      name.append('tspan').attr('x', cx).attr('dy', 18).text(second);
    } else {
      name.text(selected.name);
    }

    const nameLines = compactMobile && selected.name.length > 32 ? 2 : 1;
    const messageY = panelY + 70 + (nameLines * 18) + 18;
    const message = group.append('text')
      .attr('class', 'leaf-end-message')
      .attr('x', cx).attr('y', messageY)
      .attr('text-anchor', 'middle');

    if (compactMobile) {
      message.append('tspan').attr('x', cx).attr('dy', 0)
        .text('No sub-issues or sub-solutions');
      message.append('tspan').attr('x', cx).attr('dy', 18)
        .text(`have been created for this ${label} yet.`);
    } else {
      message.text(`No sub-issues or sub-solutions have been created for this ${label} yet.`);
    }

    levelCenters.push(y + geometry.h / 2);
    worldHeight = Math.max(worldHeight, y + geometry.h + 24);
    applyCamera(false);
  }

  const previousRender = render;
  render = function() {
    previousRender();
    renderLeafEndLayer();
  };

  focusNode = function(id) {
    const node = nodeById.get(id);
    if (!node) return;
    focusPath = pathForNode(id);
    render();
    scrollToDepth(focusPath.length, true);
    const hasChildren = (node.children || []).length > 0;
    statusHost.textContent = hasChildren
      ? `${node.name} selected. Showing ${node.children.length} example children.`
      : `${node.name} selected. No sub-issues or sub-solutions have been created yet.`;
  };
})();