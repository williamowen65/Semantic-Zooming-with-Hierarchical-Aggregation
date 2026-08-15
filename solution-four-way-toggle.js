// Compatibility stylesheet for the dynamic per-node response toggle.
// Response options are now rendered directly from each node's `responseTypes`
// by layer-context.js; this module no longer defines a solution-specific schema.
(() => {
  const style = document.createElement('style');
  style.textContent = `
    .solution-toggle-scroll{width:100%;height:24px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-ms-overflow-style:none;overscroll-behavior-x:contain;touch-action:pan-x;border-radius:999px}
    .solution-toggle-scroll::-webkit-scrollbar{display:none}
    .solution-four-way-toggle{display:flex!important;width:100%!important;min-width:max-content!important;grid-template-columns:none!important;padding:2px!important;box-sizing:border-box!important}
    .solution-four-way-toggle button{flex:1 0 max-content!important;min-width:max-content!important;padding-left:12px!important;padding-right:12px!important;font-size:10px!important;white-space:nowrap!important}
    @media(max-width:720px){.solution-four-way-toggle button{padding-left:11px!important;padding-right:11px!important;font-size:9.5px!important}}
  `;
  document.head.appendChild(style);
})();