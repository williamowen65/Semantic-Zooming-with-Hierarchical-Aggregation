// Prototype enhancements layered on top of app.js.
// This file keeps experimental interaction behavior in one place so the base
// hierarchy renderer can stay easier to reason about.

// ---- Broader/deeper sample data -------------------------------------------------
const mediaNode = nodeById.get("media");
if (mediaNode && !nodeById.has("digital-platforms")) {
  const deepLevels = [
    ["digital-platforms", "Digital Platforms", 610, 4.5, [["search-platforms", "Search Platforms"], ["video-platforms", "Video Platforms"]]],
    ["social-networks", "Social Networks", 570, 4.4, [["private-messaging", "Private Messaging"], ["online-communities", "Online Communities"]]],
    ["recommendation-systems", "Recommendation Systems", 530, 4.6, [["content-moderation", "Content Moderation"], ["feed-controls", "Feed Controls"]]],
    ["ranking-signals", "Ranking Signals", 500, 4.5, [["relevance-signals", "Relevance Signals"], ["freshness-signals", "Freshness Signals"]]],
    ["engagement-optimization", "Engagement Optimization", 470, 4.3, [["session-length", "Session Length"], ["return-frequency", "Return Frequency"]]],
    ["content-incentives", "Content Incentives", 445, 4.4, [["monetization", "Monetization"], ["virality-pressure", "Virality Pressure"]]],
    ["creator-behavior", "Creator Behavior", 420, 4.2, [["creator-economics", "Creator Economics"], ["publishing-frequency", "Publishing Frequency"]]],
    ["attention-dynamics", "Attention Dynamics", 395, 4.5, [["attention-fragmentation", "Attention Fragmentation"], ["notification-pressure", "Notification Pressure"]]],
    ["information-exposure", "Information Exposure", 370, 4.5, [["source-diversity", "Source Diversity"], ["repeat-exposure", "Repeat Exposure"]]],
    ["belief-formation", "Belief Formation", 345, 4.4, [["trust-signals", "Trust Signals"], ["social-proof", "Social Proof"]]],
    ["community-norms", "Community Norms", 320, 4.3, [["peer-effects", "Peer Effects"], ["group-identity", "Group Identity"]]],
    ["civic-response", "Civic Response", 295, 4.5, [["local-organizing", "Local Organizing"], ["public-comment", "Public Comment"]]],
    ["institutional-response", "Institutional Response", 270, 4.2, [["public-consultation", "Public Consultation"], ["agency-coordination", "Agency Coordination"]]],
    ["policy-feedback", "Policy Feedback", 245, 4.4, [["implementation", "Implementation"], ["evaluation", "Evaluation"], ["revision", "Revision"]]]
  ];

  let child = null;
  for (let i = deepLevels.length - 1; i >= 0; i -= 1) {
    const [id, name, votes, rating, siblingSpecs] = deepLevels[i];
    const siblings = siblingSpecs.map(([siblingId, siblingName], siblingIndex) => ({
      id: siblingId,
      name: siblingName,
      votes: Math.max(120, votes - 120 - siblingIndex * 35),
      rating: Math.max(3.8, rating - 0.2 + siblingIndex * 0.1)
    }));
    child = {
      id,
      name,
      votes,
      rating,
      children: child ? [child, ...siblings] : siblings
    };
  }

  mediaNode.children = [...(mediaNode.children || []), child];
  annotate(mediaNode, parentById.get(mediaNode.id), rootById.get(mediaNode.id));
}

const extraRoots = [
  ["housing", "Housing", "#b87972", 5200, 4.5, ["Supply", "Affordability", "Stability"]],
  ["food-systems", "Food Systems", "#a7a45a", 3300, 4.2, ["Food Access", "Agriculture", "Food Waste"]],
  ["justice", "Justice", "#9d7f91", 4100, 4.3, ["Courts", "Legal Access", "Corrections"]],
  ["public-safety", "Public Safety", "#7f8ca8", 3700, 4.1, ["Emergency Response", "Prevention", "Community Safety"]],
  ["science", "Science", "#6f9da0", 3000, 4.5, ["Research", "Science Literacy", "Research Funding"]],
  ["culture", "Culture", "#b488a8", 2600, 4.2, ["Arts", "Heritage", "Civic Life"]]
];

extraRoots.forEach(([id, name, color, votes, rating, childNames]) => {
  if (nodeById.has(id)) return;
  const root = {
    id,
    name,
    color,
    votes,
    rating,
    children: childNames.map((childName, index) => ({
      id: `${id}-${childName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name: childName,
      votes: Math.round(votes * (0.32 - index * 0.045)),
      rating: Math.max(3.9, rating - 0.1 + index * 0.05)
    }))
  };
  forestData.push(root);
  annotate(root);
});

// ---- Stable Voronoi geometry ----------------------------------------------------
// Selection changes visual emphasis only. It must not change the layout seed.
layoutCluster = function(items, w, h) {
  const proxies = items.map(item => ({
    id: item.id,
    item,
    weight: Math.max(1, aggregateScore(item))
  }));
  const root = d3.hierarchy({ children: proxies }).sum(d => d.weight || 0);
  const polygon = outerPolygon(w, h);
  const stableKey = items.map(item => item.id).join("-");
  const seed = Array.from(stableKey).reduce(
    (a, c) => ((a * 31 + c.charCodeAt(0)) >>> 0),
    2166136261
  ) / 4294967296;
  d3.voronoiTreemap()
    .clip(polygon)
    .prng(d3.randomLcg(seed || 0.42))(root);
  return { root, polygon };
};

// ---- Breadcrumb behavior --------------------------------------------------------
// Keep full labels and automatically reveal the newest/rightmost crumb after every
// breadcrumb rebuild. Older ancestors remain reachable by horizontal scrolling.
const baseRenderBreadcrumbs = renderBreadcrumbs;
renderBreadcrumbs = function() {
  baseRenderBreadcrumbs();
  requestAnimationFrame(() => {
    breadcrumbHost.scrollLeft = breadcrumbHost.scrollWidth;
  });
};

// ---- Click-to-child camera motion -----------------------------------------------
focusNode = function(id) {
  const node = nodeById.get(id);
  if (!node) return;

  if (window.stopHierarchyMomentum) window.stopHierarchyMomentum();
  focusPath = pathForNode(id);
  render();

  const targetDepth = node.children?.length
    ? focusPath.length
    : focusPath.length - 1;

  requestAnimationFrame(() => scrollToDepth(targetDepth, true));

  statusHost.textContent = node.children?.length
    ? `${node.name} selected. Scrolled to its ${node.children.length} child issues. Scroll upward to revisit ancestors.`
    : `${node.name} selected. This is a leaf node in the prototype. Scroll upward to revisit ancestors.`;
};

// ---- Momentum camera scrolling --------------------------------------------------
(() => {
  let momentumFrame = 0;
  let velocity = 0;
  let lastTouchY = null;
  let lastTouchTime = 0;
  let touchOriginY = null;
  let wheelTimer = 0;
  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function stopMomentum() {
    if (momentumFrame) cancelAnimationFrame(momentumFrame);
    momentumFrame = 0;
    velocity = 0;
    clearTimeout(wheelTimer);
  }
  window.stopHierarchyMomentum = stopMomentum;

  function startMomentum() {
    if (reducedMotion() || Math.abs(velocity) < 0.35 || momentumFrame) return;
    const tick = () => {
      const before = cameraY;
      cameraY += velocity;
      applyCamera(false);
      const hitBoundary = Math.abs(cameraY - before) < 0.01 && Math.abs(velocity) > 0.35;
      velocity *= 0.92;

      if (hitBoundary || Math.abs(velocity) < 0.35) {
        momentumFrame = 0;
        velocity = 0;
        return;
      }
      momentumFrame = requestAnimationFrame(tick);
    };
    momentumFrame = requestAnimationFrame(tick);
  }

  host.addEventListener("wheel", event => {
    if (!focusPath.length || worldHeight <= height) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (momentumFrame) cancelAnimationFrame(momentumFrame);
    momentumFrame = 0;

    const movement = -event.deltaY * 0.78;
    cameraY += movement;
    applyCamera(false);
    velocity = Math.max(-42, Math.min(42, movement * 0.72));

    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(startMomentum, 52);
  }, { passive: false, capture: true });

  host.addEventListener("touchstart", event => {
    if (!focusPath.length || event.touches.length !== 1) return;
    event.stopImmediatePropagation();
    stopMomentum();
    const touch = event.touches[0];
    lastTouchY = touch.clientY;
    touchOriginY = touch.clientY;
    lastTouchTime = performance.now();
    touchMoved = false;
  }, { passive: true, capture: true });

  host.addEventListener("touchmove", event => {
    if (lastTouchY == null || event.touches.length !== 1 || !focusPath.length) return;
    event.preventDefault();
    event.stopImmediatePropagation();

    const now = performance.now();
    const y = event.touches[0].clientY;
    const dy = y - lastTouchY;
    const dt = Math.max(8, now - lastTouchTime);
    if (Math.abs(y - touchOriginY) > 6) touchMoved = true;

    cameraY += dy;
    applyCamera(false);

    const instantaneous = dy * (16.667 / dt);
    velocity = velocity * 0.55 + instantaneous * 0.45;
    velocity = Math.max(-48, Math.min(48, velocity));
    lastTouchY = y;
    lastTouchTime = now;
  }, { passive: false, capture: true });

  host.addEventListener("touchend", event => {
    if (lastTouchY == null) return;
    event.stopImmediatePropagation();
    lastTouchY = null;
    lastTouchTime = 0;
    touchOriginY = null;
    startMomentum();
    setTimeout(() => { touchMoved = false; }, 80);
  }, { passive: true, capture: true });

  host.addEventListener("touchcancel", () => {
    lastTouchY = null;
    lastTouchTime = 0;
    touchOriginY = null;
    stopMomentum();
    touchMoved = false;
  }, { passive: true, capture: true });
})();

render();
