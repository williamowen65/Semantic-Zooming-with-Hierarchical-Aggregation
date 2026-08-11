# Semantic Zooming with Hierarchical Aggregation

A D3 prototype for exploring a scalable graphical view of the Atlas / Public Think Tank hierarchy.

The current experiment combines two visual ideas:

1. **A stable top-to-bottom hierarchy** so that parents are always conceptually above children.
2. **Weighted, edge-to-edge tiled clusters** so siblings stay visually compact while still showing meaningful differences in importance.

The goal is to make very large issue trees readable without turning the screen into a conventional node-link hairball.

## Current prototype

The current implementation replaces the earlier bubble/radial-tree experiment with a **weighted Voronoi-tile hierarchy**.

At the root level, all root issues occupy one compact tiled cluster. The cells touch edge-to-edge, producing a visual feel closer to a Catan board or the tightly packed examples on the D3 site than to a set of floating bubbles.

The tiles are intentionally not required to be regular hexagons. A regular hexagonal grid works well when every item has the same size, but Atlas needs to represent differences in importance. Weighted Voronoi cells allow the cluster to remain gapless while giving larger areas to more important nodes.

### Interaction model

The prototype follows the navigation model developed through the design sketches:

1. **No selection:** all root issues appear in a single tightly packed cluster.
2. **Select a root:** that root remains strong while the other root cells stay packed around it but fade into context.
3. A vertical connector leads downward from the selected cell to a new compact cluster containing only its direct children.
4. **Select a child:** that child becomes emphasized inside a faded cluster of its siblings, and its own children are added below.
5. The same pattern can repeat through arbitrary hierarchy depth.
6. The already-expanded branch remains laid out as one long vertical world rather than being replaced by only the newest two levels.
7. The mouse wheel or a vertical touch swipe moves a camera up and down that world.
8. Breadcrumbs can jump the camera directly back to an ancestor without collapsing the deeper branch.

Clicking is therefore the primary **branch-selection** action, while scrolling/swiping is the primary **spatial navigation** action once a branch has been expanded.

## Vertical camera scrolling

The current prototype treats the focused hierarchy as a continuous vertical canvas.

When a user selects progressively deeper nodes, the previous levels remain physically above the current one. They are not required to stay visible inside the viewport. Instead, the viewport acts like a camera moving over the hierarchy.

For example, after selecting:

```text
Climate Change
      ↓
Public Awareness
      ↓
Media & Communication
```

the three focused levels and the next child cluster all exist in one vertical layout. If the viewport is centered on **Media & Communication**, Climate Change may be completely above the screen. Scrolling upward brings Public Awareness and then Climate Change physically back into view.

This preserves the spatial rule:

> **Up = parents. Down = children.**

The implementation currently supports:

- mouse-wheel vertical travel on desktop;
- vertical swipe/pan on touch devices;
- animated breadcrumb jumps to existing ancestor levels;
- click-to-expand without requiring scroll to choose a child;
- bounded camera movement so the user cannot drift indefinitely beyond the rendered hierarchy.

The outermost unselected root overview remains a single static cluster. Camera scrolling becomes meaningful only after a branch is focused and the hierarchy extends beyond the viewport.

## Visual encoding

The styling is intended to communicate data rather than merely decorate the graph.

- **Position** = hierarchy. Parents are above children.
- **Tiled containment** = siblings belonging to the same parent.
- **Area** = aggregate importance of a node and its descendants.
- **Opacity** = focus state. The selected branch remains crisp; sibling context fades.
- **Color** = root topic/category. Descendants inherit the color family of their root.
- **Vertical connector** = the active parent-to-child transition.
- **Breadcrumb** = ancestor navigation even when those ancestors are outside the viewport.
- **Camera position** = which portion of the already-expanded branch the user is currently inspecting.

A useful rule for future work remains:

> **Hierarchy determines position. Relationships do not.**

Cross-tree relationships such as `related to`, `supports`, `depends on`, or `conflicts with` should eventually be added as overlays rather than allowed to distort the hierarchy layout.

## Aggregate importance experiment

The sample data now includes illustrative `votes` and `rating` values because Atlas ultimately needs visual size to reflect more than simple descendant count.

The prototype currently uses a deliberately simple experimental score:

```text
direct importance = votes × rating adjustment
aggregate importance = direct importance + all descendant importance
```

This is **not intended as the final Atlas ranking formula**. It exists only to test whether weighted cell area is visually useful.

The important design requirement is that whatever score Atlas eventually uses can be mapped to area without destroying the compact cluster.

## Why weighted Voronoi cells?

Regular hexagons produce a very attractive tightly packed board, but significant size differences make regular tessellation difficult. Larger hexagons no longer fit cleanly against smaller ones.

Weighted Voronoi / power-diagram cells solve that problem by partitioning one compact outer shape into edge-to-edge polygons whose areas approximately follow the supplied weights.

This gives the prototype several useful properties:

- very little wasted space;
- no overlap between sibling nodes;
- visually obvious size comparisons;
- a cohesive cluster rather than a collection of floating cards;
- freedom to display strongly different weights;
- a visual style that still feels geometric and board-like even though individual cells are irregular polygons.

The implementation uses the D3 Voronoi treemap ecosystem:

- D3 v6
- `d3-weighted-voronoi`
- `d3-voronoi-map`
- `d3-voronoi-treemap`

## Focus and viewport behavior

A major design decision is that the visualization should not attempt to keep the entire ancestor path and every sibling branch simultaneously visible.

If the user drills into **Climate Change → Public Awareness**, the useful viewport may primarily contain:

```text
[faded sibling cluster containing Public Awareness]
                    ↓
           Public Awareness selected
                    ↓
       [Public Awareness child cluster]
```

Climate Change can be physically above the viewport. The user still knows an ancestor exists because the breadcrumb shows the path, and scrolling upward literally returns to that earlier level.

This prevents previous levels from consuming most of the screen while preserving the mental model that those levels still exist in a stable place above the current focus.

## Data shape

The sample hierarchy is ordinary nested data:

```js
{
  id: "public-awareness",
  name: "Public Awareness",
  votes: 1600,
  rating: 4.4,
  children: [
    {
      id: "media",
      name: "Media & Communication",
      votes: 680,
      rating: 4.5
    }
  ]
}
```

Every node should have a globally unique `id`.

## Relationship design — intentionally deferred

Atlas is not only a tree. Nodes can also have relationships to nodes in other root trees, and those relationships may overlap conceptually with the focused hierarchy.

The prototype deliberately does **not** render those relationships yet. The hierarchy interaction needs to be understandable first.

The current relationship direction is:

- other root issues should remain perceptually present without expanding their trees;
- cross-root relationships should be aggregated when their exact endpoints are not visible;
- relationship detail should become more specific as the user drills deeper;
- exact node-to-node links should appear only when that detail is useful;
- relationship lines should never drive node placement.

A later experiment can test subtle faded peripheral context, badges, boundary cues, or aggregated relationship indicators without sacrificing the compact hierarchy.

## Earlier prototype

The first implementation used circular root territories, a force-directed macro layout, and radial trees that appeared when the zoom threshold was crossed.

That experiment demonstrated semantic aggregation and cross-link re-anchoring, but it changed the spatial grammar too much between overview and detail. The newer design keeps the hierarchy itself stable: **up means parent, down means child, and siblings remain tightly clustered at every level.**

## Run locally

This is a static prototype, so any simple web server works:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Next things to evaluate

The first questions to answer by using this prototype are visual and interaction-focused rather than architectural:

- Does vertical wheel/swipe navigation feel natural, or should it snap gently toward hierarchy levels?
- How much of the previous and next level should remain visible at the viewport edges?
- Should an offscreen-parent indicator appear in addition to the breadcrumb?
- Do weighted irregular polygons retain enough of the Catan/hexagonal feel?
- Are area differences easy to compare without making small nodes unreadable?
- Should the outer cluster boundary be visible at all, or disappear completely?
- How faded should non-selected siblings become?
- Should selected nodes keep their exact position inside the sibling cluster or shift slightly to create a cleaner downward connector?
- How much ancestor information belongs in the breadcrumb versus the canvas?

The perimeter / outer cluster shape is intentionally left unchanged in this iteration so the scrolling behavior can be evaluated independently. Once the camera interaction feels right, the next visual experiment can revisit the cluster boundary and then cross-root relationship styling.
