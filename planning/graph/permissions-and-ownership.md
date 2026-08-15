# Graph — Permissions and Ownership

## Table of Contents

- [Purpose](#purpose)
- [Known Requirements](#known-requirements)
- [Questions to Resolve](#questions-to-resolve)

## Purpose

Define who is allowed to create, edit, connect, disconnect, or otherwise change Nodes, requested child types, and NodeRelationships.

## Known Requirements

The graph contains user-generated content and user-defined semantic vocabulary. Permissions should operate on the generic Node model rather than on hard-coded semantic subclasses such as Issue or Solution.

## Questions to Resolve

- Who can edit a Node after other users have contributed beneath it?
- Who can change requested child types?
- Who can add or remove NodeRelationships?
- Does a Node have an owner, steward, collaborators, or some combination?
- What happens to shared Nodes that appear under multiple parents if one context is removed?
