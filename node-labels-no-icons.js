// Remove the inline issue/solution glyphs from node titles while preserving
// the existing polygon-aware wrapping, fitting, metadata, and centering logic.
(() => {
  if (typeof layoutPolygonLabel !== 'function') return;

  layoutPolygonLabel = function(item, poly, cx, cy, baseFont, fontWeight) {
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
  };
})();