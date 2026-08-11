// Adds redundant, color-independent semantic cues to every rendered cell,
// viewport-aware hierarchy depth, selected-cell connectors, all-roots breadcrumb
// navigation, and independent content-aware pan/zoom cameras for each hierarchy layer.
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
    const icon = cell.append("g").attr("class", `semantic-kind-icon semantic-kind-${item.kind || "issue"}`).attr("transform", `translate(${cx},${iconY})`).attr("aria-hidden", "true").style("pointer-events", "none");
    if (item.kind === "solution") {
      icon.append("circle").attr("r", size * 0.62).attr("fill", "rgba(255,255,255,.94)").attr("stroke", "#1f2937").attr("stroke-width", Math.max(1.5, size * 0.11)).attr("vector-effect", "non-scaling-stroke");
      icon.append("path").attr("d", `M${-size * 0.28},${size * 0.02} L${-size * 0.06},${size * 0.26} L${size * 0.34},${-size * 0.24}`).attr("fill", "none").attr("stroke", "#1f2937").attr("stroke-width", Math.max(1.7, size * 0.13)).attr("stroke-linecap", "round").attr("stroke-linejoin", "round").attr("vector-effect", "non-scaling-stroke");
    } else {
      const r = size * 0.72;
      const points = [[0, -r], [r * 0.88, r * 0.64], [-r * 0.88, r * 0.64]];
      icon.append("path").attr("d", `M${points[0][0]},${points[0][1]} L${points[1][0]},${points[1][1]} L${points[2][0]},${points[2][1]} Z`).attr("fill", "rgba(255,255,255,.94)").attr("stroke", "#1f2937").attr("stroke-width", Math.max(1.5, size * 0.11)).attr("stroke-linejoin", "round").attr("vector-effect", "non-scaling-stroke");
      icon.append("line").attr("x1", 0).attr("x2", 0).attr("y1", -size * 0.29).attr("y2", size * 0.13).attr("stroke", "#1f2937").attr("stroke-width", Math.max(1.7, size * 0.13)).attr("stroke-linecap", "round").attr("vector-effect", "non-scaling-stroke");
      icon.append("circle").attr("cx", 0).attr("cy", size * 0.34).attr("r", Math.max(1.2, size * 0.08)).attr("fill", "#1f2937");
    }
  }

  function layerKey(options) { return (options.items || []).map(item => item.id).join("|") || options.className || "layer"; }

  // Scale 1 is always the true overview: the complete layer fits in its rectangle.
  // Small cells may be visually tiny here; readability/touchability is gained by
  // zooming in rather than by forcing the whole layer to start enlarged.
  function minimumLayerScale() { return 1; }

  function centeredView(w, h, k) { return { k, x: (w - w * k) / 2, y: (h - h * k) / 2 }; }

  function clampLayerView(view, w, h, minK = 1) {
    const next = { ...view };
    next.k = Math.max(minK, Math.min(8, Number(next.k) || minK));
    const scaledW = w * next.k, scaledH = h * next.k;
    const minX = w - scaledW, minY = h - scaledH;
    if (scaledW <= w + 0.5) next.x = (w - scaledW) / 2;
    else next.x = Math.max(minX, Math.min(0, Number(next.x) || 0));
    if (scaledH <= h + 0.5) next.y = (h - scaledH) / 2;
    else next.y = Math.max(minY, Math.min(0, Number(next.y) || 0));
    return next;
  }

  function applyLayerView(clusterNode) {
    if (!clusterNode) return;
    const key = clusterNode.dataset.layerKey, w = Number(clusterNode.dataset.layerWidth) || 1, h = Number(clusterNode.dataset.layerHeight) || 1, minK = Number(clusterNode.dataset.layerMinScale) || 1;
    const fallback = centeredView(w, h, minK);
    const view = clampLayerView(layerViews.get(key) || fallback, w, h, minK);
    layerViews.set(key, view);
    d3.select(clusterNode).select("g.layer-content").attr("transform", `translate(${view.x},${view.y}) scale(${view.k})`);
  }

  function makeLayerViewport(rendered, options) {
    const g = rendered.g, node = g.node(), key = layerKey(options), clipId = `layer-clip-${++clipSerial}`, minK = minimumLayerScale(rendered);
    node.dataset.layerKey = key; node.dataset.layerWidth = options.w; node.dataset.layerHeight = options.h; node.dataset.layerMinScale = minK;
    const defs = g.append("defs");
    defs.append("clipPath").attr("id", clipId).append("rect").attr("x", 0).attr("y", 0).attr("width", options.w).attr("height", options.h);
    const viewport = g.append("g").attr("class", "layer-viewport").attr("clip-path", `url(#${clipId})`);
    const content = viewport.append("g").attr("class", "layer-content");
    g.selectAll(":scope > g.cell").nodes().forEach(cell => content.node().appendChild(cell));
    if (!layerViews.has(key)) layerViews.set(key, centeredView(options.w, options.h, minK));
    applyLayerView(node);
    g.append("rect").attr("class", "layer-interaction-border").attr("x", 0).attr("y", 0).attr("width", options.w).attr("height", options.h).attr("fill", "none").attr("stroke", "rgba(27,43,61,.10)").attr("stroke-width", 1).attr("vector-effect", "non-scaling-stroke").style("pointer-events", "none");
  }

  renderCluster = function(options) {
    const rendered = baseRenderClusterWithSemanticIcons(options);
    rendered.g.selectAll("g.cell").each(function(d) { const cell = d3.select(this); cell.selectAll(".semantic-kind-icon").remove(); appendSemanticIcon(cell, d); });
    makeLayerViewport(rendered, options); return rendered;
  };

  const baseRenderBreadcrumbsWithAllRoots = renderBreadcrumbs;
  renderBreadcrumbs = function() {
    baseRenderBreadcrumbsWithAllRoots();
    const firstButton = breadcrumbHost.querySelector("button");
    if (!firstButton || firstButton.textContent !== "All roots") return;
    const cleanButton = firstButton.cloneNode(true);
    cleanButton.classList.toggle("current", !focusPath.length);
    cleanButton.addEventListener("click", () => { if (window.stopHierarchyMomentum) window.stopHierarchyMomentum(); focusPath = []; cameraY = 0; render(); statusHost.textContent = "Showing all root issues and solutions."; });
    firstButton.replaceWith(cleanButton);
  };

  const toolbar = document.querySelector(".toolbar"), reset = document.querySelector("#reset"), depthIndicator = document.createElement("div");
  depthIndicator.id = "depth-indicator"; depthIndicator.setAttribute("role", "status"); depthIndicator.setAttribute("aria-live", "polite");
  depthIndicator.style.cssText = ["display:inline-flex","align-items:center","justify-content:center","white-space:nowrap","border:1px solid rgba(27,43,61,.12)","background:rgba(255,255,255,.78)","color:#526070","border-radius:999px","padding:7px 10px","font-size:12px","font-weight:650"].join(";");
  if (toolbar) { if (reset) toolbar.insertBefore(depthIndicator, reset); else toolbar.appendChild(depthIndicator); }

  function stageTranslateY() { const node = stage?.node?.(); if (!node) return 0; const consolidated = node.transform?.baseVal?.consolidate?.(); if (consolidated?.matrix) return consolidated.matrix.f; const transform = node.getAttribute("transform") || ""; const match = transform.match(/translate\(\s*[-+\d.eE]+[,\s]+([-+\d.eE]+)\s*\)/); return match ? Number(match[1]) : 0; }
  function viewportDepth() { if (!Array.isArray(focusPath) || !focusPath.length || !Array.isArray(levelCenters) || !levelCenters.length) return 1; const viewportProbeY = height * (width < 720 ? 0.48 : 0.5), worldProbeY = viewportProbeY - stageTranslateY(); let nearestIndex = 0, nearestDistance = Infinity; levelCenters.forEach((center,index) => { const distance = Math.abs(center-worldProbeY); if (distance < nearestDistance) { nearestDistance=distance; nearestIndex=index; } }); return nearestIndex + 1; }
  let displayedDepth = null;
  function updateDepthIndicatorFromViewport() { const depth = viewportDepth(); if (depth === displayedDepth) return; displayedDepth = depth; depthIndicator.textContent = `Depth ${depth}`; depthIndicator.setAttribute("aria-label", `Hierarchy depth ${depth}`); }
  const stageNode = stage?.node?.(); if (stageNode && typeof MutationObserver !== "undefined") { const cameraObserver = new MutationObserver(updateDepthIndicatorFromViewport); cameraObserver.observe(stageNode,{attributes:true,attributeFilter:["transform"]}); }

  function pointToStage(element,x,y) { const svgNode=svg.node(), stageNodeLocal=stage.node(); if(!svgNode||!stageNodeLocal||!element?.getCTM||!stageNodeLocal.getCTM)return null; const elementMatrix=element.getCTM(),stageMatrix=stageNodeLocal.getCTM(); if(!elementMatrix||!stageMatrix)return null; const p=svgNode.createSVGPoint(); p.x=x;p.y=y; const viewportPoint=p.matrixTransform(elementMatrix),stagePoint=viewportPoint.matrixTransform(stageMatrix.inverse()); return{x:stagePoint.x,y:stagePoint.y}; }
  function selectedPointForCluster(clusterNode){if(!clusterNode)return null;const selectedCellNode=d3.select(clusterNode).select("g.cell.is-selected").node(),datum=selectedCellNode?d3.select(selectedCellNode).datum():null;if(!selectedCellNode||!datum?.polygon?.length)return null;const[cx,cy]=d3.polygonCentroid(datum.polygon);return pointToStage(selectedCellNode,cx,cy);}
  function clusterTopPoint(clusterNode){if(!clusterNode)return null;const w=Number(clusterNode.dataset.layerWidth)||width;return pointToStage(clusterNode,w/2,0);}
  function retargetHierarchyLinksToSelections(){const contextClusters=stage.selectAll("g.context-cluster").nodes(),childCluster=stage.select("g.child-cluster").node(),links=stage.selectAll("path.hierarchy-link").nodes(),dots=stage.selectAll("circle.link-dot").nodes();links.forEach((link,i)=>{const sourceCluster=contextClusters[i];if(!sourceCluster)return;const source=selectedPointForCluster(sourceCluster);let target=null;if(i+1<contextClusters.length)target=selectedPointForCluster(contextClusters[i+1]);else if(childCluster)target=clusterTopPoint(childCluster);if(!source||!target)return;const midY=(source.y+target.y)/2;d3.select(link).attr("d",`M${source.x},${source.y} C${source.x},${midY} ${target.x},${midY} ${target.x},${target.y}`);const dot=dots[i];if(dot)d3.select(dot).attr("cx",target.x).attr("cy",target.y);});}
  function clusterFromTarget(target){return target?.closest?.("g.cluster")||null;}
  function localPoint(clusterNode,clientX,clientY){const svgNode=svg.node();if(!svgNode||!clusterNode?.getScreenCTM)return{x:0,y:0};const matrix=clusterNode.getScreenCTM();if(!matrix)return{x:0,y:0};const p=svgNode.createSVGPoint();p.x=clientX;p.y=clientY;const local=p.matrixTransform(matrix.inverse());return{x:local.x,y:local.y};}
  function setLayerView(clusterNode,next){if(!clusterNode)return;const key=clusterNode.dataset.layerKey,w=Number(clusterNode.dataset.layerWidth)||1,h=Number(clusterNode.dataset.layerHeight)||1,minK=Number(clusterNode.dataset.layerMinScale)||1,view=clampLayerView(next,w,h,minK);layerViews.set(key,view);applyLayerView(clusterNode);retargetHierarchyLinksToSelections();}

  ["touchstart","touchmove","touchend","touchcancel"].forEach(type=>{window.addEventListener(type,event=>{if(clusterFromTarget(event.target)){if(event.cancelable&&type==="touchmove")event.preventDefault();event.stopPropagation();}},{capture:true,passive:false});});
  const pointers=new Map();let activeCluster=null,dragState=null,pinchState=null;
  function viewForCluster(cluster){const w=Number(cluster.dataset.layerWidth)||1,h=Number(cluster.dataset.layerHeight)||1,minK=Number(cluster.dataset.layerMinScale)||1;return{...(layerViews.get(cluster.dataset.layerKey)||centeredView(w,h,minK))};}
  function startPinch(cluster){const pts=Array.from(pointers.values()).slice(0,2);if(pts.length<2)return;const dx=pts[1].x-pts[0].x,dy=pts[1].y-pts[0].y,centerClient={x:(pts[0].x+pts[1].x)/2,y:(pts[0].y+pts[1].y)/2},centerLocal=localPoint(cluster,centerClient.x,centerClient.y),view=viewForCluster(cluster);pinchState={distance:Math.hypot(dx,dy)||1,view,anchorContent:{x:(centerLocal.x-view.x)/view.k,y:(centerLocal.y-view.y)/view.k}};dragState=null;}
  window.addEventListener("pointerdown",event=>{const cluster=clusterFromTarget(event.target);if(!cluster)return;if(activeCluster&&cluster!==activeCluster)return;activeCluster=cluster;pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});try{event.target.setPointerCapture?.(event.pointerId);}catch(_){}if(window.stopHierarchyMomentum)window.stopHierarchyMomentum();const view=viewForCluster(cluster);if(pointers.size===1){dragState={startLocal:localPoint(cluster,event.clientX,event.clientY),view,moved:false};pinchState=null;}else if(pointers.size===2)startPinch(cluster);},{capture:true,passive:false});
  window.addEventListener("pointermove",event=>{if(!activeCluster||!pointers.has(event.pointerId))return;pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});if(pointers.size>=2){if(!pinchState)startPinch(activeCluster);if(!pinchState)return;event.preventDefault();event.stopImmediatePropagation();touchMoved=true;const pts=Array.from(pointers.values()).slice(0,2),dx=pts[1].x-pts[0].x,dy=pts[1].y-pts[0].y,distance=Math.hypot(dx,dy)||1,centerClient={x:(pts[0].x+pts[1].x)/2,y:(pts[0].y+pts[1].y)/2},centerLocal=localPoint(activeCluster,centerClient.x,centerClient.y),minK=Number(activeCluster.dataset.layerMinScale)||1,rawRatio=distance/pinchState.distance,zoomRatio=Math.pow(rawRatio,1.45),k=Math.max(minK,Math.min(8,pinchState.view.k*zoomRatio)),x=centerLocal.x-pinchState.anchorContent.x*k,y=centerLocal.y-pinchState.anchorContent.y*k;setLayerView(activeCluster,{x,y,k});return;}if(pointers.size===1&&dragState){const current=localPoint(activeCluster,event.clientX,event.clientY),dx=current.x-dragState.startLocal.x,dy=current.y-dragState.startLocal.y;if(!dragState.moved&&Math.hypot(dx,dy)<4)return;dragState.moved=true;event.preventDefault();event.stopImmediatePropagation();touchMoved=true;setLayerView(activeCluster,{x:dragState.view.x+dx,y:dragState.view.y+dy,k:dragState.view.k});}},{capture:true,passive:false});
  function endPointer(event){pointers.delete(event.pointerId);if(!pointers.size){activeCluster=null;dragState=null;pinchState=null;setTimeout(()=>{touchMoved=false;},120);return;}if(pointers.size===1&&activeCluster){const remaining=Array.from(pointers.values())[0];dragState={startLocal:localPoint(activeCluster,remaining.x,remaining.y),view:viewForCluster(activeCluster),moved:true};pinchState=null;}else if(pointers.size>=2&&activeCluster)startPinch(activeCluster);}
  window.addEventListener("pointerup",endPointer,{capture:true,passive:false});window.addEventListener("pointercancel",endPointer,{capture:true,passive:false});
  window.addEventListener("wheel",event=>{const cluster=clusterFromTarget(event.target);if(!cluster)return;const view=viewForCluster(cluster),minK=Number(cluster.dataset.layerMinScale)||1;if(event.ctrlKey||event.metaKey){event.preventDefault();event.stopImmediatePropagation();const local=localPoint(cluster,event.clientX,event.clientY),factor=Math.exp(-event.deltaY*.0042),k=Math.max(minK,Math.min(8,view.k*factor)),anchorX=(local.x-view.x)/view.k,anchorY=(local.y-view.y)/view.k;setLayerView(cluster,{x:local.x-anchorX*k,y:local.y-anchorY*k,k});return;}if(Math.abs(event.deltaX)>Math.abs(event.deltaY)*.65){event.preventDefault();event.stopImmediatePropagation();setLayerView(cluster,{x:view.x-event.deltaX,y:view.y,k:view.k});}},{capture:true,passive:false});
  const visualKey=document.querySelector(".key");if(visualKey&&!visualKey.querySelector(".layer-camera-key")){const hint=document.createElement("span");hint.className="layer-camera-key";hint.textContent="drag = pan layer · pinch = zoom layer";visualKey.appendChild(hint);}
  const baseRenderWithSelectedConnectors=render;render=function(){const result=baseRenderWithSelectedConnectors();retargetHierarchyLinksToSelections();updateDepthIndicatorFromViewport();return result;};
  updateDepthIndicatorFromViewport();if(typeof render==="function")render();
})();