(() => {
  const layerKindByParent = new Map();
  const solutionKinds = ['challenge', 'implementation', 'yay', 'nay'];

  function kindCounts(parent) {
    const counts = { issues: 0, solutions: 0, challenges: 0, implementations: 0, yays: 0, nays: 0 };
    (parent?.children || []).forEach(child => {
      if (child.kind === 'solution') counts.solutions += 1;
      else if (child.kind === 'challenge') counts.challenges += 1;
      else if (child.kind === 'implementation') counts.implementations += 1;
      else if (child.kind === 'yay') counts.yays += 1;
      else if (child.kind === 'nay') counts.nays += 1;
      else counts.issues += 1;
    });
    return counts;
  }

  function countForMode(counts, mode) {
    return counts[`${mode}s`] || 0;
  }

  function modesFor(parent) {
    return parent?.kind === 'solution' ? solutionKinds : ['issue', 'solution'];
  }

  function availableMode(parent, preferred = null) {
    const counts = kindCounts(parent);
    const modes = modesFor(parent);
    const requested = preferred || layerKindByParent.get(parent?.id) || modes[0];
    if (modes.includes(requested) && countForMode(counts, requested)) return requested;
    return modes.find(mode => countForMode(counts, mode)) || modes[0];
  }

  window.__atlasLayerKinds = { layerKindByParent, kindCounts, countForMode, modesFor, availableMode };
})();