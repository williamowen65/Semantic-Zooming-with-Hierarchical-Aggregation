# Codebase Structure and Bounded Contexts

## Table of Contents

- [Purpose](#purpose)
- [Bounded Contexts Are Architectural Boundaries](#bounded-contexts-are-architectural-boundaries)
- [Concrete Graph Folder Example](#concrete-graph-folder-example)
- [Proposed Codebase Shape](#proposed-codebase-shape)
- [What Belongs Inside a Context](#what-belongs-inside-a-context)
- [How Contexts Communicate](#how-contexts-communicate)
- [APIs and Application Services](#apis-and-application-services)
- [Domain Events and Pub-Sub](#domain-events-and-pub-sub)
- [Dependency Rule](#dependency-rule)
- [Namespaces and Physical Separation](#namespaces-and-physical-separation)
- [Relationship to Aggregates](#relationship-to-aggregates)
- [Initial Atlas Contexts](#initial-atlas-contexts)
- [Open Decisions](#open-decisions)

## Purpose

Plan the physical and logical structure of the rewritten Atlas codebase so that domain boundaries remain visible in the code rather than existing only in planning documents.

The main goal is to organize related concepts together and prevent one domain from casually reaching into another domain's internal implementation.

## Bounded Contexts Are Architectural Boundaries

A **bounded context** is not one giant object or class. It is a boundary around a group of concepts, rules, vocabulary, and behavior that belong together.

For example, the Graph context may contain many classes and abstractions:

```text
Graph
├── Node
├── NodeRelationship
├── RequestedChildType
├── RootAssociation
├── Context
├── repositories
├── services
├── events
└── traversal strategies
```

The folder or namespace is a practical way to make that boundary visible, but the folder itself is not what makes something a bounded context. The important rule is that the context **owns its internal model and behavior**.

Other contexts should interact with it through deliberate contracts rather than directly manipulating its internals.

## Concrete Graph Folder Example

A concrete first-pass representation of the Graph bounded context could look like this:

```text
src/
  Graph/
    Domain/
      Node.cs
      NodeRelationship.cs
      RequestedChildType.cs
      RootAssociation.cs

    Application/
      NodeService.cs
      TraversalService.cs

    Persistence/
      INodeRepository.cs
      NodeRepository.cs
      CachedNodeRepository.cs

    Events/
      NodeCreated.cs
      NodeEdited.cs
```

This example is intentionally concrete because it makes the bounded-context idea easier to visualize. `Graph/` is the boundary, while the folders underneath it organize the different responsibilities inside that boundary.

- `Domain/` contains the core Graph concepts and rules.
- `Application/` contains use cases and coordination logic involving those concepts.
- `Persistence/` contains the Graph-owned database abstraction and implementations. `CachedNodeRepository` can decorate the database repository without putting caching logic into `Node`.
- `Events/` contains meaningful facts that Graph can publish for other contexts to observe, such as `NodeCreated` and `NodeEdited`.

This is an illustrative starting point rather than a requirement that these exact classes or folders exist. For example, `Context`, additional relationship classes, contracts, strategies, version-history persistence, and other files can be added as their responsibilities become concrete.

The important architectural idea is that these pieces remain visibly grouped around the Graph domain while other bounded contexts communicate with Graph through intentional contracts or events instead of directly manipulating these internal classes.

## Proposed Codebase Shape

An initial ASP.NET Core codebase could organize the major contexts directly under the application source tree:

```text
src/
  Atlas.Web/

  Graph/
    Domain/
    Application/
    Persistence/
    Contracts/
    Events/

  Voting/
    Domain/
    Application/
    Persistence/
    Contracts/
    Events/

  Profiles/
    Domain/
    Application/
    Persistence/
    Contracts/
    Events/

  Notifications/
    Domain/
    Application/
    Persistence/
    Contracts/
    Events/
    Adapters/

  Moderation/
    Domain/
    Application/
    Persistence/
    Contracts/
    Events/

  Shared/
    very small cross-cutting primitives only
```

The exact project/folder structure can change during implementation. The important idea is that code is grouped primarily by **domain capability / bounded context**, not only by technical layer across the entire application.

For example, prefer:

```text
Graph/Domain/Node.cs
Voting/Domain/Vote.cs
Notifications/Application/NotificationService.cs
```

over a global structure such as:

```text
Models/
Services/
Repositories/
Controllers/
```

where unrelated domains become mixed together merely because their classes have the same technical role.

## What Belongs Inside a Context

A context may contain several kinds of code.

Typical categories include:

- **Domain** — entities, aggregate roots, value objects, domain rules, and domain-specific interfaces.
- **Application** — use cases and services that coordinate domain operations.
- **Persistence** — repository implementations, ORM mappings, and domain-specific database queries.
- **Contracts** — the intentional public surface other contexts may use.
- **Events** — domain events published when meaningful changes occur.
- **Adapters** — implementations for external systems where appropriate.

Not every context needs every folder. The structure should remain proportional to the actual complexity of that domain.

## How Contexts Communicate

Bounded contexts should communicate through **deliberate contracts** rather than directly accessing one another's repositories, tables, or internal entities.

Two primary communication styles are expected:

```text
Direct request / response
        -> API or application-service contract

Something happened
        -> domain event / publish-subscribe
```

A useful shorthand is:

> **API = I need an answer or action now.**
>
> **Event = Something happened; whoever cares may react.**

These boundaries can initially exist completely **inside one ASP.NET Core process**. They do not imply that every bounded context must become a separate HTTP service or microservice.

## APIs and Application Services

When one context needs an immediate answer or operation from another context, it should depend on a small exposed interface or application contract.

For example, Voting may need to know whether a Node exists:

```text
Voting
   |
   | IGraphQueries.GetNode(nodeId)
   v
Graph
```

Conceptually in C#:

```csharp
public interface IGraphQueries
{
    Task<NodeSummary?> GetNodeAsync(Guid nodeId);
}
```

Voting should use that public contract rather than directly depending on `NodeRepository`, ORM mappings, or Graph persistence tables.

Similarly, Profiles might ask Graph for the Nodes exposed through a particular root Context without learning how Graph internally stores `RootAssociation` records.

The contract should expose only the information another context genuinely needs.

## Domain Events and Pub-Sub

When a context has completed an operation and other parts of Atlas may care about the result, it can publish a **domain event**.

For example:

```text
Graph changes Node 123
        |
        v
publishes NodeEdited
        |
        +------> Notifications
        |
        +------> Python analysis work
        |
        +------> cache invalidation
        |
        +------> audit/history reactions
```

The Graph context does not need to know which subscribers exist. It simply announces the meaningful fact that a Node was edited.

Potential events might include:

```text
NodeCreated
NodeEdited
NodeWithdrawn
RelationshipCreated
VoteCast
ProfileFollowed
```

This is the **Observer / Publish-Subscribe** idea applied to domain behavior.

Initially, events may be delivered in-process. If Atlas later introduces background workers, queues, or separate services, the same conceptual event boundaries can move onto asynchronous infrastructure without redesigning the domain concepts that produced them.

## Dependency Rule

A bounded context should **not** routinely reach into another context's internals.

Avoid structures like:

```text
VotingService
   -> Graph.NodeRepository
   -> Graph.NodeRelationshipRepository
   -> directly changes Graph persistence
```

Prefer:

```text
Voting
   -> Graph contract

Graph
   -> publishes events

Notifications
   -> subscribes to relevant events
```

This protects each context's rules and makes it possible to change one domain's implementation without causing changes throughout the application.

Cross-context contracts should use stable identifiers and purpose-built DTOs/contracts rather than exposing entire internal aggregate objects by default.

## Namespaces and Physical Separation

The rewrite can begin as a **modular monolith** rather than a collection of microservices.

For example:

```text
Atlas.Graph
Atlas.Voting
Atlas.Profiles
Atlas.Notifications
Atlas.Moderation
```

All of these namespaces may run inside the same ASP.NET Core application and deploy together.

The bounded-context boundaries remain valuable because they organize dependencies and ownership even when the physical runtime is shared.

If a context later benefits from independent deployment, the existing contracts can make extraction easier.

For example, Notifications might become a background worker, while the Python analysis component is already expected to exist as a separate service.

## Relationship to Aggregates

A bounded context is larger than an aggregate.

Conceptually:

```text
Bounded Context
    |
    +---- Aggregate
    |       |
    |       +---- aggregate root
    |       +---- related entities/value objects
    |
    +---- another Aggregate
    |
    +---- services, repositories, events, etc.
```

Atlas should not create one giant `Graph` object containing every Node.

A more likely direction is to use smaller aggregate/consistency boundaries such as a Node and the state that must change consistently with that Node, while application services coordinate operations involving multiple Nodes or relationships.

The exact aggregate boundaries still need to be designed separately.

## Initial Atlas Contexts

The current planning structure suggests at least these bounded contexts or closely related modules. Each context below links to its corresponding planning documentation so this architecture map can also act as a navigation page.

### [Graph / Content](../graph/README.md)

Owns the core Atlas graph concepts, including Nodes, Node relationships, requested child types, emergent semantic vocabulary, root associations, Context-based root placement, traversal behavior, and Node persistence/versioning.

Related planning: [Graph and Content Model](../graph/README.md)

### [Voting](../voting/README.md)

Owns votes and voting-specific rules. Ranking/scoring algorithms may use Strategy implementations and may consume Graph identifiers/contracts without owning Graph internals.

Related planning: [Voting](../voting/README.md)

### [Profiles / Identity](../profiles-and-identity/README.md)

Owns user/profile behavior, identity-facing rules, profile metadata, and relationships between users and their profile Contexts.

Related planning: [Profiles and Identity](../profiles-and-identity/README.md)

### [Notifications](../notifications/README.md)

Owns notification records, delivery preferences, notification lifecycle, and notification-provider adapters. It primarily reacts to events emitted by other contexts.

Related planning: [Notifications](../notifications/README.md)

### [Moderation](../moderation/README.md)

Owns reporting, moderation workflow, governance actions, and moderation-specific state rather than embedding those rules into the Node model.

Related planning: [Moderation](../moderation/README.md)

### [Analysis Service Boundary](application-architecture.md)

The Python analysis service is a separate runtime/service boundary rather than simply another C# folder. It can perform graph analysis, embeddings, semantic similarity, clustering, recommendation, and AI workloads through explicit service contracts and/or queued events/jobs.

Related planning: [Application Architecture](application-architecture.md) and [Technology Stack](technology-stack.md)

## Open Decisions

- [ ] Decide whether each bounded context begins as folders/namespaces within one C# project or as separate .NET projects within the same solution.
- [ ] Define the first public contract/API exposed by the Graph context.
- [ ] Define the first set of domain events needed for the rewrite milestone.
- [ ] Decide how in-process events are dispatched initially.
- [ ] Decide where transaction boundaries sit when an operation produces a domain event.
- [ ] Define which concepts belong in a truly shared kernel, if any. Keep this area intentionally small.
- [ ] Define aggregate boundaries inside the Graph context.
- [ ] Revisit context boundaries if implementation reveals that two planned contexts actually share one inseparable model or that one context needs to be split further.
