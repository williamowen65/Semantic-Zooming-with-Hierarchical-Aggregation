// Keeps issue/solution icons inline immediately before the first label line.
// This is presentation-only: semantic-icons.js still owns icon drawing and zoom behavior.
(() => {
  function positionIcon(cell) {
    const text = cell.querySelector("text.cell-label");
    const icon = cell.querySelector("g.semantic-kind-icon");
    const firstLine = text?.querySelector("tspan");
    if (!text || !icon || !firstLine) return;

    const fontSize = parseFloat(getComputedStyle(text).fontSize) || 12;
    const iconSize = Math.max(9, Math.min(16, fontSize * 0.78));
    const lineX = Number(firstLine.getAttribute("x") || text.getAttribute("x") || 0);
    const lineY = Number(text.getAttribute("y") || 0);
    let lineWidth = 0;
    try { lineWidth = firstLine.getComputedTextLength(); } catch (_) {}

    // Labels are centered, so the first line starts half its measured width left
    // of x. Put the icon just before that start and align it optically to the line.
    const gap = Math.max(3, fontSize * 0.28);
    const iconX = lineX - lineWidth / 2 - gap - iconSize * 0.72;
    const iconY = lineY - fontSize * 0.34;

    icon.setAttribute("data-icon-x", iconX);
    icon.setAttribute("data-icon-y", iconY);
    icon.setAttribute("data-icon-size", iconSize);
    icon.setAttribute("transform", `translate(${iconX},${iconY})`);

    // Resize the existing geometry without changing which symbol is used.
    const kind = icon.classList.contains("semantic-kind-solution") ? "solution" : "issue";
    if (kind === "solution") {
      const circle = icon.querySelector("circle");
      const path = icon.querySelector("path");
      if (circle) circle.setAttribute("r", iconSize * 0.62);
      if (path) path.setAttribute("d", `M${-iconSize*.28},${iconSize*.02} L${-iconSize*.06},${iconSize*.26} L${iconSize*.34},${-iconSize*.24}`);
    } else {
      const path = icon.querySelector("path");
      const line = icon.querySelector("line");
      const dot = icon.querySelector("circle");
      const r = iconSize * 0.72;
      if (path) path.setAttribute("d", `M0,${-r} L${r*.88},${r*.64} L${-r*.88},${r*.64} Z`);
      if (line) {
        line.setAttribute("y1", -iconSize*.29);
        line.setAttribute("y2", iconSize*.13);
      }
      if (dot) {
        dot.setAttribute("cy", iconSize*.34);
        dot.setAttribute("r", Math.max(1.05, iconSize*.07));
      }
    }
  }

  function positionAll() {
    document.querySelectorAll("#viz g.cell").forEach(positionIcon);
  }

  // semantic-icons.js performs its initial render synchronously before this file.
  requestAnimationFrame(positionAll);

  // Re-apply after later renders (selection, resize, hierarchy navigation).
  const viz = document.querySelector("#viz");
  if (viz && typeof MutationObserver !== "undefined") {
    let queued = false;
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; positionAll(); });
    }).observe(viz, { childList: true, subtree: true });
  }
})();