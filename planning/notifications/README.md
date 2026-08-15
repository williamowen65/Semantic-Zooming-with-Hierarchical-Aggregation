# Notifications

## Table of Contents

- [Domain Model / UML](domain-model-and-uml.md)
- [Behavioral Rules](behavioral-rules.md)
- [Persistence](persistence.md)
- [Permissions and Ownership](permissions-and-ownership.md)
- [Key Flows](key-flows.md)
- [Open Decisions](open-decisions.md)

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
