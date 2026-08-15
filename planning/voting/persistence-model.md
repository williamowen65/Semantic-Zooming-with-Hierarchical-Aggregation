# Voting — Persistence Model

## Purpose

Define how votes, vote history if any, and derived scores are represented in storage.

## Questions to Resolve

- Which vote records need durable history?
- Which uniqueness constraints prevent duplicate voting?
- Which aggregates should be calculated versus stored?
- How are deleted or moderated targets handled?
