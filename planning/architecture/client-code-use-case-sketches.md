# Client-Code Use-Case Sketches

## Purpose

Use short, implementation-agnostic client-code sketches to design Atlas **from the caller's point of view** before committing to internal implementation details.

The goal is not to write production code early. The goal is to ask:

> If this bounded context were pleasant and obvious to use, what would the calling code look like?

These sketches are a planning tool for keeping public contracts readable, expressive, and appropriately encapsulated. They overlap with API-first and outside-in design: start with the behavior the caller needs, then design the internals that make that behavior possible.

## What a Sketch Should Show

A sketch should focus on a small real use case and show only the operations a caller should need to understand.

For example:

```text
actor = currentUser()

node = graph.createNode(
    actor,
    title,
    description,
    type,
    requestedChildTypes
)

graph.connect(
    actor,
    parentNodeId,
    node.id,
    relationshipType
)

children = graph.getChildren(node.id)

graph.editNode(
    actor,
    node.id,
    changes
)
```

This is pseudocode, not a commitment to method names, parameter shapes, or a particular implementation.

## Why This Is Useful

The sketch gives the design a readability test before implementation complexity is introduced.

Good client code should generally:

- read in terms of Atlas domain actions;
- hide persistence and caching details;
- hide ORM and database details;
- avoid exposing another bounded context's internals;
- avoid forcing callers to understand security plumbing that belongs at another layer;
- make common operations short and understandable;
- make invalid or dangerous operations difficult to express accidentally.

A sketch such as this is a warning sign:

```text
node.relationshipManager.persistenceContext.repository...
```

It suggests internal implementation details are leaking through the boundary.

## Sketch Across Bounded Contexts

The same technique can be used for each bounded context:

```text
Graph
graph.createNode(...)
graph.editNode(...)
graph.connect(...)
graph.getChildren(...)
graph.getRoots(contextId)

Voting
voting.castVote(actorId, nodeId, value)
voting.changeVote(...)
voting.removeVote(...)
voting.getScore(nodeId)

Notifications
notifications.getUnread(userId)
notifications.markRead(userId, notificationId)
notifications.updatePreferences(...)

Profiles / Identity
profiles.getProfile(profileId)
profiles.getContext(profileId)
```

These examples describe the intended usage surface only. Each bounded context remains free to contain substantially more internal complexity.

## Relationship to Bounded Contexts

Client-code sketches are especially useful when defining bounded-context contracts.

For direct communication between contexts, the sketch can reveal the smallest API/application-service contract that needs to be exposed. For event-driven communication, the sketch can instead show the meaningful event being published and the reaction expected elsewhere.

For example:

```text
Graph
  -> editNode(...)
  -> publishes NodeEdited

Notifications
  -> observes NodeEdited
  -> creates notifications for relevant recipients
```

The Graph caller does not need to explicitly invoke notification delivery. That complexity remains behind the relevant boundaries.

## Planning Practice

As each domain area becomes more concrete, create a few client-code/use-case sketches for its most important operations before finalizing detailed service and repository designs.

The sketches should remain intentionally small. They are not substitutes for UML, behavioral rules, persistence design, permissions, or detailed flows. Instead, they provide another perspective on those artifacts: **does the resulting design remain simple and readable to its consumers?**

When a sketch becomes awkward, verbose, or dependent on internals, use that as a prompt to reconsider the boundary or abstraction before implementation.

## Open Questions

- [ ] Decide which Graph operations should form the first client-code sketch for the rewrite milestone.
- [ ] Decide which operations are public bounded-context contracts versus internal application services.
- [ ] Add use-case sketches to domain planning as those domains become sufficiently defined.
- [ ] Revisit sketches after detailed design to make sure implementation decisions have not made the calling surface unnecessarily complicated.
