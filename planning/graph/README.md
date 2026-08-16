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

These are the main actions currently needed to move Graph planning beyond its current ~80% coverage and closer to implementation-ready planning. Completed decisions should be removed from this list rather than left here as stale work.

- **Finish the remaining authorization edge cases:** the main ownership and relationship-permission direction is now established. Use [Questions to Resolve — Ownership and authorization](permissions-and-ownership.md#ownership-and-authorization) to settle the narrower remaining questions: requested-child-type authority, future collaborators/stewards, moderator/community authority scope, ownership/audit history, and which elevated facts Graph obtains from other bounded contexts.
- **Choose Graph abuse and traversal safeguards:** use [Questions to Resolve — Relationship and graph-abuse protection](permissions-and-ownership.md#relationship-and-graph-abuse-protection) to decide practical fan-out/rate limits, traversal depth and result-size limits, and precise behavior when cycles are encountered. Relationship creation is generally open to users; the remaining work is making that flexibility computationally safe.
- **Define concurrent-edit and post-withdrawal behavior:** use [Questions to Resolve — Concurrency and history](permissions-and-ownership.md#concurrency-and-history) to choose the optimistic-concurrency/version mechanism, conflict UX, historical visibility after withdrawal, and exceptional moderation/redaction rules.
- **Finish content-input security rules:** use [Questions to Resolve — Content security](permissions-and-ownership.md#content-security) to choose length/shape limits and the supported formatting/sanitization model for user-generated Node and relationship content.
- **Settle event and cache security details:** use [Questions to Resolve — Events and caching](permissions-and-ownership.md#events-and-caching) to decide persisted-operation/event consistency, minimal event payloads, viewer/context-sensitive caching, and where authorization is re-evaluated for cached reads.
- **Close persistence decisions:** work through [Open Questions](persistence-model.md#open-questions), including any remaining relationship representation, version-history storage, cache invalidation, indexing, and lifecycle details not already settled by the permission model.
- **Reconcile the consolidated Graph decision list:** use [Open Decisions](open-decisions.md) as a final consistency pass so decisions made in permissions, persistence, behavior, and flows are reflected across the Graph planning set and obsolete questions are removed.
