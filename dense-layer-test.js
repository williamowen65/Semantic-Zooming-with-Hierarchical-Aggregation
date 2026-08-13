// Development-only dense-layer stress test. The tools modal selects how many
// siblings appear in one layer so pan/zoom, label density, hit targets and render
// performance can be evaluated at realistic public-scale counts.
(() => {
  const select = document.querySelector('#dense-layer-size');
  if (!select || typeof forestData === 'undefined' || typeof annotate !== 'function' || typeof render !== 'function') return;

  const rootId = 'root-dense-layer-test';
  const supportedSizes = new Set([0, 50, 100, 250, 500, 1000]);
  let stressRoot = null;

  function makeItem(index) {
    const issue = index % 4 !== 3;
    const category = [
      'Access', 'Cost', 'Coordination', 'Timing', 'Communication',
      'Reliability', 'Capacity', 'Safety', 'Quality', 'Availability'
    ][index % 10];
    const context = [
      'for local residents', 'for families', 'at work', 'in my neighborhood',
      'for students', 'for older adults', 'for small businesses', 'for commuters'
    ][index % 8];
    return {
      id: `dense-test-${index + 1}`,
      name: `${issue ? 'Issue' : 'Solution'} ${index + 1}: ${category} ${context}`,
      votes: 40 + ((index * 73) % 1960),
      rating: Number((3.4 + ((index * 17) % 16) / 10).toFixed(1)),
      kind: issue ? 'issue' : 'solution'
    };
  }

  const itemPool = Array.from({ length: 1000 }, (_, index) => makeItem(index));

  function removeStressRoot() {
    const index = forestData.findIndex(root => root.id === rootId);
    if (index >= 0) forestData.splice(index, 1);
    if (typeof nodeById !== 'undefined' && nodeById?.delete) {
      nodeById.delete(rootId);
      itemPool.forEach(item => nodeById.delete(item.id));
    }
    stressRoot = null;
  }

  function showAllRoots() {
    if (window.stopHierarchyMomentum) window.stopHierarchyMomentum();
    focusPath = [];
    cameraY = 0;
    render();
    statusHost.textContent = 'Dense layer stress test off. Showing normal dataset.';
  }

  function setStressSize(rawSize) {
    const size = Number(rawSize);
    if (!supportedSizes.has(size)) return;

    removeStressRoot();
    if (size === 0) {
      showAllRoots();
      return;
    }

    stressRoot = {
      id: rootId,
      name: `Dense Layer Stress Test · ${size} Items`,
      votes: 5000,
      rating: 4.5,
      kind: 'issue',
      color: '#7d8792',
      children: itemPool.slice(0, size)
    };
    forestData.push(stressRoot);
    annotate(stressRoot);

    // Selecting the synthetic root gives a clean single-layer test: all children
    // are visible and unselected, while the layer keeps its normal pan/zoom tools.
    if (typeof focusNode === 'function') {
      focusNode(rootId);
    } else {
      focusPath = [rootId];
      render();
    }
    statusHost.textContent = `Dense layer stress test showing ${size} sibling items.`;
  }

  select.addEventListener('change', () => setStressSize(select.value));
})();
