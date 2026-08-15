# 05 — Request and Application Flows

## Table of Contents
- [Purpose](#purpose)
- [Create Child Node](#create-child-node)
- [Flows to Design](#flows-to-design)
- [Open Questions](#open-questions)

## Purpose
Use small sequence/flow diagrams to expose missing responsibilities and transaction boundaries before implementation.

## Create Child Node

```text
Create child Node
      |
Validate user + input
      |
Create Node
      |
Create parent/child relationship
      |
Commit transaction
      |
Queue optional semantic analysis
      |
Return new Node
```

## Flows to Design
- [ ] Create a root Node.
- [ ] Create a child Node.
- [ ] Load a Node and visible child categories.
- [ ] Navigate hierarchy.
- [ ] Change requested child types.
- [ ] Add an unrequested but permitted type.
- [ ] Create a cross-branch relationship.
- [ ] Vote, if retained.
- [ ] Publish/expose a root.
- [ ] Queue analysis after Node changes.
- [ ] Receive/store Python analysis results.

## Open Questions
- [ ] Which operations require transactions?
- [ ] Which operations can be eventually consistent?
- [ ] Which analysis operations should be triggered automatically?