// Adds a redundant, color-independent semantic cue to every rendered cell.
// Issues use a warning triangle with an exclamation mark.
// Solutions use a circle with a check mark.
// This wraps the existing renderer without changing layout, interaction, or color logic.
(() => {
  if (typeof renderCluster !== "function") return;

  const baseRenderClusterWithSemanticIcons = renderCluster;

  function appendSemanticIcon(cell, datum) {
    const item = datum?.data?.item;
    if (!item || !datum.polygon?.length) return;

    const [cx, cy] = d3.polygonCentroid(datum.polygon);
    const area = Math.abs(d3.polygonArea(datum.polygon));
    const size = Math.max(11, Math.min(20, Math.sqrt(area) / 10));
    const offset = Math.max(18, Math.min(34, Math.sqrt(area) * 0.12));
    const iconY = cy - offset;

    const icon = cell.append("g")
      .attr("class", `semantic-kind-icon semantic-kind-${item.kind || "issue"}`)
      .attr("transform", `translate(${cx},${iconY})`)
      .attr("aria-hidden", "true")
      .style("pointer-events", "none");

    if (item.kind === "solution") {
      icon.append("circle")
        .attr("r", size * 0.62)
        .attr("fill", "rgba(255,255,255,.94)")
        .attr("stroke", "#1f2937")
        .attr("stroke-width", Math.max(1.5, size * 0.11))
        .attr("vector-effect", "non-scaling-stroke");

      icon.append("path")
        .attr("d", `M${-size * 0.28},${size * 0.02} L${-size * 0.06},${size * 0.26} L${size * 0.34},${-size * 0.24}`)
        .attr("fill", "none")
        .attr("stroke", "#1f2937")
        .attr("stroke-width", Math.max(1.7, size * 0.13))
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("vector-effect", "non-scaling-stroke");
    } else {
      const r = size * 0.72;
      const points = [
        [0, -r],
        [r * 0.88, r * 0.64],
        [-r * 0.88, r * 0.64]
      ];

      icon.append("path")
        .attr("d", `M${points[0][0]},${points[0][1]} L${points[1][0]},${points[1][1]} L${points[2][0]},${points[2][1]} Z`)
        .attr("fill", "rgba(255,255,255,.94)")
        .attr("stroke", "#1f2937")
        .attr("stroke-width", Math.max(1.5, size * 0.11))
        .attr("stroke-linejoin", "round")
        .attr("vector-effect", "non-scaling-stroke");

      icon.append("line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", -size * 0.29)
        .attr("y2", size * 0.13)
        .attr("stroke", "#1f2937")
        .attr("stroke-width", Math.max(1.7, size * 0.13))
        .attr("stroke-linecap", "round")
        .attr("vector-effect", "non-scaling-stroke");

      icon.append("circle")
        .attr("cx", 0)
        .attr("cy", size * 0.34)
        .attr("r", Math.max(1.2, size * 0.08))
        .attr("fill", "#1f2937");
    }
  }

  renderCluster = function(options) {
    const rendered = baseRenderClusterWithSemanticIcons(options);

    rendered.g.selectAll("g.cell").each(function(d) {
      const cell = d3.select(this);
      cell.selectAll(".semantic-kind-icon").remove();
      appendSemanticIcon(cell, d);
    });

    return rendered;
  };

  // Re-render once so icons appear immediately on the current view.
  if (typeof render === "function") render();
})();
