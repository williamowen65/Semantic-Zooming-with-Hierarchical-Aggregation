# 12 — Minimum Rewrite Milestone

## Table of Contents
- [Purpose](#purpose)
- [Candidate Milestone](#candidate-milestone)
- [Explicitly Out of Scope](#explicitly-out-of-scope)
- [Ready-to-Start Check](#ready-to-start-check)

## Purpose
Define the smallest coherent new Atlas application so the rewrite does not immediately become a rebuild of every historical feature.

## Candidate Milestone

```text
Generic Node model
       +
Persistence
       +
Parent / child traversal
       +
Requested child types
       +
Generic Node view
       +
Multiple roots
       +
Tests for those behaviors
```

- [ ] Finalize exact milestone-one scope.
- [ ] Define acceptance criteria.
- [ ] Define the smallest useful end-to-end workflow.

## Explicitly Out of Scope
Unless required to validate the architecture, consider deferring:

- [ ] Advanced diagrams.
- [ ] AI analysis.
- [ ] Semantic similarity.
- [ ] Voting.
- [ ] Advanced discovery/ranking.
- [ ] Full moderation tooling.
- [ ] Production-scale infrastructure.

## Ready-to-Start Check
- [ ] What is a Node?
- [ ] How are Nodes connected?
- [ ] How does a Node solicit child types?
- [ ] How can unexpected types participate?
- [ ] How are roots represented?
- [ ] How is the graph persisted?
- [ ] Which old behaviors must survive?
- [ ] What does C# own?
- [ ] What will Python own?
- [ ] What are the security boundaries?
- [ ] What exactly constitutes milestone one?