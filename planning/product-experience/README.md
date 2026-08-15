# Product Experience

## Table of Contents

- [Page and Screen Map](page-and-screen-map.md)
- [Next Planning Actions](#next-planning-actions)

## Scope

This area covers the user-facing surfaces of Atlas: pages, screens, navigation entry points, and the information each surface needs. It should consume the domain model rather than redefine it.

## Next Planning Actions

The next product-planning pass should convert lessons from the prototype into explicit rewrite requirements rather than leaving them only as remembered interaction behavior.

- **Map the core surfaces:** expand [Page and Screen Map](page-and-screen-map.md) with the main pages/screens, entry points, and the domain information each one needs.
- **Record interaction rules learned from the prototype:** document semantic zoom/layer behavior, collapsing/revealing children, root navigation, depth indication, filtering/toggles, mobile behavior, and other interactions that should survive the rewrite.
- **Separate required behavior from styling experiments:** identify which prototype choices are product requirements and which are visual/implementation experiments that can change freely.
- **Connect screens to bounded-context use cases:** note which Graph, Voting, Profiles, Notifications, or Moderation queries/commands each important screen needs so client-code/use-case sketches can stay grounded in actual user flows.
