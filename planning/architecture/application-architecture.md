# 04 — Application Architecture

## Table of Contents
- [Purpose](#purpose)
- [Current Direction](#current-direction)
- [C# Responsibilities](#c-responsibilities)
- [Python Responsibilities](#python-responsibilities)
- [Service Boundary](#service-boundary)
- [Domain Events](#domain-events)
- [Adapter Boundaries](#adapter-boundaries)
- [Asynchronous Analysis](#asynchronous-analysis)
- [Open Questions](#open-questions)

## Purpose
Define major runtime components and make ownership boundaries explicit.

## Current Direction

```text
Browser
   |
ASP.NET Core / C# application
   |
   +---- Database
   |
   +---- Background work / queue
   |
   +---- Python analysis service
             |
             +---- graph algorithms
             +---- embeddings
             +---- clustering
             +---- AI / semantic analysis
```

## C# Responsibilities
Likely authoritative application concerns: users, authentication, profiles, Node CRUD, permissions, transactions, public/private roots, APIs, and normal web behavior.

## Python Responsibilities
Potential analysis concerns: semantic similarity, embeddings, duplicate/overlap detection, related-node discovery, clustering, graph algorithms, summarization, AI-assisted vocabulary suggestions, and heavier analytical jobs.

## Service Boundary
The interface should be deliberately boring: stable identifiers, clear API contracts, structured payloads, and no shared in-process state. C# should request a capability/result without depending on how Python produces it.

## Domain Events

Domain events can provide a common way for one domain to announce a meaningful completed action without knowing which secondary systems care about it.

```text
Domain operation succeeds
        |
        v
Domain event published
        |
        +----> Notifications
        +----> Cache invalidation
        +----> Python analysis job
        +----> Audit / other future reactions
```

Examples include `NodeCreated`, `NodeEdited`, `RelationshipCreated`, or `VoteChanged`.

The originating domain should publish a fact about what happened, not directly invoke every downstream side effect. Subscribers can then decide how to react.

This can begin with in-process dispatch and evolve toward a queue/message bus if asynchronous or distributed processing requires it later.

## Adapter Boundaries

Use the **Adapter pattern** where Atlas talks to external providers whose APIs should not leak into core application logic.

Likely adapter boundaries include:

- notification channels/providers such as email or push;
- AI/model providers;
- object/file storage providers;
- cloud-specific service APIs where an internal application contract is useful;
- other third-party integrations added later.

Conceptually:

```text
Atlas application contract
          |
          v
        Adapter
          |
          v
External provider API
```

The goal is to make provider replacement or experimentation possible without rewriting the domain that uses the capability.

## Asynchronous Analysis
Analysis should generally not block ordinary Node creation or viewing. A likely flow is persistence first, optional queued analysis second, results available later.

Domain events may become a natural trigger for these jobs. For example, a successful `NodeEdited` event could be observed by an analysis subscriber that queues semantic re-analysis without making the Node-edit operation itself depend on Python finishing immediately.

## Open Questions
- [ ] Does Python exist in milestone one or arrive later?
- [ ] HTTP first, or is a queue required immediately?
- [ ] Where are analysis results persisted?
- [ ] How are service contracts versioned?
- [ ] Which domain events exist initially?
- [ ] When does event dispatch need to become durable messaging rather than in-process pub-sub?