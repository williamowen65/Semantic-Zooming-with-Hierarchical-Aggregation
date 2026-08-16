# 01 — Domain Model and UML

## Table of Contents
- [Purpose](#purpose)
- [Core Node Model](#core-node-model)
- [Composable Node Content](#composable-node-content)
- [Content Block Validation and Extensibility](#content-block-validation-and-extensibility)
- [Requested Child Types](#requested-child-types)
- [Children and Visible Types](#children-and-visible-types)
- [Open-Ended Child Types](#open-ended-child-types)
- [Emergent Ontology](#emergent-ontology)
- [Node Relationships and Multiple Parents](#node-relationships-and-multiple-parents)
- [Relationship Semantics and Cardinality](#relationship-semantics-and-cardinality)
- [Cycles and Traversal](#cycles-and-traversal)
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
| contentBlocks[]                  |
| requestedChildTypes              |
| children                         |
+----------------------------------+

Node
  ├── type: flexible semantic label
  ├── title: short human-readable heading
  ├── contentBlocks: ordered composable body content
  ├── requestedChildTypes: types the author is soliciting
  └── children: 0..* Node
```

Everything is a Node. Issue, solution, question, challenge, implementation, evidence, objection, support, cause, example, and future vocabulary are semantic `type` values rather than separate application classes.

The conceptual `children` collection describes graph traversal from a Node. The persistence model may represent those connections through relationship records rather than storing literal nested Node arrays.

The earlier idea of a single free-form `description` field is no longer the preferred conceptual model. A Node body should instead be represented as an ordered set of typed content blocks. A simple paragraph is still easy to express—it is just a text block—but richer posts do not require continually adding unrelated fields directly to `Node`.

## Composable Node Content

A Node's body should behave more like a lightweight block-based/no-code document editor than one large text field.

Conceptually:

```text
+----------------------------------+
|               Node               |
+----------------------------------+
| id                               |
| title                            |
| ...                              |
+----------------------------------+
| contentBlocks: 0..*              |
+----------------------------------+
                 |
                 | ordered
                 v
+----------------------------------+
|          ContentBlock            |
+----------------------------------+
| id                               |
| nodeId                           |
| position                         |
| blockType                        |
| block-specific structured data   |
+----------------------------------+
```

For example:

```text
Node
 ├── TextBlock
 ├── ImageBlock
 ├── TextBlock
 ├── PollBlock
 └── GraphBlock
```

The first useful primitives can remain deliberately small:

```text
TextBlock
ImageBlock
VideoBlock
```

Future tools can add richer blocks without changing the fundamental Node abstraction, for example:

```text
PollBlock
GraphBlock
QuoteBlock
EmbedBlock
DatasetBlock
```

The order of the blocks is part of the Node's content. Users should eventually be able to add, remove, and reorder blocks in a toolbox/editor experience similar to a no-code page builder.

This is a **domain-model decision**, not only a UI feature. Product Experience can later define how the block editor feels, but Graph owns the fact that Node content is ordered, composable, and typed.

## Content Block Validation and Extensibility

Each block type should have a defined structure and validation policy rather than accepting arbitrary untyped data.

Examples:

```text
TextBlock
- bounded text length
- supported formatting model
- sanitization / safe rendering rules

ImageBlock
- media reference
- valid media type / size constraints
- optional caption / alt text

VideoBlock
- accepted media/provider reference
- media-specific validation

PollBlock
- question
- bounded option count
- bounded option length

GraphBlock
- graph-specific structured configuration
```

Atlas can also impose Node-level limits such as:

- maximum title length;
- maximum number of content blocks;
- maximum aggregate content/media size;
- per-block limits for expensive or complex block types.

This makes input validation more precise than attempting to sanitize one giant `description` field. The server should validate the declared `blockType` and the structure expected for that type.

The implementation should **not yet be forced** into literal C# inheritance such as `TextBlock : ContentBlock`. Possible implementation shapes include subclasses, discriminated records, or a `blockType + structured payload` representation. The conceptual requirement is the stable part: **ordered typed blocks with block-specific validation**.

Adding a new content tool should generally mean adding a new supported block type, rather than expanding `Node` with fields such as `imageUrl`, `videoUrl`, `pollOptions`, and `graphConfig` that are irrelevant to most Nodes.

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

## Node Relationships and Multiple Parents

Atlas should use an explicit relationship/edge object to describe how Nodes are connected.

A shared or converging Node is still an ordinary Node. It does **not** become a special subclass merely because it has more than one parent.

Conceptually:

```text
+----------------------------------+
|               Node               |
+----------------------------------+
| id                               |
| type                             |
| title                            |
| contentBlocks[]                  |
| requestedChildTypes              |
+----------------------------------+

               0..*        0..*
Node ------------------------------- Node
          via NodeRelationship
```

A Node can therefore have **zero, one, two, or potentially many parents** if the graph and the relationship semantics call for it. Multiple parents are a property of the graph rather than a special content subclass.

## Relationship Semantics and Cardinality

The current design direction is that when several parent Nodes participate in **one relationship**, that relationship has **one semantic keyword/type shared by the participants**. The parents should not automatically receive unrelated per-edge meanings such as one parent being `supports` while another is `complicates` within what is supposed to be the same relationship.

For example:

```text
Relationship type: contradiction

Parent A ─┐
          ├── Relationship / convergent Node
Parent B ─┘
```

The relationship vocabulary remains open-ended and can participate in Atlas's emergent ontology. Examples might include `contradiction`, `similarity`, `shared cause`, `collectively supports`, or other user-defined terms. These examples are suggestions, not privileged schema values.

This raises an important **cardinality** question. Not every relationship concept naturally supports the same number of participants. A relationship such as `contradiction` may make the most sense as exactly two participants, while concepts such as `similarity`, `alternatives`, or `shared cause` may sensibly include two or more.

A promising direction is therefore for a relationship type/schema to eventually be able to describe its allowed participant count or cardinality, for example:

```text
contradiction
participants: exactly 2

similarity
participants: 2+

shared cause
participants: 2+
```

This is **not yet a finalized implementation decision**. In particular, Atlas still needs to settle the exact persistence model for a multi-participant relationship and how user-defined relationship vocabulary acquires constraints such as cardinality. The important current rule is that the UI and model should **not assume every relationship type can accept arbitrary numbers of parents**.

The Create Node UX can expose this progressively: ordinary creation begins with its contextual parent, and `+ Add another parent` can reveal the relationship/convergence controls. Once multiple participants are selected, the user defines the shared relationship keyword/type for that relationship rather than assigning independent meanings to every parent.

## Cycles and Traversal

Allowing many parents turns Atlas into a directed graph rather than a strict tree.

The current architectural preference is to keep the **primary parent/child hierarchy acyclic** where possible. In other words, structural parent/child relationships should ideally form a directed acyclic graph (DAG).

This keeps recursive traversal, breadcrumbs, diagram rendering, ancestry checks, and database queries much easier to reason about while still allowing a Node to have many parents.

Richer cross-links can still express relationships between otherwise distant parts of the graph. If Atlas later decides to permit cycles in stored relationships, traversal and rendering must explicitly track visited Nodes and prevent infinite recursive expansion.

The exact distinction between structural hierarchy edges and non-hierarchical cross-links should be finalized during persistence design.

## Multiple Roots
A root is not a special Node class. User profiles can expose multiple root Nodes, and the public Atlas can expose multiple root Nodes. Root status is contextual: it identifies an entry point into a graph/hierarchy.

## Open Questions
- [ ] Is `RequestedChildType.order` needed?
- [x] Which child types, if any, are globally available regardless of solicitation? **Current decision: none need to be hard-coded as globally privileged. Contributors can use requested types, existing ontology vocabulary, or define a new type in context.**
- [x] How are cross-branch/shared-node relationships represented at a high level? **Current decision: a Node can have multiple parents and remains an ordinary Node rather than becoming a special subclass.**
- [ ] What is the exact persistence/domain representation of one relationship involving multiple parent Nodes?
- [ ] How does a user-defined relationship type declare or acquire cardinality constraints such as exactly 2 versus 2+ participants?
- [x] Is Node body content a single description string? **Current decision: no. Node body content is an ordered collection of typed `ContentBlock` values. Simple text remains a basic block, while images, video, polls, graph integrations, and future tools can use block-specific schemas.**
- [ ] Which content blocks belong in the first rewrite milestone beyond Text, Image, and Video?
- [ ] What is the persistence representation for heterogeneous ContentBlocks?
- [ ] What Node-level and per-block size/count limits should be enforced?
- [ ] Where exactly should Atlas draw the line between structural hierarchy edges and non-hierarchical cross-links?
- [ ] Must every stored relationship be acyclic, or only the primary parent/child hierarchy?
- [ ] Which additional domain objects are truly required: votes, moderation records, permissions, etc.?