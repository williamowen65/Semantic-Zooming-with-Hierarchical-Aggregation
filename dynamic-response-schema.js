// Generic Atlas participation model.
//
// Nodes are content. Their meaning in a branch comes from the response
// relationship that connects them to a parent. Each node independently defines
// which response relationships it wants to solicit through `responseTypes`.
//
// The adapter below gives the current prototype data explicit response schemas
// without requiring the old ontology to drive the UI. New data can set
// `responseTypes` and `responseType` directly and bypass these legacy defaults.
(() => {
  if (typeof forestData === 'undefined') return;

  const ISSUE_RESPONSES = [
    { id:'issue', singular:'sub-issue', plural:'sub-issues' },
    { id:'solution', singular:'solution', plural:'solutions' }
  ];
  const SOLUTION_RESPONSES = [
    { id:'challenge', singular:'challenge', plural:'challenges' },
    { id:'implementation', singular:'implementation', plural:'implementations' },
    { id:'yay', singular:'yay', plural:'yays' },
    { id:'nay', singular:'nay', plural:'nays' }
  ];

  const cloneDefs = defs => defs.map(def => ({ ...def }));
  const legacyResponseType = child => {
    if (child?.responseType) return child.responseType;
    if (child?.semanticKind) return child.semanticKind === 'relationship' ? 'connection' : child.semanticKind;
    if (child?.kind === 'relationship') return 'connection';
    return child?.kind || 'response';
  };

  function defaultSchema(node) {
    // relationshipContentKind is retained only as a migration hint for the
    // current prototype's shared relationship appearances.
    const legacyType = node?.relationshipContentKind || node?.kind;
    return legacyType === 'solution' ? SOLUTION_RESPONSES : ISSUE_RESPONSES;
  }

  function makeExplicit(node) {
    if (!node || typeof node !== 'object') return;
    if (!Array.isArray(node.responseTypes)) node.responseTypes = cloneDefs(defaultSchema(node));
    (node.children || []).forEach(child => {
      if (!child.responseType) child.responseType = legacyResponseType(child);
      makeExplicit(child);
    });
  }

  forestData.forEach(makeExplicit);

  // Shared canonical relationship records are not always reached by walking the
  // appearance tree, so make their response schemas explicit too.
  if (window.atlasRelationships instanceof Map) {
    window.atlasRelationships.forEach(makeExplicit);
  }

  window.AtlasResponseSchema = {
    makeExplicit,
    issueDefaults: cloneDefs(ISSUE_RESPONSES),
    solutionDefaults: cloneDefs(SOLUTION_RESPONSES)
  };
})();