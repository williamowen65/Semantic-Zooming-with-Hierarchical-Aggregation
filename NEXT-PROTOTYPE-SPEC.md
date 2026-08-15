# Atlas — Next Prototype Specification

## Purpose

The next prototype should be a clean reimplementation of the ideas discovered through the current prototype, not a continuation of its accumulated architecture.

The existing prototype should be treated as a **behavioral and visual reference**: it demonstrates interactions, graph behavior, layouts, relationship navigation, and edge cases that have been useful during exploration. The next implementation should reproduce only the behaviors that still make sense under the simpler model.

This is still a prototype. The goal is to create a cleaner foundation that makes further experimentation easier, not to freeze the product design or ontology.

## Core conceptual shift

At the fundamental level, **everything is a node**.

A node can still have a **type**, but types are not a small hard-coded ontology owned by the application. A type is flexible vocabulary chosen for the conversation being structured: `issue`, `solution`, `question`, `challenge`, `implementation`, `evidence`, or essentially any other useful label.

The important rule is contextual:

> A child node's type must be one of the child types that its parent is currently requesting.

This means the structure is not driven by global rules such as “Solutions always allow Challenges and Implementations.” Instead, each node explicitly declares the kinds of child contributions it is soliciting.

The model should therefore be flexible enough for users to invent or choose the vocabulary that best describes what they want from other participants.

This prototype does **not** need to solve the user experience for creating that vocabulary yet. It only needs a data structure and rendering model that assumes such configuration is possible.

## Nodes

Every contribution is represented by the same generic node structure.

A minimal conceptual shape is:

```js
{
  id,
  type,
  title,
  description,
  requestedChildTypes,
  // other general metadata as needed
}
```

### `type`

`type` describes what this node is being presented as in the hierarchy.

Examples might include:

- issue
- solution
- question
- challenge
- implementation
- evidence
- objection
- example
- resource

The application should not maintain a closed list of valid node types. New vocabulary should not require new rendering code.

A node's type matters for how it is grouped beneath its parent, but it should not automatically determine what types of children that node itself can have.

For example, a node whose type is `solution` might request:

- challenge
- implementation
- question

Another `solution` node might request:

- issue
- evidence
- alternative

Those are both valid because the requested child vocabulary belongs to the individual node, not to the global meaning of `solution`.

### `requestedChildTypes`

`requestedChildTypes` describes the kinds of contributions this particular node is asking people to add beneath it.

Conceptually:

```js
requestedChildTypes: [
  { type: 'challenge', label: 'Challenges' },
  { type: 'implementation', label: 'Implementations' },
  { type: 'question', label: 'Questions' }
]
```

These declarations exist even when there are currently zero children of that type.

That is important because the toggle bar is not just a summary of existing data. It communicates **what kinds of information the node is soliciting**.

A child node attached through the normal hierarchy must have a `type` that matches one of the parent's `requestedChildTypes`.

## Parent-child hierarchy

The ordinary hierarchy can therefore be understood very simply:

```text
Parent node
  requests: [Challenge, Implementation, Question]

  Challenge
    Child node A
    Child node B

  Implementation
    Child node C

  Question
    0 current children
```

The parent determines which type buckets are available.

The child determines which bucket it belongs in through its own `type`.

The interface does not infer either of these from a global ontology.

## Toggle behavior

The toggle bar underneath a selected node should be generated directly from that node's `requestedChildTypes`.

Each toggle should:

- use the label configured by the parent node;
- show the number of direct child nodes whose `type` matches that requested type;
- remain visible when the count is zero;
- visually indicate when there are no current responses, while still communicating that this kind of response is wanted;
- filter the next visible graph layer to children of that type.

The toggle bar therefore serves two purposes at once:

1. **Navigation** — choose which category of responses to view.
2. **Solicitation** — communicate what kinds of contributions would be useful to add.

The UI should not contain rules such as:

```js
if (node.type === 'solution') {
  showChallengesAndImplementations();
}
```

Instead it should simply render whatever the node requests.

## Flexible vocabulary

Vocabulary should be deliberately open-ended.

`issue` and `challenge`, for example, are similar but not identical words. Depending on the conversation, one may communicate the requested contribution better than the other.

Likewise, a `solution` may reasonably solicit `issues`, `challenges`, `questions`, `evidence`, or something else entirely.

Atlas should allow the structure to reflect the language the participants actually want to use rather than forcing every discussion into one universal taxonomy.

The prototype only needs to prove that arbitrary type labels can flow through the data model and UI consistently.

## Relationships / cross-links

Normal parent-child hierarchy and graph relationships are related but distinct concepts.

The hierarchy uses a parent's requested child types and each child's `type` to organize responses.

Atlas should also support explicit relationships between nodes that already exist elsewhere in the graph.

Conceptually:

```js
{
  from,
  to,
  relationshipType,
  label
}
```

Examples may include:

- helps address
- depends on
- conflicts with
- supports
- is evidence for
- implemented by
- related to

This relationship vocabulary should also remain extensible.

A cross-link does not necessarily reclassify either node. It describes how two existing nodes relate.

For example:

- Redirecting surplus food **helps address** homelessness.
- Atlas **implements** an idea about designing social media for collective problem-solving.

These relationships can allow separate branches of the graph to converge without duplicating the underlying nodes.

## Shared nodes and contextual appearance

A node has its own identity, content, and type, but it may be reachable through multiple parts of the graph.

The application should avoid copying the underlying content merely because the same node participates in multiple branches.

Cross-branch relationships may need contextual labels or presentation so the user understands *why* the node appears there, but that presentation should be separate from the node's underlying data.

The exact rules for whether a shared node may appear beneath multiple parents with different requested-type vocabularies remain open for experimentation. The important thing for this prototype is not to bake restrictive assumptions into the architecture prematurely.

## Root layer

Roots are allowed to be heterogeneous.

A root node still has a `type`, but because it has no ordinary parent there is no parent constraint determining which types are allowed.

The root view is therefore an intentional exception: different root types can coexist in the same top-level visualization.

Examples might include:

- Issue
- Question
- Solution

Those names are not special application classes. They are simply types currently used by those root nodes.

The root card can expose a summary or grouping of the root types currently present without requiring a fixed list.

## Data validation

The data layer should be able to validate the simple hierarchy rule:

```text
For each ordinary child:
child.type must be included in parent.requestedChildTypes
```

A useful validation function might conceptually be:

```js
function canAttach(parent, child) {
  return parent.requestedChildTypes.some(
    requested => requested.type === child.type
  );
}
```

This is a structural rule, not necessarily a user-interface rule. The eventual creation interface may guide users toward valid choices automatically.

The prototype can assume valid data while still keeping this invariant explicit.

## What this prototype is not solving yet

The next prototype is focused on the **data structure and graph behavior**.

It does not yet need to determine:

- how a user invents a new type;
- whether vocabulary is private, local, shared, or global;
- whether suggested type templates exist;
- who is allowed to modify a node's requested child types;
- how vocabulary is normalized or deduplicated;
- whether similar labels such as `Issue` and `Challenge` should ever be merged;
- how a creation form presents the allowed child type selection.

Those are important product questions, but they should not complicate the structural prototype prematurely.

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

It should not need to understand what `solution`, `challenge`, `question`, or any other type means.

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

- a node's type determines its allowed child types globally;
- the application owns a closed ontology of valid node types;
- child controls can be inferred from a node class;
- Issues and Solutions require separate rendering pipelines;
- every new vocabulary term requires new UI code;
- relationships need to masquerade as special node classes;
- JavaScript should manually position ordinary page-layout elements.

If the simpler model can express a behavior directly, prefer that model even if the implementation differs substantially from the current prototype.

## Suggested implementation order

A useful clean-room progression would be:

1. Build the basic page shell and normal scrolling layout.
2. Define the generic node structure with `type` and `requestedChildTypes`.
3. Render a selected node and dynamically generate its toggle bar without D3.
4. Show every requested type, including zero-count categories.
5. Filter ordinary child nodes by `child.type`.
6. Introduce the D3 layer renderer for the currently selected type bucket.
7. Add hierarchical navigation and breadcrumbs.
8. Add explicit cross-node relationships and shared-node navigation.
9. Add URL state and persistence where useful.
10. Add themes and display controls.
11. Revisit advanced interactions only after the simpler architecture is stable.

## Current prototype as a test suite

The old prototype is valuable because it contains concrete scenarios the rewrite should be tested against:

- Homelessness requesting multiple types such as sub-issues and solutions.
- Requested categories remaining visible when they currently contain zero nodes.
- Redirecting surplus food appearing in a relationship to homelessness.
- Challenges beneath the relevant surplus-food concept.
- Social-media collective problem-solving connected to Atlas through an implementation relationship.
- A root-level Atlas post coexisting with heterogeneous roots.
- Leaf nodes that can still solicit additional response types despite having no children yet.
- Switching context through a shared node without losing the user's visual orientation.

These examples should test the flexibility of the new model rather than become architectural special cases.

## Guiding principle

**Everything is a node, but nodes can use whatever type vocabulary makes the conversation useful.**

A node declares what it is through `type` and what it wants next through `requestedChildTypes`.

A parent defines the allowed response vocabulary beneath itself. A child chooses one of those allowed types. The toggle bar exposes the parent's requested vocabulary whether or not responses already exist.

Explicit graph relationships can connect nodes across the hierarchy without forcing them into a rigid global ontology.

The next prototype should make this model feel simple in both the code and the interaction, while remaining deliberately open-ended enough for continued experimentation.