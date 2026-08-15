# Rewrite Execution

## Table of Contents

- [Old Code Salvage](old-code-salvage.md)
- [Test Suite Review](test-suite-review.md)
- [Minimum Rewrite Milestone](minimum-rewrite-milestone.md)
- [Next Planning Actions](#next-planning-actions)

## Scope

This area covers how the rewrite is executed: what to reuse from the old application, which tests describe enduring behavior, and what the smallest coherent first rewrite milestone should contain.

## Next Planning Actions

The next rewrite-planning pass should turn the general clean-rewrite direction into a concrete first implementation sequence.

- **Choose what to salvage:** update [Old Code Salvage](old-code-salvage.md) with a deliberate keep/rewrite/reference decision for useful pieces of the old application rather than copying assumptions wholesale.
- **Classify the existing tests:** use [Test Suite Review](test-suite-review.md) to identify which tests express enduring product/domain behavior, which are tied to the old architecture, and which should be replaced.
- **Finalize the first milestone:** define the smallest coherent vertical slice in [Minimum Rewrite Milestone](minimum-rewrite-milestone.md), including the bounded contexts, persistence, contracts, and UI behavior required to prove the new architecture.
- **Order implementation dependencies:** make sure the milestone reflects the planning dependencies—especially Graph, Identity/Security boundaries, and the minimum architecture needed before optional domains are added.
