# Notifications — Open Decisions

## Purpose

Track unresolved notification design questions explicitly.

## Open Decisions

- [ ] Which domain events exist in milestone one?
- [ ] Are domain events dispatched only in-process initially, or through durable messaging from the start?
- [ ] Which events create in-app notifications?
- [ ] Which events are eligible for email, push, or other adapters?
- [ ] How are user notification preferences modeled?
- [ ] How are repeated events grouped or deduplicated?
- [ ] What retry/idempotency guarantees are required for external delivery?
- [ ] Are domain events themselves persisted for replay/audit, or are they transient signals?
- [ ] Which notification functionality belongs in the first rewrite milestone versus later?
