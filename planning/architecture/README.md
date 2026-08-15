# Architecture

## Table of Contents

- [Application Architecture](application-architecture.md)
- [Codebase Structure and Bounded Contexts](codebase-structure-and-bounded-contexts.md)
- [Client-Code Use-Case Sketches](client-code-use-case-sketches.md)
- [Technology Stack](technology-stack.md)
- [Infrastructure and Deployment](infrastructure-and-deployment.md)

## Scope

This area covers runtime component boundaries and implementation choices rather than Atlas domain semantics. Current planning includes an ASP.NET Core / C# application as the authoritative application layer and a separate Python analysis service for graph, semantic, and AI workloads.

Client-code use-case sketches are also used during architecture planning to model each bounded context from the caller's point of view before detailed implementation. They help test whether the intended contracts remain readable and encapsulated.
