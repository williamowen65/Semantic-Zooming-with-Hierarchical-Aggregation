# Semantic Zooming with Hierarchical Aggregation

A D3.js v7 prototype exploring how to keep a large forest of independent hierarchies understandable at multiple scales.

The current implementation began with **circle-based hierarchical aggregation** and a **tree-style detail view**, but the design direction is evolving toward a more focused clustered hierarchy that preserves depth, reduces visual clutter, and makes backtracking easier.

## Core idea

At the highest level, root issues are packed together in a tight cluster, similar to a bubble or packed-circle chart. Their size can reflect the aggregate importance, count, or total weight of everything beneath them.

When a user selects one root issue, the visualization focuses on that issue's hierarchy. Parent/child direction stays consistent: parents remain above, children appear below. Siblings are grouped together in compact clusters rather than spread across long horizontal rows.

As the user zooms in, only the selected branch is expanded. Other sibling branches can be hidden once the user drills into one child. This preserves hierarchy while avoiding the readability problems that appear when every branch remains visible at once.

The intended interaction is roughly:

1. **All root issues** are shown together in a packed cluster.
2. Selecting one root focuses the visualization on that root and shows its direct children as a compact cluster beneath it.
3. Selecting one child hides unrelated sibling branches and reveals that child's children as a new cluster beneath it.
4. The same pattern repeats until individual leaf nodes are reached.
5. Zooming back out naturally restores higher-level context and eventually returns to the packed root cluster.

## Current design direction: focused hierarchy + relationship overlay

The visualization has two different jobs, and they should not compete with each other:

1. **Understand the hierarchy of the currently selected issue.**
2. **Understand how that issue relates to the larger Atlas network.**

The clustered drill-down view should primarily solve the first problem. It should remain structurally stable and easy to read rather than trying to display the entire network at once.

Cross-tree relationships should therefore be treated as an **overlay on top of the hierarchy**, not as forces that determine node position.

A useful design rule is:

> **Hierarchy determines position. Relationships do not.**

Parent/child relationships determine where nodes live in the clustered tree. Other relationships such as `related to`, `supports`, `depends on`, or `conflicts with` should be shown separately through styling, boundary indicators, or relationship overlays.

### Showing that other root issues exist

When the user is focused on one root tree, the interface should still communicate that other root-level issues exist without rendering all of their trees.

For example, while viewing **Climate Change**, subtle peripheral indicators could represent roots such as **Education**, **Housing**, **Energy**, or **Economy**. These indicators act as context: they tell the user that the focused tree is part of a larger graph.

The other root trees do not need to stay expanded. If the user wants to switch context, selecting one of these indicators can focus that root, while zooming fully out returns to the complete root cluster.

### Aggregating cross-root relationships

Cross-tree relationships can use the same semantic aggregation principle as the hierarchy itself.

For example, suppose a deep node under Climate Change has several `related to` links into the Housing tree. If Housing is not expanded, the visualization does not need to draw lines to hidden individual Housing nodes. Instead, those relationships can aggregate upward into a compact Housing indicator such as:

```text
Housing · 7 relationships
```

As the user zooms deeper into the Climate Change branch, the relationship summary can become more specific. At a high level, Climate Change might have 23 relationships to Education. At a deeper level, the visualization might show that 15 originate under Policy, five under Adaptation, and three under Mitigation. At the leaf level, the exact node-to-node relationships can finally be drawn.

This allows relationship detail to become more precise as hierarchy detail becomes more precise, without destroying the stable clustered layout.

### Visual encoding goals

The styling should communicate information rather than act as decoration. A useful visual vocabulary is:

- **Position** = hierarchical parent/child structure.
- **Containment / clustering** = sibling groups and subtree membership.
- **Size** = aggregate descendant count, weight, or importance.
- **Peripheral markers** = other root trees outside the currently focused hierarchy.
- **Line treatment / color / badges** = cross-tree relationship type and strength.
- **Visibility** = semantic zoom level and selected branch.

This should allow the visualization to remain readable as a hierarchy while still communicating that the focused issue is connected to a much larger network.

## Features being explored

- D3 v7 + SVG
- Multiple independent root trees (`forestData`)
- Packed root-level overview
- Compact clustered sibling groups
- Consistent top-to-bottom hierarchy direction
- Branch-focused semantic zoom
- Aggregate node sizing
- Cross-tree relationship aggregation
- Peripheral root indicators while focused on one tree
- Progressive relationship detail as the user zooms deeper
- Click-to-focus and zoom-out-to-backtrack interaction

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

## Earlier implementation notes

The first prototype treated each root hierarchy as a circular aggregate territory. A force simulation positioned root territories, and a radial tree appeared inside each territory once the user crossed a zoom threshold.

That version demonstrated useful ideas around aggregate sizing, semantic zoom, and cross-link re-anchoring, but it did not preserve the hierarchical reading pattern as clearly as desired. In particular, switching between packed bubbles and radial trees made it harder to maintain the simple rule that **up means parent and down means child**.

The newer direction keeps the good parts of clustering and aggregation while making the hierarchy itself the stable spatial structure.

## Next experiment

The next prototype should replace the current radial-tree detail view with the focused clustered hierarchy described above:

- packed root cluster at the outermost zoom level;
- one selected root shown above a compact cluster of its direct children;
- only one selected branch expanded at a time;
- deeper child clusters appearing beneath the selected node;
- aggregate sizing preserved at every level;
- cross-root relationships shown as summarized peripheral overlays rather than layout-driving links.

Once that interaction feels correct, the next design problem is to establish a clear visual language for relationship type, relationship strength, hidden external roots, and transitions between aggregated and exact relationships.
