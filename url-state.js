// Keep the selected hierarchy branch in the URL so reloads and shared links
// reopen the same part of the tree. focusPath stores node IDs, not node objects.
// Example: #path=root-environment/environment-biodiversity
(() => {
  if (typeof render !== "function" || typeof forestData === "undefined") return;

  const hashKey = "path";
  let restoring = false;
  let lastSerialized = null;

  function idFromPathEntry(entry) {
    if (typeof entry === "string") return entry;
    if (entry && typeof entry.id === "string") return entry.id;
    return null;
  }

  function serializePath(path = focusPath) {
    if (!Array.isArray(path) || !path.length) return "";
    const ids = path.map(idFromPathEntry);
    if (ids.some(id => !id)) return "";
    return ids.map(id => encodeURIComponent(id)).join("/");
  }

  function pathFromSerialized(serialized) {
    if (!serialized) return [];
    const ids = serialized.split("/").filter(Boolean).map(part => {
      try { return decodeURIComponent(part); } catch (_) { return part; }
    });
    if (!ids.length) return [];
    if (ids.some(id => !id || id === "undefined" || id === "null")) return null;

    // Validate that the IDs form one real parent -> child chain, but return IDs
    // because that is the representation used by focusPath throughout the app.
    let choices = forestData;
    for (const id of ids) {
      const node = Array.isArray(choices) ? choices.find(item => item.id === id) : null;
      if (!node) return null;
      choices = node.children || [];
    }
    return ids;
  }

  function serializedFromLocation() {
    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);
    return params.get(hashKey) || "";
  }

  function replaceHash(serialized) {
    const url = new URL(window.location.href);
    url.hash = serialized ? `${hashKey}=${serialized}` : "";
    history.replaceState(history.state, "", url);
  }

  function syncUrlFromFocus() {
    if (restoring) return;
    const serialized = serializePath();
    if (serialized === lastSerialized) return;
    lastSerialized = serialized;
    replaceHash(serialized);
  }

  function restoreFromUrl({ animate = false } = {}) {
    const serialized = serializedFromLocation();
    const resolved = pathFromSerialized(serialized);
    if (resolved == null) {
      // A stale/malformed hash (including the previous undefined/undefined bug)
      // should never strand the visualization in a phantom branch.
      restoring = true;
      focusPath = [];
      cameraY = 0;
      render();
      restoring = false;
      lastSerialized = "";
      replaceHash("");
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

  const incoming = serializedFromLocation();
  if (incoming) restoreFromUrl({ animate: false });
  else syncUrlFromFocus();
})();
