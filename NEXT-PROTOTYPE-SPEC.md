# Atlas — Next Prototype Specification

## Purpose

The next prototype should be a clean reimplementation of the ideas discovered through the current prototype, not a continuation of its accumulated architecture.

The existing prototype should be treated as a **behavioral and visual reference**: it demonstrates interactions, graph behavior, layouts, relationship navigation, and edge cases that have been useful during exploration. The next implementation should reproduce only the behaviors that still make sense under the simpler model.

This is still a prototype. The goal is to create a cleaner foundation that makes further experimentation easier, not to freeze the product design or ontology.

## Core conceptual shift

The system should avoid treating concepts such as Issue, Solution, Challenge, Implementation, Yay, and Nay as permanent classes of nodes.

At the fundamental level, **everything is a node**.

A node represents a post, thought, question, proposal, observation, claim, piece of information, or other contribution. Its role is determined primarily by its relationships and the context in which it appears rather than by a globally fixed node type.

The same underlying node should be able to participate in multiple parts of the graph and play a different role in each context without duplicating its underlying content.

## Nodes

A node should contain only broadly applicable content and metadata. A minimal conceptual shape is:

```js
{
  id,
  title,
  description,
  responseTypes,
  // other general metadata as needed
}
```

`responseTypes` describes the kinds of responses that the author or community is soliciting beneath this particular node.

Nodes should not need to know that they are permanently an `issue`, `solution`, `challenge`, etc.

## Relationships / edges

Meaning between nodes should live primarily on the edge connecting them.

Conceptually:

```js
{
  from,
  to,
  type,
  label
}
```

Examples of relationship vocabulary may include:

- sub-issue
- solution
- challenge
- implementation
- yay / support
- nay / objection
- evidence
- counterevidence
- question
- answer
- helps address
- depends on
- conflicts with
- related to
- implemented by

This vocabulary is expected to evolve. The architecture should not require new rendering logic every time a new relationship type is introduced.

A relationship can also connect nodes that already exist elsewhere in the graph. This is how Atlas can represent connections between otherwise separate branches without copying the underlying node.

## Response types are invitations to participate

The toggle bar underneath a selected node should no longer primarily be understood as a classifier for its children.

It represents **what kinds of responses this node is asking people to contribute**.

For example, one node might solicit:

- Sub-issues
- Solutions

Another might solicit:

- Challenges
- Implementations
- Yays
- Nays

Another might solicit:

- Evidence
- Counterevidence
- Questions

Another might expose only:

- Related ideas

These options should be definable on a **per-node basis** rather than inferred from a hard-coded ontology.

The author of a node may eventually be able to choose what kinds of information or responses they want from other people. Templates or community conventions may provide useful defaults, but that is a product-design question to explore later.

## Toggle behavior

The toggle UI should be generated dynamically from the selected node's configured response types.

Each option should:

- have a human-readable label;
- show the number of responses currently connected through that relationship;
- remain visible with a count of zero when the node is explicitly soliciting that response type;
- be disabled or otherwise visually indicate emptiness when appropriate;
- filter the next visible graph layer to relationships of that type.

The UI should not contain special logic such as "if this is a Solution, show Challenges and Implementations." That configuration belongs to the node or its chosen response schema.

## Contextual identity

A node's content identity and its contextual role are separate concepts.

If node B appears beneath node A through a `solution` relationship, B is being presented **as a solution to A** in that context. That does not mean B permanently becomes a Solution node.

If B is also connected to node C through `evidence`, it can appear as evidence in that context while remaining the same underlying node.

This contextual behavior is important for representing a real graph rather than forcing information into a strict tree ontology.

## Cross-branch relationships

The current prototype's related-topic behavior should remain an important reference case.

For example:

- Redirecting surplus food can help address homelessness.
- Atlas can implement an idea about designing social media for collective problem-solving.

These should be represented through relationships between shared nodes rather than duplicated content.

When navigating across such a relationship, Atlas should be able to change branch context while preserving the identity and visual position of the shared/related node as much as practical. The current prototype demonstrates useful behavior here and can serve as a reference during reimplementation.

## Root layer

Roots are allowed to be heterogeneous.

The root view is an intentional exception to ordinary response filtering: different kinds of starting posts can coexist in the same top-level visualization.

The current concepts of Issues, Questions, and Solutions may still be useful as **root discovery categories or labels**, but they should not force those nodes into permanent structural classes deeper in the system.

This distinction should remain open to further experimentation.

## Layout

The page shell should be rebuilt simply rather than copied wholesale from the current prototype.

Start with normal document layout and CSS wherever possible:

1. Header
2. Breadcrumb/navigation area
3. Visualization / hierarchy content
4. Normal document-flow spacing beneath the visualization
5. Any optional footer or auxiliary UI

Avoid JavaScript positioning when normal CSS layout can solve the problem.

The previous prototype encountered several bugs because independently calculated card heights, graph positions, scrolling corrections, and fixed/sticky elements began interacting. The rewrite should prefer a single understandable layout model.

## Scrolling and navigation

The hierarchy may grow vertically as the user travels deeper into it.

Important behaviors discovered in the current prototype include:

- the user should be able to scroll naturally through the hierarchy;
- breadcrumbs/header content should not obscure the top of the graph;
- switching to a related branch should not produce an arbitrary jump;
- when branch context changes around a shared node, preserving that node's viewport position is preferable to automatically scrolling it into a new position;
- layout changes should not cause flashes or secondary corrective scrolling after render.

The exact implementation can change. These are behavioral goals, not requirements to preserve the old scrolling code.

## Diagram rendering

D3 can continue to handle the weighted/tiled graph visualization where it is useful.

The D3 layer should be kept as isolated as practical from application semantics. Ideally it receives something close to:

- the nodes to display in the current layer;
- their weights / visual importance;
- selected state;
- callbacks for interaction.

It should not need to understand the product ontology or decide which response types are valid.

Application/data logic should determine **what belongs in a layer**. The visualization should determine **how that layer is drawn**.

## Descriptions and content

Descriptions should support lightweight intentional formatting such as line breaks or paragraph breaks without requiring arbitrary HTML in the data.

Node titles and descriptions should remain readable at different viewport widths and should wrap rather than being unexpectedly truncated with ellipses.

## Themes

Themes should remain presentation-only.

Changing a theme should affect colors, gradients, surfaces, and related visual styling without changing graph semantics or requiring node data to contain theme-specific colors.

Some themes can use clearly visible linear gradients rather than all themes being subtle variations of flat fills.

## What to avoid in the rewrite

Avoid carrying forward compatibility machinery solely because the current prototype needed it.

In particular, do not begin the rewrite with assumptions such as:

- every node has one permanent semantic kind;
- child controls are determined globally by that kind;
- relationships need to masquerade as special node classes;
- Issues and Solutions require separate rendering pipelines;
- every new relationship vocabulary term requires new UI code;
- JavaScript should manually position ordinary page-layout elements.

If the simpler model can express a behavior directly, prefer that model even if the implementation differs substantially from the current prototype.

## Suggested implementation order

A useful clean-room progression would be:

1. Build the basic page shell and normal scrolling layout.
2. Define the generic node and relationship data structures.
3. Render a simple selected node and its dynamic response toggle bar without D3.
4. Resolve the visible children for a selected response type from relationships.
5. Introduce the D3 layer renderer for those resolved children.
6. Add hierarchical navigation and breadcrumbs.
7. Add shared-node / cross-branch navigation.
8. Add URL state and persistence where useful.
9. Add themes and display controls.
10. Revisit advanced interactions only after the simpler architecture is stable.

## Current prototype as a test suite

The old prototype is valuable because it contains concrete scenarios the rewrite should be tested against:

- Homelessness with multiple sub-issues and solutions.
- Redirecting surplus food appearing in a relationship to homelessness.
- Challenges beneath that relationship.
- Social-media collective problem-solving connected to Atlas through an implementation relationship.
- A root-level Atlas post coexisting with other heterogeneous roots.
- Leaf nodes that still solicit response types with zero current responses.
- Switching context through a shared node without losing the user's visual orientation.

These examples should be used to test the flexibility of the new model rather than copied as architectural special cases.

## Guiding principle

**Atlas should structure a conversation without forcing the conversation into a rigid ontology.**

Nodes hold ideas. Relationships describe how ideas connect. Each node can communicate what kinds of responses would be useful next. The interface derives its hierarchy from those choices dynamically.

The next prototype should make that model feel simple in both the code and the interaction, while remaining deliberately open-ended enough for continued experimentation.