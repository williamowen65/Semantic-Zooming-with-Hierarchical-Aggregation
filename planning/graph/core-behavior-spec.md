# 02 — Core Behavior Specification

## Table of Contents
- [Purpose](#purpose)
- [Node Behavior](#node-behavior)
- [Child Categories](#child-categories)
- [Navigation](#navigation)
- [Roots](#roots)
- [Prototype Behaviors to Preserve](#prototype-behaviors-to-preserve)
- [Open Questions](#open-questions)

## Purpose
Describe what Atlas must do independently of framework, database, or UI implementation.

## Node Behavior
- [ ] A Node can have zero or many children.
- [ ] A Node can have zero, one, or many parents through explicit `NodeRelationship` edges.
- [ ] A Node can request particular child types.
- [ ] Users can create flexible type vocabulary dynamically.
- [ ] Requested child types may change as a conversation develops.

## Child Categories
- [ ] Requested child categories remain visible when their count is zero.
- [ ] Existing unrequested child types appear when contributions of that type exist.

## Navigation
- [ ] Define ordinary hierarchy traversal behavior.
- [x] Shared/cross-branch Nodes are represented as ordinary Nodes that may have multiple parents through explicit relationship edges.
- [ ] When a Node has multiple parents, define how the UI exposes the available parent contexts/routes.
- [ ] Define what context is preserved when switching from one parent route to another.
- [ ] Keep primary hierarchical traversal acyclic where practical so navigation cannot recurse indefinitely.
- [ ] If non-hierarchical relationships are allowed to form cycles, traversal/rendering must detect already-visited Nodes and prevent infinite expansion.

A multi-parent Node should not be duplicated merely because it appears through different routes. The route determines the current context; the underlying Node identity remains the same.

## Roots
- [ ] Multiple roots can exist on a profile.
- [ ] Multiple roots can exist on the public Atlas.
- [ ] Root status does not require a different Node class.

## Prototype Behaviors to Preserve
Use the prototype as behavioral evidence, not as an implementation template.

- [ ] Inventory useful diagram behavior.
- [ ] Inventory layer collapse/reveal behavior.
- [ ] Inventory branch navigation behavior.
- [ ] Inventory theme/display behavior worth keeping.
- [ ] Record any other behavior that should become a testable requirement.

## Open Questions
- [ ] What is permitted versus merely solicited?
- [x] Can one Node participate in multiple parent contexts? **Yes. A Node can have 0..* parents through `NodeRelationship` edges and remains one underlying Node.**
- [ ] How should users choose between multiple parent contexts when viewing a shared Node?
- [ ] Which behaviors belong to the model versus only the presentation layer?