# 09 — Existing Test Suite Review

## Table of Contents
- [Purpose](#purpose)
- [Classification](#classification)
- [Review Tasks](#review-tasks)
- [New Test Strategy](#new-test-strategy)

## Purpose
Turn the old test suite into a source of behavioral requirements without forcing the new architecture to imitate the old implementation.

## Classification

```text
PRESERVE BEHAVIOR
REWRITE FOR NEW MODEL
OBSOLETE
UNSURE
```

## Review Tasks
- [ ] Identify genuine Atlas behavioral tests.
- [ ] Identify tests coupled specifically to Issue/Solution classes.
- [ ] Extract important requirements before retiring obsolete tests.
- [ ] Identify security/authentication tests worth carrying forward.
- [ ] Identify integration tests that reveal hidden application behavior.

## New Test Strategy
- [ ] Begin with generic Node model tests.
- [ ] Test requested versus actual child categories.
- [ ] Test roots and hierarchy traversal.
- [ ] Test authorization boundaries.
- [ ] Add persistence/integration tests as the architecture solidifies.