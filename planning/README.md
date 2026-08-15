# Atlas Rewrite Planning

This folder is the planning workspace for the Atlas rewrite. Planning is organized by **domain area / bounded context** rather than forcing every feature into the graph model or requiring every area to have the same set of documents.

## Table of Contents

- [Graph and Content Model](graph/README.md) — Nodes, emergent types, requested child types, relationships, multi-parent structure, traversal, and persistence of the core graph.
- [Voting](voting/README.md) — Voting and scoring behavior. Placeholder until this domain is explored in detail.
- [Profiles and Identity](profiles-and-identity/README.md) — Users, profiles, ownership, roots shown on profiles, and identity-related domain rules.
- [Moderation](moderation/README.md) — Moderation, abuse handling, content governance, and related workflows.
- [Architecture](architecture/README.md) — Application boundaries, C# / Python responsibilities, technology stack, and infrastructure.
- [Security](security/README.md) — Cross-cutting authorization, validation, application security, and service-to-service security.
- [Product Experience](product-experience/README.md) — Pages, screens, and user-facing application surfaces.
- [Rewrite Execution](rewrite/README.md) — Old-code salvage, test-suite review, and minimum rewrite milestones.

## How to use this planning structure

Not every area needs the same number of documents. The graph/content model is unusually central and complex, so it already has several focused planning documents. Other domains can begin with a single README and gain additional documents only when their rules become complex enough to justify them.

The goal is to keep each bounded context understandable on its own while making the top-level planning folder a map of the entire rewrite.
