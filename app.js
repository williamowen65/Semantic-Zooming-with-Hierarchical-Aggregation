const forestData = [
  { id: "climate", name: "Climate Adaptation", children: [
    { id: "coasts", name: "Coastal Resilience", children: [
      { id: "wetlands", name: "Restore Wetlands", value: 34 },
      { id: "seawalls", name: "Adaptive Seawalls", value: 22 },
      { id: "retreat", name: "Managed Retreat", value: 18 }
    ]},
    { id: "heat", name: "Urban Heat", children: [
      { id: "tree-cover", name: "Tree Cover", value: 26 },
      { id: "cool-roofs", name: "Cool Roofs", value: 14 }
    ]}
  ]},
  { id: "housing", name: "Housing", children: [
    { id: "supply", name: "Supply", children: [
      { id: "zoning", name: "Zoning Reform", value: 31 },
      { id: "construction", name: "Construction Capacity", value: 23 }
    ]},
    { id: "affordability", name: "Affordability", children: [
      { id: "vouchers", name: "Rental Support", value: 18 },
      { id: "social-housing", name: "Social Housing", value: 27 }
    ]}
  ]},
  { id: "transport", name: "Transportation", children: [
    { id: "transit", name: "Public Transit", children: [
      { id: "bus", name: "Bus Frequency", value: 20 },
      { id: "rail", name: "Regional Rail", value: 30 }
    ]},
    { id: "streets", name: "Street Network", children: [
      { id: "bike", name: "Protected Bike Lanes", value: 18 },
      { id: "walk", name: "Walkability", value: 16 }
    ]}
  ]},
  { id: "energy", name: "Energy", children: [
    { id: "grid", name: "Grid", children: [
      { id: "storage", name: "Storage", value: 24 },
      { id: "transmission", name: "Transmission", value: 29 }
    ]},
    { id: "buildings", name: "Buildings", children: [
      { id: "heat-pumps", name: "Heat Pumps", value: 22 },
      { id: "efficiency", name: "Efficiency", value: 17 }
    ]}
  ]}
];

const crossLinks = [
  { source: "cool-roofs", target: "efficiency", type: "synergy", weight: 1 },
  { source: "tree-cover", target: "walk", type: "synergy", weight: .9 },
  { source: "zoning", target: "transit", type: "dependency", weight: 1 },
  { source: "social-housing", target: "rail", type: "dependency", weight: .75 },
  { source: "construction", target: "heat-pumps", type: "dependency", weight: .7 },
  { source: "retreat", target: "housing", type: "pressure", weight: .65 },
  { source: "storage", target: "rail", type: "infrastructure", weight: .65 },
  { source: "bike", target: "coasts", type: "planning", weight: .5 }
];

const cfg = { threshold: 1.65, rMin: 82, rMax: 142, zoom: [.45, 8], duration: 280 };
const host = document.querySelector("#viz");
let width = host.clientWidth, height = host.clientHeight;
const svg = d3.select(host).append("svg").attr("viewBox", [0, 0, width, height]);
const viewport = svg.append("g");
const crossLayer = viewport.append("g");
const rootsLayer = viewport.append("g");
const detailLayer = viewport.append("g");
let currentTransform = d3.zoomIdentity;
let currentMode = "bubble";

function hierarchyTotal(d) { return d3.hierarchy(d).sum(n => n.value || 0); }
const totals = forestData.map(d => hierarchyTotal(d).value || 1);
const rScale = d3.scaleSqrt().domain(d3.extent(totals)).range([cfg.rMin, cfg.rMax]);

const rootModels = forestData.map((data, i) => {
  const packed = hierarchyTotal(data).sort((a, b) => b.value - a.value);
  const radius = rScale(packed.value || 1);
  d3.pack().size([radius * 2, radius * 2]).padding(4)(packed);

  const tree = d3.hierarchy(data);
  d3.tree()
    .size([Math.PI * 2, radius * .70])
    .separation((a, b) => (a.parent === b.parent ? 1 : 1.25) / Math.max(1, a.depth))(tree);

  return {
    id: data.id, data, packed, tree, radius,
    detailById: new Map(tree.descendants().map(n => [n.data.id, n])),
    x: width / 2 + Math.cos(i / forestData.length * Math.PI * 2) * Math.min(width, height) * .22,
    y: height / 2 + Math.sin(i / forestData.length * Math.PI * 2) * Math.min(width, height) * .22
  };
});

const nodeIndex = new Map();
const rootByNode = new Map();
rootModels.forEach(model => model.packed.descendants().forEach(node => {
  nodeIndex.set(node.data.id, { node, model });
  rootByNode.set(node.data.id, model.id);
}));

const rootPairs = new Map();
crossLinks.forEach(link => {
  const a = rootByNode.get(link.source), b = rootByNode.get(link.target);
  if (!a || !b || a === b) return;
  const key = [a, b].sort().join("|");
  rootPairs.set(key, (rootPairs.get(key) || 0) + (link.weight || 1));
});
const byRoot = new Map(rootModels.map(d => [d.id, d]));
const macroLinks = [...rootPairs].map(([key, weight]) => {
  const [a, b] = key.split("|");
  return { source: byRoot.get(a), target: byRoot.get(b), weight };
});

d3.forceSimulation(rootModels)
  .force("center", d3.forceCenter(width / 2, height / 2).strength(.055))
  .force("charge", d3.forceManyBody().strength(d => -4500 - d.radius * 13))
  .force("collision", d3.forceCollide().radius(d => d.radius + 44).iterations(3))
  .force("links", d3.forceLink(macroLinks).id(d => d.id)
    .distance(d => 235 - Math.min(70, d.weight * 30))
    .strength(d => Math.min(.28, .08 + d.weight * .08)))
  .stop()
  .tick(360);

function radialPoint(node) {
  const angle = node.x - Math.PI / 2;
  return { x: Math.cos(angle) * node.y, y: Math.sin(angle) * node.y };
}
function nodeRadius(node) { return node.depth === 0 ? 8 : node.children ? 6.5 : 4.8; }
function labelSide(node) {
  if (node.depth === 0) return { x: 12, anchor: "start" };
  const angle = (node.x * 180 / Math.PI) % 360;
  return angle > 90 && angle < 270 ? { x: -10, anchor: "end" } : { x: 10, anchor: "start" };
}
function treePath(link) {
  const a = radialPoint(link.source), b = radialPoint(link.target);
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  return `M${a.x},${a.y} Q${mx * .74},${my * .74} ${b.x},${b.y}`;
}

const rootGroups = rootsLayer.selectAll("g.root-group")
  .data(rootModels, d => d.id).join("g")
  .attr("class", "root-group")
  .attr("transform", d => `translate(${d.x},${d.y})`)
  .on("mouseenter", (_, d) => highlight(d.id))
  .on("mouseleave", clearHighlight)
  .on("click", (event, d) => { event.stopPropagation(); focusRoot(d); });
rootGroups.append("circle").attr("class", "root-halo").attr("r", d => d.radius + 7);
rootGroups.append("circle").attr("class", "root-shell").attr("r", d => d.radius);
rootGroups.append("text").attr("class", "aggregate-label").attr("y", -3)
  .style("font-size", d => `${Math.max(13, Math.min(18, d.radius / 7))}px`).text(d => d.data.name);
rootGroups.append("text").attr("class", "aggregate-subtitle").attr("y", 16)
  .text(d => `${d.packed.leaves().length} leaf ideas · ${Math.round(d.packed.value || 0)} weight`);

const detailRoots = detailLayer.selectAll("g.detail-root")
  .data(rootModels, d => d.id).join("g")
  .attr("class", "detail-root")
  .attr("transform", d => `translate(${d.x},${d.y})`)
  .style("opacity", 0).style("pointer-events", "none");

detailRoots.each(function(model) {
  const g = d3.select(this);
  g.selectAll("path.tree-link").data(model.tree.links(), d => d.target.data.id).join("path")
    .attr("class", "tree-link").attr("d", treePath);
  const nodes = g.selectAll("g.tree-node").data(model.tree.descendants(), d => d.data.id).join("g")
    .attr("class", "tree-node").attr("data-node-id", d => d.data.id).attr("data-depth", d => d.depth)
    .attr("transform", d => { const p = radialPoint(d); return `translate(${p.x},${p.y})`; })
    .on("mouseenter", (event, d) => { event.stopPropagation(); highlight(d.data.id); })
    .on("mouseleave", clearHighlight)
    .on("click", (event, d) => { event.stopPropagation(); if (d.children) focusNode(model, d); });
  nodes.append("circle").attr("r", nodeRadius);
  nodes.append("text").attr("x", d => labelSide(d).x).attr("text-anchor", d => labelSide(d).anchor).text(d => d.data.name);
  nodes.filter(d => !d.children && d.data.value).append("text").attr("class", "value")
    .attr("x", d => labelSide(d).x).attr("y", 12).attr("text-anchor", d => labelSide(d).anchor)
    .text(d => `value ${d.data.value}`);
});

function endpoint(id, detail) {
  const indexed = nodeIndex.get(id); if (!indexed) return null;
  const model = indexed.model;
  if (!detail) return { x: model.x, y: model.y, r: model.radius };
  const node = model.detailById.get(id);
  if (!node) return { x: model.x, y: model.y, r: model.radius };
  const p = radialPoint(node);
  return { x: model.x + p.x, y: model.y + p.y, r: nodeRadius(node) + 2 };
}

function crossPath(link, k) {
  const detail = k >= cfg.threshold;
  const a = endpoint(link.source, detail), b = endpoint(link.target, detail);
  if (!a || !b) return "";
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
  const sx = a.x + dx / len * a.r, sy = a.y + dy / len * a.r;
  const tx = b.x - dx / len * b.r, ty = b.y - dy / len * b.r;
  const mx = (sx + tx) / 2, my = (sy + ty) / 2;
  const bend = Math.min(74, Math.max(22, len * .15));
  const nx = -dy / len, ny = dx / len;
  return `M${sx},${sy} Q${mx + nx * bend},${my + ny * bend} ${tx},${ty}`;
}

crossLayer.selectAll("path.cross-link").data(crossLinks).join("path")
  .attr("class", d => `cross-link ${d.weight >= .9 ? "strong" : ""}`)
  .attr("d", d => crossPath(d, 1));

function updateLOD(k) {
  const next = k >= cfg.threshold ? "tree" : "bubble";
  if (next !== currentMode) {
    currentMode = next;
    const tree = next === "tree";
    rootsLayer.selectAll(".root-shell").transition().duration(cfg.duration)
      .style("fill-opacity", tree ? .06 : .72).style("stroke-opacity", tree ? .38 : 1);
    rootsLayer.selectAll(".aggregate-label,.aggregate-subtitle").transition().duration(cfg.duration).style("opacity", tree ? 0 : 1);
    detailLayer.selectAll(".detail-root").style("pointer-events", tree ? "auto" : "none")
      .transition().duration(cfg.duration).style("opacity", tree ? 1 : 0);
  }
  crossLayer.selectAll(".cross-link").attr("d", d => crossPath(d, k));
}

function highlight(nodeId) {
  const ids = new Set([nodeId]), links = [];
  const root = rootModels.find(d => d.id === nodeId);
  const descendants = root ? new Set(root.packed.descendants().map(n => n.data.id)) : null;
  crossLinks.forEach(link => {
    if (link.source === nodeId || link.target === nodeId || descendants?.has(link.source) || descendants?.has(link.target)) {
      links.push(link); ids.add(link.source); ids.add(link.target);
    }
  });
  const roots = new Set([...ids].map(id => rootByNode.get(id)).filter(Boolean));
  rootsLayer.selectAll(".root-group").classed("is-dimmed", d => !roots.has(d.id)).classed("is-highlighted", d => roots.has(d.id));
  detailLayer.selectAll(".tree-node").classed("is-dimmed", d => !ids.has(d.data.id)).classed("is-highlighted", d => ids.has(d.data.id));
  crossLayer.selectAll(".cross-link").classed("is-dimmed", d => !links.includes(d)).style("stroke-opacity", d => links.includes(d) ? 1 : null);
}
function clearHighlight() {
  viewport.selectAll(".is-dimmed,.is-highlighted").classed("is-dimmed", false).classed("is-highlighted", false);
  crossLayer.selectAll(".cross-link").style("stroke-opacity", null);
}

const zoom = d3.zoom().scaleExtent(cfg.zoom).on("zoom", event => {
  currentTransform = event.transform;
  viewport.attr("transform", currentTransform);
  updateLOD(currentTransform.k);
});
svg.call(zoom).call(zoom.transform, d3.zoomIdentity);

function focusRoot(model) {
  const scale = Math.min(5.2, Math.max(1.9, Math.min(width, height) / (model.radius * 2.7)));
  const t = d3.zoomIdentity.translate(width / 2, height / 2).scale(scale).translate(-model.x, -model.y);
  svg.transition().duration(700).ease(d3.easeCubicInOut).call(zoom.transform, t);
}
function focusNode(model, node) {
  const p = radialPoint(node), cx = model.x + p.x, cy = model.y + p.y;
  const scale = Math.min(7, Math.max(currentTransform.k, 3.1 + node.depth * .7));
  const t = d3.zoomIdentity.translate(width / 2, height / 2).scale(scale).translate(-cx, -cy);
  svg.transition().duration(650).ease(d3.easeCubicInOut).call(zoom.transform, t);
}

window.addEventListener("resize", () => {
  width = host.clientWidth; height = host.clientHeight;
  svg.attr("viewBox", [0, 0, width, height]);
});
