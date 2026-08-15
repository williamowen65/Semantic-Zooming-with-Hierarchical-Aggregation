# Notifications — Key Flows

## Purpose

Sketch the end-to-end paths that connect domain events to user-facing notifications.

## Example: Node Edited

```text
User edits Node
      |
      v
Graph domain validates and persists edit
      |
      v
NodeEdited domain event is published
      |
      v
Notification subscriber evaluates recipients / preferences
      |
      +----> create in-app Notification
      |
      +----> queue eligible external delivery
                     |
                     v
             channel Adapter sends
```

The graph domain should not need to know whether anyone receives email, push, or another delivery type.

## Other Flows to Define

- Vote or response activity generates a notification.
- A user is mentioned or directly referenced.
- Multiple similar events are grouped into one notification.
- A user marks a notification read/unread.
- A delivery provider fails and a retry occurs.
- A user changes notification preferences.
- An event is received but no notification is warranted.
