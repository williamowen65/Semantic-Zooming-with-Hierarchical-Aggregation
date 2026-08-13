// Compatibility loader for the split layer-kind modules.
(() => {
  const modules = [
    'layer-kind-state.js',
    'layer-kind-filter.js',
    'layer-kind-api.js',
    'layer-kind-actions.js',
    'root-layer-label.js',
    'card-stack-layer-kind-bridge.js'
  ];
  function load(index) {
    if (index >= modules.length) return;
    const script = document.createElement('script');
    script.src = `${modules[index]}?v=20260813-1435`;
    script.onload = () => load(index + 1);
    document.head.appendChild(script);
  }
  load(0);
})();