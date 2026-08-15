# Profiles and Identity

This domain covers users, identity, profiles, ownership/stewardship, and the way root Nodes are surfaced through a person's profile.

## Table of Contents

- [Domain Model and UML](domain-model-and-uml.md)
- [Behavioral Rules](behavioral-rules.md)
- [Persistence Model](persistence-model.md)
- [Permissions and Ownership](permissions-and-ownership.md)
- [Key Flows](key-flows.md)
- [Open Decisions](open-decisions.md)
- [Next Planning Actions](#next-planning-actions)

## Next Planning Actions

The next planning pass should make the identity boundary concrete enough that Graph and other contexts can depend on stable identity contracts without owning user data.

- **Define the user/profile model:** update [Domain Model and UML](domain-model-and-uml.md) with the relationship among account identity, profile, Context, and any future community/organization membership concepts that belong here.
- **Define identity and profile rules:** use [Behavioral Rules](behavioral-rules.md) to decide profile lifecycle, privacy/visibility defaults, and which identity facts are stable contracts for other bounded contexts.
- **Define persistence ownership:** document how users, profiles, and profile-to-Context references are stored in [Persistence Model](persistence-model.md).
- **Resolve permissions and ownership:** use [Permissions and Ownership](permissions-and-ownership.md) to decide who can modify profile data and which authority/membership facts can be exposed to Graph or Moderation through contracts.
- **Sketch authentication/profile flows:** capture the important identity-facing operations in [Key Flows](key-flows.md), then record unresolved choices in [Open Decisions](open-decisions.md).
