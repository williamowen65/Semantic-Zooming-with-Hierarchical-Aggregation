# Graph — Open Decisions

## Table of Contents

- [Resolved](#resolved)
- [Open](#open)

## Resolved

- Everything is represented by the generic Node model rather than Issue/Solution subclasses.
- Node `type` vocabulary is open-ended and can emerge through use.
- Requested child types are solicitation, not a complete restriction on possible responses.
- No semantic child type needs to be globally privileged merely so it can be added.
- The preferred model is **Node = content** and **NodeRelationship = meaning of the connection**.
- A Node may have more than one parent through multiple NodeRelationships.

## Open

- [ ] Is explicit ordering required for requested child types?
- [ ] Must structural parent/child relationships remain acyclic?
- [ ] What relationship metadata belongs on NodeRelationship beyond type/label?
- [ ] Which graph operations require special authorization?
