# Voting — Behavioral Rules

## Purpose

Record voting invariants independently of UI or database implementation.

## Strategy Pattern

Voting and ranking rules are good candidates for the **Strategy pattern** because Atlas may need to support or experiment with different algorithms without making the rest of the application depend on one permanent scoring implementation.

Conceptually:

```text
Voting / Ranking Service
          |
          v
     IScoringStrategy
        /   |   \
       /    |    \
Simple   Weighted   Future strategy
```

The same idea may also apply elsewhere in Atlas where an algorithm can vary while the surrounding workflow remains stable, including:

- ranking and scoring;
- graph traversal policies;
- recommendations and related-node discovery;
- possibly other analysis or prioritization algorithms.

This is a design seam rather than a requirement that Atlas support multiple algorithms on day one. The purpose is to avoid hard-coding an algorithm deeply into domain or UI behavior when it is likely to evolve.

## Questions to Resolve

- What does a vote mean?
- Can a vote be changed or removed?
- Are positive and negative votes symmetric?
- How do votes affect ranking, visual weight, credibility, or discovery?
- What must remain true when a Node is shared across multiple graph contexts?
- Which voting/ranking behaviors should be represented behind interchangeable strategies, and which are fixed domain rules?