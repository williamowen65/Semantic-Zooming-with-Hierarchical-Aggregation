# Atlas Node Data Model Notes

## Core realization

The Atlas data model can be substantially simpler than the earlier ontology-oriented design.

Instead of separate structural classes for **Issue**, **Solution**, **Challenge**, and other semantic categories, Atlas can use a single recursive **Node** class. A node's semantic meaning is expressed through a flexible `type` value rather than through a separate class hierarchy.

This means Atlas does not need to predict every possible category of thought in advance. Users can use vocabulary appropriate to the conversation while the underlying application continues to work with the same node structure.

## Initial UML sketch

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
  ├── requestedChildTypes: types the author is explicitly soliciting
  └── children: 0..* Node
```

A more explicit conceptual representation is:

```text
Node
  id
  type
  title
  description
  requestedChildTypes: RequestedChildType[]
  children: Node[]
```

## Node type

Every node still has a `type`.

Examples might include:

- issue
- solution
- question
- challenge
- implementation
- evidence
- objection
- support
- cause
- example

These examples are vocabulary, not a fixed inheritance hierarchy. Atlas should not require a different application class for every semantic type.

The type gives the node semantic meaning in the conversation while allowing the underlying data structure and behavior to remain generic.

## The ontology should emerge naturally

Atlas should not begin with the assumption that there is one correct, centrally maintained ontology that must be designed in advance.

Instead, the ontology can **emerge from how people actually structure conversations**.

Users may choose existing type vocabulary when it fits, but they may also define a new type in the moment when the existing language does not express what they are trying to contribute or solicit.

For example, one conversation may naturally use:

```text
Issue
Solution
Challenge
Evidence
```

while another may evolve toward:

```text
Question
Hypothesis
Example
Counterexample
Experiment
```

and another may invent categories that Atlas's designers never anticipated.

This does not require new application classes. These are simply values used by the same generic Node structure.

The ontology can therefore be **fluid rather than fixed**. Human users can interact with the vocabulary that exists, reuse it, introduce new vocabulary, and potentially change which kinds of responses a node is soliciting as the conversation develops.

The resulting ontology is better understood as an emergent property of the graph and its participants than as a schema imposed on every conversation by Atlas itself.

This also means ontology design can happen **on the fly**. A contributor does not necessarily need to select from a complete pre-existing taxonomy before participating. They can define the semantic category they need at the point where they need it, subject to whatever naming, moderation, normalization, or permission rules Atlas eventually adopts.

Questions such as whether equivalent terms should later be suggested, merged, aliased, or normalized are separate product and governance questions. They should not require changing the underlying Node model.

## Requested child types

A node can declare the kinds of responses it is particularly interested in receiving.

For example, a node might request:

```text
Solutions
Challenges
Evidence
```

Another node might request:

```text
Questions
Examples
Counterarguments
```

These requested types are what the diagram's child-category toggles primarily represent. Importantly, a requested category should remain visible even when its current count is zero. The empty category communicates to people viewing the diagram that this is a kind of contribution being requested.

`requestedChildTypes` is therefore **solicitation metadata**, not a strict validation rule.

Requested child types can use established vocabulary or vocabulary created specifically for the current conversation. They can also potentially change over time as participants realize that different kinds of responses would be useful.

## RequestedChildType

It may be useful to represent each requested child type as a small object rather than only a string:

```text
+----------------------------------+
|        RequestedChildType        |
+----------------------------------+
| type                             |
| label                            |
| order                            |
+----------------------------------+
```

Conceptually:

```text
Node 1 -------- 0..* RequestedChildType
```

Possible fields:

- `type` — the semantic type being requested.
- `label` — the human-readable wording shown in the interface.
- `order` — optional presentation ordering for the toggles.

Whether explicit `order` is ultimately necessary is still an open design question. It can remain in the conceptual model for now.

## Children

Every node contains a `children` collection. It can be empty or contain any number of child nodes.

```text
Node 1 -------- 0..* Node
        children
```

A child's `type` will often match one of its parent's `requestedChildTypes`, but this is **not required in every case**.

The parent is expressing what it wants people to contribute, not completely restricting what people are allowed to say.

For example, a node may request `solution` and `evidence` responses. Someone should still be able to ask a `question` about that node even if the author did not explicitly request questions.

When that happens, a Questions category can appear in the interface because a question actually exists beneath the node.

This suggests the visible categories for a node are conceptually derived from both:

```text
visibleChildTypes =
    requestedChildTypes
    UNION
    typesPresentIn(children)
```

There may also be broadly available conversational types, such as `question`, that users can add regardless of whether the parent explicitly requested them. The exact creation and governance rules can be designed later.

## Solicitation versus restriction

This distinction is important:

**Requested child types answer:**

> What kinds of contributions would be especially useful here?

They do not necessarily answer:

> What kinds of contributions are legally allowed to exist here?

This allows the author to structure a conversation without preventing unexpected but useful directions from emerging.

## One recursive class instead of an ontology of classes

An earlier Atlas design used different structural concepts such as Issue and Solution and then expanded as additional needs appeared: Challenge, Implementation, Yay, Nay, Question, and so on.

That approach becomes increasingly difficult because real conversations do not fit neatly into a small permanent ontology. Adding more classes does not solve the fundamental problem; it simply moves the boundary.

The simplified model instead says:

> Everything is a Node. A Node has a flexible type.

That one class can recursively contain other nodes and can describe the kinds of child nodes it would particularly like to receive.

This makes the data model more expressive while simultaneously reducing the number of structural concepts the application itself needs to understand.

## Centralized validation and security

Using one Node model also creates a useful application boundary for user-generated content.

Node creation and modification can share common handling for:

- input validation;
- authorization and permissions;
- length and format constraints;
- persistence rules;
- output escaping and safe rendering;
- abuse-prevention rules;
- database access.

SQL injection protection should primarily come from **parameterized queries, prepared statements, or the ORM/database access layer**, rather than attempting to manually remove SQL-like text from user input.

Because Issues, Solutions, Questions, Challenges, and other semantic categories are all represented by the same underlying Node model, this common security and validation behavior does not need to be duplicated across a collection of semantic subclasses.

Flexible user-created type vocabulary still needs validation as user-generated data, but adding a new semantic type should not require adding executable application code.

## Multiple roots

Atlas is not restricted to one root node.

There can be multiple root nodes associated with a user's profile, and there can also be multiple root nodes on the public-facing Atlas experience.

Conceptually:

```text
User/Profile
    |
    +---- 0..* root Node

Public Atlas
    |
    +---- 0..* root Node
```

A root node is not a separate class. It is still an ordinary Node.

Being a root means that the node is being used as an entry point into a particular hierarchy or graph context rather than requiring a special `RootNode` data model.

The exact persistence model for associating roots with profiles or public collections can be decided separately from the Node class itself.

## Scope of these notes

These notes describe the **structure of the data**, assuming users will eventually be able to create and configure nodes and their semantic vocabulary.

They are intentionally not attempting to fully design the node-creation user experience yet. However, the model should assume that users may create types and requested child categories dynamically, in context, rather than being limited to a taxonomy Atlas's developers predefine.

Questions such as vocabulary discovery, aliases, normalization, permissions, moderation, duplicate terminology, and whether communities develop shared conventions can be explored later without changing the fundamental Node model.

## Guiding principle

Atlas should provide structure without requiring a rigid ontology.

A single recursive Node model gives each contribution enough freedom of expression to represent different kinds of thought while still giving the application a predictable structure to store, secure, render, and navigate.

The ontology itself can emerge from human use and remain fluid as conversations evolve.