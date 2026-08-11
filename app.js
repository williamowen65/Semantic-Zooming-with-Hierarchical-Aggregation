const forestData = [
  {
    id: "climate", name: "Climate Change", color: "#86b75b", votes: 9800, rating: 4.6,
    children: [
      { id: "migration", name: "Migration", votes: 2200, rating: 4.2, children: [
        { id: "displacement", name: "Displacement", votes: 1150, rating: 4.4 },
        { id: "border-policy", name: "Border Policy", votes: 820, rating: 3.8 },
        { id: "refugee-support", name: "Refugee Support", votes: 910, rating: 4.5 },
        { id: "legal-pathways", name: "Legal Pathways", votes: 630, rating: 4.1 },
        { id: "integration", name: "Integration Programs", votes: 760, rating: 4.3 }
      ]},
      { id: "adaptation", name: "Adaptation", votes: 1900, rating: 4.5, children: [
        { id: "coastal", name: "Coastal Resilience", votes: 780, rating: 4.6 },
        { id: "heat", name: "Urban Heat", votes: 650, rating: 4.3 },
        { id: "water", name: "Water Security", votes: 720, rating: 4.4 }
      ]},
      { id: "resilience", name: "Resilience", votes: 1650, rating: 4.1 },
      { id: "policy", name: "Policy & Regulation", votes: 2050, rating: 4.0 },
      {
        id: "public-awareness", name: "Public Awareness", votes: 1600, rating: 4.4,
        children: [
          { id: "outreach", name: "Outreach & Education", votes: 720, rating: 4.3 },
          { id: "media", name: "Media & Communication", votes: 680, rating: 4.5, children: [
            { id: "traditional-media", name: "Traditional Media", votes: 280, rating: 3.8 },
            { id: "social-media", name: "Social Media", votes: 520, rating: 4.2 },
            { id: "storytelling", name: "Storytelling", votes: 390, rating: 4.6 },
            { id: "misinformation", name: "Misinformation Response", votes: 470, rating: 4.7 }
          ]},
          { id: "community", name: "Community Engagement", votes: 590, rating: 4.6 },
          { id: "behavior", name: "Behavior Change", votes: 520, rating: 4.1 },
          { id: "citizen-science", name: "Citizen Science", votes: 430, rating: 4.2 }
        ]
      },
      { id: "finance", name: "Finance & Investment", votes: 1750, rating: 4.0 }
    ]
  },
  {
    id: "infrastructure", name: "Infrastructure", color: "#6ea6df", votes: 7000, rating: 4.4,
    children: [
      { id: "transport", name: "Transportation", votes: 2600, rating: 4.2 },
      { id: "utilities", name: "Utilities", votes: 2200, rating: 4.3 },
      { id: "housing-infra", name: "Housing", votes: 1800, rating: 4.0 }
    ]
  },
  {
    id: "education", name: "Education", color: "#9276cf", votes: 5600, rating: 4.5,
    children: [
      { id: "k12", name: "K-12", votes: 2100, rating: 4.4 },
      { id: "higher-ed", name: "Higher Education", votes: 1800, rating: 4.2 },
      { id: "skills", name: "Skills & Training", votes: 1600, rating: 4.5 }
    ]
  },
  {
    id: "healthcare", name: "Healthcare", color: "#e5af43", votes: 4800, rating: 4.3,
    children: [
      { id: "access", name: "Access", votes: 1900, rating: 4.5 },
      { id: "cost", name: "Cost", votes: 1700, rating: 4.0 },
      { id: "prevention", name: "Prevention", votes: 1400, rating: 4.4 }
    ]
  },
  {
    id: "economy", name: "Economy", color: "#df776b", votes: 4500, rating: 4.0,
    children: [
      { id: "jobs", name: "Jobs", votes: 1800, rating: 4.1 },
      { id: "markets", name: "Markets", votes: 1500, rating: 3.9 },
      { id: "trade", name: "Trade", votes: 1200, rating: 3.8 }
    ]
  },
  {
    id: "environment", name: "Environment", color: "#7d70b8", votes: 3900, rating: 4.5,
    children: [
      { id: "biodiversity", name: "Biodiversity", votes: 1700, rating: 4.6 },
      { id: "pollution", name: "Pollution", votes: 1500, rating: 4.4 },
      { id: "conservation", name: "Conservation", votes: 1300, rating: 4.5 }
    ]
  },
  {
    id: "governance", name: "Governance", color: "#62b7b0", votes: 3100, rating: 4.1,
    children: [
      { id: "institutions", name: "Institutions", votes: 1300, rating: 4.2 },
      { id: "elections", name: "Elections", votes: 1100, rating: 3.9 },
      { id: "transparency", name: "Transparency", votes: 1200, rating: 4.5 }
    ]
  },
  {
    id: "social-equity", name: "Social Equity", color: "#c99062", votes: 2800, rating: 4.4,
    children: [
      { id: "rights", name: "Rights", votes: 1200, rating: 4.5 },
      { id: "opportunity", name: "Opportunity", votes: 1050, rating: 4.3 },
      { id: "inclusion", name: "Inclusion", votes: 900, rating: 4.5 }
    ]
  },
  { id: "technology", name: "Technology", color: "#8e969d", votes: 3400, rating: 4.2 },
  { id: "energy", name: "Energy", color: "#766ac6", votes: 4300, rating: 4.5 }
];

const host = document.querySelector("#viz");
const breadcrumbHost = document.querySelector("#breadcrumbs");
const resetButton = document.querySelector("#reset");
const statusHost = document.querySelector("#status");

let width = host.clientWidth;
let height = host.clientHeight;
let focusPath = [];
let cameraY = 0;
let worldHeight = height;
let levelCenters = [];
let touchStartY = null;
let touchLastY = null;
let touchMoved = false;

const svg = d3.select(host).append("svg")
  .attr("role", "img")
  .attr("aria-label", "Weighted clustered hierarchy")
  .attr("viewBox", [0, 0, width, height]);
const stage = svg.append("g").attr("class", "stage");

const nodeById = new Map();
const parentById = new Map();
const rootById = new Map();

function annotate(node, parent = null, root = node) {
  nodeById.set(node.id, node);
  parentById.set(node.id, parent);
  rootById.set(node.id, root);
  (node.children || []).forEach(child => annotate(child, node, root));
}
forestData.forEach(root => annotate(root));

function directScore(node) {
  const votes = Math.max(1, node.votes || 1);
  const rating = Math.max(0.5, Math.min(5, node.rating || 3));
  return votes * (0.35 + 0.65 * rating / 5);
}

function aggregateScore(node) {
  return directScore(node) + (node.children || []).reduce((sum, child) => sum + aggregateScore(child), 0);
}

function rootColor(node) {
  return rootById.get(node.id)?.color || "#7d8a96";
}

function lighten(hex, amount = 0.2) {
  const c = d3.color(hex);
  if (!c) return hex;
  const white = d3.rgb(255, 255, 255);
  return d3.interpolateRgb(c, white)(amount);
}

function compact(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  return `${Math.round(value)}`;
}

function polygonPath(poly) {
  return `M${poly.map(p => p.join(",")).join("L")}Z`;
}

function outerPolygon(w, h) {
  const cx = w / 2, cy = h / 2;
  const rx = w / 2, ry = h / 2;
  const points = 14;
  return d3.range(points).map(i => {
    const a = -Math.PI / 2 + i / points * Math.PI * 2;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
  });
}

function layoutCluster(items, w, h, seedKey) {
  const proxies = items.map(item => ({
    id: item.id,
    item,
    weight: Math.max(1, aggregateScore(item))
  }));
  const root = d3.hierarchy({ children: proxies }).sum(d => d.weight || 0);
  const polygon = outerPolygon(w, h);
  const seed = Array.from(seedKey).reduce((a, c) => ((a * 31 + c.charCodeAt(0)) >>> 0), 2166136261) / 4294967296;
  const layout = d3.voronoiTreemap()
    .clip(polygon)
    .prng(d3.randomLcg(seed || 0.42));
  layout(root);
  return { root, polygon };
}

function wrapLabel(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  words.forEach(word => {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function renderCluster({ items, x, y, w, h, selectedId = null, faded = false, interactive = true, className = "" }) {
  const { root, polygon } = layoutCluster(items, w, h, `${selectedId || "all"}-${items.map(d => d.id).join("-")}`);
  const g = stage.append("g")
    .attr("class", `cluster ${className}`)
    .attr("transform", `translate(${x},${y})`);

  g.append("path")
    .attr("class", "cluster-outline")
    .attr("d", polygonPath(polygon));

  const leaves = root.leaves();
  const cells = g.selectAll("g.cell")
    .data(leaves, d => d.data.id)
    .join("g")
    .attr("class", d => {
      const selected = d.data.id === selectedId;
      return `cell ${selected ? "is-selected" : ""} ${faded && !selected ? "is-faded" : ""}`;
    })
    .attr("tabindex", interactive ? 0 : null)
    .attr("role", interactive ? "button" : null)
    .attr("aria-label", d => `${d.data.item.name}, ${compact(aggregateScore(d.data.item))} aggregate importance`)
    .on("click", (event, d) => {
      if (!interactive || touchMoved) return;
      event.stopPropagation();
      focusNode(d.data.item.id);
    })
    .on("keydown", (event, d) => {
      if (!interactive) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        focusNode(d.data.item.id);
      }
    });

  cells.append("path")
    .attr("class", "cell-shape")
    .attr("d", d => polygonPath(d.polygon))
    .attr("fill", d => {
      const base = rootColor(d.data.item);
      return faded && d.data.id !== selectedId ? lighten(base, 0.7) : lighten(base, 0.22);
    });

  cells.each(function(d) {
    const item = d.data.item;
    const [cx, cy] = d3.polygonCentroid(d.polygon);
    const area = Math.abs(d3.polygonArea(d.polygon));
    const selected = item.id === selectedId;
    const fontSize = Math.max(9, Math.min(17, Math.sqrt(area) / 8.5));
    const maxChars = Math.max(9, Math.floor(Math.sqrt(area) / 5.6));
    const lines = wrapLabel(item.name, maxChars);
    const text = d3.select(this).append("text")
      .attr("class", "cell-label")
      .attr("x", cx)
      .attr("y", cy - ((lines.length - 1) * fontSize * .52) - 3)
      .attr("text-anchor", "middle")
      .style("font-size", `${fontSize}px`)
      .style("font-weight", selected ? 750 : 620);
    lines.forEach((line, i) => {
      text.append("tspan")
        .attr("x", cx)
        .attr("dy", i === 0 ? 0 : fontSize * 1.08)
        .text(line);
    });
    text.append("tspan")
      .attr("class", "score-label")
      .attr("x", cx)
      .attr("dy", fontSize * 1.12)
      .text(compact(aggregateScore(item)));
  });

  return { g, leaves };
}

function currentNode() {
  return focusPath.length ? nodeById.get(focusPath[focusPath.length - 1]) : null;
}

function siblingSet(node) {
  if (!node) return forestData;
  const parent = parentById.get(node.id);
  return parent ? parent.children || [] : forestData;
}

function pathForNode(id) {
  const path = [];
  let node = nodeById.get(id);
  while (node) {
    path.unshift(node.id);
    node = parentById.get(node.id);
  }
  return path;
}

function cameraBounds() {
  const toolbarAllowance = width < 720 ? 118 : 78;
  const bottomAllowance = 54;
  const min = Math.min(0, height - worldHeight - bottomAllowance);
  const max = Math.max(0, toolbarAllowance - 20);
  return { min, max };
}

function clampCamera(value) {
  const { min, max } = cameraBounds();
  return Math.max(min, Math.min(max, value));
}

function applyCamera(animate = false) {
  cameraY = clampCamera(cameraY);
  stage.interrupt();
  if (animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    stage.transition()
      .duration(520)
      .ease(d3.easeCubicOut)
      .attr("transform", `translate(0,${cameraY})`);
  } else {
    stage.attr("transform", `translate(0,${cameraY})`);
  }
}

function scrollToDepth(index, animate = true) {
  if (!levelCenters.length) return;
  const safeIndex = Math.max(0, Math.min(levelCenters.length - 1, index));
  const viewportTarget = height * (width < 720 ? 0.42 : 0.46);
  cameraY = viewportTarget - levelCenters[safeIndex];
  applyCamera(animate);
}

function focusNode(id) {
  const node = nodeById.get(id);
  if (!node) return;
  focusPath = pathForNode(id);
  render();
  scrollToDepth(focusPath.length - 1, true);
  statusHost.textContent = node.children?.length
    ? `${node.name} selected. ${node.children.length} child issues shown below. Scroll vertically to revisit ancestors.`
    : `${node.name} selected. This is a leaf node in the prototype. Scroll upward to revisit ancestors.`;
}

function panToBreadcrumb(index) {
  if (!focusPath.length) return;
  scrollToDepth(index, true);
  const id = focusPath[Math.max(0, Math.min(focusPath.length - 1, index))];
  statusHost.textContent = `${nodeById.get(id).name} brought back into view. The deeper branch remains expanded below.`;
}

function renderBreadcrumbs() {
  breadcrumbHost.replaceChildren();
  const all = document.createElement("button");
  all.type = "button";
  all.textContent = "All roots";
  all.addEventListener("click", () => {
    if (focusPath.length) panToBreadcrumb(0);
  });
  breadcrumbHost.append(all);

  focusPath.forEach((id, index) => {
    const sep = document.createElement("span");
    sep.className = "crumb-separator";
    sep.textContent = "›";
    breadcrumbHost.append(sep);

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = nodeById.get(id).name;
    button.className = index === focusPath.length - 1 ? "current" : "";
    button.addEventListener("click", () => panToBreadcrumb(index));
    breadcrumbHost.append(button);
  });
}

function selectedCentroid(rendered, id, x, y) {
  const leaf = rendered.leaves.find(d => d.data.id === id);
  if (!leaf) return null;
  const [cx, cy] = d3.polygonCentroid(leaf.polygon);
  return { x: x + cx, y: y + cy };
}

function render() {
  width = host.clientWidth;
  height = host.clientHeight;
  svg.attr("viewBox", [0, 0, width, height]);
  stage.selectAll("*").remove();
  levelCenters = [];
  renderBreadcrumbs();

  const compactMobile = width < 720;
  const contentTop = compactMobile ? 132 : 98;
  const centerX = width / 2;

  if (!focusPath.length) {
    cameraY = 0;
    worldHeight = height;
    stage.attr("transform", "translate(0,0)");
    const usableHeight = Math.max(420, height - contentTop - 62);
    const clusterW = Math.min(width * (compactMobile ? .9 : .66), 780);
    const clusterH = Math.min(usableHeight * .8, clusterW * .72);
    const x = centerX - clusterW / 2;
    const y = contentTop + Math.max(10, (usableHeight - clusterH) * .38);
    renderCluster({
      items: forestData,
      x, y, w: clusterW, h: clusterH,
      selectedId: null,
      faded: false,
      interactive: true,
      className: "root-overview"
    });

    stage.append("text")
      .attr("class", "canvas-caption")
      .attr("x", centerX)
      .attr("y", y + clusterH + 34)
      .attr("text-anchor", "middle")
      .text("Choose any root issue to focus its hierarchy");
    return;
  }

  const clusterW = Math.min(width * (compactMobile ? .86 : .52), 620);
  const clusterH = Math.max(230, Math.min(clusterW * .62, compactMobile ? 390 : 340));
  const clusterX = centerX - clusterW / 2;
  const levelGap = compactMobile ? 128 : 150;
  const startY = contentTop + 18;
  let previousSelectedPoint = null;
  let cursorY = startY;

  focusPath.forEach((id, index) => {
    const selected = nodeById.get(id);
    const siblings = siblingSet(selected);
    const rendered = renderCluster({
      items: siblings,
      x: clusterX,
      y: cursorY,
      w: clusterW,
      h: clusterH,
      selectedId: selected.id,
      faded: true,
      interactive: true,
      className: `context-cluster depth-${index}`
    });

    const point = selectedCentroid(rendered, selected.id, clusterX, cursorY);
    levelCenters.push(cursorY + clusterH / 2);

    if (previousSelectedPoint && point) {
      const topY = cursorY;
      stage.insert("path", ".cluster")
        .attr("class", "hierarchy-link")
        .attr("d", `M${previousSelectedPoint.x},${previousSelectedPoint.y + 22} C${previousSelectedPoint.x},${previousSelectedPoint.y + 64} ${point.x},${topY - 48} ${point.x},${topY}`);
      stage.insert("circle", ".cluster")
        .attr("class", "link-dot")
        .attr("cx", point.x)
        .attr("cy", topY)
        .attr("r", 3.5);
    }

    previousSelectedPoint = point;
    cursorY += clusterH + levelGap;
  });

  const selected = currentNode();
  if (selected?.children?.length) {
    const childW = Math.min(width * (compactMobile ? .9 : .58), 690);
    const childH = Math.max(250, Math.min(childW * .66, compactMobile ? 420 : 390));
    const childX = centerX - childW / 2;
    const childY = cursorY;

    if (previousSelectedPoint) {
      stage.insert("path", ".cluster")
        .attr("class", "hierarchy-link")
        .attr("d", `M${previousSelectedPoint.x},${previousSelectedPoint.y + 22} C${previousSelectedPoint.x},${previousSelectedPoint.y + 66} ${centerX},${childY - 48} ${centerX},${childY}`);
      stage.insert("circle", ".cluster")
        .attr("class", "link-dot")
        .attr("cx", centerX)
        .attr("cy", childY)
        .attr("r", 3.5);
    }

    renderCluster({
      items: selected.children,
      x: childX,
      y: childY,
      w: childW,
      h: childH,
      selectedId: null,
      faded: false,
      interactive: true,
      className: "child-cluster"
    });

    levelCenters.push(childY + childH / 2);
    stage.append("text")
      .attr("class", "canvas-caption")
      .attr("x", centerX)
      .attr("y", childY + childH + 30)
      .attr("text-anchor", "middle")
      .text(`Click a child of ${selected.name} to continue down`);
    worldHeight = childY + childH + 86;
  } else {
    stage.append("text")
      .attr("class", "leaf-message")
      .attr("x", centerX)
      .attr("y", cursorY - levelGap + 58)
      .attr("text-anchor", "middle")
      .text("Leaf node · scroll upward or use a breadcrumb to revisit an ancestor");
    worldHeight = cursorY - levelGap + 118;
  }

  applyCamera(false);
}

host.addEventListener("wheel", event => {
  if (!focusPath.length || worldHeight <= height) return;
  event.preventDefault();
  cameraY -= event.deltaY * 0.78;
  applyCamera(false);
}, { passive: false });

host.addEventListener("touchstart", event => {
  if (!focusPath.length || event.touches.length !== 1) return;
  touchStartY = event.touches[0].clientY;
  touchLastY = touchStartY;
  touchMoved = false;
}, { passive: true });

host.addEventListener("touchmove", event => {
  if (touchLastY == null || event.touches.length !== 1 || !focusPath.length) return;
  const y = event.touches[0].clientY;
  const dy = y - touchLastY;
  if (Math.abs(y - touchStartY) > 6) touchMoved = true;
  if (worldHeight > height) {
    event.preventDefault();
    cameraY += dy;
    applyCamera(false);
  }
  touchLastY = y;
}, { passive: false });

host.addEventListener("touchend", () => {
  touchStartY = null;
  touchLastY = null;
  window.setTimeout(() => { touchMoved = false; }, 0);
}, { passive: true });

resetButton.addEventListener("click", () => {
  focusPath = [];
  cameraY = 0;
  render();
  statusHost.textContent = "Showing all root issues.";
});

window.addEventListener("resize", () => {
  render();
  applyCamera(false);
});

render();