# 01 — Domain Model and UML

## Table of Contents
- [Purpose](#purpose)
- [Core Node Model](#core-node-model)
- [Requested Child Types](#requested-child-types)
- [Children and Visible Types](#children-and-visible-types)
- [Open-Ended Child Types](#open-ended-child-types)
- [Emergent Ontology](#emergent-ontology)
- [Multi-Parent and Converging Nodes](#multi-parent-and-converging-nodes)
- [Multiple Roots](#multiple-roots)
- [Open Questions](#open-questions)

## Purpose
Define the things Atlas fundamentally stores and how they relate, without tying the model to a particular UI or persistence implementation.

## Core Node Model

```text
+----------------------------------+
|               Node               |
+----------------------------------+
| id                               |
| type                             |
| title                            |
| description                      |
| requestedChildTypes              |
| children                         |
+----------------------------------+

Node
  ├── type: flexible semantic label
  ├── requestedChildTypes: types the author is soliciting
  └── children: 0..* Node
```

Everything is a Node. Issue, solution, question, challenge, implementation, evidence, objection, support, cause, example, and future vocabulary are semantic `type` values rather than separate application classes.

## Requested Child Types

```text
+----------------------------------+
|        RequestedChildType        |
+----------------------------------+
| type                             |
| label                            |
| order                            |
+----------------------------------+
```

Requested child types are solicitation metadata, not strict validation. They communicate what kinds of contributions would be especially useful. Empty requested categories should remain visible. Whether `order` is necessary remains open.

## Children and Visible Types
A Node may contain zero or many children. A child's type will often match a requested child type, but does not have to.

```text
visibleChildTypes =
    requestedChildTypes
    UNION
    typesPresentIn(children)
```

## Open-Ended Child Types

Atlas does **not currently need a special hard-coded set of globally available child types**.

Requested child types describe what the parent is soliciting, but they are not an exhaustive list of what contributors are allowed to add. A contributor may respond using:

1. one of the parent's requested child types;
2. another existing type from the emergent ontology; or
3. a new type defined in context at the moment it is needed.

For example, if a node requests `Solution` and `Evidence`, a contributor can still create a `Question`. This is not because `Question` is a privileged global type. It is because Atlas permits the ontology itself to remain open-ended.

Common types such as Question, Evidence, or Challenge may eventually be surfaced prominently in the user interface because they are useful or frequently used. That would be a **discovery or suggestion mechanism**, not a schema restriction or globally privileged semantic category.

This keeps the model internally consistent: Atlas does not claim to have an emergent ontology while secretly enforcing a fixed ontology underneath it.

## Emergent Ontology
Atlas should not impose one complete ontology in advance. Users can reuse existing vocabulary or define new semantic types in the moment. The ontology can emerge and change fluidly through human use.

AI may later help identify similar vocabulary, aliases, overlapping concepts, or possible consolidation, but should not need to control the ontology.

## Multi-Parent and Converging Nodes

Atlas should not assume that every non-root Node has exactly one parent.

Two Nodes from completely different routes through the graph may converge into a single child Node. In that case, the converging Node has **two real parents** rather than merely displaying a reference to another branch.

Conceptually:

```text
Parent A --------\
                  >---- Shared Child ----> further children
Parent B --------/
```

The shared child is still an ordinary Node and can continue recursively with its own children and requested child types.

This turns the hierarchy into a directed graph rather than a strict tree. A Node may therefore have:

```text
parents: 0..* Node
children: 0..* Node
```

The relationship between a parent and child may also carry semantic vocabulary such as `relates to`, `helps address`, `implemented by`, or whatever terms emerge from users. The exact storage model for that relationship is still open.

One possible UML direction is to introduce an explicit relationship object:

```text
+----------------------------------+
|        NodeRelationship          |
+----------------------------------+
| parentNodeId                     |
| childNodeId                      |
| type                             |
| label                            |
+----------------------------------+

Node 1 ---- 0..* NodeRelationship 0..* ---- 1 Node
```

Another possibility is a specialized Node subclass for a convergence/relationship Node that inherits the ordinary Node fields and adds relationship information. That approach should be compared with the explicit-edge model before implementation.

The current conceptual preference is to preserve the principle that the shared/converging contribution itself is still a normal Node, while allowing the **connection between Nodes** to express whatever relationship vocabulary is needed. This avoids requiring a special Node subclass merely because a Node has multiple parents, but the subclass option remains worth evaluating if the relationship itself needs first-class content and behavior.

### Cycles and infinite traversal

Allowing multiple parents raises an important graph question: users could potentially create a relationship that points back into an ancestor path and produces a cycle.

The data model should therefore explicitly decide whether:

- Atlas requires the parent/child graph to remain a directed acyclic graph (DAG); or
- cycles are permitted in storage but traversal/rendering must detect already-visited Nodes and stop recursive expansion.

This decision should be made before persistence and traversal logic are finalized.

## Multiple Roots
A root is not a special Node class. User profiles can expose multiple root Nodes, and the public Atlas can expose multiple root Nodes. Root status is contextual: it identifies an entry point into a graph/hierarchy.

## Open Questions
- [ ] Is `RequestedChildType.order` needed?
- [x] Which child types, if any, are globally available regardless of solicitation? **Current decision: none need to be hard-coded as globally privileged. Contributors can use requested types, existing ontology vocabulary, or define a new type in context.**
- [ ] Should parent/child semantics live on an explicit `NodeRelationship` edge, on a specialized Node subclass, or use both for different cases?
- [ ] Must the parent/child graph remain acyclic, or can Atlas store cycles while traversal detects and contains them?
- [ ] Which additional domain objects are truly required: votes, moderation records, permissions, etc.?