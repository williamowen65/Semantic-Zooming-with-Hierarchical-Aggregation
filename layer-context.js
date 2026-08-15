// Render compact information for each selected hierarchy level in the white
// space between that level and the next one. Context travels with the hierarchy.
(() => {
  const parseTranslateY = element => {
    const transform = element?.getAttribute('transform') || '';
    const match = transform.match(/translate\(\s*[-\d.]+(?:[ ,]+)([-\d.]+)/);
    return match ? Number(match[1]) : 0;
  };
  const compact = value => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(Math.round(value || 0));
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const descriptionHtml = value => esc(value).replace(/\n/g, '<br/>');
  const responseState = () => window.__atlasLayerKinds;

  function hierarchyViewportScale() {
    const host = document.querySelector('#viz');
    if (!host) return 1;
    const logicalWidth = host.offsetWidth || width || 1;
    const physicalWidth = host.getBoundingClientRect().width || logicalWidth;
    const scale = physicalWidth / logicalWidth;
    return Number.isFinite(scale) && scale > 0 ? scale : 1;
  }
  function layerTop(cluster) { return parseTranslateY(cluster); }
  function layerHeight(cluster) {
    const declared = Number(cluster?.dataset?.layerHeight);
    if (Number.isFinite(declared) && declared > 0) return declared;
    const outline = cluster ? d3.select(cluster).select('.cluster-outline').node() : null;
    if (outline) { try { return outline.getBBox().height; } catch (_) {} }
    return 0;
  }
  function layerBottom(cluster) { return layerTop(cluster) + layerHeight(cluster); }
  function displayType(node) {
    return node?.displayType || node?.rootRole || (node?.kind === 'solution' ? 'solution' : node?.kind === 'issue' ? 'issue' : 'node');
  }
  function responseLabel(def, count) {
    const word = count === 1 ? (def.singular || def.label || def.id) : (def.plural || def.label || def.id);
    return `${count} ${word}`;
  }

  function renderLayerContextEntries() {
    stage.selectAll('.layer-context-entry').remove();
    if (!focusPath?.length) return;
    const state = responseState();
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
      let cardHeight = preserveViewportSize ? preferredCardHeight : Math.min(preferredCardHeight, Math.max(58, available - 12));
      const centeredOffset = Math.max(6, (available - cardHeight) / 2);
      const y = preserveViewportSize ? gapTop + (6 / hierarchyScale) : gapTop + Math.max(6, centeredOffset - 7);
      const visualCenterX = width / 2;
      const desiredCardWidth = Math.max(120, physicalViewportWidth - 20);
      const cardWidth = preserveViewportSize ? desiredCardWidth : (width < 720 ? Math.max(120, width - 20) : Math.min(width - 32, width * .76));
      const x = preserveViewportSize ? visualCenterX - cardWidth / 2 : (width < 720 ? 10 : Math.max(16, width * .12));
      const type = displayType(node);
      const defs = state?.responseDefinitionsFor?.(node) || [];
      const counts = state?.responseCounts?.(node) || {};
      const totalResponses = Object.values(counts).reduce((sum, n) => sum + Number(n || 0), 0);
      const typeLabel = type === 'solution' ? 'Solution' : type === 'question' ? 'Question' : type === 'issue' ? 'Issue' : 'Post';
      const html = `<div xmlns="http://www.w3.org/1999/xhtml" class="layer-context-card ${type === 'solution' ? 'is-solution' : 'is-issue'}"><div class="layer-context-copy"><div class="layer-context-primary"><span class="layer-context-kind">${esc(typeLabel)}</span><span class="layer-context-name">${esc(node.name)}</span></div><div class="layer-context-description">${descriptionHtml(node.description || '')}</div></div><div class="layer-context-stats"><span class="layer-context-stat"><strong>${compact(node.votes)}</strong> votes</span><span class="layer-context-stat"><strong>${Number(node.rating || 0).toFixed(1)}</strong> avg</span><span class="layer-context-stat"><strong>${totalResponses}</strong> responses</span></div></div>`;
      const entry = stage.append('g').attr('class', 'layer-context-entry');
      if (preserveViewportSize) entry.attr('transform', `translate(${visualCenterX},${y}) scale(${inverseHierarchyScale}) translate(${-visualCenterX},${-y})`);
      const cardFo = entry.append('foreignObject').attr('x', x).attr('y', y).attr('width', cardWidth).attr('height', cardHeight).html(html);
      const cardElement = cardFo.node()?.querySelector('.layer-context-card');
      if (cardElement) {
        cardElement.style.height = 'auto';
        cardElement.style.minHeight = `${preferredCardHeight}px`;
        const measuredHeight = Math.ceil(cardElement.scrollHeight || cardElement.getBoundingClientRect().height || cardHeight);
        cardHeight = Math.max(preferredCardHeight, measuredHeight);
        cardFo.attr('height', cardHeight);
      }

      if (!defs.length) return;
      const mode = window.atlasLayerKindModeFor?.(node.id) || state.availableMode(node);
      const toggleWidth = Math.min(cardWidth * .88, physicalViewportWidth < 720 ? Math.max(240, physicalViewportWidth - 32) : Math.max(280, Math.min(520, defs.length * 118)));
      const toggleHeight = 24;
      const toggleX = x + (cardWidth - toggleWidth) / 2;
      const toggleY = y + cardHeight + 4;
      const buttons = defs.map(def => {
        const count = Number(counts[def.id] || 0);
        return `<button type="button" class="${mode === def.id ? 'is-active' : ''}" ${count ? '' : 'disabled'} data-parent-id="${esc(node.id)}" data-kind="${esc(def.id)}">${esc(responseLabel(def,count))}</button>`;
      }).join('');
      const toggleHtml = `<div xmlns="http://www.w3.org/1999/xhtml" class="solution-toggle-scroll"><div class="layer-kind-toggle solution-four-way-toggle" role="group" aria-label="Choose which responses to show">${buttons}</div></div>`;
      entry.append('foreignObject').attr('class', 'layer-kind-toggle-host').attr('x', toggleX).attr('y', toggleY).attr('width', toggleWidth).attr('height', toggleHeight).html(toggleHtml);
    });
  }

  const baseRender = render;
  render = function() { const result=baseRender(); renderLayerContextEntries(); return result; };
  renderLayerContextEntries();
})();