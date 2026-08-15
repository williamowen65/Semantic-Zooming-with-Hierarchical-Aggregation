# Voting

## Table of Contents

- [Purpose](#purpose)
- [Known Context](#known-context)
- [Questions to Explore](#questions-to-explore)

## Purpose

Plan Atlas voting as its own domain concern instead of embedding voting rules into the core Node model.

## Known Context

Voting exists in the broader Atlas concept and may affect ranking, visual weight, credibility, or discovery, but its exact rules have not yet been revisited for the rewrite.

## Questions to Explore

- What exactly does a vote represent?
- Can users vote once per Node, per relationship, or in multiple dimensions?
- Are positive and negative votes symmetric?
- How should votes affect diagrams, ranking, and discovery?
- What abuse-prevention rules are required?
- Does voting need its own persistence model and audit/history records?
