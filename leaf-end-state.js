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

    // The empty state occupies exactly the slot where a child layer would have been.
    // Its position is based on the fixed layer frame, never on an internal pan/zoom transform.
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
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', geometry.h);

    const label = selected.kind === 'solution' ? 'solution' : 'issue';
    const message = `No sub-issues or sub-solutions have been created for this ${label} yet.`;
    const cx = width / 2;
    const cy = Math.min(geometry.h * .34, compactMobile ? 118 : 140);

    group.append('text')
      .attr('class', 'leaf-end-title')
      .attr('x', cx)
      .attr('y', cy)
      .attr('text-anchor', 'middle')
      .text('End of this branch');

    group.append('text')
      .attr('class', 'leaf-end-message')
      .attr('x', cx)
      .attr('y', cy + (compactMobile ? 28 : 32))
      .attr('text-anchor', 'middle')
      .text(message);

    // Treat the empty state as the next depth so the same scrolling target is available.
    levelCenters.push(y + geometry.h / 2);
    worldHeight = Math.max(worldHeight, y + geometry.h + 24);
    applyCamera(false);
  }

  const previousRender = render;
  render = function() {
    previousRender();
    renderLeafEndLayer();
  };

  // The original leaf behavior scrolls back to the selected layer. For a leaf, target
  // the newly-created empty next layer instead, exactly as if real children existed.
  focusNode = function(id) {
    const node = nodeById.get(id);
    if (!node) return;
    focusPath = pathForNode(id);
    render();
    const targetDepth = focusPath.length;
    scrollToDepth(targetDepth, true);
    const hasChildren = (node.children || []).length > 0;
    statusHost.textContent = hasChildren
      ? `${node.name} selected. Showing ${node.children.length} example children.`
      : `${node.name} selected. No sub-issues or sub-solutions have been created yet.`;
  };
})();