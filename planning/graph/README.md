# Graph and Content Model

## Table of Contents

- [Domain Model and UML](domain-model-and-uml.md)
- [Core Behavior Specification](core-behavior-spec.md)
- [Persistence Model](persistence-model.md)
- [Permissions and Ownership](permissions-and-ownership.md)
- [Request and Navigation Flows](request-flows.md)
- [Open Decisions](open-decisions.md)
- [Next Planning Actions](#next-planning-actions)

## Scope

This is the core Atlas graph/content bounded context. It defines the generic Node model, emergent semantic types, requested child types, parent/child relationships, multi-parent convergence, roots, traversal behavior, and persistence concerns that are structurally unique to Atlas.

Other concerns such as voting, profiles, moderation, and infrastructure belong in their own planning areas even when they reference Nodes.

## Next Planning Actions

These are the main actions currently needed to move Graph planning closer to implementation-ready coverage.

- **Resolve authorization and relationship permissions:** work through [Questions to Resolve](permissions-and-ownership.md#questions-to-resolve), especially who may edit, withdraw, connect, disconnect, or change requested child types once other users or contexts depend on a Node.
- **Resolve Graph-specific security behavior:** use the security-related sections and open questions in [Permissions and Ownership](permissions-and-ownership.md) to choose concrete approaches for object-level authorization, graph/resource abuse, concurrent edits, visibility after withdrawal, event integrity, and authorization-aware caching.
- **Close persistence decisions:** work through [Open Questions](persistence-model.md#open-questions), including relationship persistence details, version-history representation, cache invalidation, and remaining lifecycle rules.
- **Reconcile remaining Graph questions:** use [Open Decisions](open-decisions.md) as the consolidated check that decisions made elsewhere are reflected consistently across the Graph model.
