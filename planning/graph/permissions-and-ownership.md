# Graph — Permissions and Ownership

## Table of Contents

- [Purpose](#purpose)
- [Boundary with Identity, Profiles, Communities, and Moderation](#boundary-with-identity-profiles-communities-and-moderation)
- [Abbreviated Permissions UML](#abbreviated-permissions-uml)
- [How the Graph Knows Who Is Acting](#how-the-graph-knows-who-is-acting)
- [Graph-Owned Authorization Rules](#graph-owned-authorization-rules)
- [Cross-Context Authorization](#cross-context-authorization)
- [Graph-Specific Security Surface](#graph-specific-security-surface)
- [Security Request Flow](#security-request-flow)
- [Known Requirements](#known-requirements)
- [Current Decisions](#current-decisions)
- [Questions to Resolve](#questions-to-resolve)

## Purpose

Define who is allowed to create, edit, connect, disconnect, or otherwise change Nodes, requested child types, and NodeRelationships, while keeping user/account/profile concerns outside the Graph bounded context.

The Graph context should know enough identity information to enforce Graph-specific rules, but it should **not own user accounts, profile data, authentication, community membership, or moderation authority**.

## Boundary with Identity, Profiles, Communities, and Moderation

Graph data may contain stable identifiers that refer to entities owned by other bounded contexts.

Examples include:

```text
userId
communityId
organizationId
contextId
```

The important rule is:

> **Graph may know an external entity's stable ID when that identity is meaningful to Graph, without owning or loading the external entity itself.**

For example, a Node may persist an `authorUserId` because authorship matters when deciding whether somebody may edit or withdraw that Node. Graph does not need the corresponding user's name, email address, password data, profile settings, or other Identity/Profile internals.

Likewise, Graph may know that an operation concerns `communityId = 17`, but it should not directly query community membership tables. If Graph needs to know whether an actor has authority in Community 17, it should use an intentional contract exposed by the context that owns that information.

Conceptually:

```text
Identity / Profiles       Communities         Moderation
       |                      |                    |
       | stable identity      | membership/role    | elevated authority
       | or contract          | contract           | contract
       +-----------+----------+---------+----------+
                   |                    |
                   v                    v
                         Graph
                           |
                           +-- Nodes
                           +-- NodeRelationships
                           +-- requested child types
                           +-- Graph-specific authorization rules
```

## Abbreviated Permissions UML

This UML intentionally shows only the pieces relevant to Graph permissions and ownership. It is **not** a replacement for the complete Node UML.

```text
+----------------------------------+
|               Node               |
+----------------------------------+
| id                               |
| authorUserId                     |
| ...other Node fields omitted...  |
+----------------------------------+
| canEdit(actorId, authority?)     |
| canWithdraw(actorId, authority?) |
+----------------------------------+

             1
             |
             | authorUserId
             |
             v
     +-------------------+
     | External User ID  |
     +-------------------+
     | userId            |
     +-------------------+
     | owned by Identity |
     +-------------------+

+----------------------------------+
|        NodeRelationship          |
+----------------------------------+
| id                               |
| parentNodeId                     |
| childNodeId                      |
| createdByUserId                  |
| ...other fields omitted...       |
+----------------------------------+

+----------------------------------+
|          Graph Actor             |
+----------------------------------+
| actorId                          |
| optional authority facts         |
+----------------------------------+
             |
             | passed into Graph use case
             v
+----------------------------------+
|      Graph Application Layer     |
+----------------------------------+
| editNode(...)                    |
| withdrawNode(...)                |
| createRelationship(...)          |
+----------------------------------+
             |
             v
+----------------------------------+
| Graph domain authorization rules |
+----------------------------------+
```

`External User ID` above is conceptual notation. It does **not** mean Graph creates its own User entity. The identifier refers to an identity owned by another bounded context.

As the design expands, the same pattern can apply to other externally owned identities such as communities or organizations: Graph retains only the identifier or Context reference it needs and obtains richer authorization facts through a contract when necessary.

## How the Graph Knows Who Is Acting

Because the first rewrite is expected to be a **modular monolith inside one ASP.NET Core application**, bounded contexts do not need to authenticate each other with separate HTTP access tokens merely because they are logically separated.

A likely request flow is:

```text
Browser request
      |
      v
ASP.NET authentication middleware
      |
      | validates session/cookie/token once
      v
Authenticated application request
      |
      | trusted actorId / principal
      v
Graph application use case
      |
      | actorId + requested operation
      v
Graph authorization rule
```

The important security boundary is at the application's external request boundary. ASP.NET authentication establishes the authenticated principal. Application code then derives the trusted `actorId` from that principal and passes it to Graph.

The Graph context should **not trust a user ID supplied arbitrarily by the browser**. For example, a request body should not be allowed to say `actorId = 42` and thereby impersonate User 42. The application obtains the actor identity from the authenticated server-side request context.

Within the same process, Graph can therefore receive a trusted identity value or a small actor/authorization abstraction rather than receiving and re-validating the original authentication token.

Conceptually:

```text
BAD
Browser sends:
{ actorId: 42, nodeId: 10, title: "..." }

Graph trusts actorId directly

GOOD
Browser sends:
{ nodeId: 10, title: "..." }

Authentication middleware -> authenticated User 42
Application layer          -> actorId = 42
Graph                      -> checks actorId against Graph rules
```

If Atlas later separates Graph into a different deployed service, then service-to-service authentication becomes a real network-boundary concern. At that point, signed service credentials, OAuth/JWTs, mTLS, or another service-authentication mechanism may be appropriate. That infrastructure is **not required merely to preserve bounded contexts inside one application**.

## Graph-Owned Authorization Rules

Graph should own rules that depend on Graph concepts and Graph state.

Examples:

```text
Is actorId the author of this Node?

Is this Node still eligible for hard deletion,
or must it be withdrawn because dependent Graph content exists?

May this NodeRelationship be removed without violating Graph rules?

May requested child types be changed on this Node?
```

For a simple authorship rule, Graph may need nothing more than:

```text
actorId == node.authorUserId
```

This is a Graph rule because `authorUserId` is meaningful Graph metadata even though the User itself belongs to another bounded context.

The exact Graph domain methods do not have to literally be named `canEdit` or `canWithdraw`; the UML uses those names only to make the responsibility visible.

## Cross-Context Authorization

Some permission questions depend on information Graph does not own.

Examples:

```text
Is this actor an administrator?
Is this actor a moderator for Community 17?
Is this actor a member of Organization 8 with an editor role?
```

Graph should not answer those questions by reading another context's repositories or database tables directly.

Instead, the application can obtain those facts through an intentional contract, for example:

```text
Graph/Application
       |
       | CanModerate(actorId, contextId)?
       v
Moderation / Community Authorization Contract
```

or the application layer can resolve the required authority before invoking the Graph domain operation and provide a small trusted authorization value.

A possible conceptual actor object is:

```text
GraphActor
- actorId
- authority facts needed for this operation
```

The important constraint is to avoid turning `GraphActor` into a duplicate User/Profile object. It should carry only information needed to perform the current Graph authorization decision.

## Graph-Specific Security Surface

Authentication itself is outside Graph, but Graph still has a meaningful security surface because it owns user-generated graph data and the operations that can mutate it.

### Authorization and ownership

Every Graph command should authorize the requested operation against the target Graph object. Knowing a `nodeId` or `relationshipId` must never imply permission to edit, withdraw, connect, disconnect, or even necessarily view that object.

This specifically protects against object-ID / insecure-direct-object-reference style mistakes where a caller changes an identifier and unintentionally gains access to another user's content.

### Untrusted Node content

Node titles, descriptions, semantic types, requested child types, and relationship labels are all potentially user-supplied content.

Graph persistence should use parameterized ORM/database operations rather than constructing SQL from user input. That substantially reduces SQL-injection risk, but it does not eliminate the need for:

- input validation and reasonable length/shape limits;
- safe output encoding/rendering;
- protection against stored HTML/script injection where rich text is supported;
- explicit decisions about whether markup is allowed at all and, if so, how it is sanitized.

Validation rules should be part of the Graph/application boundary rather than left to UI-only validation.

### Relationship authorization

Creating a relationship is itself a protected Graph write operation. Atlas should not assume that a user may connect any two Nodes merely because both IDs exist.

The final rules still need to be decided, but Graph should explicitly authorize:

```text
create relationship
remove relationship
change relationship type/metadata
```

and consider whether authorization depends on authorship, Context, moderation authority, or the ownership of the involved Nodes.

### Graph resource abuse

Atlas has Graph-specific denial-of-service and resource-abuse risks that ordinary CRUD models may not have to the same degree.

Potential abuse or accidental pathological structures include:

- extreme fan-out from one Node;
- very deep traversal requests;
- extremely large numbers of parent relationships on a shared Node;
- repeated expensive graph queries;
- cycles where an algorithm assumes acyclic traversal;
- requests designed to force large in-memory graph materialization.

Planning should therefore consider pagination, bounded traversal depth, query/result limits, rate limiting where appropriate, cancellation/timeouts, and algorithms that explicitly handle cycles rather than recursively assuming a tree.

The domain model can remain flexible without permitting unbounded computational work in a single request.

### Version-history integrity

Node version history is intended to be visible and durable. Ordinary editing should append a new revision rather than rewrite previous revisions.

Graph should prevent ordinary users from silently changing or deleting historical revisions. Exceptional redaction/removal for legal, privacy, abuse, or safety reasons belongs to the Moderation/Security design rather than normal Node editing.

### Concurrent edits

Shared Nodes make concurrent edits plausible. Atlas should consider optimistic concurrency for Node updates—for example, a revision/version token checked when saving—to prevent one user's edit from silently overwriting another user's newer edit.

The exact conflict-resolution UX remains open, but lost updates should not be the default behavior.

### Soft deletion and information exposure

The current withdrawal model preserves the underlying Node and history when community content depends on it. Security/privacy planning must still define what remains visible after withdrawal.

Important questions include:

- Is the original title/description still visible in history?
- Is the author's identity still visible?
- Are moderators able to redact specific versions while preserving structural history?
- When does privacy/legal removal override the normal transparency goal?

### Domain-event integrity

Graph events such as `NodeCreated`, `NodeEdited`, and `NodeWithdrawn` should represent successful, authorized Graph operations.

Other bounded contexts should not be able to fabricate a Graph event and thereby make Notifications, analysis, or other subscribers behave as though Graph state changed when it did not.

The eventual event-dispatch mechanism should preserve the principle that Graph owns the production of Graph domain facts.

### Cache and visibility safety

Caching must not accidentally bypass Graph authorization or visibility rules.

If cached data varies by viewer permissions or Context visibility, the cache key/policy must account for those differences, or the repository/application layer must re-check authorization before returning cached content.

A cached Node representation that was valid for one viewer must not automatically become visible to another viewer with weaker permissions.

## Security Request Flow

The intended security layering is:

```text
Incoming HTTP request
        |
        v
Authentication
        |
        | trusted actor identity
        v
Graph command/query
        |
        v
Graph authorization + input validation
        |
        v
Graph domain operation
        |
        v
Persistence / version creation
        |
        v
Graph domain event
```

This keeps responsibilities separated:

```text
Identity / application security
- prove who the actor is
- establish trusted request identity

Graph security
- determine whether that actor may perform this Graph operation
- validate Graph-owned input and invariants
- protect Graph integrity and computational resources

Moderation
- handle exceptional authority, abuse, redaction, and removal cases
```

Graph should not own passwords, login flows, sessions, token issuance, or account security merely because Graph operations require an authenticated actor.

## Known Requirements

- Graph contains user-generated content and user-defined semantic vocabulary.
- Permissions operate on the generic Node model rather than hard-coded semantic subclasses such as Issue or Solution.
- Graph can persist stable external identifiers where authorship, creation, stewardship, Context, or similar references are meaningful to Graph.
- Graph must not perform arbitrary user/profile/community lookups through another context's internal repositories.
- Authenticated actor identity must originate from trusted server-side authentication state, not from an actor ID supplied by the client.
- Graph should own Graph-specific authorization rules.
- Authority owned elsewhere—such as community moderation roles—should cross the bounded-context boundary through an explicit contract or trusted application-layer authorization result.
- All Graph mutations must authorize against the specific target object rather than treating knowledge of its identifier as permission.
- User-generated Graph content must be treated as untrusted input and safely persisted/rendered.
- Graph traversal and relationship APIs must be designed with computational abuse and pathological graph shapes in mind.
- Node version history should be protected from ordinary destructive rewriting.
- Caching must preserve authorization and visibility boundaries.

## Current Decisions

- [x] Graph does **not** own User/Profile entities. It stores only stable IDs where Graph needs them.
- [x] The same external-ID principle can apply to Communities, Organizations, and other entities owned by separate contexts.
- [x] Inside the initial modular monolith, bounded contexts do **not** need separate network authentication tokens to call each other.
- [x] External authentication occurs at the ASP.NET application boundary; the application passes a trusted actor identity into Graph use cases.
- [x] Graph must never trust an arbitrary `actorId` supplied by the browser as proof of identity.
- [x] Graph owns authorization rules that can be answered from Graph state, such as matching an actor ID to a Node's author ID.
- [x] Graph uses contracts/application coordination when an authorization decision requires facts owned by another bounded context.
- [x] SQL/database access should use parameterized ORM operations rather than dynamic SQL composed from user content.
- [x] Graph authorization and validation must be enforced server-side even if the UI also performs validation.
- [x] Graph domain events represent authorized Graph operations and should be produced by the Graph boundary.
- [x] Version history is append-oriented from the perspective of ordinary editing; exceptional redaction is a separate moderation/security concern.

## Questions to Resolve

### Ownership and authorization

- [ ] Who can edit a Node after other users have contributed beneath it?
- [ ] Who can change requested child types?
- [ ] Who can add a `NodeRelationship`?
- [ ] Who can remove a `NodeRelationship`, particularly when the relationship was created by another contributor?
- [ ] Is `authorUserId` sufficient for Node ownership, or does Graph eventually need collaborators/stewards in addition to the original author?
- [ ] Should relationship records persist `createdByUserId` for ownership/history/permission decisions?
- [ ] What happens to shared Nodes that appear under multiple parents if one context or relationship is removed?
- [ ] Which elevated authorization facts should Graph ask other contexts for rather than receive pre-resolved from the application layer?
- [ ] When Communities and Organizations are designed in detail, which context owns membership and role checks?
- [ ] Which Graph authorization decisions should also create auditable domain events or version-history entries?

### Content security

- [ ] What input-length and structural limits apply to titles, descriptions, semantic types, requested child types, and relationship labels?
- [ ] Does Node content support plain text only, Markdown, sanitized HTML, or another formatting model?
- [ ] If rich text/Markdown is supported, what sanitizer/rendering policy prevents stored script/markup injection?

### Relationship and graph-abuse protection

- [ ] What authorization rule permits a user to connect two existing Nodes?
- [ ] Are there practical limits on parent count, child count, or relationship creation rate?
- [ ] What traversal depth/result-size limits should public APIs enforce?
- [ ] How should traversal APIs behave when cycles exist?
- [ ] Should the primary hierarchy reject cycles even if richer cross-links are allowed elsewhere?

### Concurrency and history

- [ ] What optimistic-concurrency/version mechanism should Node edits use?
- [ ] What should the client experience be when a Node changed after the editor loaded it?
- [ ] Which historical fields remain visible after withdrawal?
- [ ] Which exceptional conditions allow moderation/security to redact historical content?

### Events and caching

- [ ] How will the event dispatcher ensure Graph events correspond to successfully persisted operations?
- [ ] Which Graph events contain user/context identifiers, and what information should intentionally not be copied into event payloads?
- [ ] Which cached Graph reads vary by viewer or Context permissions?
- [ ] Where should authorization be re-evaluated when serving cached results?
