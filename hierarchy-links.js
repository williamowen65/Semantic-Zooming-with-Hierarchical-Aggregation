// Renders the hierarchy connectors between the selected cell in one layer and
// the selected cell (or child layer) below it. semantic-icons.js already knows
// how to retarget `.hierarchy-link` paths while a layer is panned or zoomed.
(() => {
  if (typeof render !== "function" || typeof d3 === "undefined" || !stage) return;

  function pointToStage(element, x, y) {
    const svgNode = svg?.node?.();
    const stageNode = stage?.node?.();
    if (!svgNode || !stageNode || !element?.getCTM || !stageNode.getCTM) return null;
    const elementMatrix = element.getCTM();
    const stageMatrix = stageNode.getCTM();
    if (!elementMatrix || !stageMatrix) return null;
    const p = svgNode.createSVGPoint();
    p.x = x;
    p.y = y;
    const viewportPoint = p.matrixTransform(elementMatrix);
    const stagePoint = viewportPoint.matrixTransform(stageMatrix.inverse());
    return { x: stagePoint.x, y: stagePoint.y };
  }

  function selectedPoint(clusterNode) {
    if (!clusterNode) return null;
    const cellNode = d3.select(clusterNode).select("g.cell.is-selected").node();
    const datum = cellNode ? d3.select(cellNode).datum() : null;
    if (!cellNode || !datum?.polygon?.length) return null;
    const [cx, cy] = d3.polygonCentroid(datum.polygon);
    return pointToStage(cellNode, cx, cy);
  }

  function childTargetPoint(clusterNode) {
    if (!clusterNode) return null;
    const w = Number(clusterNode.dataset.layerWidth) || width;
    return pointToStage(clusterNode, w / 2, 0);
  }

  function renderHierarchyLinks() {
    stage.selectAll("path.hierarchy-link, circle.link-dot").remove();
    if (!Array.isArray(focusPath) || !focusPath.length) return;

    const contexts = stage.selectAll("g.context-cluster").nodes();
    const childCluster = stage.select("g.child-cluster").node();

    contexts.forEach((sourceCluster, index) => {
      const source = selectedPoint(sourceCluster);
      let target = null;
      if (index + 1 < contexts.length) target = selectedPoint(contexts[index + 1]);
      else if (childCluster) target = childTargetPoint(childCluster);
      if (!source || !target) return;

      const midY = (source.y + target.y) / 2;
      stage.insert("path", ":first-child")
        .attr("class", "hierarchy-link")
        .attr("d", `M${source.x},${source.y} C${source.x},${midY} ${target.x},${midY} ${target.x},${target.y}`)
        .attr("fill", "none")
        .attr("stroke", "#526070")
        .attr("stroke-width", 2.2)
        .attr("stroke-linecap", "round")
        .attr("vector-effect", "non-scaling-stroke")
        .style("pointer-events", "none");

      stage.append("circle")
        .attr("class", "link-dot")
        .attr("cx", target.x)
        .attr("cy", target.y)
        .attr("r", 4)
        .attr("fill", "#526070")
        .style("pointer-events", "none");
    });
  }

  const baseRenderWithHierarchyLinks = render;
  render = function() {
    const result = baseRenderWithHierarchyLinks();
    renderHierarchyLinks();
    return result;
  };

  // semantic-icons.js performs one render during initialization before this file
  // loads, so render once now to restore connectors immediately.
  render();
})();
