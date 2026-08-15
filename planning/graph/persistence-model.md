# 03 — Persistence Model

## Table of Contents
- [Purpose](#purpose)
- [Node Persistence Shape](#node-persistence-shape)
- [Conceptual Tables](#conceptual-tables)
- [Repository Pattern](#repository-pattern)
- [Caching with a Repository Decorator](#caching-with-a-repository-decorator)
- [Node Version History](#node-version-history)
- [Graph Storage](#graph-storage)
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
User
ProfileRoot
PublicRoot
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
- [ ] Decide how Nodes are stored.
- [ ] Decide how parent/child edges are stored.
- [ ] Decide how cross-branch relationships are represented.
- [ ] Decide how requested child types are persisted.
- [ ] Decide whether vocabulary needs separate normalization/storage.
- [ ] Design profile-root and public-root associations.
- [ ] Define deletion and soft-deletion behavior.

## Indexes and Queries
- [ ] Identify common hierarchy traversal queries.
- [ ] Identify graph lookup queries.
- [ ] Identify indexes needed for parent, child, type, owner, and visibility lookups.
- [ ] Consider how analysis results from Python are stored or cached.
- [ ] Identify which repository reads are safe and valuable to cache.
- [ ] Define cache invalidation requirements around Node edits, relationship changes, and version creation.

## Open Questions
- [ ] Relational adjacency list, relationship table, or another graph representation?
- [ ] PostgreSQL or another database?
- [ ] Should semantic type strings be normalized or remain direct user-generated values?
- [ ] Snapshot-based Node versions or another revision representation?
- [ ] Which Node-related changes are versioned together versus separately?
- [ ] What cache technology and invalidation strategy should back `CachedNodeRepository`?