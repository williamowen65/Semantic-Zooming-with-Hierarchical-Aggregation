// Keep the vertical space between hierarchy layers screen-sized at overview zoom.
// The hierarchy canvas is globally scaled at 80/64/52%, but the selected-topic
// card and issue/solution toggle are counter-scaled. Expand the logical layer gap
// so the visible gap remains the same size it has at Standard (100%).
(() => {
  if (typeof render !== 'function' || typeof stage === 'undefined') return;

  const baseRender = render;

  function hierarchyScale() {
    const host = document.querySelector('#viz');
    if (!host) return 1;
    const logical = host.offsetWidth || width || 1;
    const physical = host.getBoundingClientRect().width || logical;
    const scale = physical / logical;
    return Number.isFinite(scale) && scale > 0 ? scale : 1;
  }

  function translateOf(node) {
    const transform = node?.getAttribute('transform') || '';
    const match = transform.match(/translate\(\s*([-\d.]+)(?:[ ,]+)([-\d.]+)/);
    return match ? { x: Number(match[1]), y: Number(match[2]) } : { x: 0, y: 0 };
  }

  function layerHeight(node) {
    const declared = Number(node?.dataset?.layerHeight);
    if (Number.isFinite(declared) && declared > 0) return declared;
    try { return d3.select(node).select('.cluster-outline').node()?.getBBox()?.height || 0; } catch (_) { return 0; }
  }

  function moveCluster(node, dy) {
    if (!node || !dy) return;
    const t = translateOf(node);
    node.setAttribute('transform', `translate(${t.x},${t.y + dy})`);
  }

  function selectedPoint(cluster) {
    const cell = cluster ? d3.select(cluster).select('g.cell.is-selected').node() : null;
    const datum = cell ? d3.select(cell).datum() : null;
    if (!cell || !datum?.polygon?.length) return null;
    const [cx, cy] = d3.polygonCentroid(datum.polygon);
    const t = translateOf(cluster);
    return { x: t.x + cx, y: t.y + cy };
  }

  function retargetLinks(contextClusters, childCluster) {
    const links = stage.selectAll('path.hierarchy-link').nodes();
    const dots = stage.selectAll('circle.link-dot').nodes();
    links.forEach((link, index) => {
      const source = selectedPoint(contextClusters[index]);
      let target = null;
      if (contextClusters[index + 1]) target = selectedPoint(contextClusters[index + 1]);
      else if (childCluster) {
        const t = translateOf(childCluster);
        const w = Number(childCluster.dataset.layerWidth) || width;
        target = { x: t.x + w / 2, y: t.y };
      }
      if (!source || !target) return;
      const midY = (source.y + target.y) / 2;
      d3.select(link).attr('d', `M${source.x},${source.y} C${source.x},${midY} ${target.x},${midY} ${target.x},${target.y}`);
      if (dots[index]) d3.select(dots[index]).attr('cx', target.x).attr('cy', target.y);
    });
  }

  function preserveGapSize() {
    const scale = hierarchyScale();
    if (scale >= .995 || !Array.isArray(focusPath) || !focusPath.length) return;

    const contextClusters = focusPath
      .map((_, i) => stage.select(`.context-cluster.depth-${i}`).node())
      .filter(Boolean);
    const childCluster = stage.select('.child-cluster').node();
    const ordered = childCluster ? [...contextClusters, childCluster] : contextClusters;
    if (ordered.length < 2) return;

    const physicalWidth = window.innerWidth || document.documentElement.clientWidth || width;
    const standardGap = physicalWidth < 720 ? 88 : 110;
    const targetLogicalGap = standardGap / scale;
    const contextEntries = stage.selectAll('.layer-context-entry').nodes();

    let cumulative = 0;
    for (let i = 1; i < ordered.length; i += 1) {
      if (cumulative) moveCluster(ordered[i], cumulative);

      const previous = ordered[i - 1];
      const current = ordered[i];
      const previousTop = translateOf(previous).y;
      const currentTop = translateOf(current).y;
      const currentGap = currentTop - (previousTop + layerHeight(previous));
      const extra = Math.max(0, targetLogicalGap - currentGap);

      // Preserve the same visual relationship the context UI has at 100%.
      // The gap can grow to compensate for overview zoom, but the card should
      // remain anchored near the bottom of its owning layer instead of drifting
      // toward the middle of the newly enlarged gap.
      const entry = contextEntries[i - 1];
      if (entry && cumulative) {
        const old = entry.getAttribute('transform') || '';
        entry.setAttribute('transform', `translate(0,${cumulative}) ${old}`);
      }

      if (extra) {
        moveCluster(current, extra);
        cumulative += extra;
      }
    }

    if (childCluster) {
      const childTop = translateOf(childCluster).y;
      stage.selectAll('text.canvas-caption').each(function() {
        const text = d3.select(this);
        if ((text.text() || '').includes('· children')) text.attr('y', childTop - 24);
      });
    }

    if (Array.isArray(levelCenters)) {
      levelCenters.length = 0;
      ordered.forEach(cluster => levelCenters.push(translateOf(cluster).y + layerHeight(cluster) / 2));
    }
    const last = ordered[ordered.length - 1];
    if (last) worldHeight = Math.max(height, translateOf(last).y + layerHeight(last) + 24);

    retargetLinks(contextClusters, childCluster);
    if (typeof applyCamera === 'function') applyCamera(false);
  }

  render = function() {
    const result = baseRender();
    preserveGapSize();
    return result;
  };

  requestAnimationFrame(preserveGapSize);
})();