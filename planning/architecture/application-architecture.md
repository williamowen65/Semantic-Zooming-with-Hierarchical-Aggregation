# 04 — Application Architecture

## Table of Contents
- [Purpose](#purpose)
- [Current Direction](#current-direction)
- [C# Responsibilities](#c-responsibilities)
- [Python Responsibilities](#python-responsibilities)
- [Service Boundary](#service-boundary)
- [Asynchronous Analysis](#asynchronous-analysis)
- [Open Questions](#open-questions)

## Purpose
Define major runtime components and make ownership boundaries explicit.

## Current Direction

```text
Browser
   |
ASP.NET Core / C# application
   |
   +---- Database
   |
   +---- Background work / queue
   |
   +---- Python analysis service
             |
             +---- graph algorithms
             +---- embeddings
             +---- clustering
             +---- AI / semantic analysis
```

## C# Responsibilities
Likely authoritative application concerns: users, authentication, profiles, Node CRUD, permissions, transactions, public/private roots, APIs, and normal web behavior.

## Python Responsibilities
Potential analysis concerns: semantic similarity, embeddings, duplicate/overlap detection, related-node discovery, clustering, graph algorithms, summarization, AI-assisted vocabulary suggestions, and heavier analytical jobs.

## Service Boundary
The interface should be deliberately boring: stable identifiers, clear API contracts, structured payloads, and no shared in-process state. C# should request a capability/result without depending on how Python produces it.

## Asynchronous Analysis
Analysis should generally not block ordinary Node creation or viewing. A likely flow is persistence first, optional queued analysis second, results available later.

## Open Questions
- [ ] Does Python exist in milestone one or arrive later?
- [ ] HTTP first, or is a queue required immediately?
- [ ] Where are analysis results persisted?
- [ ] How are service contracts versioned?