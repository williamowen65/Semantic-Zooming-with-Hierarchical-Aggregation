// Adds redundant, color-independent semantic cues to every rendered cell,
// a viewport-aware hierarchy depth indicator, and keeps hierarchy connectors aimed
// at selected cells rather than merely at the edge of their cluster.
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

  // The depth readout follows what is actually in the viewport rather than what
  // was most recently selected. Depth 0 is the all-roots overview. Once a branch
  // is expanded, each rendered hierarchy level is depth 1, 2, 3, ...
  const toolbar = document.querySelector(".toolbar");
  const reset = document.querySelector("#reset");
  const depthIndicator = document.createElement("div");
  depthIndicator.id = "depth-indicator";
  depthIndicator.setAttribute("role", "status");
  depthIndicator.setAttribute("aria-live", "polite");
  depthIndicator.style.cssText = [
    "display:inline-flex",
    "align-items:center",
    "justify-content:center",
    "white-space:nowrap",
    "border:1px solid rgba(27,43,61,.12)",
    "background:rgba(255,255,255,.78)",
    "color:#526070",
    "border-radius:999px",
    "padding:7px 10px",
    "font-size:12px",
    "font-weight:650"
  ].join(";");

  if (toolbar) {
    if (reset) toolbar.insertBefore(depthIndicator, reset);
    else toolbar.appendChild(depthIndicator);
  }

  function stageTranslateY() {
    const node = stage?.node?.();
    if (!node) return 0;

    const consolidated = node.transform?.baseVal?.consolidate?.();
    if (consolidated?.matrix) return consolidated.matrix.f;

    const transform = node.getAttribute("transform") || "";
    const match = transform.match(/translate\(\s*[-+\d.eE]+[,\s]+([-+\d.eE]+)\s*\)/);
    return match ? Number(match[1]) : 0;
  }

  function viewportDepth() {
    if (!Array.isArray(focusPath) || !focusPath.length || !Array.isArray(levelCenters) || !levelCenters.length) {
      return 0;
    }

    // Match the camera's own target line so a level becomes the active depth when
    // it reaches the same visual position used by click-to-child auto-scrolling.
    const viewportProbeY = height * (width < 720 ? 0.48 : 0.5);
    const worldProbeY = viewportProbeY - stageTranslateY();

    let nearestIndex = 0;
    let nearestDistance = Infinity;
    levelCenters.forEach((center, index) => {
      const distance = Math.abs(center - worldProbeY);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex + 1;
  }

  let displayedDepth = null;
  function updateDepthIndicatorFromViewport() {
    const depth = viewportDepth();
    if (depth === displayedDepth) return;
    displayedDepth = depth;
    depthIndicator.textContent = `Depth ${depth}`;
    depthIndicator.setAttribute("aria-label", `Hierarchy depth ${depth}`);
  }

  // D3 changes the stage transform for manual scrolling, momentum, breadcrumb
  // movement, and animated click-to-child travel. Observing that transform makes
  // the depth indicator follow the camera itself instead of selection state.
  const stageNode = stage?.node?.();
  if (stageNode && typeof MutationObserver !== "undefined") {
    const cameraObserver = new MutationObserver(updateDepthIndicatorFromViewport);
    cameraObserver.observe(stageNode, { attributes: true, attributeFilter: ["transform"] });
  }

  // Return the selected cell's centroid in the stage's world coordinates.
  function selectedPointForCluster(clusterNode) {
    if (!clusterNode) return null;
    const selectedCell = d3.select(clusterNode).select("g.cell.is-selected");
    if (selectedCell.empty()) return null;
    const datum = selectedCell.datum();
    if (!datum?.polygon?.length) return null;

    const [cx, cy] = d3.polygonCentroid(datum.polygon);
    const transform = clusterNode.getAttribute("transform") || "";
    const match = transform.match(/translate\(\s*([-+\d.eE]+)[,\s]+([-+\d.eE]+)\s*\)/);
    const x = match ? Number(match[1]) : 0;
    const y = match ? Number(match[2]) : 0;
    return { x: x + cx, y: y + cy };
  }

  // The base renderer draws links to the top edge of every cluster. Once a
  // cluster already has a selected node, retarget that connector to the node.
  // The last connector into an unselected child cluster is intentionally left
  // untouched because there is not yet a selected destination there.
  function retargetHierarchyLinksToSelections() {
    const contextClusters = stage.selectAll("g.context-cluster").nodes();
    const links = stage.selectAll("path.hierarchy-link").nodes();
    const dots = stage.selectAll("circle.link-dot").nodes();

    for (let i = 1; i < contextClusters.length; i += 1) {
      const source = selectedPointForCluster(contextClusters[i - 1]);
      const target = selectedPointForCluster(contextClusters[i]);
      const link = links[i - 1];
      const dot = dots[i - 1];
      if (!source || !target || !link) continue;

      const sourceY = source.y + 22;
      const targetY = target.y - 22;
      const midY = (sourceY + targetY) / 2;
      d3.select(link).attr(
        "d",
        `M${source.x},${sourceY} C${source.x},${midY} ${target.x},${midY} ${target.x},${targetY}`
      );

      if (dot) {
        d3.select(dot)
          .attr("cx", target.x)
          .attr("cy", targetY);
      }
    }
  }

  const baseRenderWithSelectedConnectors = render;
  render = function() {
    const result = baseRenderWithSelectedConnectors();
    retargetHierarchyLinksToSelections();
    updateDepthIndicatorFromViewport();
    return result;
  };

  updateDepthIndicatorFromViewport();

  // Re-render once so icons, viewport depth, and selected-node connectors appear immediately.
  if (typeof render === "function") render();
})();
