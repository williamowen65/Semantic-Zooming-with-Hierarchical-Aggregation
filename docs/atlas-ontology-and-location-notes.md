# Atlas ontology, public participation, and location model

These notes capture the design discussion around how people may use the Atlas as a public think tank/social platform, how the issue hierarchy should evolve, and how location should fit into the model.

## 1. How people may think about posting into the Atlas

The Atlas hierarchy should help people answer **“Where in the Atlas does what I’m talking about belong?”** rather than encouraging them to invent a new top-level category for every subject.

People using a social feed probably will not naturally think in ontology terms. They will arrive with things such as:

- observations and lived experiences
- problems or complaints
- proposed solutions
- evidence, studies, or reporting
- questions
- reactions to current events
- descriptions of projects or interventions

The hierarchy should organize those contributions without requiring contributors to understand taxonomy design.

### Lock down the root layer

A strong working model is:

> **The roots belong to the Atlas. The branches belong increasingly to the community.**

Layer 1 should therefore be curated and locked. Broad roots such as **Health & Wellbeing**, **Environment & Natural World**, **Housing & Built Environment**, **Law, Rights & Justice**, and **Technology & Information** act as durable umbrellas.

Allowing users to freely create roots would likely produce overlapping concepts such as “Climate,” “Climate Change,” “Environment,” “Sustainability,” and “Planet.” The structure would begin to reflect who posted first instead of helping people understand how subjects relate.

A possible governance model by depth:

- **Layer 1:** locked and Atlas-curated.
- **Layer 2:** mostly curated; users may suggest additions.
- **Layer 3:** hybrid; existing categories are encouraged, but new nodes can be proposed.
- **Layer 4 and below:** increasingly community-generated and organic.

This allows specificity to explode at lower levels without destabilizing the top-level ontology.

## 2. Nodes are not posts

An important distinction is that an issue node represents **what a subject is**, while posts represent **what people are saying about that subject**.

For example:

`Environment & Natural World → Biodiversity Loss → Pacific Northwest Species Decline → Southern Resident Orcas → Chinook Salmon Prey Shortage → Stream Temperature`

“Stream Temperature” could be a single conceptual node with hundreds or thousands of posts attached to it.

The tree describes the subject. The feed contains the conversation.

This also means polygon weight could eventually be calculated from real Atlas activity: posts, participants, followers, evidence submissions, votes, proposed solutions, unresolved questions, or some intentionally designed combination of those signals.

## 3. Lower levels should become increasingly specific

The Atlas designers do not need to anticipate every specific public issue in advance. Lower levels are where community knowledge can create detail that a centrally designed taxonomy could never enumerate beforehand.

For example:

`Environment → Biodiversity → Orcas → Southern Resident Killer Whales → J Pod → [specific emerging problem]`

Depth can therefore represent a gradual transition from **curated taxonomy** toward **collective intelligence**.

## 4. Cross-cutting issues and “related to” relationships

Real problems frequently belong conceptually near several different branches. Homelessness, for example, can relate strongly to housing, behavioral health, poverty/income, public services, and public space.

The user interface can retain a tree-shaped primary navigation path while the underlying data model eventually supports graph relationships.

A node could have one canonical location in the hierarchy while also exposing relationships such as:

**Also related to:** Mental Health Care Access · Addiction Treatment · Income Security · Public Space

This avoids duplicating concepts merely because they cross traditional categories.

## 5. A possible posting interaction

A future Atlas post composer could help users locate their contribution automatically.

Example post:

> “I've been documenting unusually warm water and salmon mortality in the Stillaguamish this summer…”

Atlas could suggest:

`Environment & Natural World → Biodiversity Loss → Salmon Decline → Habitat & Survival Conditions → High Stream Temperatures`

It could separately suggest related concepts such as **Climate Change**, **Water Management**, or **Southern Resident Orcas**.

The user chooses the best primary node and publishes. Someone navigating through the hierarchy could later reach **High Stream Temperatures** and see activity such as followers, posts, proposed solutions, and evidence sources, then enter the associated social feed.

The desired feedback loop is:

1. Someone discovers Atlas through a post and then discovers the hierarchy.
2. Someone exploring the hierarchy discovers a focused conversation.
3. Conversations create or reveal increasingly specific nodes.
4. Node activity shows where public attention, evidence, disagreement, and proposed solutions are accumulating.

## 6. Location should be a separate dimension

Location should **not** normally become another level in the issue hierarchy.

For example, avoid creating separate conceptual branches such as:

- Housing Affordability — Seattle
- Housing Affordability — Portland
- Housing Affordability — San Francisco

There should instead be one conceptual **Housing Affordability** node, with posts and other records associated with relevant locations.

This keeps two independent questions separate:

- **What is this about?** → the issue/solution ontology.
- **Where does this apply?** → the geographic model.

## 7. Posts may have multiple affected locations

A post should be able to reference **zero, one, or many affected locations**.

Example:

- **Post:** “Low Chinook returns are affecting the Southern Resident orcas.”
- **Primary issue:** Chinook Salmon Prey Shortage
- **Related issues:** Southern Resident Orca Decline, Habitat Loss
- **Affected locations:** Salish Sea, Puget Sound, Columbia River Basin
- **Posting/author location:** potentially Seattle, WA, if the user intentionally provides it

The affected locations are the important semantic/geographic information. The author's physical location is a different concept and should be treated separately, including appropriate privacy considerations.

## 8. Distinguish types of geographic information

At least three concepts may eventually be useful:

### Affected locations
Places that an issue, solution, policy, project, or post says are affected. A record may have many.

### Observation location
Where a specific observation, event, measurement, project, incident, or intervention occurred.

### Author/posting location
Where the contributor happens to be. This is optional, privacy-sensitive, and generally should not define the issue ontology.

## 9. Locations should be first-class objects

Locations should eventually be modeled as structured Atlas entities rather than arbitrary strings or simple hashtags.

Locations themselves can have hierarchy, for example:

`Earth → North America → United States → Washington → Puget Sound region → Seattle`

The geographic hierarchy exists **parallel to** the issue hierarchy.

An issue path might be:

`Environment & Natural World → Biodiversity Loss → Orcas → Southern Residents → Prey Availability`

while its geographic context might be:

`Earth → North America → Pacific Northwest → Salish Sea → Puget Sound`

Posts and other records connect the two dimensions.

## 10. Geographic inheritance

Location relationships should inherit upward when appropriate.

If a post is tagged as affecting **Seattle**, Atlas can infer that it also contributes to queries or aggregates for **Washington**, **United States**, **North America**, etc. The author should not have to manually add every geographic ancestor.

This inheritance should be based on structured geographic relationships rather than duplicated tags.

## 11. Geography can eventually be more than place names

A future location model should be capable of representing geographic shapes and domains, not just city names or points.

Examples include:

- point locations
- neighborhoods
- cities and counties
- states/provinces and countries
- watersheds
- rivers
- coastlines or marine regions
- tribal territories
- transit service areas
- congressional/administrative districts
- ecosystems
- wildfire or disaster footprints
- user-defined regions

Different public issues have fundamentally different geographic footprints.

## 12. Geographic filtering of the hierarchy

Keeping geography separate creates a powerful future interaction: the same issue visualization can be filtered or reweighted by location.

For example:

- **Global** shows the broad Atlas activity distribution.
- Selecting **United States** reweights the hierarchy using activity relevant to the United States.
- Selecting **Washington** changes the relative weights again.
- Selecting **Seattle** shows the issue landscape associated with Seattle.

This enables questions such as:

- “What is happening with housing affordability?”
- “What problems are people discussing in Seattle?”
- “What are the biggest housing issues in Seattle?”

The third question is effectively the intersection of two independent dimensions: **Housing × Seattle**.

## 13. Working conceptual model

A useful way to keep the architecture understandable is:

> **Issues and solutions describe _what_. Locations describe _where_. Posts describe _what people are saying_. Relationships describe _how concepts connect_.**

These concepts should remain separate in the underlying model even when the interface combines them into a seamless experience.

## 14. Design questions to resolve before production ontology work

Before massively expanding the demo hierarchy, it would be useful to define explicit rules for:

- What qualifies as a root?
- What qualifies as an issue versus a sub-issue?
- What qualifies as a solution?
- When should a concept become its own node rather than remain a post?
- How are duplicate or near-duplicate community-created nodes merged?
- Who approves proposed nodes at shallower depths?
- Can a solution have sub-issues, and can an issue contain competing solutions?
- What types of “related to” relationships should exist?
- How should location relevance be asserted, verified, inherited, and disputed?
- Which geographic relationships are hierarchical versus overlapping?
- What activity signals should determine polygon weight?

These rules can provide the stable foundation for later expanding every branch of the Atlas while still allowing public participation to create the long-tail detail.