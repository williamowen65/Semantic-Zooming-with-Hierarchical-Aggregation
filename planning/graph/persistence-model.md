# 03 — Persistence Model

## Table of Contents
- [Purpose](#purpose)
- [Node Persistence Shape](#node-persistence-shape)
- [Conceptual Tables](#conceptual-tables)
- [Repository Pattern](#repository-pattern)
- [Caching with a Repository Decorator](#caching-with-a-repository-decorator)
- [Node Version History](#node-version-history)
- [Graph Storage](#graph-storage)
- [Root Associations](#root-associations)
- [Deletion and Withdrawal](#deletion-and-withdrawal)
- [Indexes and Queries](#indexes-and-queries)
- [Open Questions](#open-questions)

## Purpose
Translate the conceptual recursive Node model into a durable database design while keeping persistence concerns outside the Node domain object itself.

## Node Persistence Shape

The core Node persistence model should remain intentionally simple and should closely reflect the domain model. Database-generated identity fields such as the primary key can be added by persistence without changing the conceptual meaning of the Node.

Methods and application behavior that belong to the Node class do not need to be represented as stored data unless they introduce actual persistent state.

## Conceptual Tables
Potential starting points:

```text
Node
NodeRelationship / ParentChild
RequestedChildType
NodeVersion
RootAssociation
User
Vote
```

These are candidates, not final schema decisions.

## Repository Pattern

Use a **Repository pattern** as the primary abstraction between application/domain code and database access.

Conceptually:

```text
Application / Domain Services
          |
          v
     INodeRepository
          |
          v
Database implementation / ORM
          |
          v
       Database
```

The repository should expose operations that are meaningful to Atlas rather than becoming a generic `Repository<T>` abstraction merely wrapping every ORM method.

Potential benefits include:

- isolating database and ORM details from application/domain logic;
- providing one place for Node-specific queries and traversal-oriented persistence operations;
- making tests easier by substituting a fake or in-memory repository;
- allowing the persistence implementation to evolve without spreading database code throughout the application;
- providing a stable seam for caching and other persistence-layer concerns;
- centralizing transaction-aware storage behavior where appropriate.

Caching is an important motivation for this abstraction, but it is not the only benefit.

## Caching with a Repository Decorator

Caching should remain outside the Node itself. A **Decorator pattern** can wrap the database-backed repository while preserving the same interface:

```text
                 INodeRepository
                       ^
                       |
              CachedNodeRepository
                       |
                       v
             DatabaseNodeRepository
                       |
                       v
                    Database
```

The application depends only on `INodeRepository`.

A cached repository can:

1. check cache for a requested Node or query result;
2. fall through to the database repository on a miss;
3. cache eligible results;
4. invalidate or update relevant cache entries after writes.

This allows caching policy to change without making caching part of the Node domain object or requiring application services to know whether a result came from cache or the database.

The exact cache technology and invalidation policy remain implementation decisions.

## Node Version History

Users should be able to edit Nodes, but edits should not erase the historical record. Atlas should retain an accessible version history so people can inspect what changed and when.

A likely persistence concept is a first-class `NodeVersion` / revision record rather than relying only on application logs.

Conceptually:

```text
Node
  id
  current state ...

NodeVersion
  id
  nodeId
  revisionNumber
  editedByUserId
  changedAt
  title / description / type / other versioned fields
  optional edit summary or metadata
```

The exact representation can be either full historical snapshots or another versioning approach, but the system should support these product requirements:

- the current Node is fast and straightforward to retrieve;
- previous versions remain durable;
- version history is visible to users who are permitted to view the Node;
- each revision can identify when it occurred and, when appropriate, who made it;
- editing a Node does not silently rewrite history.

Whether requested child types and relationship changes belong in the Node revision history or require their own histories is still open.

## Graph Storage

Most of the graph persistence shape is now conceptually straightforward.

- [x] **Nodes are stored as ordinary relational rows whose fields closely mirror the Node data model.** Database-generated identity fields such as `id` are persistence concerns rather than separate domain concepts.
- [x] **Parent/child edges are stored as explicit `NodeRelationship` records.** The edge stores the relationship between an existing parent Node and an existing child Node rather than embedding parent state inside the child.
- [x] **Cross-branch/shared-node relationships use the same `NodeRelationship` representation.** There is not a second special storage model for cross-branch relationships.
- [x] **A Node may have many parents.** Multiple `NodeRelationship` rows can point to the same child Node, allowing two, three, or potentially many graph routes to converge on one underlying Node identity.
- [x] **Requested child types are persisted as part of the Node's configuration/state.** They describe the types that Node is actively soliciting rather than defining a globally fixed ontology.
- [x] **A Node's own semantic `type` is user-defined vocabulary.** Contributors can use an existing requested or known type, or define a new type in context.
- [x] **Semantic type values should be indexed for lookup/search.** The vocabulary does not currently need a separate normalized ontology table merely in order to be searchable.
- [x] **Root entry points use a generalized `RootAssociation` table.** A root is contextual metadata pointing to an ordinary Node, not a special `RootNode` class.
- [x] Define the default deletion model at a conceptual level: preserve graph integrity and contribution history through soft deletion/withdrawal once other content depends on a Node.

The important distinction is that a multi-parent Node is still an ordinary Node. Multi-parent behavior emerges from the number of incoming `NodeRelationship` records rather than from a special subclass or extra parent array stored directly on the Node row.

Conceptually:

```text
Node A -----\
Node B ------\
Node C -------> Shared Node
Node D ------/
```

The database represents that shape as several relationship records with the same child Node identifier.

## Root Associations

Atlas expects root Nodes to appear in several kinds of contexts, not only user profiles and the public Atlas. Future contexts may include communities, organizations, projects, collections, or other groupings.

Because the set of root contexts is expected to expand, use one generalized polymorphic association table rather than creating a separate `ProfileRoot`, `OrganizationRoot`, `CommunityRoot`, and similar table for every new context.

Conceptually:

```text
RootAssociation
- id
- nodeId
- contextType
- contextId
```

Example data:

```text
id | nodeId | contextType  | contextId
---+--------+--------------+----------
1  | 101    | profile      | 42
2  | 205    | profile      | 42
3  | 101    | public       | NULL
4  | 310    | organization | 7
5  | 205    | community    | 19
```

This means:

```text
Node 101
- is a root on Profile 42
- is also a public Atlas root

Node 205
- is a root on Profile 42
- is also a root for Community 19

Node 310
- is a root for Organization 7
```

The Node itself does **not** need fields such as `isProfileRoot`, `isPublicRoot`, or a list of root contexts. Root placement is derived by combining:

```text
nodeId + contextType + contextId
```

The three values together answer the practical question: **which Node should be exposed as an entry point, and in which context should it appear?**

Typical lookups become straightforward:

```text
All roots for Profile 42:
WHERE contextType = 'profile'
  AND contextId = 42

All roots for Organization 7:
WHERE contextType = 'organization'
  AND contextId = 7

All public Atlas roots:
WHERE contextType = 'public'
```

A single Node can have any number of `RootAssociation` records, so the same underlying content can legitimately be an entry point in several contexts without duplication.

### Why use the generalized table?

The main reason is extensibility. Atlas is expected to grow beyond profiles and public roots into additional contexts such as communities and organizations. A generalized table allows new root contexts to be introduced without creating a new association table and persistence model every time.

The tradeoff is weaker conventional foreign-key enforcement for `contextId`. The meaning of `contextId` depends on `contextType`: for example, `42` may identify a Profile when the type is `profile`, while `7` may identify an Organization when the type is `organization`.

Because a single SQL foreign key cannot directly point one column at several possible context tables, the application/repository layer must validate that:

- the `contextType` is supported;
- the corresponding context exists when a `contextId` is required;
- the user is authorized to expose the Node in that context;
- duplicate root associations are prevented where appropriate.

This is a deliberate tradeoff: Atlas accepts some application-level validation in exchange for an extensible root-context model that does not require a schema migration and new association entity for every future context type.

Indexes should support at least `(contextType, contextId)` for retrieving a context's roots and `nodeId` for finding every context in which a Node is exposed as a root.

## Deletion and Withdrawal

Deletion should distinguish between two different user intentions:

1. **The author no longer wants this visible as their post.**
2. **The underlying Node should cease to exist in the graph.**

Those are not always the same operation in a collaborative system.

### Current preferred behavior

If a Node has no dependent contributions or important relationships, a true hard delete may be acceptable.

Once other people have contributed children, relationships, votes, or other dependent content, deleting the underlying Node outright can destroy context for work that belongs to other participants. In that case Atlas should prefer a **soft delete / withdrawal** model.

A withdrawn Node should remain in persistent storage so that:

- graph relationships do not break;
- descendant and related contributions retain their context;
- version history remains inspectable;
- audit/moderation history can remain intact;
- references to the Node do not silently point at nothing.

The user-facing presentation can hide the original contribution or replace it with a marker such as:

```text
This node was withdrawn by its author.
```

The exact wording and which metadata remains visible are product/moderation decisions.

### Hard delete versus soft delete

A reasonable default rule to investigate is:

```text
No dependent community content
        -> hard delete may be allowed

Dependent children / relationships / votes / history
        -> soft delete / withdraw
```

Moderation may require stronger deletion or content-redaction powers for legal, privacy, abuse, or safety reasons. Those cases should be designed in the moderation domain rather than making ordinary author deletion responsible for every removal scenario.

Withdrawal itself should be recorded as part of the durable history so the Node does not simply disappear from the historical record.

## Indexes and Queries
- [ ] Identify common hierarchy traversal queries.
- [ ] Identify graph lookup queries.
- [ ] Identify indexes needed for parent, child, type, owner, and visibility lookups.
- [x] Index semantic Node `type` values so the emergent vocabulary remains searchable.
- [x] Index `RootAssociation(contextType, contextId)` for retrieving roots by context.
- [x] Index `RootAssociation.nodeId` for finding all root contexts associated with a Node.
- [ ] Consider how analysis results from Python are stored or cached.
- [ ] Identify which repository reads are safe and valuable to cache.
- [ ] Define cache invalidation requirements around Node edits, relationship changes, and version creation.

## Open Questions
- [ ] PostgreSQL or another relational database?
- [ ] Exact schema for `NodeRelationship` and whether relationship vocabulary needs any separate indexing/normalization.
- [x] Exact persistence model for profile/public/future root associations: **use `RootAssociation(id, nodeId, contextType, contextId)` so root status remains contextual and extensible.**
- [ ] Decide whether the global `public` context uses a nullable `contextId`, a dedicated public-context identifier, or another small convention.
- [ ] Snapshot-based Node versions or another revision representation?
- [ ] Which Node-related changes are versioned together versus separately?
- [ ] Exact hard-delete eligibility rules before Atlas requires withdrawal instead.
- [ ] What data remains visible after an author withdraws a Node?
- [ ] What cache technology and invalidation strategy should back `CachedNodeRepository`?