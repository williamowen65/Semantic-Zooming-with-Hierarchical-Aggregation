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
- [ ] A Node can request particular child types.
- [ ] Users can create flexible type vocabulary dynamically.
- [ ] Requested child types may change as a conversation develops.

## Child Categories
- [ ] Requested child categories remain visible when their count is zero.
- [ ] Existing unrequested child types appear when contributions of that type exist.

## Navigation
- [ ] Define hierarchy traversal behavior.
- [ ] Define shared/cross-branch Node navigation.
- [ ] Define what context is preserved while moving between branches.

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
- [ ] Can one Node participate in multiple parent contexts?
- [ ] Which behaviors belong to the model versus only the presentation layer?