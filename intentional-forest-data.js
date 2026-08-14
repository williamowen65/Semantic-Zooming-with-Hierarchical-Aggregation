// Intentionally empty dataset for testing the Atlas no-data state.
(() => {
  if (typeof forestData === "undefined") return;

  forestData.splice(0, forestData.length);
  if (typeof nodeById !== "undefined") nodeById.clear();
  if (typeof parentById !== "undefined") parentById.clear();
  if (typeof rootById !== "undefined") rootById.clear();
  if (typeof focusPath !== "undefined") focusPath = [];

  if (typeof render === "function") render();

  const host = document.querySelector("#viz");
  if (host && !host.querySelector(".empty-data-state")) {
    const message = document.createElement("div");
    message.className = "empty-data-state";
    message.setAttribute("role", "status");
    message.textContent = "There is no data to display.";
    Object.assign(message.style, {
      position: "absolute",
      inset: "0",
      display: "grid",
      placeItems: "center",
      padding: "24px",
      textAlign: "center",
      fontSize: "clamp(18px, 2.4vw, 28px)",
      fontWeight: "650",
      color: "currentColor",
      pointerEvents: "none"
    });
    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    host.appendChild(message);
  }

  const status = document.querySelector("#status");
  if (status) status.textContent = "There is no data to display.";

  // The normal boot-complete check expects at least one rendered cell. In this
  // intentional empty state there will never be one, so reveal immediately.
  document.documentElement.classList.remove("atlas-booting");
})();
