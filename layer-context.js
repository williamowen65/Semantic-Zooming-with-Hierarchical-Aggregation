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
  const childKindCounts = node => {
    let issues = 0, solutions = 0;
    (node?.children || []).forEach(child => {
      if (child.kind === 'solution') solutions += 1;
      else issues += 1;
    });
    return { issues, solutions };
  };
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  function hierarchyViewportScale() {
    const host = document.querySelector('#viz');
    if (!host) return 1;
    const logicalWidth = host.offsetWidth || width || 1;
    const physicalWidth = host.getBoundingClientRect().width || logicalWidth;
    const scale = physicalWidth / logicalWidth;
    return Number.isFinite(scale) && scale > 0 ? scale : 1;
  }

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
    const hierarchyScale = hierarchyViewportScale();
    const inverseHierarchyScale = 1 / hierarchyScale;
    const physicalViewportWidth = window.innerWidth || document.documentElement.clientWidth || width;
    const preserveViewportSize = hierarchyScale < .995;

    focusPath.forEach((id, index) => {
      const node = nodeById.get(id), current = clusters[index];
      if (!node || !current) return;
      const next = clusters[index + 1] || (index === focusPath.length - 1 ? childCluster : null);

      const currentBottom = layerBottom(current);
      const gapTop = currentBottom;
      const gapBottom = next ? layerTop(next) : currentBottom + (width < 720 ? 96 : 112);
      const available = Math.max(58, gapBottom - gapTop);
      const preferredCardHeight = 66;
      const cardHeight = preserveViewportSize
        ? preferredCardHeight
        : Math.min(preferredCardHeight, Math.max(58, available - 12));
      // Standard view keeps the existing centered treatment. At overview zoom,
      // anchor the card to the upper layer with the same 6px *screen* inset as
      // Standard instead of centering it inside the enlarged logical gap.
      const centeredOffset = Math.max(6, (available - cardHeight) / 2);
      const y = preserveViewportSize
        ? gapTop + (6 / hierarchyScale)
        : gapTop + Math.max(6, centeredOffset - 7);

      // The hierarchy canvas itself is scaled at overview presets. Keep these UI
      // controls screen-sized, like the header, by counter-scaling only the
      // context entry around its visual center/top anchor. Their widths are based
      // on the real device viewport rather than the emulated wide canvas.
      const visualCenterX = width / 2;
      const desiredCardWidth = Math.max(120, physicalViewportWidth - 20);
      const cardWidth = preserveViewportSize
        ? desiredCardWidth
        : (width < 720 ? Math.max(120, width - 20) : Math.min(width - 32, width * .76));
      const x = preserveViewportSize
        ? visualCenterX - cardWidth / 2
        : (width < 720 ? 10 : Math.max(16, width * .12));

      const locations = affectedLocationCount(node);
      const counts = childKindCounts(node);
      const locationHtml = locations == null ? '' : `<span class="layer-context-stat affected-location-stat"><strong>${locations}</strong> affected location${locations === 1 ? '' : 's'}</span>`;
      const html = `<div xmlns="http://www.w3.org/1999/xhtml" class="layer-context-card ${node.kind === 'solution' ? 'is-solution' : 'is-issue'}"><div class="layer-context-copy"><div class="layer-context-primary"><span class="layer-context-kind">${node.kind === 'solution' ? 'Solution' : 'Issue'}</span><span class="layer-context-name">${esc(node.name)}</span></div><div class="layer-context-description">${esc(node.description || '')}</div></div><div class="layer-context-stats">${locationHtml}<span class="layer-context-stat"><strong>${compact(node.votes)}</strong> votes</span><span class="layer-context-stat"><strong>${Number(node.rating || 0).toFixed(1)}</strong> avg</span><span class="layer-context-stat"><strong>${counts.issues}</strong> ${counts.issues === 1 ? 'issue' : 'issues'}</span><span class="layer-context-stat"><strong>${counts.solutions}</strong> ${counts.solutions === 1 ? 'solution' : 'solutions'}</span></div></div>`;
      const entry = stage.append('g').attr('class', 'layer-context-entry');
      if (preserveViewportSize) {
        entry.attr('transform', `translate(${visualCenterX},${y}) scale(${inverseHierarchyScale}) translate(${-visualCenterX},${-y})`);
      }
      entry.append('foreignObject').attr('x', x).attr('y', y).attr('width', cardWidth).attr('height', cardHeight).html(html);

      if ((node.children || []).length) {
        const mode = typeof window.atlasLayerKindModeFor === 'function' ? window.atlasLayerKindModeFor(node.id) : 'issue';
        const toggleWidth = Math.min(physicalViewportWidth < 720 ? 210 : 230, cardWidth * .72);
        const toggleHeight = 24;
        const toggleX = x + (cardWidth - toggleWidth) / 2;
        const toggleY = y + cardHeight + 4;
        const issueLabel = `${counts.issues} ${counts.issues === 1 ? 'sub-issue' : 'sub-issues'}`;
        const solutionLabel = `${counts.solutions} ${counts.solutions === 1 ? 'solution' : 'solutions'}`;
        const toggleHtml = `<div xmlns="http://www.w3.org/1999/xhtml" class="layer-kind-toggle" role="group" aria-label="Show child issues or solutions"><button type="button" class="${mode === 'issue' ? 'is-active' : ''}" ${counts.issues ? '' : 'disabled'} onclick="window.atlasSetLayerKind && window.atlasSetLayerKind('${esc(node.id)}','issue')">${issueLabel}</button><button type="button" class="${mode === 'solution' ? 'is-active' : ''}" ${counts.solutions ? '' : 'disabled'} onclick="window.atlasSetLayerKind && window.atlasSetLayerKind('${esc(node.id)}','solution')">${solutionLabel}</button></div>`;
        entry.append('foreignObject').attr('class', 'layer-kind-toggle-host').attr('x', toggleX).attr('y', toggleY).attr('width', toggleWidth).attr('height', toggleHeight).html(toggleHtml);
      }
    });
  }

  const baseRender = render;
  render = function() { baseRender(); renderLayerContextEntries(); };
  renderLayerContextEntries();
})();