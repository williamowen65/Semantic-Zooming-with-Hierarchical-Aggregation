// Compatibility loader for the split layer-kind modules.
(() => {
  const modules = [
    'layer-kind-state.js',
    'layer-kind-filter.js',
    'layer-kind-api.js',
    'layer-kind-actions.js',
    'root-layer-label.js',
    'card-stack-layer-kind-bridge.js',
    'solution-four-way-toggle.js'
  ];
  function load(index) {
    if (index >= modules.length) return;
    const script = document.createElement('script');
    script.src = `${modules[index]}?v=20260814-four-way-solution`;
    script.onload = () => load(index + 1);
    document.head.appendChild(script);
  }
  load(0);
})();