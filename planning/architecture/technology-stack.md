# 10 — Technology Stack

## Table of Contents
- [Purpose](#purpose)
- [Current Direction](#current-direction)
- [Decision Criteria](#decision-criteria)
- [Decisions](#decisions)

## Purpose
Choose tools against concrete Atlas requirements rather than changing technology merely because a rewrite creates the opportunity.

## Current Direction
A strong candidate is ASP.NET Core/C# for the authoritative web application with a separate Python service for graph, AI, and analytical workloads.

## Decision Criteria
- [ ] Developer ergonomics.
- [ ] Type safety and maintainability.
- [ ] Database/ORM experience.
- [ ] Testing ergonomics.
- [ ] Authentication/authorization support.
- [ ] Background-job support.
- [ ] Deployment complexity.
- [ ] Observability.
- [ ] Graph/data/AI ecosystem.
- [ ] Ease of changing the domain model during continued exploration.

## Decisions
- [ ] Primary backend framework/language.
- [ ] Python analysis framework.
- [ ] Database.
- [ ] ORM/persistence tooling.
- [ ] Service-to-service contract technology.
- [ ] Background-job/queue technology, if needed initially.