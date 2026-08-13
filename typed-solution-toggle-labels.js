// Keeps the existing two-channel layer toggle mechanics while presenting
// solution children with public-facing Challenge / Implementation terminology.
(() => {
  const semanticKind = node => node?.semanticKind || node?.kind;

  function syncSolutionToggleLabels() {
    const entries = Array.from(document.querySelectorAll('#viz .layer-context-entry'));
    entries.forEach((entry, index) => {
      const id = focusPath?.[index];
      const parent = id ? nodeById.get(id) : null;
      if (!parent || semanticKind(parent) !== 'solution') return;

      let challenges = 0;
      let implementations = 0;
      (parent.children || []).forEach(child => {
        const kind = semanticKind(child);
        if (kind === 'challenge') challenges += 1;
        if (kind === 'implementation') implementations += 1;
      });

      const buttons = Array.from(entry.querySelectorAll('.layer-kind-toggle button'));
      if (buttons[0]) buttons[0].textContent = `${challenges} ${challenges === 1 ? 'challenge' : 'challenges'}`;
      if (buttons[1]) buttons[1].textContent = `${implementations} ${implementations === 1 ? 'implementation' : 'implementations'}`;
      const group = entry.querySelector('.layer-kind-toggle');
      if (group) group.setAttribute('aria-label', 'Show solution challenges or implementations');
    });
  }

  let queued = false;
  function scheduleSync() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      syncSolutionToggleLabels();
    });
  }

  const viz = document.querySelector('#viz');
  if (viz && typeof MutationObserver !== 'undefined') {
    new MutationObserver(scheduleSync).observe(viz, { childList: true, subtree: true });
  }

  scheduleSync();
})();