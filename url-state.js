// Keep the selected hierarchy branch in the URL so reloads and shared links
// reopen the same part of the tree. Example: #path=root-environment/environment-biodiversity
(() => {
  if (typeof render !== "function" || typeof forestData === "undefined") return;

  const hashKey = "path";
  let restoring = false;
  let lastSerialized = null;

  function serializePath(path = focusPath) {
    if (!Array.isArray(path) || !path.length) return "";
    return path.map(node => encodeURIComponent(node.id)).join("/");
  }

  function pathFromSerialized(serialized) {
    if (!serialized) return [];
    const ids = serialized.split("/").filter(Boolean).map(part => {
      try { return decodeURIComponent(part); } catch (_) { return part; }
    });
    if (!ids.length) return [];

    const resolved = [];
    let choices = forestData;
    for (const id of ids) {
      const node = Array.isArray(choices) ? choices.find(item => item.id === id) : null;
      if (!node) return null;
      resolved.push(node);
      choices = node.children || [];
    }
    return resolved;
  }

  function serializedFromLocation() {
    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);
    return params.get(hashKey) || "";
  }

  function syncUrlFromFocus() {
    if (restoring) return;
    const serialized = serializePath();
    if (serialized === lastSerialized) return;
    lastSerialized = serialized;

    const url = new URL(window.location.href);
    if (serialized) url.hash = `${hashKey}=${serialized}`;
    else url.hash = "";
    history.replaceState(history.state, "", url);
  }

  function restoreFromUrl({ animate = false } = {}) {
    const serialized = serializedFromLocation();
    const resolved = pathFromSerialized(serialized);
    if (resolved == null) {
      // Do not strand the page on a stale or malformed branch link.
      lastSerialized = null;
      syncUrlFromFocus();
      return false;
    }

    restoring = true;
    focusPath = resolved;
    if (!focusPath.length) cameraY = 0;
    render();
    if (focusPath.length && typeof scrollToDepth === "function") {
      requestAnimationFrame(() => scrollToDepth(focusPath.length - 1, animate));
    }
    restoring = false;
    lastSerialized = serializePath();
    return true;
  }

  const baseRenderWithUrlState = render;
  render = function(...args) {
    const result = baseRenderWithUrlState(...args);
    syncUrlFromFocus();
    return result;
  };

  window.addEventListener("hashchange", () => restoreFromUrl({ animate: true }));

  // The app has already performed its initial render by the time this last script
  // runs. Re-render once only when the incoming link identifies a branch.
  const incoming = serializedFromLocation();
  if (incoming) restoreFromUrl({ animate: false });
  else syncUrlFromFocus();
})();
