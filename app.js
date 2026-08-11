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
      if (!interactive) return;
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

function focusNode(id) {
  const node = nodeById.get(id);
  if (!node) return;
  focusPath = pathForNode(id);
  render();
  statusHost.textContent = node.children?.length
    ? `${node.name} selected. ${node.children.length} child issues shown below.`
    : `${node.name} selected. This is a leaf node in the prototype.`;
}

function goToDepth(index) {
  if (index < 0) {
    focusPath = [];
  } else {
    focusPath = focusPath.slice(0, index + 1);
  }
  render();
}

function renderBreadcrumbs() {
  breadcrumbHost.replaceChildren();
  const all = document.createElement("button");
  all.type = "button";
  all.textContent = "All roots";
  all.addEventListener("click", () => goToDepth(-1));
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
    button.addEventListener("click", () => goToDepth(index));
    breadcrumbHost.append(button);
  });
}

function render() {
  width = host.clientWidth;
  height = host.clientHeight;
  svg.attr("viewBox", [0, 0, width, height]);
  stage.selectAll("*").remove();
  renderBreadcrumbs();

  const compactMobile = width < 720;
  const contentTop = compactMobile ? 128 : 100;
  const usableHeight = Math.max(420, height - contentTop - 62);
  const centerX = width / 2;

  if (!focusPath.length) {
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

  const selected = currentNode();
  const siblings = siblingSet(selected);
  const hasChildren = !!selected.children?.length;

  const upperW = Math.min(width * (compactMobile ? .82 : .48), 570);
  const upperH = Math.min(usableHeight * .34, upperW * .62);
  const upperX = centerX - upperW / 2;
  const upperY = contentTop + 14;

  const upper = renderCluster({
    items: siblings,
    x: upperX,
    y: upperY,
    w: upperW,
    h: upperH,
    selectedId: selected.id,
    faded: true,
    interactive: true,
    className: "context-cluster"
  });

  if (!hasChildren) {
    stage.append("text")
      .attr("class", "leaf-message")
      .attr("x", centerX)
      .attr("y", upperY + upperH + 58)
      .attr("text-anchor", "middle")
      .text("Leaf node · choose a sibling above or use the breadcrumb to go back");
    return;
  }

  const selectedLeaf = upper.leaves.find(d => d.data.id === selected.id);
  const [selectedCX, selectedCY] = d3.polygonCentroid(selectedLeaf.polygon);
  const lineStartX = upperX + selectedCX;
  const lineStartY = upperY + selectedCY + 22;

  const lowerW = Math.min(width * (compactMobile ? .9 : .58), 690);
  const lowerH = Math.min(usableHeight * .42, lowerW * .68);
  const lowerX = centerX - lowerW / 2;
  const lowerY = Math.min(height - lowerH - 46, upperY + upperH + 86);

  stage.append("path")
    .attr("class", "hierarchy-link")
    .attr("d", `M${lineStartX},${lineStartY} C${lineStartX},${lineStartY + 34} ${centerX},${lowerY - 34} ${centerX},${lowerY}`);

  stage.append("circle")
    .attr("class", "link-dot")
    .attr("cx", centerX)
    .attr("cy", lowerY)
    .attr("r", 3.5);

  renderCluster({
    items: selected.children,
    x: lowerX,
    y: lowerY,
    w: lowerW,
    h: lowerH,
    selectedId: null,
    faded: false,
    interactive: true,
    className: "child-cluster"
  });

  stage.append("text")
    .attr("class", "canvas-caption")
    .attr("x", centerX)
    .attr("y", Math.min(height - 18, lowerY + lowerH + 28))
    .attr("text-anchor", "middle")
    .text(`Click a child of ${selected.name} to continue down`);
}

resetButton.addEventListener("click", () => {
  focusPath = [];
  render();
  statusHost.textContent = "Showing all root issues.";
});

window.addEventListener("resize", render);
render();
