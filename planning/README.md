# Atlas Rewrite Planning

This folder is the planning workspace for the Atlas rewrite. Planning is organized by **domain area / bounded context** rather than forcing every feature into the graph model.

## Table of Contents

- [Planning Coverage Dashboard](#planning-coverage-dashboard)
- [How to Read the Dashboard](#how-to-read-the-dashboard)
- [How Coverage Is Scored](#how-coverage-is-scored)
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

Each dashboard **Area** link and **Next planning** link goes directly to that area's `Next Planning Actions` section. From there, the action list explains what should be worked through to raise coverage and links more deeply into the exact working documents.

| Area | Coverage | Status | Current read / next planning |
|---|---:|:---:|---|
| [Graph and Content Model](graph/README.md#next-planning-actions) | ~80% | 🟢 | Most-developed domain. Core Node model, emergent ontology, requested child types, relationships, multi-parent convergence, repository/caching direction, version history, navigation, permission boundaries, and the broader Graph security surface have been explored. Authorization and relationship-permission rules now have substantial concrete direction, including ownership transfer, relationship removal authority, optional approval states, and cycle handling. **Next planning:** [resolve the remaining Graph security, concurrency, visibility, persistence, event, cache, and model decisions](graph/README.md#next-planning-actions). |
| [Voting](voting/README.md#next-planning-actions) | ~20% | 🔴 | Strategy-pattern direction exists for scoring/ranking, but the meaning of votes, scoring rules, persistence, abuse handling, and flows remain sparse. **Next planning:** [define the voting model, behavior, storage, permissions, and core flows](voting/README.md#next-planning-actions). |
| [Profiles and Identity](profiles-and-identity/README.md#next-planning-actions) | ~20% | 🔴 | Multiple profile roots and contextual root status are known. Ownership, identity rules, privacy, and profile behavior need substantial design. **Next planning:** [define the identity/profile model, authority boundaries, persistence, and key flows](profiles-and-identity/README.md#next-planning-actions). |
| [Moderation](moderation/README.md#next-planning-actions) | ~10% | 🔴 | Mostly a planning scaffold. Governance, moderation states, authority, reporting, auditability, and shared-node consequences remain open. **Next planning:** [define moderation entities, authority, governance behavior, auditability, and resolution flows](moderation/README.md#next-planning-actions). |
| [Notifications](notifications/README.md#next-planning-actions) | ~30% | 🟡 | Initial domain model, domain events, Observer/Publish-Subscribe, delivery adapters, key flows, and persistence questions are documented. **Next planning:** [define recipients, preferences, grouping, durable delivery/retry behavior, and event-to-notification flows](notifications/README.md#next-planning-actions). |
| [Architecture](architecture/README.md#next-planning-actions) | ~65% | 🟢 | Modular bounded contexts, contracts/events, per-context DbContexts over shared SQL, client-code sketches, Graph permission-boundary interaction, and Graph query/command/event direction are established. **Next planning:** [settle event/transaction behavior, the C# ↔ Python contract, deployment topology, and contract readability](architecture/README.md#next-planning-actions). |
| [Security](security/README.md#next-planning-actions) | ~20% | 🔴 | Important concerns are identified, but concrete authorization, validation, service security, threat modeling, and abuse protections need deeper design. **Next planning:** [define trust boundaries, authorization responsibilities, input/output protections, service security, and abuse controls](security/README.md#next-planning-actions). |
| [Product Experience](product-experience/README.md#next-planning-actions) | ~35% | 🟡 | The prototype produced substantial interaction knowledge, but it has not yet been systematically converted into rewrite-oriented screen and behavior specifications. **Next planning:** [turn prototype lessons into explicit screens, interaction rules, and bounded-context use cases](product-experience/README.md#next-planning-actions). |
| [Rewrite Execution](rewrite/README.md#next-planning-actions) | ~35% | 🟡 | Clean-rewrite strategy, old-code salvage, test review, and minimum-milestone thinking exist. **Next planning:** [decide what to salvage, classify tests, finalize the first vertical slice, and order implementation dependencies](rewrite/README.md#next-planning-actions). |

### Current focus signal

**Most documented:** 🟢 Graph and Content Model

**Developed architecture direction:** 🟢 Architecture

**Partially explored:** 🟡 Product Experience, Rewrite Execution, Notifications

**Largest documentation gaps:** 🔴 Voting, Profiles and Identity, Moderation, Security

The percentages should be updated as planning conversations produce concrete decisions, diagrams, rules, flows, or persistence designs. Simply creating placeholder files should **not** materially increase coverage.

## How to Read the Dashboard

- 🟢 **Developed** — substantial design work exists and the area is becoming coherent. This does not mean finished.
- 🟡 **In progress** — meaningful ideas exist, but important pieces are still undocumented or unresolved.
- 🔴 **Early / sparse** — mostly placeholders, initial context, or unanswered questions.
- ⚪ **Not started** — recognized as relevant but essentially no design work has been done yet.
- ❓ **Unclear / needs reconsideration** — planning exists, but assumptions conflict or the direction itself needs to be revisited.

The percentage measures **planning coverage**, not implementation progress, confidence, quality, or feature completeness. An 80% area can still contain major unresolved decisions; it simply means considerably more of its design surface has been examined and recorded than a 10% area.

## How Coverage Is Scored

Coverage measures how much of an area's relevant **design surface has been deliberately discovered, examined, and documented**. It is not calculated by dividing checked boxes by total boxes.

A useful progression is:

```text
Undiscovered concern
        -> little or no coverage

Concern identified and documented
        -> partial coverage

Design direction established
        -> substantial coverage

Concrete decisions made and interactions understood
        -> high coverage

Coherent enough to implement without major conceptual unknowns
        -> very high coverage
```

### Discovering new questions is progress

Good planning often reveals additional questions. Identifying a previously invisible concern—such as concurrency, graph-traversal abuse, event integrity, or authorization-aware caching—**increases planning coverage** because that part of the design surface is now understood well enough to investigate deliberately.

Unchecked questions therefore do not automatically lower a percentage. They make the remaining design work visible.

For example:

```text
Before:
Graph security concern is not recognized at all

After:
Concern is identified, its boundary is understood,
and concrete questions are recorded

Result:
Planning coverage increased even though there are now
more visible unchecked questions.
```

### When coverage can decrease

Coverage may legitimately decrease when new information shows that an earlier assumption, model, or architectural direction was materially wrong and a significant portion of the existing planning must be reconsidered.

For example, discovering an edge case that still fits the current model should not reduce coverage. Discovering that the core model cannot represent a required behavior and needs substantial redesign may reduce the estimate until that design surface is understood again.

The dashboard should therefore reward **better understanding**, not fewer questions. The goal is to make uncertainty visible and resolve the important parts before implementation, rather than creating an incentive to avoid discovering complexity.

Percentages remain intentionally approximate and should generally move in meaningful increments rather than changing for every small note or checkbox.

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
