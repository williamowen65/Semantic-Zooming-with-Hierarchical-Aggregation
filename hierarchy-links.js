// Renders the hierarchy connectors between the selected cell in one layer and
// the selected cell (or child layer) below it. Connector endpoints land on the
// perimeter of selected Voronoi cells instead of their centroids.
(() => {
  if (typeof render !== "function" || typeof d3 === "undefined" || !stage) return;

  function pointToStage(element, x, y) {
    const svgNode = svg?.node?.();
    const stageNode = stage?.node?.();
    if (!svgNode || !stageNode || !element?.getCTM || !stageNode.getCTM) return null;
    const elementMatrix = element.getCTM();
    const stageMatrix = stageNode.getCTM();
    if (!elementMatrix || !stageMatrix) return null;
    const p = svgNode.createSVGPoint(); p.x = x; p.y = y;
    const viewportPoint = p.matrixTransform(elementMatrix);
    const stagePoint = viewportPoint.matrixTransform(stageMatrix.inverse());
    return { x: stagePoint.x, y: stagePoint.y };
  }

  function perimeterPoint(poly, towardX, towardY) {
    if (!poly?.length) return null;
    const [cx, cy] = d3.polygonCentroid(poly);
    let dx = towardX - cx, dy = towardY - cy;
    const mag = Math.hypot(dx, dy) || 1; dx /= mag; dy /= mag;
    let bestT = Infinity, best = null;
    for (let i = 0; i < poly.length; i += 1) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const ex = b[0] - a[0], ey = b[1] - a[1], ax = a[0] - cx, ay = a[1] - cy;
      const det = dx * (-ey) - dy * (-ex); if (Math.abs(det) < 1e-8) continue;
      const t = (ax * (-ey) - ay * (-ex)) / det, u = (dx * ay - dy * ax) / det;
      if (t >= 0 && u >= -1e-6 && u <= 1 + 1e-6 && t < bestT) { bestT = t; best = [cx + dx * t, cy + dy * t]; }
    }
    return best || [cx, cy];
  }

  function selectedCell(clusterNode) {
    if (!clusterNode) return null;
    const cellNode = d3.select(clusterNode).select("g.cell.is-selected").node();
    const datum = cellNode ? d3.select(cellNode).datum() : null;
    if (!cellNode || !datum?.polygon?.length) return null;
    const [cx, cy] = d3.polygonCentroid(datum.polygon);
    return { cellNode, datum, centroid: { x: cx, y: cy } };
  }

  function selectedPerimeterPoint(clusterNode, targetStagePoint) {
    const selected = selectedCell(clusterNode); if (!selected) return null;
    const svgNode = svg?.node?.(), stageNode = stage?.node?.();
    if (!svgNode || !stageNode || !selected.cellNode.getCTM || !stageNode.getCTM) return pointToStage(selected.cellNode, selected.centroid.x, selected.centroid.y);
    const cellMatrix = selected.cellNode.getCTM(), stageMatrix = stageNode.getCTM();
    if (!cellMatrix || !stageMatrix) return pointToStage(selected.cellNode, selected.centroid.x, selected.centroid.y);
    const stagePoint = svgNode.createSVGPoint(); stagePoint.x = targetStagePoint.x; stagePoint.y = targetStagePoint.y;
    const screenPoint = stagePoint.matrixTransform(stageMatrix), targetLocal = screenPoint.matrixTransform(cellMatrix.inverse());
    const edge = perimeterPoint(selected.datum.polygon, targetLocal.x, targetLocal.y);
    return pointToStage(selected.cellNode, edge[0], edge[1]);
  }

  function selectedCentroidPoint(clusterNode) {
    const selected = selectedCell(clusterNode);
    return selected ? pointToStage(selected.cellNode, selected.centroid.x, selected.centroid.y) : null;
  }

  function childTargetPoint(clusterNode) {
    if (!clusterNode) return null;
    const box = clusterNode.getBBox(); return pointToStage(clusterNode, box.x + box.width / 2, box.y);
  }

  function renderHierarchyLinks() {
    stage.selectAll("path.hierarchy-link, circle.link-dot").remove();
    if (!Array.isArray(focusPath) || !focusPath.length) return;
    const contexts = stage.selectAll("g.context-cluster").nodes(), childCluster = stage.select("g.child-cluster").node();
    contexts.forEach((sourceCluster, index) => {
      const nextCluster = index + 1 < contexts.length ? contexts[index + 1] : null;
      const rawTarget = nextCluster ? selectedCentroidPoint(nextCluster) : (childCluster ? childTargetPoint(childCluster) : null); if (!rawTarget) return;
      const source = selectedPerimeterPoint(sourceCluster, rawTarget); let target = rawTarget;
      if (nextCluster) { const rawSource = selectedCentroidPoint(sourceCluster); if (rawSource) target = selectedPerimeterPoint(nextCluster, rawSource) || rawTarget; }
      if (!source || !target) return;
      const midY = (source.y + target.y) / 2;
      stage.insert("path", ":first-child").attr("class", "hierarchy-link").attr("d", `M${source.x},${source.y} C${source.x},${midY} ${target.x},${midY} ${target.x},${target.y}`).attr("fill", "none").attr("stroke", "#526070").attr("stroke-width", 2.2).attr("stroke-linecap", "round").attr("vector-effect", "non-scaling-stroke").style("pointer-events", "none");
    });
  }

  // Layer pan/zoom changes the transform on `g.layer-content`. Recompute the
  // connector geometry whenever a layer transform changes so the line stays
  // attached to the current selected-cell perimeter.
  let refreshFrame = 0;
  function scheduleHierarchyRefresh() {
    if (refreshFrame) return;
    refreshFrame = requestAnimationFrame(() => {
      refreshFrame = 0;
      renderHierarchyLinks();
    });
  }
  const stageNode = stage.node();
  if (stageNode && typeof MutationObserver !== "undefined") {
    new MutationObserver(records => {
      if (records.some(record => record.target?.classList?.contains("layer-content"))) scheduleHierarchyRefresh();
    }).observe(stageNode, { subtree: true, attributes: true, attributeFilter: ["transform"] });
  }
  window.refreshHierarchyLinks = scheduleHierarchyRefresh;

  const baseRenderWithHierarchyLinks = render;
  render = function() { const result = baseRenderWithHierarchyLinks(); scheduleHierarchyRefresh(); return result; };
  render();
})();