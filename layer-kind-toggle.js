// Separates every non-root child layer into Issues and Solutions views.
// The root layer always shows root issues. Each selected node/card owns the
// Issues/Solutions setting for the layer immediately beneath it.
(() => {
  if (typeof renderCluster !== 'function' || typeof render !== 'function') return;

  const layerKindByParent = new Map();
  const baseRenderCluster = renderCluster;

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

  function parentAndModeFor(options) {
    const className = String(options?.className || '');

    // Root overview and the root context layer are always root issues.
    if (className === 'root-overview' || /context-cluster\s+depth-0\b/.test(className)) {
      return { root: true, parent: null, mode: 'issue' };
    }

    const depthMatch = className.match(/context-cluster\s+depth-(\d+)/);
    if (depthMatch) {
      const depth = Number(depthMatch[1]);
      const parentId = focusPath?.[depth - 1];
      const parent = parentId ? nodeById.get(parentId) : null;
      const selectedChild = focusPath?.[depth] ? nodeById.get(focusPath[depth]) : null;
      return { root: false, parent, mode: availableMode(parent, selectedChild?.kind) };
    }

    if (className === 'child-cluster') {
      const parent = typeof currentNode === 'function' ? currentNode() : null;
      return { root: false, parent, mode: availableMode(parent) };
    }

    return null;
  }

  renderCluster = function(options) {
    const context = parentAndModeFor(options);
    if (!context || !Array.isArray(options?.items)) return baseRenderCluster(options);

    if (context.root) {
      const issues = options.items.filter(item => item.kind !== 'solution');
      return baseRenderCluster({ ...options, items: issues.length ? issues : options.items });
    }

    if (!context.parent) return baseRenderCluster(options);
    const filtered = options.items.filter(item => (item.kind === 'solution' ? 'solution' : 'issue') === context.mode);
    return baseRenderCluster({ ...options, items: filtered.length ? filtered : options.items });
  };

  window.atlasLayerKindModeFor = function(parentId) {
    const parent = nodeById.get(parentId);
    if (!parent) return 'issue';
    const parentDepth = Array.isArray(focusPath) ? focusPath.indexOf(parentId) : -1;
    const selectedChild = parentDepth >= 0 && focusPath[parentDepth + 1]
      ? nodeById.get(focusPath[parentDepth + 1])
      : null;
    return availableMode(parent, selectedChild?.kind);
  };

  window.atlasSetLayerKind = function(parentId, kind) {
    const parent = nodeById.get(parentId);
    if (!parent) return;
    const counts = kindCounts(parent);
    const desired = kind === 'solution' ? 'solution' : 'issue';
    if ((desired === 'issue' && !counts.issues) || (desired === 'solution' && !counts.solutions)) return;

    layerKindByParent.set(parentId, desired);
    if (window.stopHierarchyMomentum) window.stopHierarchyMomentum();

    // Treat the card's toggle like selecting that parent: clear anything deeper
    // so the newly displayed issue/solution layer begins with no selected child.
    if (typeof pathForNode === 'function') focusPath = pathForNode(parentId);
    render();
    requestAnimationFrame(() => {
      if (typeof scrollToDepth === 'function') scrollToDepth(Math.max(0, focusPath.length - 1), true);
    });
  };

  function addRootIssuesLabel() {
    stage.selectAll('.root-layer-label').remove();
    const firstCluster = stage.select('.root-overview, .context-cluster.depth-0').node();
    if (!firstCluster) return;
    const transform = firstCluster.getAttribute('transform') || '';
    const match = transform.match(/translate\(\s*[-\d.]+(?:[ ,]+)([-\d.]+)/);
    const top = match ? Number(match[1]) : (width < 720 ? 132 : 98);
    stage.append('text')
      .attr('class', 'root-layer-label')
      .attr('x', width < 720 ? 14 : 20)
      .attr('y', Math.max(width < 720 ? 128 : 92, top - 8))
      .attr('text-anchor', 'start')
      .text('Root issues');
  }

  const baseRender = render;
  render = function() {
    baseRender();
    addRootIssuesLabel();
  };

  render();
})();