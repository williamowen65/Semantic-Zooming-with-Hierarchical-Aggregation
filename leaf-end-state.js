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
      .attr('x', cx).attr('y', panelY + 34)
      .attr('text-anchor', 'middle')
      .text('End of this branch');

    const kindAndName = group.append('text')
      .attr('class', 'leaf-end-node-name')
      .attr('x', cx).attr('y', panelY + 66)
      .attr('text-anchor', 'middle');
    kindAndName.append('tspan').attr('class', 'leaf-end-kind').text(`${label.toUpperCase()}  `);

    const nameText = selected.name;
    if (compactMobile && nameText.length > 30) {
      const words = nameText.split(/\s+/);
      let first = '', second = '';
      words.forEach(word => {
        if (!second && `${first} ${word}`.trim().length <= 27) first = `${first} ${word}`.trim();
        else second = `${second} ${word}`.trim();
      });
      kindAndName.append('tspan').text(first);
      if (second) kindAndName.append('tspan').attr('x', cx).attr('dy', 18).text(second);
    } else {
      kindAndName.append('tspan').text(nameText);
    }

    const nameLines = compactMobile && nameText.length > 30 ? 2 : 1;
    const messageY = panelY + 66 + ((nameLines - 1) * 18) + 32;
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

  function scrollSelectedContextCardDesktop() {
    if (width < 720) return false;
    const cards = stage.selectAll('.layer-context-entry foreignObject').nodes();
    const card = cards[cards.length - 1];
    if (!card) return false;
    const cardY = Number(card.getAttribute('y'));
    if (!Number.isFinite(cardY)) return false;

    // Desktop should frame the drill-down exactly like mobile: selected-topic card
    // immediately below the fixed header, followed by the next layer/end state.
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

    // Preserve the existing mobile behavior. On desktop, explicitly anchor the
    // newly rendered selected-topic card under the toolbar instead of centering
    // the layer, which could appear not to scroll on tall desktop viewports.
    if (!scrollSelectedContextCardDesktop()) {
      scrollToDepth(focusPath.length, true);
    }

    const hasChildren = (node.children || []).length > 0;
    statusHost.textContent = hasChildren
      ? `${node.name} selected. Showing ${node.children.length} example children.`
      : `${node.name} selected. No sub-issues or sub-solutions have been created yet.`;
  };
})();