// Keep the selected hierarchy branch and per-layer issue/solution toggles in the
// URL so reloads and shared links reopen the same view.
// Example: #path=root-environment/environment-biodiversity&layers=root-environment:solution
(() => {
  if (typeof render !== "function" || typeof forestData === "undefined") return;

  const pathHashKey = "path";
  const layersHashKey = "layers";
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

    let choices = forestData;
    for (const id of ids) {
      const node = Array.isArray(choices) ? choices.find(item => item.id === id) : null;
      if (!node) return null;
      choices = node.children || [];
    }
    return ids;
  }

  function serializeLayerKinds() {
    const state = typeof window.atlasGetLayerKindState === "function"
      ? window.atlasGetLayerKindState()
      : (window.__atlasPendingLayerKinds || {});
    return Object.entries(state || {})
      .filter(([, kind]) => kind === "issue" || kind === "solution")
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, kind]) => `${encodeURIComponent(id)}:${kind === "solution" ? "s" : "i"}`)
      .join(",");
  }

  function layerKindsFromSerialized(serialized) {
    const result = {};
    if (!serialized) return result;
    serialized.split(",").filter(Boolean).forEach(entry => {
      const splitAt = entry.lastIndexOf(":");
      if (splitAt < 1) return;
      let id = entry.slice(0, splitAt);
      try { id = decodeURIComponent(id); } catch (_) {}
      const code = entry.slice(splitAt + 1);
      if (!id || (code !== "i" && code !== "s")) return;
      result[id] = code === "s" ? "solution" : "issue";
    });
    return result;
  }

  function stateFromLocation() {
    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);
    return {
      path: params.get(pathHashKey) || "",
      layers: params.get(layersHashKey) || ""
    };
  }

  function serializedState() {
    return `${serializePath()}|${serializeLayerKinds()}`;
  }

  function replaceHash(pathSerialized, layersSerialized) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams();
    if (pathSerialized) params.set(pathHashKey, pathSerialized);
    if (layersSerialized) params.set(layersHashKey, layersSerialized);
    url.hash = params.toString();
    history.replaceState(history.state, "", url);
  }

  function syncUrlFromFocus() {
    if (restoring) return;
    const pathSerialized = serializePath();
    const layersSerialized = serializeLayerKinds();
    const combined = `${pathSerialized}|${layersSerialized}`;
    if (combined === lastSerialized) return;
    lastSerialized = combined;
    replaceHash(pathSerialized, layersSerialized);
  }

  function restoreFromUrl({ animate = false } = {}) {
    const incoming = stateFromLocation();
    const resolved = pathFromSerialized(incoming.path);
    if (resolved == null) {
      restoring = true;
      focusPath = [];
      cameraY = 0;
      window.__atlasPendingLayerKinds = {};
      if (typeof window.atlasRestoreLayerKindState === "function") window.atlasRestoreLayerKindState({});
      render();
      restoring = false;
      lastSerialized = "|";
      replaceHash("", "");
      return false;
    }

    const layerKinds = layerKindsFromSerialized(incoming.layers);
    window.__atlasPendingLayerKinds = layerKinds;
    if (typeof window.atlasRestoreLayerKindState === "function") {
      window.atlasRestoreLayerKindState(layerKinds);
    }

    restoring = true;
    focusPath = resolved;
    if (!focusPath.length) cameraY = 0;
    render();
    if (focusPath.length && typeof scrollToDepth === "function") {
      requestAnimationFrame(() => scrollToDepth(focusPath.length - 1, animate));
    }
    restoring = false;
    lastSerialized = serializedState();
    return true;
  }

  const baseRenderWithUrlState = render;
  render = function(...args) {
    const result = baseRenderWithUrlState(...args);
    syncUrlFromFocus();
    return result;
  };

  window.atlasSyncUrlState = syncUrlFromFocus;
  window.addEventListener("hashchange", () => restoreFromUrl({ animate: true }));

  const incoming = stateFromLocation();
  if (incoming.path || incoming.layers) restoreFromUrl({ animate: false });
  else syncUrlFromFocus();
})();
