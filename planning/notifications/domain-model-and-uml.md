# Notifications — Domain Model / UML

## Purpose

Define the concepts involved in notifying users without coupling domain objects to delivery channels.

## Initial UML Direction

```text
+----------------------+       +----------------------+
|     DomainEvent      |       |     Notification     |
+----------------------+       +----------------------+
| id                   |       | id                   |
| eventType            |       | recipientUserId      |
| occurredAt           |       | eventId              |
| aggregateId / source |       | status               |
| payload / metadata   |       | createdAt            |
+----------------------+       | readAt               |
                               +----------------------+
                                          |
                                          v
                              +-------------------------+
                              | NotificationDelivery    |
                              +-------------------------+
                              | notificationId          |
                              | channel                 |
                              | providerMessageId       |
                              | deliveryStatus          |
                              | attemptedAt             |
                              +-------------------------+
```

The exact classes and fields remain open. The important separation is between **something happening in Atlas**, the **notification record shown to a user**, and the **delivery mechanism used to reach that user**.

## Adapter Pattern

External delivery providers should sit behind an **Adapter** interface so notification logic does not depend directly on one email, push, SMS, or future provider.

```text
Notification Service
        |
        v
INotificationChannel
   /       |       \
Email    Push    In-app / future
Adapter  Adapter      Adapter
```

The same Adapter principle can be used elsewhere in Atlas when application code needs to consume an external provider behind a stable internal contract, such as AI/model providers, storage services, or other third-party APIs.
