# Architecture

## Table of Contents

- [Application Architecture](application-architecture.md)
- [Codebase Structure and Bounded Contexts](codebase-structure-and-bounded-contexts.md)
- [Client-Code Use-Case Sketches](client-code-use-case-sketches.md)
- [Technology Stack](technology-stack.md)
- [Infrastructure and Deployment](infrastructure-and-deployment.md)
- [Next Planning Actions](#next-planning-actions)

## Scope

This area covers runtime component boundaries and implementation choices rather than Atlas domain semantics. Current planning includes an ASP.NET Core / C# application as the authoritative application layer and a separate Python analysis service for graph, semantic, and AI workloads.

Client-code use-case sketches are also used during architecture planning to model each bounded context from the caller's point of view before detailed implementation. They help test whether the intended contracts remain readable and encapsulated.

## Next Planning Actions

The next architecture pass should close the remaining cross-cutting decisions that affect how the bounded contexts run and communicate.

- **Choose event dispatch and transaction behavior:** work through [Open Decisions](codebase-structure-and-bounded-contexts.md#open-decisions), especially how in-process domain events are dispatched, when durable messaging is needed, and where transaction boundaries sit when an operation emits an event.
- **Define the C# ↔ Python service contract:** update [Application Architecture](application-architecture.md) with which workloads are synchronous requests versus asynchronous jobs/events, what data crosses the boundary, and how failures/timeouts are handled.
- **Finalize deployment/runtime topology:** use [Infrastructure and Deployment](infrastructure-and-deployment.md) to decide how the ASP.NET application, Python analysis service, database, cache, and any workers are deployed and networked.
- **Keep contracts grounded in caller needs:** use [Client-Code Use-Case Sketches](client-code-use-case-sketches.md) as the check that bounded-context APIs remain small and readable rather than exposing persistence or infrastructure details.
