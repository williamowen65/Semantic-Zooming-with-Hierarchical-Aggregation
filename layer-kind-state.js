(() => {
  const layerKindByParent = new Map();
  const solutionKinds = ['challenge', 'implementation', 'yay', 'nay', 'connection'];
  const issueKinds = ['issue', 'solution', 'connection'];
  const semanticKind = node => node?.semanticKind || node?.kind;
  const modeForKind = kind => kind === 'relationship' ? 'connection' : kind;

  function kindCounts(parent) {
    const counts = { issues: 0, solutions: 0, challenges: 0, implementations: 0, yays: 0, nays: 0, connections: 0 };
    (parent?.children || []).forEach(child => {
      const kind = semanticKind(child);
      if (kind === 'solution') counts.solutions += 1;
      else if (kind === 'challenge') counts.challenges += 1;
      else if (kind === 'implementation') counts.implementations += 1;
      else if (kind === 'yay') counts.yays += 1;
      else if (kind === 'nay') counts.nays += 1;
      else if (kind === 'relationship') counts.connections += 1;
      else counts.issues += 1;
    });
    return counts;
  }

  function countForMode(counts, mode) {
    return counts[`${mode}s`] || 0;
  }

  function modesFor(parent) {
    return semanticKind(parent) === 'solution' ? solutionKinds : issueKinds;
  }

  function availableMode(parent, preferred = null) {
    const counts = kindCounts(parent);
    const modes = modesFor(parent);
    const requested = modeForKind(preferred || layerKindByParent.get(parent?.id) || modes[0]);
    if (modes.includes(requested) && countForMode(counts, requested)) return requested;
    return modes.find(mode => countForMode(counts, mode)) || modes[0];
  }

  window.__atlasLayerKinds = { layerKindByParent, kindCounts, countForMode, modesFor, availableMode, semanticKind, modeForKind };
})();