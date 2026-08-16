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

Each currently identified UI surface has its own editable Excalidraw planning file. These begin as intentionally blank canvases so the surface can be designed independently without prematurely locking the product into a shared layout.

- [Public Atlas / home](wireframes/public-atlas-home.excalidraw)
- [Generic Node / hierarchy view](wireframes/generic-node-hierarchy.excalidraw)
- [User profile](wireframes/user-profile.excalidraw)
- [User root Nodes](wireframes/user-root-nodes.excalidraw)
- [Create Node](wireframes/create-node.excalidraw)
- [Edit Node](wireframes/edit-node.excalidraw)
- [Authentication](wireframes/authentication.excalidraw)
- [Moderation / administration](wireframes/moderation-administration.excalidraw)

When a new first-class UI surface is added to this screen map, add a corresponding `.excalidraw` file under `planning/product-experience/wireframes/` so the product-experience planning remains one-wireframe-per-surface.

## Generic Node Experience
The rewrite should avoid recreating separate Issue and Solution page architectures. Semantic type should change meaning/content, not require a separate application page class whenever possible.

## Open Questions
- [ ] Is create/edit inline, modal, or separate-page behavior?
- [ ] What does a profile need to expose initially?
- [ ] Which prototype diagram interactions are part of the Node screen versus later enhancement?
