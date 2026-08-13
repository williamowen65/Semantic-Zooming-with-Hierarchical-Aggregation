// Legacy placeholder. Hierarchy-wide overview zoom was removed in favor of
// directly controlling each layer's height, so no zoom-specific gap correction
// is needed anymore.

// Load the delegated layer-kind click handler from this tiny, reliably loaded
// utility so rerendered toggle buttons always keep their behavior.
(() => {
  const script = document.createElement('script');
  script.src = 'layer-kind-clicks.js?v=20260813-1442';
  document.head.appendChild(script);
})();
