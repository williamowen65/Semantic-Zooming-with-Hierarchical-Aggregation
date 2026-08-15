# 06 — Security and Permissions

## Table of Contents
- [Purpose](#purpose)
- [Authorization](#authorization)
- [User-Generated Content](#user-generated-content)
- [Database Safety](#database-safety)
- [Service Security](#service-security)
- [Open Questions](#open-questions)

## Purpose
Define security boundaries before implementation, especially because Nodes and semantic vocabulary are user-generated.

## Authorization
- [ ] Who can create Nodes?
- [ ] Who can edit Nodes?
- [ ] Who can add children?
- [ ] Who can change requested child types?
- [ ] Who can create/modify vocabulary?
- [ ] Who can expose public roots?
- [ ] Define deletion and moderation permissions.

## User-Generated Content
- [ ] Input validation.
- [ ] Length/format constraints.
- [ ] Safe output encoding/rendering.
- [ ] Abuse prevention and rate limits where appropriate.

## Database Safety
Use parameterized queries, prepared statements, or ORM protections. Do not attempt to prevent SQL injection by manually stripping SQL-looking text from Node content.

## Service Security
- [ ] Authenticate C# ↔ Python communication.
- [ ] Define which service may write authoritative data.
- [ ] Validate analysis-service responses before use.

## Open Questions
- [ ] How does ownership change as Nodes gain contributors?
- [ ] What moderation model is required initially?
- [ ] Which permissions belong to a Node versus a graph/profile context?