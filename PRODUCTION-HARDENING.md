# Atlas Prototype → Production Hardening Notes

## Purpose

This document is a working checklist for turning the current Atlas / semantic-zooming prototype into code that is easier to understand, audit, test, secure, package, and eventually use inside a larger production application.

The prototype reaching the desired interaction model is a change in phase. The next job is less about rapidly inventing behavior and more about making the behavior **trustworthy, maintainable, testable, and reusable**.

AI-generated code should be treated like code from a fast but unfamiliar contributor: useful and productive, but not exempt from normal engineering review.

---

## 1. Make the code human-readable first

Before doing a serious security or architecture review, format the source code so a human can actually inspect it.

Current prototype code that is compressed onto single lines or accumulated through small patches should be normalized into a consistent style.

### Actions

- Run a formatter such as **Prettier** across JavaScript, CSS, HTML, JSON, and Markdown where appropriate.
- Establish a checked-in formatter configuration rather than relying on editor defaults.
- Add a format-check command that can run in CI.
- Avoid minified/compressed source in the repository. Minification should be a build output, not the editable source.
- Read the formatted code manually after formatting; formatting makes review possible but does not constitute review.

### Goal

A developer should be able to open any source file and understand its structure without first transforming it.

---

## 2. Establish a normal linting baseline

Use a JavaScript linter to catch suspicious patterns, accidental globals, unreachable code, inconsistent assumptions, and other defects that are easy to miss during rapid prototyping.

### Actions

- Add **ESLint**.
- Start with a conservative recommended ruleset rather than enabling hundreds of stylistic rules at once.
- Resolve warnings deliberately rather than globally disabling rules that expose inconvenient prototype patterns.
- Consider security-oriented ESLint rules where they provide useful signal.
- Add linting to CI once the initial cleanup is complete.

### Goal

New code should not quietly reintroduce classes of mistakes that have already been cleaned up.

---

## 3. Run security-focused static analysis

No single security scanner is sufficient. Use multiple complementary layers.

### Candidate tools

- **Semgrep** — pattern-based static analysis with security rules for JavaScript and web applications.
- **GitHub CodeQL** — deeper static analysis that integrates naturally with GitHub repositories.
- **ESLint security rules** — useful for lower-level JavaScript patterns.
- **GitHub dependency/security alerts** where applicable.

### Important principle

Scanner output is a review queue, not a verdict. Investigate findings in context, fix genuine risks, and document intentional exceptions.

---

## 4. Review dependencies and the software supply chain

If/when the project gains npm dependencies, treat dependency security as its own concern.

### Actions

- Keep the dependency tree small where practical.
- Run `npm audit` or the equivalent package-manager audit.
- Enable Dependabot or equivalent dependency update/security alerts.
- Prefer well-maintained packages with clear ownership and release histories.
- Remove unused dependencies.
- Commit and respect a lockfile.
- Avoid pulling executable code dynamically from arbitrary third-party locations.
- Review major dependency upgrades rather than blindly accepting automated changes.

---

## 5. Manually audit dangerous browser boundaries

Static tools are useful, but several areas deserve explicit human inspection because Atlas will eventually display user-created content.

### DOM / XSS review

Search for and inspect uses of:

- `innerHTML`
- `outerHTML`
- `insertAdjacentHTML`
- dynamically constructed HTML strings
- inline event-handler strings
- `eval`
- `new Function`
- dynamic script injection
- unsafe URL construction
- SVG content generated from user-controlled strings

Prefer DOM APIs and `textContent` for user-provided text whenever possible.

If rich user-authored HTML is ever supported, sanitize it with a well-reviewed sanitizer and define exactly which markup is permitted.

### URL state

The prototype already uses URL/navigation state. Review:

- query parameters;
- hashes;
- path-derived identifiers;
- redirects;
- values copied from URLs into the DOM;
- malformed or unexpectedly large values.

Treat URL input as untrusted.

### Browser storage

Review any use of:

- `localStorage`
- `sessionStorage`
- IndexedDB
- cookies

Do not store secrets or sensitive authentication material in inappropriate browser storage.

---

## 6. Separate prototype data from untrusted production data

The current forest is controlled demo data. Production Atlas data will eventually be created by users and should be treated as hostile/untrusted input at every boundary.

### Production assumptions

A user may submit:

- unexpected Unicode;
- extremely long titles/descriptions;
- HTML/script-like text;
- malformed data;
- duplicate identifiers;
- invalid relationships;
- deeply nested structures;
- attempts to impersonate another node/user;
- URLs or external references;
- content designed to break layouts.

### Actions

- Define schemas for incoming data.
- Validate data at API boundaries.
- Enforce length and shape limits server-side.
- Escape text at rendering boundaries.
- Do not rely on client-side validation for authorization or integrity.
- Test unusually long titles and paragraph-sized descriptions in the visualization.

---

## 7. Define one source of truth for application state

The prototype has evolved through patches, compatibility bridges, and separate helper modules. Before production packaging, identify who owns each piece of state.

Examples include:

- selected/focused node;
- focus path;
- active child type (Issue/Solution or Challenge/Implementation);
- camera/zoom state;
- theme;
- URL state;
- filters;
- user/session state.

### Questions

- Is the same state represented in multiple places?
- Can one module mutate state without another module knowing?
- Does rendering derive from state, or does DOM state sometimes become the source of truth?
- Are event handlers relying on script load order?
- Which state should eventually be controlled by the host application versus the Atlas visualization?

### Goal

A change should have one understandable path from **intent → state update → render**.

---

## 8. Simplify the module graph

The prototype contains small patch files and compatibility layers created while iterating quickly. That is reasonable during experimentation, but production should not preserve every historical workaround indefinitely.

### Actions

- Document the current script/module load order.
- Identify bridge files that only exist because of earlier architecture.
- Identify duplicate logic.
- Consolidate related behavior where doing so makes ownership clearer.
- Remove dead or superseded modules.
- Replace implicit global dependencies with explicit imports or a clear module interface.
- Establish a single predictable initialization sequence.

Do this incrementally and preserve behavior with tests while refactoring.

---

## 9. Add behavioral tests before major refactoring

Tests are especially important before consolidating prototype code because they let the implementation change without accidentally changing the interaction model that has already been worked out.

### High-value behaviors to test

- Selecting a root.
- Drilling through an Issue path.
- Switching Issue ↔ Solution child layers.
- Switching Challenge ↔ Implementation child layers.
- Changing a toggle on a historical card truncates the deeper path correctly.
- The toggle always reflects the child layer currently being displayed.
- Returning to an ancestor behaves consistently.
- URL state restores the intended view.
- Long card text grows without overlap or clipping.
- Unselected/selected visual states remain distinct.
- Leaf nodes/end states behave correctly.
- Data containing unusual characters renders as text rather than executable markup.

### Test layers

A useful eventual mix could include:

- small unit tests for state transformations;
- DOM/component tests for rendering behavior;
- a handful of end-to-end browser tests for critical navigation flows.

The state transformation behind historical-toggle behavior is a particularly good candidate for a pure unit test.

---

## 10. Consider introducing TypeScript or runtime schemas

This does not need to happen immediately, but the ontology is becoming rich enough that explicit types may pay off.

Possible entities include:

- Issue
- Solution
- Challenge
- Implementation
- Inquiry
- User
- Vote
- Relationship
- Visibility state
- Featured status

TypeScript can catch developer mistakes, while runtime schema validation (for example with a schema library) protects actual network/API boundaries. They solve different problems and can be used together.

---

## 11. Define the reusable visualization boundary

Before packaging Atlas into another application, determine what the visualization actually owns.

A useful target is for the semantic-zooming interface to operate from a data object plus a small initialization/configuration API.

Conceptually:

```js
const atlas = createAtlasExplorer({
  element,
  data,
  currentUser,
  permissions,
  onSelectNode,
  onVote,
  onCreateNode,
  onNavigate
});
```

The exact API should be designed later; this is a boundary sketch, not a specification.

### The Atlas visualization/package could own

- hierarchy rendering;
- semantic zooming;
- card stacks;
- Issue/Solution and Challenge/Implementation toggles;
- focus-path interaction;
- visualization-specific camera state;
- visualization controls;
- presentation of the ontology.

### The host application could own

- authentication;
- user profiles;
- persistent networking;
- routing outside the visualization;
- account settings;
- moderation interfaces;
- server authorization;
- billing, if relevant;
- global application chrome/navigation.

### Milestone

A useful architecture milestone is:

> **The demo can run from a JSON-like data object plus one initialization call, without the host application needing to understand Atlas's internal rendering implementation.**

If that works cleanly, the package boundary is probably becoming healthy.

---

## 12. Distinguish a frontend package from a backend API

“Package Atlas as an API” can refer to two different things and they should remain conceptually separate.

### Reusable frontend module

A JavaScript package, component, or potentially Web Component that renders and manages the interactive Atlas visualization inside another site.

### Network/service API

A backend interface that persists and retrieves things such as:

- inquiries;
- nodes;
- relationships;
- votes;
- users;
- permissions;
- moderation state;
- featured/discovery status.

The frontend module can consume this API, but the visualization itself should not need to own authentication and server-side authorization logic.

---

## 13. Authentication and authorization must be server-enforced

Once Atlas supports real accounts and contributions, never trust the browser to decide what a user is allowed to do.

Examples:

- creating/editing/deleting nodes;
- voting;
- editing an inquiry root;
- moderation;
- featuring an inquiry;
- changing ownership/stewardship;
- viewing private/unlisted content.

The UI can hide controls a user cannot use, but the backend must independently enforce every permission.

---

## 14. Think about abuse, not only technical exploits

A public think tank has application-specific security problems beyond conventional XSS or dependency vulnerabilities.

Eventually consider:

- spam;
- automated voting;
- coordinated manipulation;
- duplicate accounts;
- harassment;
- malicious links;
- mass node creation;
- vandalism;
- impersonation;
- attempts to hijack popular inquiries;
- denial-of-service through huge/deep content trees;
- moderation abuse;
- brigading of featured inquiries.

These are product/security design problems as much as code problems.

---

## 15. Add CI as the project hardens

A future pull request should ideally be checked automatically before merge.

Possible CI stages:

1. install dependencies from the lockfile;
2. verify formatting;
3. lint;
4. run unit tests;
5. run browser/integration tests where practical;
6. run security/static analysis;
7. build the reusable package/site;
8. deploy only after required checks pass.

GitHub Pages deployment should eventually consume a reproducible build artifact rather than depend on a hand-maintained list of individual prototype files.

---

## 16. Move toward a real build system

The current Pages workflow explicitly copies many individual JavaScript and CSS files. That has been useful for the prototype but creates a risk: adding a source file can work locally while being silently omitted from deployment.

A production-oriented build should ideally:

- have explicit entry points;
- follow imports automatically;
- bundle/copy required assets deterministically;
- produce versioned build output;
- fail if an import cannot be resolved;
- avoid manually updating a deployment asset list every time a module is added.

This would eliminate a class of deployment mistakes encountered during prototype iteration.

---

## 17. Content Security Policy and browser hardening

As the frontend stabilizes, evaluate a restrictive **Content Security Policy (CSP)**.

A good CSP is easier to adopt when the application already avoids:

- inline scripts;
- inline event handlers;
- `eval`-like behavior;
- uncontrolled third-party scripts.

Also consider appropriate security headers when Atlas is served by the production application.

Do not bolt CSP on at the very end if architectural choices are making it difficult; use it as feedback about unsafe frontend patterns.

---

## 18. Logging, errors, and observability

Production failures should be diagnosable without exposing sensitive information.

Eventually define:

- structured client/server error handling;
- useful but non-sensitive logs;
- error reporting/monitoring;
- API request identifiers where useful;
- metrics for failed operations;
- graceful UI states when data cannot load or an action fails.

Avoid logging authentication tokens, private content, or unnecessary personal data.

---

## 19. Accessibility and robustness are part of production quality

The semantic visualization should eventually be tested beyond the happy path.

Consider:

- keyboard navigation;
- visible focus states;
- screen-reader semantics;
- color contrast;
- reduced-motion preferences;
- zoomed browser text;
- narrow phones;
- very long text;
- touch targets;
- browser differences;
- high node counts and performance.

Security hardening should not be the only definition of “production ready.”

---

## 20. Suggested order of operations

Do not try to do every hardening task simultaneously.

### Phase A — Make the prototype reviewable

- Freeze major interaction experimentation temporarily.
- Format the code.
- Add linting.
- Document the module/load graph.
- Identify obsolete patch/bridge layers.
- Manually read the important interaction/state code.

### Phase B — Protect existing behavior

- Add tests around focus-path and toggle behavior.
- Add tests for long/untrusted text rendering.
- Establish CI for formatting, linting, and tests.

### Phase C — Security audit

- Run Semgrep/CodeQL/security linting.
- Audit DOM injection and URL state manually.
- Review dependencies.
- Define input schemas and trust boundaries.
- Fix findings before exposing real user-generated content.

### Phase D — Refactor architecture

- Consolidate duplicate state ownership.
- Remove obsolete compatibility code.
- Move toward explicit modules/imports.
- Establish one initialization path.
- Keep tests green throughout the refactor.

### Phase E — Package the visualization

- Define the public frontend API.
- Make the demo boot from data + configuration.
- Build Atlas as a reusable module/component.
- Replace manual Pages asset copying with a reproducible build.

### Phase F — Integrate with the production application/backend

- Define persistent data/API models.
- Add authentication and server-side authorization.
- Add profiles, inquiry ownership, visibility, moderation, voting, etc.
- Threat-model abuse and permissions before opening contribution features publicly.

---

## Production-readiness questions

Before treating the prototype as production code, be able to answer:

- Can a human developer comfortably read the entire important code path?
- Is there one understandable source of truth for navigation state?
- Do automated tests protect the interactions already designed?
- What data is trusted and what data is untrusted?
- Can user text ever become executable HTML/JavaScript?
- Are permissions enforced on the server rather than merely represented in the UI?
- Are dependencies known, locked, and monitored?
- Do security scanners run automatically?
- Does adding a module automatically include it in the build?
- Can the Atlas visualization run independently from the surrounding site?
- Is the frontend package API smaller and more stable than its internal implementation?
- Can a future developer change internals without needing to rewrite the host application?
- Can failures be diagnosed safely?
- Is the application usable with keyboard/touch/accessibility tools and unusually long real-world content?

---

## Working principle

> **The prototype proved what Atlas should feel like. The hardening phase should make that behavior something we can understand, test, trust, and reuse.**

AI assistance can continue to be useful during this phase, but every generated change should increasingly pass through the same formatter, linter, tests, static analysis, code review, and architectural boundaries expected of any other production contribution.
