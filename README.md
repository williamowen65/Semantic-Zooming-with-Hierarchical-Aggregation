# Semantic Zooming with Hierarchical Aggregation

A D3.js v7 prototype that blends **circle-based hierarchical aggregation** with a **tree-style detail view**.

The goal is to keep a large forest of independent hierarchies understandable at multiple scales without making the user mentally switch between unrelated layouts.

## Core idea

Each root hierarchy owns a stable circular territory. At a distance, that territory behaves like an aggregate bubble. Root territories are positioned with a force simulation, with cross-tree relationships pulling related roots somewhat closer together.

When the user zooms in, the aggregate shell fades and a radial tree appears **inside the same territory**. This preserves spatial context while changing the level of semantic detail.

Cross-tree links also change meaning with zoom:

- **Bubble mode:** links terminate at the boundary of the relevant root aggregate.
- **Tree mode:** links terminate at the boundary of their specific source and target nodes.

This makes the same relationship readable at both macro and micro scales.

## Features

- D3 v7 + SVG
- Multiple independent root trees (`forestData`)
- Arbitrary cross-tree relationships (`crossLinks`)
- Force-directed macro layout of root territories
- Packed hierarchy used to size aggregate territories
- Radial tree detail layout inside each territory
- Semantic zoom with animated LOD transition
- Cross-link endpoint re-anchoring as LOD changes
- Curved cross-tree links anchored to node/circle perimeters rather than centers
- Hover highlighting across trees
- Click-to-focus on root bubbles and internal parent nodes

## Data shape

```js
const forestData = [
  {
    id: "root_1",
    name: "Root Alpha",
    children: [
      { id: "node_1a", name: "Branch A", value: 50, children: [] }
    ]
  }
];

const crossLinks = [
  { source: "node_1a", target: "node_2b", type: "dependency", weight: 1 }
];
```

Every node must have a globally unique `id`.

## Run locally

Because this is a static prototype, any simple web server will work:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Architecture notes

### Macro layout

Each root hierarchy becomes one compound force node. Its collision radius is derived from the total value of the hierarchy. Cross-tree relationships are reduced to root-to-root force links for the macro simulation.

### Micro layout

The hierarchy is processed twice:

1. `d3.pack()` calculates aggregate sizing and establishes the root territory.
2. `d3.tree()` calculates a radial detail layout that fits inside the same territory.

The radial detail view is intentionally not a separate screen or a completely different spatial arrangement.

### Semantic zoom

The default detail threshold is:

```js
cfg.threshold = 1.65;
```

Below the threshold, the root aggregate shell and summary label dominate. Above it, the shell fades and tree nodes, tree links, and detailed labels become visible.

### Next experiment

The current prototype has one principal bubble/tree threshold. The next useful step is **multi-stage hierarchical LOD**: root only → first-level branches → second-level branches → leaves. That should scale much better for the deeper structures this architecture is intended to support.

For very large relationship sets, another useful step is moving cross-link rendering to Canvas while retaining SVG for nodes and labels.
