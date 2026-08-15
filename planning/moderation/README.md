# Moderation

This domain covers moderation, reporting, abuse handling, content governance, and the effect of moderation on shared graph content and user-created vocabulary.

## Table of Contents

- [Domain Model and UML](domain-model-and-uml.md)
- [Behavioral Rules](behavioral-rules.md)
- [Persistence Model](persistence-model.md)
- [Permissions and Ownership](permissions-and-ownership.md)
- [Key Flows](key-flows.md)
- [Open Decisions](open-decisions.md)
- [Next Planning Actions](#next-planning-actions)

## Next Planning Actions

Moderation is still mostly a scaffold, so the next pass should establish its authority model and how moderation changes interact with shared Graph content.

- **Define moderation entities/states:** update [Domain Model and UML](domain-model-and-uml.md) with reports, moderation cases/actions, status transitions, and the identifiers needed to reference users, Nodes, relationships, or contexts without owning them.
- **Define governance behavior:** document what moderation actions exist and what they mean in [Behavioral Rules](behavioral-rules.md), especially removal/redaction versus ordinary author withdrawal.
- **Define authority:** use [Permissions and Ownership](permissions-and-ownership.md) to decide who can moderate what, how community/organization authority is represented, and what authority facts Graph can ask for through a contract.
- **Preserve auditability:** specify durable moderation records and audit history in [Persistence Model](persistence-model.md).
- **Model report-to-resolution flows:** add representative report/review/action/appeal or restoration flows in [Key Flows](key-flows.md), then track unresolved governance choices in [Open Decisions](open-decisions.md).
