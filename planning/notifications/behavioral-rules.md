# Notifications — Behavioral Rules

## Purpose

Define how Atlas reacts to noteworthy domain changes without requiring the originating domain to know notification details.

## Domain Events

A **domain event** is a record that something meaningful already happened in a domain.

Examples might include:

```text
NodeCreated
NodeEdited
NodeRelationshipCreated
VoteAdded
VoteChanged
UserMentioned
```

The domain responsible for the action publishes the event after the relevant state change succeeds.

The event should describe the fact that occurred. It should not contain instructions such as "send an email" because delivery policy belongs to the notifications domain.

## Observer / Publish-Subscribe

Notifications are a natural use of the **Observer** or **Publish-Subscribe** pattern.

Conceptually:

```text
Graph domain
    |
    | publishes NodeEdited
    v
Event dispatcher / bus
    |
    +----> Notification handler
    +----> Cache invalidation handler
    +----> Analysis-job handler
    +----> Future handlers
```

The producer does not need to know which subscribers exist.

A notification subscriber can decide whether the event matters to a particular user and what kind of notification should result.

This separation allows new reactions to be added later without modifying the code that performed the original domain operation.

## Rules to Define

- Which domain events are notification-worthy?
- Who should receive each event?
- Which events should be grouped or deduplicated?
- Which notifications are in-app only versus eligible for external delivery?
- When should notifications be delivered immediately versus asynchronously?
- How should retries behave when an external provider fails?
- How are notification preferences applied?
