(() => {
  // Dynamic response model: every node is fundamentally the same kind of object.
  // A parent node decides which response relationships it solicits through
  // `responseTypes`, and each child appearance declares its `responseType`.
  const responseTypeByParent = new Map();
  const legacyModeForKind = kind => kind === 'relationship' ? 'connection' : kind;
  const semanticKind = node => node?.semanticKind || node?.kind || 'node';
  const hierarchyKind = node => node?.relationshipContentKind || semanticKind(node); // compatibility only

  const titleCase = value => String(value || '').replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  function normalizeDefinition(def) {
    if (typeof def === 'string') return { id:def, label:titleCase(def), singular:def, plural:`${def}s` };
    const id = String(def?.id || def?.type || def?.key || 'response');
    const singular = def?.singular || def?.labelSingular || def?.label || titleCase(id);
    const plural = def?.plural || def?.labelPlural || (String(singular).endsWith('s') ? singular : `${singular}s`);
    return { ...def, id, label:def?.label || plural, singular, plural };
  }

  function responseTypeForChild(child) {
    return child?.responseType || child?.responseRole || child?.edgeType || legacyModeForKind(semanticKind(child));
  }

  function inferredDefinitions(parent) {
    const seen = new Set();
    const defs = [];
    (parent?.children || []).forEach(child => {
      const id = responseTypeForChild(child);
      if (!id || seen.has(id)) return;
      seen.add(id);
      defs.push(normalizeDefinition(id));
    });
    return defs;
  }

  function responseDefinitionsFor(parent) {
    const explicit = Array.isArray(parent?.responseTypes) ? parent.responseTypes : [];
    return (explicit.length ? explicit : inferredDefinitions(parent)).map(normalizeDefinition);
  }

  function responseCounts(parent) {
    const counts = Object.create(null);
    responseDefinitionsFor(parent).forEach(def => { counts[def.id] = 0; });
    (parent?.children || []).forEach(child => {
      const id = responseTypeForChild(child);
      if (!id) return;
      counts[id] = (counts[id] || 0) + 1;
    });
    return counts;
  }

  function countForMode(counts, mode) { return counts?.[mode] || 0; }
  function modesFor(parent) { return responseDefinitionsFor(parent).map(def => def.id); }
  function definitionFor(parent, id) { return responseDefinitionsFor(parent).find(def => def.id === id) || normalizeDefinition(id); }

  function availableMode(parent, preferred = null) {
    const defs = responseDefinitionsFor(parent);
    if (!defs.length) return null;
    const counts = responseCounts(parent);
    const requested = preferred || responseTypeByParent.get(parent?.id) || defs[0].id;
    if (defs.some(def => def.id === requested)) return requested;
    return defs.find(def => countForMode(counts, def.id))?.id || defs[0].id;
  }

  window.__atlasLayerKinds = {
    // New names.
    responseTypeByParent,
    responseDefinitionsFor,
    responseTypeForChild,
    responseCounts,
    definitionFor,
    // Compatibility aliases for the existing UI modules and URL state.
    layerKindByParent: responseTypeByParent,
    kindCounts: responseCounts,
    countForMode,
    modesFor,
    availableMode,
    semanticKind,
    hierarchyKind,
    modeForKind: legacyModeForKind
  };
})();