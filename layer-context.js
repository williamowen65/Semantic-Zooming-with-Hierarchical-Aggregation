// Render compact information for each selected hierarchy level in the white
// space between that level and the next one. Context travels with the hierarchy.
(() => {
  const parseTranslateY = element => {
    const transform = element?.getAttribute('transform') || '';
    const match = transform.match(/translate\(\s*[-\d.]+(?:[ ,]+)([-\d.]+)/);
    return match ? Number(match[1]) : 0;
  };
  const compact = value => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(Math.round(value || 0));
  const affectedLocationCount = node => {
    if (!node || node.kind !== 'issue') return null;
    if (Array.isArray(node.affectedLocations)) return node.affectedLocations.length;
    if (Number.isFinite(node.affectedLocationCount)) return node.affectedLocationCount;
    return Math.max(1, Math.min(12, Math.round((node.votes || 1000) / 1450)));
  };
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  // A layer's visible frame is fixed even when its internal layer-content is
  // panned or zoomed. Never use getBBox() here: getBBox() includes transformed
  // descendants and makes the context card drift when a layer is zoomed.
  function layerTop(cluster) {
    return parseTranslateY(cluster);
  }
  function layerHeight(cluster) {
    const declared = Number(cluster?.dataset?.layerHeight);
    if (Number.isFinite(declared) && declared > 0) return declared;
    const outline = cluster ? d3.select(cluster).select('.cluster-outline').node() : null;
    if (outline) {
      try { return outline.getBBox().height; } catch (_) {}
    }
    return 0;
  }
  function layerBottom(cluster) {
    return layerTop(cluster) + layerHeight(cluster);
  }

  function renderLayerContextEntries() {
    stage.selectAll('.layer-context-entry').remove();
    if (!focusPath?.length) return;
    const clusters = focusPath.map((_, index) => stage.select(`.context-cluster.depth-${index}`).node());
    const childCluster = stage.select('.child-cluster').node();

    focusPath.forEach((id, index) => {
      const node = nodeById.get(id), current = clusters[index];
      if (!node || !current) return;
      const next = clusters[index + 1] || (index === focusPath.length - 1 ? childCluster : null);

      // Position strictly in world/layer coordinates. Internal pan/zoom changes
      // only g.layer-content and therefore cannot affect these values.
      const currentBottom = layerBottom(current);
      const gapTop = currentBottom;
      const gapBottom = next ? layerTop(next) : currentBottom + (width < 720 ? 96 : 112);
      const available = Math.max(58, gapBottom - gapTop);
      const cardHeight = Math.min(width < 720 ? 76 : 66, Math.max(58, available - 12));
      const y = gapTop + Math.max(5, (available - cardHeight) / 2);
      const x = width < 720 ? 10 : Math.max(16, width * .12);
      const cardWidth = width < 720 ? Math.max(120, width - 20) : Math.min(width - 32, width * .76);
      const locations = affectedLocationCount(node), childCount = (node.children || []).length;
      const locationHtml = locations == null ? '' : `<span class="layer-context-stat affected-location-stat"><strong>${locations}</strong> affected location${locations === 1 ? '' : 's'}</span>`;
      const html = `<div xmlns="http://www.w3.org/1999/xhtml" class="layer-context-card ${node.kind === 'solution' ? 'is-solution' : 'is-issue'}"><div class="layer-context-copy"><div class="layer-context-primary"><span class="layer-context-kind">${node.kind === 'solution' ? 'Solution' : 'Issue'}</span><span class="layer-context-name">${esc(node.name)}</span></div><div class="layer-context-description">${esc(node.description || '')}</div></div><div class="layer-context-stats">${locationHtml}<span class="layer-context-stat"><strong>${compact(node.votes)}</strong> votes</span><span class="layer-context-stat"><strong>${Number(node.rating || 0).toFixed(1)}</strong> avg</span><span class="layer-context-stat"><strong>${childCount}</strong> children</span></div></div>`;
      const entry = stage.append('g').attr('class', 'layer-context-entry');
      entry.append('foreignObject').attr('x', x).attr('y', y).attr('width', cardWidth).attr('height', cardHeight).html(html);
    });
  }

  const baseRender = render;
  render = function() { baseRender(); renderLayerContextEntries(); };
  renderLayerContextEntries();
})();