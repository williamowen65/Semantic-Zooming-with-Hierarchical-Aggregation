// Preserve the normal child-layer scroll behavior even when the selected node is a leaf.
// A leaf gets an empty next-layer area with a clear end-of-hierarchy message.
(() => {
  if (typeof render !== 'function' || typeof focusNode !== 'function') return;

  const parseTranslateY = element => {
    const transform = element?.getAttribute('transform') || '';
    const match = transform.match(/translate\(\s*[-\d.]+(?:[ ,]+)([-\d.]+)/);
    return match ? Number(match[1]) : 0;
  };

  function splitIntoLines(text, maxChars) {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';
    words.forEach(word => {
      const candidate = line ? `${line} ${word}` : word;
      if (candidate.length <= maxChars || !line) line = candidate;
      else { lines.push(line); line = word; }
    });
    if (line) lines.push(line);
    return lines;
  }

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
    const horizontalMargin = compactMobile ? 24 : 40;
    const panelWidth = Math.max(240, Math.min(compactMobile ? width - horizontalMargin * 2 : 720, width - horizontalMargin * 2));
    const nameLines = splitIntoLines(selected.name, compactMobile ? 30 : 58).slice(0, compactMobile ? 3 : 2);
    const panelHeight = compactMobile ? 220 + Math.max(0, nameLines.length - 1) * 18 : 172;
    const panelX = cx - panelWidth / 2;
    const panelY = cy - 58;

    group.append('rect')
      .attr('class', 'leaf-end-card')
      .attr('x', panelX).attr('y', panelY)
      .attr('width', panelWidth).attr('height', panelHeight)
      .attr('rx', compactMobile ? 20 : 16);

    group.append('text')
      .attr('class', 'leaf-end-title')
      .attr('x', cx).attr('y', panelY + 38)
      .attr('text-anchor', 'middle')
      .text('End of this branch');

    const kindLine = group.append('text')
      .attr('class', 'leaf-end-kind')
      .attr('x', cx).attr('y', panelY + 66)
      .attr('text-anchor', 'middle')
      .text(label.toUpperCase());

    const name = group.append('text')
      .attr('class', 'leaf-end-node-name')
      .attr('x', cx).attr('y', panelY + 91)
      .attr('text-anchor', 'middle');

    nameLines.forEach((line, index) => {
      name.append('tspan')
        .attr('x', cx)
        .attr('dy', index === 0 ? 0 : (compactMobile ? 18 : 17))
        .text(line);
    });

    const messageY = panelY + 91 + Math.max(1, nameLines.length) * (compactMobile ? 18 : 17) + 26;
    const message = group.append('text')
      .attr('class', 'leaf-end-message')
      .attr('x', cx).attr('y', messageY)
      .attr('text-anchor', 'middle');

    // Keep the first thought together and explicitly wrap after "sub-solutions"
    // so the copy never gets close to the card edges on mobile.
    message.append('tspan').attr('x', cx).attr('dy', 0)
      .text('No sub-issues or sub-solutions');
    message.append('tspan').attr('x', cx).attr('dy', compactMobile ? 19 : 18)
      .text(`have been created for this ${label} yet.`);

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