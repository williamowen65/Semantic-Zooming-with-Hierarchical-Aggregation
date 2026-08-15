# Atlas — Before Rewrite To-Do List

This checklist is for the design and planning work to complete before beginning the clean rewrite of Atlas.

The goal is not to fully specify every future feature. It is to make the fundamental architectural decisions clear enough that the rewrite begins from a stable understanding of what Atlas is.

## 1. Finish the domain model / UML

- [ ] Finalize the generic `Node` model.
- [ ] Define `RequestedChildType` and decide whether fields such as `order` are necessary.
- [ ] Define how parent/child relationships are represented conceptually.
- [ ] Define how cross-branch relationships between existing nodes are represented.
- [ ] Define how multiple root nodes relate to user profiles.
- [ ] Define how multiple public-facing root nodes are represented.
- [ ] Add other domain objects only when they are actually needed, such as users, votes, permissions, or moderation records.
- [ ] Keep node `type` vocabulary flexible and user-extensible rather than creating semantic subclasses.

## 2. Write the core behavioral specification

Document behavior independently from implementation details.

- [ ] Define how nodes gain children.
- [ ] Define how requested child types behave when their count is zero.
- [ ] Define how unrequested child types can still appear when contributions of that type exist.
- [ ] Define broadly available conversational types, such as questions, if Atlas will have any.
- [ ] Define how users can create new type vocabulary dynamically.
- [ ] Define how requested child types can change over time.
- [ ] Define how shared nodes / cross-branch relationships behave.
- [ ] Define hierarchy navigation behavior.
- [ ] Define what makes a node a root in a particular context.
- [ ] Identify behavioral requirements from the prototype that should survive the rewrite.

## 3. Design the persistence model

Translate the conceptual recursive Node model into a database-oriented design.

- [ ] Decide how Nodes are stored.
- [ ] Decide whether parent/child structure is stored through adjacency/relationship rows rather than literal nested arrays.
- [ ] Design storage for requested child types.
- [ ] Design storage for flexible node type vocabulary.
- [ ] Decide how cross-branch relationships are persisted.
- [ ] Design user/profile-to-root associations.
- [ ] Design public-root associations.
- [ ] Determine whether votes require their own table/model.
- [ ] Determine deletion and soft-deletion behavior.
- [ ] Consider indexing requirements for hierarchy traversal and graph queries.

Possible conceptual tables to investigate:

```text
Node
NodeRelationship / ParentChild
RequestedChildType
User
ProfileRoot
PublicRoot
Vote
```

## 4. Create the application architecture diagram

Document the major runtime components and clearly define ownership boundaries.

Current direction to evaluate:

```text
Browser
   |
ASP.NET Core / C# application
   |
   +---- Database
   |
   +---- Background work / queue
   |
   +---- Python analysis service
             |
             +---- graph algorithms
             +---- embeddings
             +---- clustering
             +---- AI / semantic analysis
```

- [ ] Define what the ASP.NET Core application owns.
- [ ] Define what the Python analysis service owns.
- [ ] Define what the database owns as authoritative state.
- [ ] Define the boundary/API between C# and Python.
- [ ] Keep the service contract simple and independent of Python implementation details.
- [ ] Decide which analytical operations should be asynchronous.
- [ ] Determine whether a queue/background-job system is needed initially or can be introduced later.

## 5. Draw key request / application flows

Create small sequence or flow diagrams for important operations.

- [ ] Create a root Node.
- [ ] Create a child Node.
- [ ] Load a Node and its visible child categories.
- [ ] Navigate through the hierarchy.
- [ ] Add or change requested child types.
- [ ] Add an unrequested but permitted child type, such as a question.
- [ ] Create a cross-branch relationship.
- [ ] Vote on a contribution, if voting remains part of the rewrite.
- [ ] Publish or expose a root Node.
- [ ] Queue analysis after a Node changes.
- [ ] Receive/store results from the Python analysis service.

Example:

```text
Create child Node
      |
Validate user + input
      |
Create Node
      |
Create parent/child relationship
      |
Commit transaction
      |
Queue optional semantic analysis
      |
Return new Node
```

## 6. Define the security and permissions model

- [ ] Define who can create Nodes.
- [ ] Define who can edit a Node.
- [ ] Define who can add children to a Node.
- [ ] Define who can change requested child types.
- [ ] Define who can create or modify type vocabulary.
- [ ] Define who can expose something as a public root.
- [ ] Define deletion and moderation permissions.
- [ ] Define validation rules for all user-generated Node content and type vocabulary.
- [ ] Use parameterized queries / ORM protections for database access.
- [ ] Define safe output rendering / encoding expectations.
- [ ] Define authentication between the C# application and Python service.
- [ ] Consider abuse prevention and rate limits where appropriate.

## 7. Create the page / screen map

Identify application surfaces without prematurely designing every visual detail.

Possible surfaces:

```text
Public Atlas / home
Generic Node / hierarchy view
User profile
User root Nodes
Create Node
Edit Node
Authentication
Moderation / administration
```

- [ ] Decide which screens actually need to exist in the first rewrite milestone.
- [ ] Identify what data each screen needs.
- [ ] Ensure Issue and Solution do not accidentally return as separate page architectures.
- [ ] Design around one generic Node experience wherever practical.

## 8. Review the old codebase for salvageable work

Do not port the old architecture wholesale. Review it deliberately.

Classify useful pieces as:

```text
KEEP CONCEPT
REUSE CODE
REWRITE
DELETE
UNSURE
```

- [ ] Review domain/model code.
- [ ] Review authentication and user-management code.
- [ ] Review database/persistence code.
- [ ] Review validation/security code.
- [ ] Review UI/layout code.
- [ ] Review graph/diagram code.
- [ ] Review infrastructure code.
- [ ] Review utility/helper code.
- [ ] Preserve useful implementation knowledge without preserving obsolete Issue/Solution assumptions.

## 9. Review the existing test suite

The existing test suite should become a source of requirements rather than a requirement that the new architecture imitate the old one.

Classify tests as:

```text
PRESERVE BEHAVIOR
REWRITE FOR NEW MODEL
OBSOLETE
UNSURE
```

- [ ] Identify tests that describe genuine Atlas behavior.
- [ ] Identify tests coupled specifically to Issue/Solution classes.
- [ ] Convert important behavioral tests into requirements for the rewrite.
- [ ] Decide on the initial test strategy for the new Node model.
- [ ] Begin the rewrite with tests for the smallest core domain behaviors.

## 10. Decide the initial technology stack

- [ ] Confirm whether ASP.NET Core / C# remains the primary application backend.
- [ ] Confirm whether Python begins as a separate analysis service or is introduced later.
- [ ] Select the database technology.
- [ ] Select ORM / persistence tooling.
- [ ] Decide how service-to-service APIs will be represented.
- [ ] Decide how asynchronous jobs will eventually be represented.
- [ ] Prefer technologies based on concrete Atlas requirements rather than changing tools merely because this is a rewrite.

## 11. Review infrastructure and deployment choices

- [ ] Inventory what the previous Azure infrastructure actually provided.
- [ ] Review the existing Terraform as documentation of operational requirements.
- [ ] Decide whether there is a concrete reason to move from Azure to AWS.
- [ ] If evaluating AWS, map operational requirements to AWS services before rewriting Terraform.
- [ ] Plan database hosting.
- [ ] Plan secrets management.
- [ ] Plan TLS / DNS.
- [ ] Plan logging and observability.
- [ ] Plan deployment for the C# application.
- [ ] Plan independent deployment/scaling for the Python service if introduced.
- [ ] Avoid letting cloud-specific architecture dictate the core Atlas domain model.

## 12. Define the minimum rewrite milestone

Before coding, explicitly define what counts as the first coherent new Atlas application.

A candidate first milestone is:

```text
Generic Node model
       +
Persistence
       +
Parent / child traversal
       +
Requested child types
       +
Generic Node view
       +
Multiple roots
       +
Tests for those behaviors
```

- [ ] Write the exact first-milestone scope.
- [ ] Explicitly list features that are **not** required for that milestone.
- [ ] Avoid rebuilding diagrams, AI, voting, advanced discovery, and other systems until the basic model proves itself unless one is required to validate the architecture.

## Ready-to-rewrite checkpoint

The rewrite is ready to begin when these questions have clear answers:

- [ ] What is a Node?
- [ ] How are Nodes connected?
- [ ] How does a Node solicit particular child types?
- [ ] How can unexpected/unrequested types still participate?
- [ ] How are roots represented?
- [ ] How is the graph persisted?
- [ ] What behavior from the old application must survive?
- [ ] What does the C# application own?
- [ ] What will the Python analysis service eventually own?
- [ ] What are the security boundaries?
- [ ] What is the first implementation milestone?

Once those are coherent with one another, implementation can begin without requiring every future Atlas feature to be designed in advance.