// Public-facing label for the top-level challenge layer.
(() => {
  if (typeof render !== 'function' || typeof stage === 'undefined') return;

  function addRootChallengesLabel() {
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
      .text('Root challenges');
  }

  const baseRender = render;
  render = function() {
    baseRender();
    addRootChallengesLabel();
  };

  render();
})();