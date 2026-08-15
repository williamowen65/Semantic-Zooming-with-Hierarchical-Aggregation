# 07 — Page and Screen Map

## Table of Contents
- [Purpose](#purpose)
- [Candidate Surfaces](#candidate-surfaces)
- [Generic Node Experience](#generic-node-experience)
- [Open Questions](#open-questions)

## Purpose
Identify application surfaces and their data needs without prematurely designing every visual detail.

## Candidate Surfaces

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

- [ ] Decide which surfaces exist in the first rewrite milestone.
- [ ] Identify data required by each surface.
- [ ] Identify authenticated versus public behavior.

## Generic Node Experience
The rewrite should avoid recreating separate Issue and Solution page architectures. Semantic type should change meaning/content, not require a separate application page class whenever possible.

## Open Questions
- [ ] Is create/edit inline, modal, or separate-page behavior?
- [ ] What does a profile need to expose initially?
- [ ] Which prototype diagram interactions are part of the Node screen versus later enhancement?