# 01 — Domain Model and UML

## Table of Contents
- [Purpose](#purpose)
- [Core Node Model](#core-node-model)
- [Requested Child Types](#requested-child-types)
- [Children and Visible Types](#children-and-visible-types)
- [Emergent Ontology](#emergent-ontology)
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
A Node may contain zero or many children. A child's type will often match a requested child type, but does not always have to. For example, a question may be permitted even when the parent did not explicitly request questions.

```text
visibleChildTypes =
    requestedChildTypes
    UNION
    typesPresentIn(children)
```

## Emergent Ontology
Atlas should not impose one complete ontology in advance. Users can reuse existing vocabulary or define new semantic types in the moment. The ontology can emerge and change fluidly through human use.

AI may later help identify similar vocabulary, aliases, overlapping concepts, or possible consolidation, but should not need to control the ontology.

## Multiple Roots
A root is not a special Node class. User profiles can expose multiple root Nodes, and the public Atlas can expose multiple root Nodes. Root status is contextual: it identifies an entry point into a graph/hierarchy.

## Open Questions
- [ ] Is `RequestedChildType.order` needed?
- [ ] Which child types, if any, are globally available regardless of solicitation?
- [ ] How are cross-branch/shared-node relationships represented in the domain model?
- [ ] Which additional domain objects are truly required: votes, moderation records, permissions, etc.?