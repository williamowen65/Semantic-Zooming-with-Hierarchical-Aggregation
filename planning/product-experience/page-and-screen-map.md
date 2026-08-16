# 07 — Page and Screen Map

## Table of Contents
- [Purpose](#purpose)
- [Candidate Surfaces](#candidate-surfaces)
- [UI Surface Wireframes](#ui-surface-wireframes)
- [Generic Node Experience](#generic-node-experience)
- [Create Node Experience](#create-node-experience)
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

Each currently identified UI surface has an editable Excalidraw planning file. A surface may also have companion Excalidraw files when it has substantially different presentation modes or interaction states that are still projections of the same underlying surface/data.

- [Public Atlas / home](wireframes/public-atlas-home.excalidraw)
- Generic Node / hierarchy:
  - [Graph / tiled hierarchy mode](wireframes/generic-node-hierarchy.excalidraw)
  - [Feed / forum-style mode](wireframes/generic-node-feed.excalidraw)
- [User profile](wireframes/user-profile.excalidraw)
- [User root Nodes](wireframes/user-root-nodes.excalidraw)
- Create Node:
  - [Base creation flow](wireframes/create-node.excalidraw)
  - [Expanded multi-parent / relationship creation state](wireframes/create-node-multiple-parents.excalidraw)
- [Edit Node](wireframes/edit-node.excalidraw)
- [Authentication](wireframes/authentication.excalidraw)
- [Moderation / administration](wireframes/moderation-administration.excalidraw)

When a new first-class UI surface is added to this screen map, add a corresponding `.excalidraw` file under `planning/product-experience/wireframes/`. When one surface has multiple genuinely different view modes or expanded states, companion wireframes are acceptable as long as the notes make clear that they are alternate projections or interaction states rather than separate domain models.

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

## Create Node Experience

Node creation should remain one basic experience regardless of whether the Node begins as a profile root, a child of an existing Node, or a convergence/shared Node with multiple parents.

The normal case can begin with one parent supplied by the current entry context. Rather than introducing a separate “relationship node” creation mode, the UI should expose **+ Add another parent**. Adding another parent expands the placement portion of the form while the object being created remains an ordinary Node.

For a multi-parent Node, each incoming connection needs a semantic explanation of how that parent participates in the new Node. The creation UI should therefore let the user assign a relationship meaning to each parent independently, with common/suggested terms where useful and the ability to define a new term. Examples include `supports`, `contradicts`, `complicates`, or `qualifies`, but these should not become a permanently closed vocabulary.

The Node's own type, title, and content remain separate from those incoming relationship meanings. Conceptually:

```text
Parent A --supports----\
                       > New Node
Parent B --complicates-/
```

This separation lets the Node title/content express the actual new idea while the incoming connection labels explain why the parents converge there. The same approach can extend beyond two parents.

The current wireframe deliberately leaves one Graph-model question open: whether these semantic relationship labels are stored directly as relationship/edge metadata or represented through additional Node semantics. The UX can be explored before locking that persistence/domain choice.

## Open Questions
- [ ] Is create/edit inline, modal, or separate-page behavior?
- [ ] What does a profile need to expose initially?
- [ ] Which prototype diagram interactions are part of the Node screen versus later enhancement?
- [ ] Which ranking signals and strategy determine ordering in feed mode versus visual weight in graph mode?
- [ ] Does clicking the non-button body of a feed card default to the Node page, do nothing, or use another interaction while the two explicit actions remain available?
- [ ] For multi-parent creation, does relationship meaning live directly on the connection/relationship record or remain Node-based in the final Graph model?
