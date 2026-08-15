# Security

## Table of Contents

- [Security and Permissions](security-and-permissions.md)
- [Next Planning Actions](#next-planning-actions)

## Scope

Security is a cross-cutting planning area covering authorization, input validation, safe rendering, database protections, service-to-service authentication, and abuse-prevention concerns that apply across multiple Atlas domains.

## Next Planning Actions

The next security pass should turn broad concerns into explicit rules and trust boundaries that other planning areas can reference.

- **Define the trust/authentication boundary:** update [Security and Permissions](security-and-permissions.md) with how ASP.NET authentication establishes a trusted actor and how that identity is passed into bounded-context operations.
- **Define cross-context authorization rules:** document which authorization decisions belong inside a domain and which require contracts with Identity, Moderation, Communities, or other contexts.
- **Define input/output protections:** record validation, parameterized persistence, safe rendering/encoding, and handling of user-generated titles, descriptions, semantic types, and other free-form content.
- **Define service security:** specify the trust model for the separate Python service and any future independently deployed components, including when service-to-service credentials become necessary.
- **Define abuse and resource protections:** capture rate limits, resource/query limits, audit/logging expectations, and cross-cutting abuse controls. Graph-specific traversal, relationship, caching, and object-authorization decisions remain in [Graph Permissions and Ownership](../graph/permissions-and-ownership.md#questions-to-resolve).
