(() => {
  const layerKindByParent = new Map();

  function kindCounts(parent) {
    let issues = 0, solutions = 0;
    (parent?.children || []).forEach(child => {
      if (child.kind === 'solution') solutions += 1;
      else issues += 1;
    });
    return { issues, solutions };
  }

  function availableMode(parent, preferred = null) {
    const counts = kindCounts(parent);
    const requested = preferred || layerKindByParent.get(parent?.id) || 'issue';
    if (requested === 'solution' && counts.solutions) return 'solution';
    if (requested === 'issue' && counts.issues) return 'issue';
    return counts.issues ? 'issue' : (counts.solutions ? 'solution' : 'issue');
  }

  window.__atlasLayerKinds = { layerKindByParent, kindCounts, availableMode };
})();