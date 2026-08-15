# Atlas hierarchy prototype

This repository is the clean rewrite of the Atlas hierarchy prototype.

The previous exploratory implementation is preserved on the branch:

`pre-clean-rewrite-prototype-2026-08-14`

The active prototype intentionally uses a much smaller architecture:

- `index.html` — page shell only
- `styles.css` — normal document-flow layout and presentation
- `data.js` — generic nodes, parent/child hierarchy edges, and cross-links
- `diagram.js` — isolated D3 weighted Voronoi rendering
- `app.js` — navigation, requested child-type toggles, validation, and application state
- `NEXT-PROTOTYPE-SPEC.md` — working structural specification

Every contribution is a generic node with a flexible `type`. Each node independently declares `requestedChildTypes`, which drives the response toggle bar even when a requested category currently has zero children. Ordinary children must use one of the types requested by their parent. Cross-branch relationships are stored separately from the ordinary hierarchy.

This is still an exploratory prototype rather than a finished product architecture.
