# 03 — Persistence Model

## Table of Contents
- [Purpose](#purpose)
- [Conceptual Tables](#conceptual-tables)
- [Graph Storage](#graph-storage)
- [Indexes and Queries](#indexes-and-queries)
- [Open Questions](#open-questions)

## Purpose
Translate the conceptual recursive Node model into a durable database design.

## Conceptual Tables
Potential starting points:

```text
Node
NodeRelationship / ParentChild
RequestedChildType
User
ProfileRoot
PublicRoot
Vote
```

These are candidates, not final schema decisions.

## Graph Storage
- [ ] Decide how Nodes are stored.
- [ ] Decide how parent/child edges are stored.
- [ ] Decide how cross-branch relationships are represented.
- [ ] Decide how requested child types are persisted.
- [ ] Decide whether vocabulary needs separate normalization/storage.
- [ ] Design profile-root and public-root associations.
- [ ] Define deletion and soft-deletion behavior.

## Indexes and Queries
- [ ] Identify common hierarchy traversal queries.
- [ ] Identify graph lookup queries.
- [ ] Identify indexes needed for parent, child, type, owner, and visibility lookups.
- [ ] Consider how analysis results from Python are stored or cached.

## Open Questions
- [ ] Relational adjacency list, relationship table, or another graph representation?
- [ ] PostgreSQL or another database?
- [ ] Should semantic type strings be normalized or remain direct user-generated values?