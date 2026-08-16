# Graph — Permissions and Ownership

## Table of Contents

- [Purpose](#purpose)
- [Boundary with Identity, Profiles, Communities, and Moderation](#boundary-with-identity-profiles-communities-and-moderation)
- [Abbreviated Permissions UML](#abbreviated-permissions-uml)
- [How the Graph Knows Who Is Acting](#how-the-graph-knows-who-is-acting)
- [Graph-Owned Authorization Rules](#graph-owned-authorization-rules)
- [Cross-Context Authorization](#cross-context-authorization)
- [Authorization and Relationship Permission Decisions](#authorization-and-relationship-permission-decisions)
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
| approvalState?                   |
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
Is actorId the author or current owner of this Node?

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

## Authorization and Relationship Permission Decisions

This section records the current business-rule direction for the Graph permission model. The goal is to write rules clearly enough that they can later become tests and implementation policies.

### Node editing and ownership

- The person who creates a Node has ordinary edit authority over that Node.
- Node authorship/ownership is meaningful Graph metadata and should be represented through stable IDs rather than by loading full User/Profile objects into Graph.
- The design should allow for future shared editing/collaboration, but the exact collaborator/steward persistence model does not need to be finalized for the first rewrite milestone.
- Ownership transfer is expected to be supported. A transfer should not complete until the intended recipient explicitly accepts it.
- Ownership/authorship changes should be auditable rather than silently rewriting history.

A likely future distinction is between **original authorship**, **current ownership**, and **editing permission**. These may eventually require more than a single `authorUserId` field—for example, a separate access/ownership association—but that schema decision remains open.

### Relationship creation

The current direction is permissive: ordinary users should generally be able to propose/create relationships between Nodes rather than requiring ownership of the parent Node.

Creating a relationship does **not** transfer ownership of either Node.

Relationship creation still needs Graph validation for structural correctness and abuse protection. In particular, traversal and relationship logic must safely handle cyclic graph shapes rather than assuming a strict tree.

Cycles are not necessarily treated as invalid domain data. If a relationship creates a circular route, the application should detect that condition during traversal/rendering and represent it safely to the user rather than recursing indefinitely or crashing.

### Relationship removal

The owner of a parent Node should **not automatically gain the right to remove relationships created by other contributors** merely because those relationships point from or through the owner's Node.

This is intentional. Unwanted or low-quality contributed relationships should primarily be handled through community voting/ranking rather than allowing a Node owner to unilaterally erase contributions they dislike.

The current preferred ordinary removal authorities are:

- the user who created the relationship; and
- a moderator with applicable authority.

This makes `createdByUserId` useful relationship metadata for permission and history decisions.

The exact interaction with later Voting and Moderation rules is still open. In particular, a sufficiently downvoted relationship may become hidden/de-emphasized without being physically removed.

### Optional relationship approval workflow

Relationship approval should be **configurable rather than universal**.

A Node or Context may opt into an approval requirement. By default, approval can be off so that ordinary collaborative linking remains lightweight.

If either involved Node/context requires approval, a newly proposed relationship may need an explicit state such as:

```text
Pending
Approved
Rejected
```

The exact scope of the setting is still open: it may live on a Node, a Context, or another policy object. The important rule is that approval can be enabled selectively rather than forcing all Atlas relationships through moderation.

Moderators are expected to be able to participate in relationship approval where the relevant Context gives them that authority.

### Moderation authority

Moderator authority exists as an override path for Graph relationships and potentially shared/community-owned content, but its exact scope is not yet decided.

Open scope questions include whether moderator authority is:

- global;
- Context-specific;
- community-specific;
- organization-specific; or
- some combination of these.

Graph should consume the relevant authority fact through an explicit contract or trusted application-layer result rather than owning community/moderator membership data itself.

### Concurrent editing

Shared editing should be possible in the future, and the UX may eventually become collaborative enough that more than one user can edit the same Node.

The immediate persistence requirement is simpler: Node writes should avoid silent lost updates. Optimistic concurrency/version checks are the current preferred direction even if real-time collaborative editing is deferred.

### Author identity detachment / anonymization

A Node may need to survive even when the relationship to its original author is removed or anonymized—for example, because the Node has dependent community content or because a privacy/moderation action requires identity removal while preserving graph structure.

This is different from deleting the Node itself. The exact rules for when author identity can be detached, anonymized, or redacted remain open and should be coordinated with Moderation, Privacy, and version-history planning.

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

Creating a relationship is itself a protected Graph write operation. The current direction is that authenticated/eligible contributors may generally create relationships between visible Nodes without owning the parent Node, subject to Graph validation, approval policy when enabled, and later abuse/rate controls.

Graph should explicitly authorize and distinguish:

```text
create relationship
remove relationship
approve/reject relationship
change relationship type/metadata
```

The creator and applicable moderators have special authority over relationship removal; the parent Node owner does not automatically receive removal authority over somebody else's relationship.

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
- Parent Node ownership does not imply unilateral control over relationships created by other contributors.
- Relationship creators retain ordinary removal authority over their own relationships; moderation can provide an override where authorized.
- Relationship approval may be enabled selectively rather than imposed globally.
- Ownership transfers require recipient acceptance.

## Current Decisions

- [x] Graph does **not** own User/Profile entities. It stores only stable IDs where Graph needs them.
- [x] The same external-ID principle can apply to Communities, Organizations, and other entities owned by separate contexts.
- [x] Inside the initial modular monolith, bounded contexts do **not** need separate network authentication tokens to call each other.
- [x] External authentication occurs at the ASP.NET application boundary; the application passes a trusted actor identity into Graph use cases.
- [x] Graph must never trust an arbitrary `actorId` supplied by the browser as proof of identity.
- [x] Graph owns authorization rules that can be answered from Graph state, such as matching an actor ID to a Node's author ID.
- [x] Graph uses contracts/application coordination when an authorization decision requires facts owned by another bounded context.
- [x] The Node creator has ordinary edit authority over the Node.
- [x] Node ownership may be transferred, but the recipient must accept before the transfer becomes effective.
- [x] Ordinary users may generally propose/create relationships between Nodes without owning the parent Node, subject to validation and any enabled approval policy.
- [x] A parent Node owner does **not** automatically have authority to remove relationships created by other users.
- [x] The relationship creator has ordinary authority to remove that relationship.
- [x] Applicable moderators may remove or approve/reject relationships according to later moderation-scope rules.
- [x] Relationship approval is optional/configurable rather than universal; `Pending`, `Approved`, and `Rejected` are candidate states.
- [x] Cycles are not assumed impossible. Traversal/rendering must detect and represent cyclic routes safely rather than recursing indefinitely.
- [x] SQL/database access should use parameterized ORM operations rather than dynamic SQL composed from user content.
- [x] Graph authorization and validation must be enforced server-side even if the UI also performs validation.
- [x] Graph domain events represent authorized Graph operations and should be produced by the Graph boundary.
- [x] Version history is append-oriented from the perspective of ordinary editing; exceptional redaction is a separate moderation/security concern.
- [x] Shared editing is a future capability, but Node persistence should at minimum protect against silent lost updates through optimistic concurrency/version checks.

## Questions to Resolve

### Ownership and authorization

- [x] Who can edit a Node? **The creator/current owner has ordinary edit authority. Future shared editors/collaborators may be added.**
- [ ] Who can change requested child types? Current assumption: this follows Node editing authority, but confirm whether collaborators/moderators can also do so.
- [x] Who can add a `NodeRelationship`? **Ordinary eligible users may generally create/propose relationships without owning the parent Node, subject to validation and optional approval policy.**
- [x] Who can remove a `NodeRelationship`? **The relationship creator and an applicable moderator. Parent Node ownership alone does not grant removal authority.**
- [ ] Define whether original authorship and current ownership are stored separately once ownership transfer is implemented.
- [ ] Define the future collaborator/steward/editor model and whether it requires a `NodeAccess`-style association table.
- [x] Should relationship records persist `createdByUserId`? **Yes, it is useful for ownership/history/permission decisions.**
- [ ] Define exact ownership-transfer history/event semantics beyond recipient acceptance.
- [ ] What happens to shared Nodes that appear under multiple parents if one context or relationship is removed?
- [ ] Which elevated authorization facts should Graph ask other contexts for rather than receive pre-resolved from the application layer?
- [ ] When Communities and Organizations are designed in detail, which context owns membership and role checks?
- [ ] Define exact moderator scope: global, Context-specific, community-specific, organization-specific, or mixed.
- [ ] Which Graph authorization decisions should also create auditable domain events or version-history entries?
- [ ] Define when/why author identity may be detached or anonymized while preserving the Node and its graph structure.

### Relationship approval

- [x] Approval is optional rather than universal.
- [x] Candidate approval states are `Pending`, `Approved`, and `Rejected`.
- [ ] Decide where the approval requirement is configured: Node, Context, policy object, or some combination.
- [ ] Define the exact rule when both involved Nodes/Contexts have different approval settings. Current direction: if either relevant policy requires approval, the relationship should require approval.
- [ ] Define who can approve/reject in each type of moderated Context.

### Content security

- [ ] What input-length and structural limits apply to titles, descriptions, semantic types, requested child types, and relationship labels?
- [ ] Does Node content support plain text only, Markdown, sanitized HTML, or another formatting model?
- [ ] If rich text/Markdown is supported, what sanitizer/rendering policy prevents stored script/markup injection?

### Relationship and graph-abuse protection

- [x] What authorization rule permits a user to connect two existing Nodes? **Ordinary eligible users may generally create/propose the connection; ownership of either Node is not required by default.**
- [ ] Are there practical limits on parent count, child count, or relationship creation rate?
- [ ] What traversal depth/result-size limits should public APIs enforce?
- [x] How should traversal APIs behave when cycles exist? **They must detect cycles, stop recursive expansion safely, and represent the circular route to the user rather than failing or looping indefinitely.**
- [ ] Decide whether any specific relationship subtype should reject cycles even though the general Graph model can represent them.

### Concurrency and history

- [ ] Choose the exact optimistic-concurrency/version mechanism for Node edits.
- [ ] Define the client experience when a Node changed after the editor loaded it.
- [ ] Define how future real-time/shared editing relates to optimistic concurrency.
- [ ] Which historical fields remain visible after withdrawal?
- [ ] Which exceptional conditions allow moderation/security to redact historical content?
- [ ] Define how authorship/ownership transfer appears in version history.

### Events and caching

- [ ] How will the event dispatcher ensure Graph events correspond to successfully persisted operations?
- [ ] Which Graph events contain user/context identifiers, and what information should intentionally not be copied into event payloads?
- [ ] Which cached Graph reads vary by viewer or Context permissions?
- [ ] Where should authorization be re-evaluated when serving cached results?