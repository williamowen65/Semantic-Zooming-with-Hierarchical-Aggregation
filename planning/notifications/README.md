# Notifications

## Table of Contents

- [Domain Model / UML](domain-model-and-uml.md)
- [Behavioral Rules](behavioral-rules.md)
- [Persistence](persistence.md)
- [Permissions and Ownership](permissions-and-ownership.md)
- [Key Flows](key-flows.md)
- [Open Decisions](open-decisions.md)
- [Next Planning Actions](#next-planning-actions)

## Purpose

Plan notifications as a separate bounded context so Atlas domains can announce that something happened without knowing how a user will ultimately be notified.

## Current Direction

The main architectural idea is:

```text
Domain action
    |
    v
Domain event
    |
    +----> Notification subscriber / handler
    +----> Other subscribers as needed
```

For example, the graph domain may publish `NodeEdited` without knowing whether that eventually becomes an in-app notification, email, push notification, or no user-facing notification at all.

This area is intentionally early-stage. The domain-event, Observer / Publish-Subscribe, and Adapter concepts are the main design direction recorded so far.

## Next Planning Actions

The next planning pass should turn the event/subscriber direction into concrete notification behavior.

- **Define notification and preference entities:** update [Domain Model / UML](domain-model-and-uml.md) with the notification record, recipient reference, delivery/read state, and preference concepts that actually need to persist.
- **Define recipient and grouping rules:** use [Behavioral Rules](behavioral-rules.md) to decide which events create notifications for whom, when similar events are grouped, and when a notification should be suppressed.
- **Define durable delivery state:** specify persistence for notification records, delivery attempts, idempotency, and retry information in [Persistence](persistence.md).
- **Define user control:** use [Permissions and Ownership](permissions-and-ownership.md) to decide who can view, dismiss, mark read, or change delivery preferences.
- **Sketch event-to-delivery flows:** document in-app and external-provider flows in [Key Flows](key-flows.md), then settle remaining retry, preference, and milestone questions in [Open Decisions](open-decisions.md).
