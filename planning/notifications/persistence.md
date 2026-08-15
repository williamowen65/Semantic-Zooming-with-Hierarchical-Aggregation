# Notifications — Persistence

## Purpose

Define what notification state must be durable and what can remain transient infrastructure behavior.

## Likely Stored State

Potential records include:

```text
Notification
NotificationDelivery
NotificationPreference
```

A durable Notification record may track the recipient, source event, created time, read/unread state, and enough metadata to render the notification.

A NotificationDelivery record may track attempts through external channels, provider identifiers, delivery status, retry information, and timestamps.

## Questions

- Are domain events themselves persisted, or only the resulting notifications?
- How long is notification history retained?
- Should delivery attempts be retained for audit/debugging?
- How are retries made idempotent so one event does not create duplicate deliveries?
- How are notification preferences stored?
- Which event payload fields should be copied into durable notification state versus resolved when displayed?
