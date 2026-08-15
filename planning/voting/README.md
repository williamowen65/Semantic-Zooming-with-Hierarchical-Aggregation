# Voting

Voting is its own domain concern rather than part of the Node class itself. The exact voting model has not yet been revisited for the rewrite, so these files intentionally begin as structured placeholders.

## Table of Contents

- [Domain Model and UML](domain-model-and-uml.md)
- [Behavioral Rules](behavioral-rules.md)
- [Persistence Model](persistence-model.md)
- [Permissions and Ownership](permissions-and-ownership.md)
- [Key Flows](key-flows.md)
- [Open Decisions](open-decisions.md)
- [Next Planning Actions](#next-planning-actions)

## Next Planning Actions

To raise Voting coverage, the next planning pass should turn the current placeholders into a concrete voting model.

- **Define what a vote means:** update [Domain Model and UML](domain-model-and-uml.md) and [Behavioral Rules](behavioral-rules.md) with the vote entity/value model, whether votes can change, and what invariants apply.
- **Choose scoring/ranking behavior:** document the initial scoring semantics and where Strategy-based ranking algorithms belong in [Behavioral Rules](behavioral-rules.md).
- **Define storage and uniqueness:** specify how votes are persisted, indexed, and constrained in [Persistence Model](persistence-model.md), including whether a user may have one active vote per target.
- **Resolve authority and abuse rules:** define who may vote, retract/change votes, and how obvious abuse is constrained in [Permissions and Ownership](permissions-and-ownership.md).
- **Sketch the main flows:** document cast/change/remove/read-score scenarios in [Key Flows](key-flows.md), then collect anything unresolved in [Open Decisions](open-decisions.md).
