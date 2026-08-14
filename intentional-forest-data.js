// Minimal Atlas root dataset for testing the top-level experience.
// These inquiries intentionally have no sub-issues, solutions, or other child content yet.
(() => {
  if (typeof forestData === "undefined" || typeof annotate !== "function") return;

  const roots = [
    {
      id: "root-atlas-public-think-tank",
      name: "How can we make Atlas effective as a public think tank?",
      votes: 0,
      rating: 0,
      kind: "issue",
      color: "#71879a",
      children: []
    },
    {
      id: "root-homelessness",
      name: "Solving the Homelessness Crisis",
      votes: 0,
      rating: 0,
      kind: "issue",
      color: "#71879a",
      children: []
    },
    {
      id: "root-help-world",
      name: "What ideas could help make the world better?",
      votes: 0,
      rating: 0,
      kind: "issue",
      color: "#71879a",
      children: []
    },
    {
      id: "root-unimplemented-great-ideas",
      name: "What are some great ideas that have never been implemented?",
      votes: 0,
      rating: 0,
      kind: "issue",
      semanticKind: "challenge",
      color: "#71879a",
      children: []
    }
  ];

  forestData.splice(0, forestData.length, ...roots);
  if (typeof nodeById !== "undefined") nodeById.clear();
  if (typeof parentById !== "undefined") parentById.clear();
  if (typeof rootById !== "undefined") rootById.clear();
  roots.forEach(root => annotate(root));
  if (typeof focusPath !== "undefined") focusPath = [];

  document.querySelector("#viz .empty-data-state")?.remove();
  if (typeof render === "function") render();

  const status = document.querySelector("#status");
  if (status) status.textContent = "Showing all Atlas root inquiries.";
  document.documentElement.classList.remove("atlas-booting");
})();
