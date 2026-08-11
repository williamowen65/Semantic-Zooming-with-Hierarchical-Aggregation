// Adds redundant, color-independent semantic cues to every rendered cell,
// viewport-aware hierarchy depth, selected-cell connectors, all-roots breadcrumb
// navigation, and independent pan/zoom cameras for each hierarchy layer.
(() => {
  if (typeof renderCluster !== "function") return;

  const baseRenderClusterWithSemanticIcons = renderCluster;
  const layerViews = new Map();
  let clipSerial = 0;

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
      const points = [[0, -r], [r * 0.88, r * 0.64], [-r * 0.88, r * 0.64]];

      icon.append("path")
        .attr("d", `M${points[0][0]},${points[0][1]} L${points[1][0]},${points[1][1]} L${points[2][0]},${points[2][1]} Z`)
        .attr("fill", "rgba(255,255,255,.94)")
        .attr("stroke", "#1f2937")
        .attr("stroke-width", Math.max(1.5, size * 0.11))
        .attr("stroke-linejoin", "round")
        .attr("vector-effect", "non-scaling-stroke");

      icon.append("line")
        .attr("x1", 0).attr("x2", 0)
        .attr("y1", -size * 0.29).attr("y2", size * 0.13)
        .attr("stroke", "#1f2937")
        .attr("stroke-width", Math.max(1.7, size * 0.13))
        .attr("stroke-linecap", "round")
        .attr("vector-effect", "non-scaling-stroke");

      icon.append("circle")
        .attr("cx", 0).attr("cy", size * 0.34)
        .attr("r", Math.max(1.2, size * 0.08))
        .attr("fill", "#1f2937");
    }
  }

  function layerKey(options) {
    return (options.items || []).map(item => item.id).join("|") || options.className || "layer";
  }

  function clampLayerView(view, w, h) {
    view.k = Math.max(0.6, Math.min(5, view.k || 1));
    if (view.k >= 1) {
      view.x = Math.max(w * (1 - view.k), Math.min(0, view.x || 0));
      view.y = Math.max(h * (1 - view.k), Math.min(0, view.y || 0));
    } else {
      view.x = (w - w * view.k) / 2;
      view.y = (h - h * view.k) / 2;
    }
    return view;
  }

  function applyLayerView(clusterNode) {
    if (!clusterNode) return;
    const key = clusterNode.dataset.layerKey;
    const w = Number(clusterNode.dataset.layerWidth) || 1;
    const h = Number(clusterNode.dataset.layerHeight) || 1;
    const view = clampLayerView(layerViews.get(key) || { x: 0, y: 0, k: 1 }, w, h);
    layerViews.set(key, view);
    d3.select(clusterNode).select("g.layer-content")
      .attr("transform", `translate(${view.x},${view.y}) scale(${view.k})`);
  }

  function makeLayerViewport(rendered, options) {
    const g = rendered.g;
    const node = g.node();
    const key = layerKey(options);
    const clipId = `layer-clip-${++clipSerial}`;
    node.dataset.layerKey = key;
    node.dataset.layerWidth = options.w;
    node.dataset.layerHeight = options.h;

    const defs = g.append("defs");
    defs.append("clipPath")
      .attr("id", clipId)
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", options.w)
      .attr("height", options.h);

    const viewport = g.append("g")
      .attr("class", "layer-viewport")
      .attr("clip-path", `url(#${clipId})`);
    const content = viewport.append("g").attr("class", "layer-content");

    g.selectAll(":scope > g.cell").nodes().forEach(cell => content.node().appendChild(cell));
    applyLayerView(node);

    g.append("rect")
      .attr("class", "layer-interaction-border")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", options.w)
      .attr("height", options.h)
      .attr("fill", "none")
      .attr("stroke", "rgba(27,43,61,.10)")
      .attr("stroke-width", 1)
      .attr("vector-effect", "non-scaling-stroke")
      .style("pointer-events", "none");
  }

  renderCluster = function(options) {
    const rendered = baseRenderClusterWithSemanticIcons(options);
    rendered.g.selectAll("g.cell").each(function(d) {
      const cell = d3.select(this);
      cell.selectAll(".semantic-kind-icon").remove();
      appendSemanticIcon(cell, d);
    });
    makeLayerViewport(rendered, options);
    return rendered;
  };

  // Keep All roots as the first breadcrumb item and make it a true reset.
  const baseRenderBreadcrumbsWithAllRoots = renderBreadcrumbs;
  renderBreadcrumbs = function() {
    baseRenderBreadcrumbsWithAllRoots();
    const firstButton = breadcrumbHost.querySelector("button");
    if (!firstButton || firstButton.textContent !== "All roots") return;

    const cleanButton = firstButton.cloneNode(true);
    cleanButton.classList.toggle("current", !focusPath.length);
    cleanButton.addEventListener("click", () => {
      if (window.stopHierarchyMomentum) window.stopHierarchyMomentum();
      focusPath = [];
      cameraY = 0;
      render();
      statusHost.textContent = "Showing all root issues and solutions.";
    });
    firstButton.replaceWith(cleanButton);
  };

  // The depth readout follows what is actually in the viewport rather than what
  // was most recently selected. The root level is always Depth 1.
  const toolbar = document.querySelector(".toolbar");
  const reset = document.querySelector("#reset");
  const depthIndicator = document.createElement("div");
  depthIndicator.id = "depth-indicator";
  depthIndicator.setAttribute("role", "status");
  depthIndicator.setAttribute("aria-live", "polite");
  depthIndicator.style.cssText = [
    "display:inline-flex", "align-items:center", "justify-content:center",
    "white-space:nowrap", "border:1px solid rgba(27,43,61,.12)",
    "background:rgba(255,255,255,.78)", "color:#526070",
    "border-radius:999px", "padding:7px 10px", "font-size:12px", "font-weight:650"
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
    if (!Array.isArray(focusPath) || !focusPath.length || !Array.isArray(levelCenters) || !levelCenters.length) return 1;
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

  const stageNode = stage?.node?.();
  if (stageNode && typeof MutationObserver !== "undefined") {
    const cameraObserver = new MutationObserver(updateDepthIndicatorFromViewport);
    cameraObserver.observe(stageNode, { attributes: true, attributeFilter: ["transform"] });
  }

  function selectedPointForCluster(clusterNode) {
    if (!clusterNode) return null;
    const selectedCellNode = d3.select(clusterNode).select("g.cell.is-selected").node();
    const datum = selectedCellNode ? d3.select(selectedCellNode).datum() : null;
    if (!selectedCellNode || !datum?.polygon?.length) return null;

    const [cx, cy] = d3.polygonCentroid(datum.polygon);
    const svgNode = svg.node();
    const stageNodeLocal = stage.node();
    if (!svgNode || !stageNodeLocal || !selectedCellNode.getCTM || !stageNodeLocal.getCTM) return null;

    const cellMatrix = selectedCellNode.getCTM();
    const stageMatrix = stageNodeLocal.getCTM();
    if (!cellMatrix || !stageMatrix) return null;

    const point = svgNode.createSVGPoint();
    point.x = cx;
    point.y = cy;
    const screenPoint = point.matrixTransform(cellMatrix);
    const stagePoint = screenPoint.matrixTransform(stageMatrix.inverse());
    return { x: stagePoint.x, y: stagePoint.y };
  }

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
      d3.select(link).attr("d", `M${source.x},${sourceY} C${source.x},${midY} ${target.x},${midY} ${target.x},${targetY}`);
      if (dot) d3.select(dot).attr("cx", target.x).attr("cy", targetY);
    }
  }

  function clusterFromTarget(target) {
    return target?.closest?.("g.cluster") || null;
  }

  function localPoint(clusterNode, clientX, clientY) {
    const svgNode = svg.node();
    if (!svgNode || !clusterNode?.getCTM) return { x: 0, y: 0 };
    const matrix = clusterNode.getCTM();
    if (!matrix) return { x: 0, y: 0 };
    const p = svgNode.createSVGPoint();
    p.x = clientX;
    p.y = clientY;
    const local = p.matrixTransform(matrix.inverse());
    return { x: local.x, y: local.y };
  }

  function setLayerView(clusterNode, next) {
    if (!clusterNode) return;
    const key = clusterNode.dataset.layerKey;
    const w = Number(clusterNode.dataset.layerWidth) || 1;
    const h = Number(clusterNode.dataset.layerHeight) || 1;
    const view = clampLayerView(next, w, h);
    layerViews.set(key, view);
    applyLayerView(clusterNode);
    retargetHierarchyLinksToSelections();
  }

  // Prevent the older touch-camera handlers from also consuming gestures that
  // begin inside a layer. White space between layers still uses those handlers.
  ["touchstart", "touchmove", "touchend", "touchcancel"].forEach(type => {
    window.addEventListener(type, event => {
      if (clusterFromTarget(event.target)) event.stopPropagation();
    }, { capture: true, passive: false });
  });

  const pointers = new Map();
  let activeCluster = null;
  let dragStart = null;
  let pinchState = null;

  window.addEventListener("pointerdown", event => {
    const cluster = clusterFromTarget(event.target);
    if (!cluster) return;
    activeCluster = cluster;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (window.stopHierarchyMomentum) window.stopHierarchyMomentum();

    const view = { ...(layerViews.get(cluster.dataset.layerKey) || { x: 0, y: 0, k: 1 }) };
    if (pointers.size === 1) {
      dragStart = { x: event.clientX, y: event.clientY, view, moved: false };
      pinchState = null;
    } else if (pointers.size === 2) {
      const pts = Array.from(pointers.values());
      const dx = pts[1].x - pts[0].x;
      const dy = pts[1].y - pts[0].y;
      const centerClient = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      pinchState = {
        distance: Math.hypot(dx, dy) || 1,
        centerClient,
        view
      };
      dragStart = null;
    }
  }, { capture: true });

  window.addEventListener("pointermove", event => {
    if (!activeCluster || !pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size >= 2 && pinchState) {
      event.preventDefault();
      event.stopPropagation();
      touchMoved = true;
      const pts = Array.from(pointers.values()).slice(0, 2);
      const dx = pts[1].x - pts[0].x;
      const dy = pts[1].y - pts[0].y;
      const distance = Math.hypot(dx, dy) || 1;
      const centerClient = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      const startLocal = localPoint(activeCluster, pinchState.centerClient.x, pinchState.centerClient.y);
      const currentLocal = localPoint(activeCluster, centerClient.x, centerClient.y);
      const k = Math.max(0.6, Math.min(5, pinchState.view.k * distance / pinchState.distance));
      const ratio = k / pinchState.view.k;
      const x = currentLocal.x - (startLocal.x - pinchState.view.x) * ratio;
      const y = currentLocal.y - (startLocal.y - pinchState.view.y) * ratio;
      setLayerView(activeCluster, { x, y, k });
      return;
    }

    if (pointers.size === 1 && dragStart) {
      const dx = event.clientX - dragStart.x;
      const dy = event.clientY - dragStart.y;
      if (!dragStart.moved && Math.hypot(dx, dy) < 5) return;
      dragStart.moved = true;
      event.preventDefault();
      event.stopPropagation();
      touchMoved = true;
      setLayerView(activeCluster, {
        x: dragStart.view.x + dx,
        y: dragStart.view.y + dy,
        k: dragStart.view.k
      });
    }
  }, { capture: true, passive: false });

  function endPointer(event) {
    pointers.delete(event.pointerId);
    if (!pointers.size) {
      activeCluster = null;
      dragStart = null;
      pinchState = null;
      setTimeout(() => { touchMoved = false; }, 90);
      return;
    }
    if (pointers.size === 1 && activeCluster) {
      const remaining = Array.from(pointers.values())[0];
      const view = { ...(layerViews.get(activeCluster.dataset.layerKey) || { x: 0, y: 0, k: 1 }) };
      dragStart = { x: remaining.x, y: remaining.y, view, moved: true };
      pinchState = null;
    }
  }

  window.addEventListener("pointerup", endPointer, { capture: true });
  window.addEventListener("pointercancel", endPointer, { capture: true });

  // Horizontal wheel/trackpad movement pans the hovered layer. Ctrl/Command +
  // wheel (including trackpad pinch gestures that surface as ctrl+wheel) zooms it.
  window.addEventListener("wheel", event => {
    const cluster = clusterFromTarget(event.target);
    if (!cluster) return;
    const key = cluster.dataset.layerKey;
    const view = { ...(layerViews.get(key) || { x: 0, y: 0, k: 1 }) };

    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const local = localPoint(cluster, event.clientX, event.clientY);
      const factor = Math.exp(-event.deltaY * 0.0024);
      const k = Math.max(0.6, Math.min(5, view.k * factor));
      const ratio = k / view.k;
      setLayerView(cluster, {
        x: local.x - (local.x - view.x) * ratio,
        y: local.y - (local.y - view.y) * ratio,
        k
      });
      return;
    }

    if (Math.abs(event.deltaX) > Math.abs(event.deltaY) * 0.65) {
      event.preventDefault();
      event.stopImmediatePropagation();
      setLayerView(cluster, { x: view.x - event.deltaX, y: view.y, k: view.k });
    }
  }, { capture: true, passive: false });

  const visualKey = document.querySelector(".key");
  if (visualKey && !visualKey.querySelector(".layer-camera-key")) {
    const hint = document.createElement("span");
    hint.className = "layer-camera-key";
    hint.textContent = "drag layer = pan · pinch / Ctrl+wheel = zoom";
    visualKey.appendChild(hint);
  }

  const baseRenderWithSelectedConnectors = render;
  render = function() {
    const result = baseRenderWithSelectedConnectors();
    retargetHierarchyLinksToSelections();
    updateDepthIndicatorFromViewport();
    return result;
  };

  updateDepthIndicatorFromViewport();
  if (typeof render === "function") render();
})();
