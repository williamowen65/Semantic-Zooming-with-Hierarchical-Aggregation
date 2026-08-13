(() => {
  if (typeof render !== 'function' || typeof stage === 'undefined') return;
  const originalRender = render;
  function adjust() {
    const control = stage.select('.show-all-roots-control').node();
    if (!control) return;
    const toolbar = document.querySelector('.toolbar');
    const safeTop = (toolbar ? toolbar.getBoundingClientRect().bottom : 76) + 8;
    const currentTop = Number(control.getAttribute('y')) || 0;
    const delta = safeTop - currentTop;
    if (delta <= 0) return;
    control.setAttribute('y', safeTop);
    stage.selectAll('.layer-context-entry').nodes().forEach(entry => {
      entry.querySelectorAll('foreignObject').forEach(node => {
        node.setAttribute('y', (Number(node.getAttribute('y')) || 0) + delta);
      });
    });
    const child = stage.select('.child-cluster').node();
    if (child) {
      const match = (child.getAttribute('transform') || '').match(/translate\(\s*([-\d.]+)(?:[ ,]+)([-\d.]+)/);
      if (match) child.setAttribute('transform', `translate(${Number(match[1])},${Number(match[2]) + delta})`);
    }
  }
  render = function(...args) {
    const result = originalRender(...args);
    requestAnimationFrame(adjust);
    return result;
  };
  window.addEventListener('resize', () => requestAnimationFrame(adjust));
  requestAnimationFrame(adjust);
})();
