// Compatibility loader for the split layer-kind modules.
(() => {
  const modules = [
    'layer-kind-state.js',
    'layer-kind-filter.js',
    'layer-kind-api.js',
    'layer-kind-actions.js',
    'root-layer-label.js',
    'card-stack-layer-kind-bridge.js',
    'layer-kind-clicks.js',
    'solution-four-way-toggle.js',
    'relationship-connections.js'
  ];
  const ownVersion = (() => {
    try {
      const src = document.currentScript?.src;
      return src ? (new URL(src, window.location.href).searchParams.get('v') || '20260814-layer-kind-modules') : '20260814-layer-kind-modules';
    } catch (_) {
      return '20260814-layer-kind-modules';
    }
  })();
  function load(index) {
    if (index >= modules.length) return;
    const script = document.createElement('script');
    script.src = `${modules[index]}?v=${encodeURIComponent(ownVersion)}`;
    script.onload = () => load(index + 1);
    document.head.appendChild(script);
  }
  load(0);
})();