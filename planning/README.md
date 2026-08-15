# Atlas Rewrite Planning

This folder is the planning workspace for the Atlas rewrite. Planning is organized by **domain area / bounded context** rather than forcing every feature into the graph model.

## Table of Contents

- [Graph and Content Model](graph/README.md)
- [Voting](voting/README.md)
- [Profiles and Identity](profiles-and-identity/README.md)
- [Moderation](moderation/README.md)
- [Architecture](architecture/README.md)
- [Security](security/README.md)
- [Product Experience](product-experience/README.md)
- [Rewrite Execution](rewrite/README.md)

## Minimum design package for a domain area

A substantive domain area should eventually contain, at minimum:

1. **Domain model / UML** — what objects exist and how they relate.
2. **Behavioral rules** — invariants and behavior that should remain true regardless of implementation.
3. **Persistence shape** — how the conceptual model maps to stored state.
4. **Permissions / ownership** — who is allowed to create, change, remove, or otherwise affect the domain objects.
5. **Key flows** — a few end-to-end operations that show how the domain behaves in practice.
6. **Open decisions** — unresolved questions and a record of decisions as they are settled.

A domain can have placeholder files before its design is complete. The point is to make missing decisions visible rather than pretending they have already been made.

Cross-cutting areas such as architecture, security, product experience, and rewrite execution do not have to use these exact six documents; they should use analogous planning artifacts appropriate to their responsibilities.
