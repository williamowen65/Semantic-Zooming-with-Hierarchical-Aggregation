// Remove the inline issue/solution glyphs from node titles while preserving
// the existing polygon-aware wrapping and fitting logic.
//
// At hierarchy overview zoom levels, prioritize the title at the visual center
// of each Voronoi cell. Metadata prefers the space immediately below the title,
// but can move above it when the lower half of the polygon is too narrow.
// Standard zoom keeps the existing label behavior unchanged so the focused /
// screen-tracking presentation continues to behave as before.
(() => {
  if (typeof layoutPolygonLabel !== 'function' || typeof renderCluster !== 'function') return;

  const originalRenderCluster = renderCluster;

  function isHierarchyOverview() {
    const mode = document.body?.dataset?.hierarchyZoom;
    return !!mode && mode !== 'standard';
  }

  function baseLabelLayout(item, poly, cx, cy, baseFont, fontWeight) {
    const words = String(item?.name || '').split(/\s+/).filter(Boolean);
    const maxLines = 7;
    const meta = metadataLines(item);
    const baseMetaFont = baseFont * .68;

    for (let scale = 1; scale >= .08; scale -= .04) {
      const effectiveFont = baseFont * scale;
      const effectiveMeta = baseMetaFont * scale;
      const lineH = effectiveFont * 1.08;
      const metaH = effectiveMeta * 1.22;
      const pad = Math.max(1.5, effectiveFont * .38);

      for (let lineCountGuess = 1; lineCountGuess <= maxLines; lineCountGuess++) {
        const blockH = (lineCountGuess - 1) * lineH + effectiveFont + metaH * 2;
        const y0 = cy - blockH * .44;
        const lines = [];
        let cursor = 0;
        let failed = false;

        for (let li = 0; li < lineCountGuess && cursor < words.length; li++) {
          const y = y0 + li * lineH;
          const span = polygonSpanAtY(poly, y - effectiveFont * .25);
          if (!span) { failed = true; break; }
          const available = Math.max(0, span[1] - span[0] - pad * 2);
          let line = '';

          while (cursor < words.length) {
            const candidate = line ? `${line} ${words[cursor]}` : words[cursor];
            const candidateWidth = measuredWidth(candidate, effectiveFont, fontWeight);
            if (candidateWidth <= available || !line) {
              if (candidateWidth > available && !line) { failed = true; break; }
              line = candidate;
              cursor++;
            } else break;
          }

          if (failed || !line) { failed = true; break; }
          lines.push({ text: line, span, y });
        }

        if (failed || cursor < words.length || !lines.length) continue;

        const meta1Y = y0 + lines.length * lineH + .1 * effectiveFont;
        const meta2Y = meta1Y + metaH;
        const meta1Span = polygonSpanAtY(poly, meta1Y);
        const meta2Span = polygonSpanAtY(poly, meta2Y);
        if (!meta1Span || !meta2Span) continue;
        if (measuredWidth(meta[0], effectiveMeta, 560) > meta1Span[1] - meta1Span[0] - pad * 2) continue;
        if (measuredWidth(meta[1], effectiveMeta, 560) > meta2Span[1] - meta2Span[0] - pad * 2) continue;

        return { scale, baseFont, baseMetaFont, lines, y0, meta, meta1Span, meta2Span };
      }
    }
    return null;
  }

  // app.js calls this directly. Keep its standard-zoom behavior exactly as it
  // was; overview centering is applied after renderCluster creates each cell.
  layoutPolygonLabel = baseLabelLayout;

  function wrapCenteredTitle(item, poly, cx, cy, baseFont, fontWeight) {
    const words = String(item?.name || '').split(/\s+/).filter(Boolean);
    const meta = metadataLines(item);
    const maxLines = 7;
    const baseMetaFont = baseFont * .68;

    for (let scale = 1; scale >= .08; scale -= .04) {
      const effectiveFont = baseFont * scale;
      const effectiveMeta = baseMetaFont * scale;
      const lineH = effectiveFont * 1.08;
      const metaH = effectiveMeta * 1.22;
      const pad = Math.max(1.5, effectiveFont * .38);

      for (let lineCountGuess = 1; lineCountGuess <= maxLines; lineCountGuess++) {
        // Baseline compensation keeps the actual title glyphs centered rather
        // than centering the title+stats block as a whole.
        const firstBaseline = cy - ((lineCountGuess - 1) * lineH) / 2 + effectiveFont * .30;
        const lines = [];
        let cursor = 0;
        let failed = false;

        for (let li = 0; li < lineCountGuess && cursor < words.length; li++) {
          const y = firstBaseline + li * lineH;
          const span = polygonSpanAtY(poly, y - effectiveFont * .25);
          if (!span) { failed = true; break; }
          const available = Math.max(0, span[1] - span[0] - pad * 2);
          let line = '';

          while (cursor < words.length) {
            const candidate = line ? `${line} ${words[cursor]}` : words[cursor];
            const candidateWidth = measuredWidth(candidate, effectiveFont, fontWeight);
            if (candidateWidth <= available || !line) {
              if (candidateWidth > available && !line) { failed = true; break; }
              line = candidate;
              cursor++;
            } else break;
          }

          if (failed || !line) { failed = true; break; }
          lines.push({ text: line, span, y });
        }

        if (failed || cursor < words.length || !lines.length) continue;

        const titleTop = lines[0].y - effectiveFont * .82;
        const titleBottom = lines[lines.length - 1].y + effectiveFont * .22;
        const placements = [
          {
            side: 'below',
            meta1Y: titleBottom + effectiveMeta * 1.02,
            meta2Y: titleBottom + effectiveMeta * 1.02 + metaH
          },
          {
            side: 'above',
            meta2Y: titleTop - effectiveMeta * .62,
            meta1Y: titleTop - effectiveMeta * .62 - metaH
          }
        ];

        for (const placement of placements) {
          const meta1Span = polygonSpanAtY(poly, placement.meta1Y);
          const meta2Span = polygonSpanAtY(poly, placement.meta2Y);
          if (!meta1Span || !meta2Span) continue;
          if (measuredWidth(meta[0], effectiveMeta, 560) > meta1Span[1] - meta1Span[0] - pad * 2) continue;
          if (measuredWidth(meta[1], effectiveMeta, 560) > meta2Span[1] - meta2Span[0] - pad * 2) continue;

          return {
            scale,
            baseFont,
            baseMetaFont,
            lines,
            meta,
            meta1Span,
            meta2Span,
            meta1Y: placement.meta1Y,
            meta2Y: placement.meta2Y,
            metaSide: placement.side
          };
        }
      }
    }
    return null;
  }

  function toLocal(value, anchor, scale) {
    return anchor + (value - anchor) / scale;
  }

  function recenterOverviewLabels(rendered) {
    if (!isHierarchyOverview() || !rendered?.g || !rendered?.leaves) return;

    rendered.g.selectAll('g.cell').each(function(d) {
      const item = d?.data?.item;
      const poly = d?.polygon;
      if (!item || !poly) return;

      const [cx, cy] = d3.polygonCentroid(poly);
      const area = Math.abs(d3.polygonArea(poly));
      const selected = d.data.id === this.parentNode?.dataset?.selectedId;
      const fontWeight = this.classList.contains('is-selected') ? 750 : 620;
      const baseFont = Math.max(9, Math.min(18, Math.sqrt(area) / 8.5));
      const layout = wrapCenteredTitle(item, poly, cx, cy, baseFont, fontWeight);
      if (!layout) return;

      const text = d3.select(this).select('text.cell-label');
      if (text.empty()) return;

      const { scale, baseMetaFont, lines, meta, meta1Span, meta2Span, meta1Y, meta2Y, metaSide } = layout;
      text.selectAll('*').remove();
      text
        .attr('x', cx)
        .attr('y', cy)
        .attr('text-anchor', 'middle')
        .attr('data-fit-scale', scale)
        .attr('data-fit-anchor-x', cx)
        .attr('data-fit-anchor-y', cy)
        .attr('data-meta-side', metaSide)
        .attr('transform', `translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`)
        .style('font-size', `${baseFont}px`)
        .style('font-weight', fontWeight);

      lines.forEach(line => {
        const lineCenter = (line.span[0] + line.span[1]) / 2;
        text.append('tspan')
          .attr('x', toLocal(lineCenter, cx, scale))
          .attr('y', toLocal(line.y, cy, scale))
          .text(line.text);
      });

      const meta1Center = (meta1Span[0] + meta1Span[1]) / 2;
      const meta2Center = (meta2Span[0] + meta2Span[1]) / 2;
      text.append('tspan')
        .attr('class', 'score-label metadata-line')
        .attr('x', toLocal(meta1Center, cx, scale))
        .attr('y', toLocal(meta1Y, cy, scale))
        .style('font-size', `${baseMetaFont}px`)
        .style('font-weight', 560)
        .text(meta[0]);
      text.append('tspan')
        .attr('class', 'score-label metadata-line child-counts')
        .attr('x', toLocal(meta2Center, cx, scale))
        .attr('y', toLocal(meta2Y, cy, scale))
        .style('font-size', `${baseMetaFont}px`)
        .style('font-weight', 560)
        .text(meta[1]);
    });
  }

  renderCluster = function(args) {
    const rendered = originalRenderCluster(args);
    recenterOverviewLabels(rendered);
    return rendered;
  };
})();