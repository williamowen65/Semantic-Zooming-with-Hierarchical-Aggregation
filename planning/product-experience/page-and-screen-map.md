# 07 — Page and Screen Map

## Table of Contents
- [Purpose](#purpose)
- [Candidate Surfaces](#candidate-surfaces)
- [UI Surface Wireframes](#ui-surface-wireframes)
- [Generic Node Experience](#generic-node-experience)
- [Open Questions](#open-questions)

## Purpose
Identify application surfaces and their data needs without prematurely designing every visual detail.

## Candidate Surfaces

```text
Public Atlas / home
Generic Node / hierarchy view
User profile
User root Nodes
Create Node
Edit Node
Authentication
Moderation / administration
```

- [ ] Decide which surfaces exist in the first rewrite milestone.
- [ ] Identify data required by each surface.
- [ ] Identify authenticated versus public behavior.

## UI Surface Wireframes

Each currently identified UI surface has an editable Excalidraw planning file. A surface may also have companion Excalidraw files when it has substantially different presentation modes that are still projections of the same underlying surface/data.

- [Public Atlas / home](wireframes/public-atlas-home.excalidraw)
- Generic Node / hierarchy:
  - [Graph / tiled hierarchy mode](wireframes/generic-node-hierarchy.excalidraw)
  - [Feed / forum-style mode](wireframes/generic-node-feed.excalidraw)
- [User profile](wireframes/user-profile.excalidraw)
- [User root Nodes](wireframes/user-root-nodes.excalidraw)
- [Create Node](wireframes/create-node.excalidraw)
- [Edit Node](wireframes/edit-node.excalidraw)
- [Authentication](wireframes/authentication.excalidraw)
- [Moderation / administration](wireframes/moderation-administration.excalidraw)

When a new first-class UI surface is added to this screen map, add a corresponding `.excalidraw` file under `planning/product-experience/wireframes/`. When one surface has multiple genuinely different view modes, companion wireframes are acceptable as long as the notes make clear that they are alternate projections rather than separate domain models.

## Generic Node Experience
The rewrite should avoid recreating separate Issue and Solution page architectures. Semantic type should change meaning/content, not require a separate application page class whenever possible.

The Generic Node experience has at least two interchangeable presentation modes over the same Graph data:

1. **Graph / tiled mode** — hierarchy layers are represented spatially, with ranking/weight visible through tile sizing or related visual emphasis.
2. **Feed / forum mode** — the same layer is represented as a conventional ranked social feed. Nodes/forums with stronger ranking signals (for example votes, average score, or other ranking inputs) rise toward the top rather than becoming visually larger.

Users should be able to switch between these representations. The purpose is partly explanatory: the conventional feed makes Atlas approachable like other social platforms, while the graphical representation helps users understand that the feed is actually one layer of a nested graph.

### Feed-card navigation

A card in Feed mode should expose two distinct navigation choices rather than forcing the user into one interpretation of the card:

1. **Graph children** — keep that Node as the selected context and open its child layer in the graphical/tiled representation. This lets a user move directly from a conventional feed into the spatial representation of that Node's descendants.
2. **Open Node page** — navigate to the Node's full page for its user-defined type, title, stats/metadata, ordered typed content blocks, and child-type navigation.

This means a feed card is both a normal social-feed item and an entry point into the graph. The graphical action is not a different object or data path; it is another projection of the same Node and its relationships.

On a Node's own page, the upper portion contains the Node's user-defined type, title, stats/metadata, and its ordered typed content blocks. Beneath that is the same dynamic, user-defined child-type toggle used by the graphical view. In feed mode, selecting a child type replaces the lower area with a ranked feed of child Nodes of that type rather than a graphical/tiled visualization. Child cards in that feed should retain the same **Graph children** and **Open Node page** choices, allowing users to move fluidly between detail, feed, and graphical representations at any depth.

## Open Questions
- [ ] Is create/edit inline, modal, or separate-page behavior?
- [ ] What does a profile need to expose initially?
- [ ] Which prototype diagram interactions are part of the Node screen versus later enhancement?
- [ ] Which ranking signals and strategy determine ordering in feed mode versus visual weight in graph mode?
- [ ] Does clicking the non-button body of a feed card default to the Node page, do nothing, or use another interaction while the two explicit actions remain available?
