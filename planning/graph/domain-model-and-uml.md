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

A shared or converging Node is still an ordinary Node. It does **not** become a special subclass merely because it has more than one parent. The semantic meaning of each connection belongs on the relationship between the Nodes.

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

+----------------------------------+
|        NodeRelationship          |
+----------------------------------+
| id                               |
| parentNodeId                     |
| childNodeId                      |
| type                             |
| label                            |
+----------------------------------+
```

A Node can therefore have **zero, one, two, or many parents** if the graph calls for it.

For example:

```text
Parent A --[relates to]------\
                              > Shared Child
Parent B --[helps address]---/
Parent C --[supports]--------/
```

The Shared Child remains one underlying Node. Each parent relationship can have different semantic vocabulary.

This is especially useful for Atlas because two contributions from completely different routes through the graph may converge on the same idea. The shared child can then continue normally with its own requested child types and descendants.

The relationship vocabulary can itself participate in the emergent ontology. Examples might include:

```text
relates to
helps address
implemented by
supports
depends on
contradicts
```

but Atlas should not require those exact terms in advance.

### Why the relationship is not a Node subclass

The default rule is:

> **Node = content. NodeRelationship = meaning of the connection.**

A Node should not inherit from a special `RelatedNode`, `MultiParentNode`, or similar class merely because of its graph position. Multiple parents are a property of the graph, not a different kind of content object.

If a relationship someday needs substantial first-class content of its own—such as a description, votes, discussion, requested child types, or its own descendants—that may justify representing that relationship as a first-class Node. That should be treated as a separate modeling decision rather than making all shared relationships subclasses by default.

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
- [x] How are cross-branch/shared-node relationships represented? **Current decision: use explicit `NodeRelationship` edges. A Node can have 0..* parents; multi-parent Nodes remain ordinary Nodes.**
- [x] Is Node body content a single description string? **Current decision: no. Node body content is an ordered collection of typed `ContentBlock` values. Simple text remains a basic block, while images, video, polls, graph integrations, and future tools can use block-specific schemas.**
- [ ] Which content blocks belong in the first rewrite milestone beyond Text, Image, and Video?
- [ ] What is the persistence representation for heterogeneous ContentBlocks?
- [ ] What Node-level and per-block size/count limits should be enforced?
- [ ] Where exactly should Atlas draw the line between structural hierarchy edges and non-hierarchical cross-links?
- [ ] Must every stored relationship be acyclic, or only the primary parent/child hierarchy?
- [ ] Which additional domain objects are truly required: votes, moderation records, permissions, etc.?