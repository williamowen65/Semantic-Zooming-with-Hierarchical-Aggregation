# Atlas Rewrite Planning

This folder is the planning workspace for the Atlas rewrite. Planning is organized by **domain area / bounded context** rather than forcing every feature into the graph model.

## Table of Contents

- [Planning Coverage Dashboard](#planning-coverage-dashboard)
- [How to Read the Dashboard](#how-to-read-the-dashboard)
- [Graph and Content Model](graph/README.md)
- [Voting](voting/README.md)
- [Profiles and Identity](profiles-and-identity/README.md)
- [Moderation](moderation/README.md)
- [Notifications](notifications/README.md)
- [Architecture](architecture/README.md)
- [Security](security/README.md)
- [Product Experience](product-experience/README.md)
- [Rewrite Execution](rewrite/README.md)
- [Minimum Design Package for a Domain Area](#minimum-design-package-for-a-domain-area)
- [Client-Code Use-Case Sketches](#client-code-use-case-sketches)

## Planning Coverage Dashboard

This dashboard is a **documentation coverage / design-attention metric**, not a claim that an idea is correct, final, or implementation-ready. Percentages are intentionally approximate. They answer: **How much deliberate planning attention has this area received so far?**

| Area | Coverage | Status | Current read |
|---|---:|:---:|---|
| [Graph and Content Model](graph/README.md) | ~70% | 🟢 | Most-developed domain. Core Node model, emergent ontology, requested child types, relationships, multi-parent convergence, repository/caching direction, version-history requirements, and several navigation decisions have been explored. Some persistence and behavioral edge cases remain. |
| [Voting](voting/README.md) | ~20% | 🔴 | Recognized as a domain and now has a strategy-pattern seam for scoring/ranking, but the meaning of votes, scoring rules, persistence, abuse handling, and flows are mostly unexplored. |
| [Profiles and Identity](profiles-and-identity/README.md) | ~20% | 🔴 | Multiple profile roots and contextual root status are known. Ownership, identity rules, privacy, and profile behavior need substantial design. |
| [Moderation](moderation/README.md) | ~10% | 🔴 | Mostly a planning scaffold. Governance, moderation states, authority, reporting, auditability, and shared-node consequences remain open. |
| [Notifications](notifications/README.md) | ~30% | 🟡 | Initial domain model exists. Domain events, Observer/Publish-Subscribe, delivery adapters, key flows, and persistence questions are documented, but recipient rules, preferences, grouping, retry/idempotency, and milestone scope remain open. |
| [Architecture](architecture/README.md) | ~50% | 🟡 | Direction exists around ASP.NET Core/C#, a separate Python analysis service, domain events, adapter boundaries, and possible Terraform/cloud changes. Contracts, durable messaging, deployment, and operational details need refinement. |
| [Security](security/README.md) | ~20% | 🔴 | Important concerns have been identified, but the rewrite's concrete authorization, validation, service security, threat model, and abuse protections are not yet designed in depth. |
| [Product Experience](product-experience/README.md) | ~35% | 🟡 | The prototype produced substantial interaction knowledge, but it has not yet been systematically converted into rewrite-oriented screen and behavior specifications. |
| [Rewrite Execution](rewrite/README.md) | ~35% | 🟡 | Clean-rewrite strategy, old-code salvage, test review, and minimum-milestone thinking exist. Exact first milestone and migration/salvage decisions still need to be finalized. |

### Current focus signal

**Most documented:** 🟢 Graph and Content Model

**Partially explored:** 🟡 Architecture, Product Experience, Rewrite Execution, Notifications

**Largest documentation gaps:** 🔴 Voting, Profiles and Identity, Moderation, Security

The percentages should be updated as planning conversations produce concrete decisions, diagrams, rules, flows, or persistence designs. Simply creating placeholder files should **not** materially increase coverage.

## How to Read the Dashboard

- 🟢 **Developed** — substantial design work exists and the area is becoming coherent. This does not mean finished.
- 🟡 **In progress** — meaningful ideas exist, but important pieces are still undocumented or unresolved.
- 🔴 **Early / sparse** — mostly placeholders, initial context, or unanswered questions.
- ⚪ **Not started** — recognized as relevant but essentially no design work has been done yet.
- ❓ **Unclear / needs reconsideration** — planning exists, but assumptions conflict or the direction itself needs to be revisited.

The percentage measures **planning coverage**, not implementation progress, confidence, quality, or feature completeness. A 70% area can still contain major unresolved decisions; it simply means considerably more of its design surface has been examined and recorded than a 10% area.

## Minimum Design Package for a Domain Area

A substantive domain area should eventually contain, at minimum:

1. **Domain model / UML** — what objects exist and how they relate.
2. **Behavioral rules** — invariants and behavior that should remain true regardless of implementation.
3. **Persistence shape** — how the conceptual model maps to stored state.
4. **Permissions / ownership** — who is allowed to create, change, remove, or otherwise affect the domain objects.
5. **Key flows** — a few end-to-end operations that show how the domain behaves in practice.
6. **Open decisions** — unresolved questions and a record of decisions as they are settled.
7. **Client-code / use-case sketches** — small pseudocode examples, where useful, showing how a caller should interact with the domain's public/application surface without knowing its internal implementation.

A domain can have placeholder files before its design is complete. The point is to make missing decisions visible rather than pretending they have already been made.

Cross-cutting areas such as architecture, security, product experience, and rewrite execution do not have to use these exact seven documents; they should use analogous planning artifacts appropriate to their responsibilities.

## Client-Code Use-Case Sketches

As part of planning, Atlas should model important operations from the **client/caller's point of view** before detailed implementation. These sketches are intentionally short pseudocode rather than production code.

The question they answer is:

> If this bounded context were pleasant and obvious to use, what would the calling code look like?

This helps keep encapsulation visible during design. A caller should be able to express domain operations without understanding repository implementations, ORM details, caching, internal relationship machinery, or unrelated security plumbing.

For example, a Graph sketch might read conceptually:

```text
node = graph.createNode(actor, ...)
graph.connect(actor, parentNodeId, node.id, relationshipType)
children = graph.getChildren(node.id)
graph.editNode(actor, node.id, changes)
```

The sketches do not lock Atlas into exact method names or signatures. Instead, they serve as a readability and boundary test before implementation complexity is introduced.

Detailed guidance and examples are maintained in [Architecture — Client-Code Use-Case Sketches](architecture/client-code-use-case-sketches.md).
