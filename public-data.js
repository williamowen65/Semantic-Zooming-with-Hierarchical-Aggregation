// Atlas root-only seed data.
// No child nodes yet: this intentionally establishes only the broad public-interest umbrellas.
(() => {
  if (!Array.isArray(window.forestData) && typeof forestData === "undefined") return;
  const forest = typeof forestData !== "undefined" ? forestData : window.forestData;

  const roots = [
    { id: "root-health", name: "Health & Wellbeing", votes: 9800, rating: 4.7, kind: "issue" },
    { id: "root-economy", name: "Money, Work & Economy", votes: 9400, rating: 4.6, kind: "issue" },
    { id: "root-housing", name: "Housing & Built Environment", votes: 9000, rating: 4.7, kind: "issue" },
    { id: "root-education", name: "Education & Knowledge", votes: 8500, rating: 4.6, kind: "issue" },
    { id: "root-environment", name: "Environment & Natural World", votes: 9300, rating: 4.8, kind: "issue" },
    { id: "root-infrastructure", name: "Infrastructure, Transportation & Utilities", votes: 8200, rating: 4.5, kind: "issue" },
    { id: "root-energy", name: "Energy & Resources", votes: 7600, rating: 4.5, kind: "issue" },
    { id: "root-government", name: "Government & Public Institutions", votes: 8300, rating: 4.5, kind: "issue" },
    { id: "root-justice", name: "Law, Rights & Justice", votes: 8500, rating: 4.7, kind: "issue" },
    { id: "root-safety", name: "Safety, Conflict & Security", votes: 7900, rating: 4.6, kind: "issue" },
    { id: "root-technology", name: "Technology & Information", votes: 8800, rating: 4.7, kind: "issue" },
    { id: "root-community", name: "Family, Relationships & Community", votes: 7800, rating: 4.6, kind: "issue" },
    { id: "root-culture", name: "Culture, Media & Recreation", votes: 7200, rating: 4.4, kind: "issue" },
    { id: "root-food", name: "Food & Agriculture", votes: 7300, rating: 4.6, kind: "issue" },
    { id: "root-migration", name: "Human Movement & Migration", votes: 6900, rating: 4.5, kind: "issue" },
    { id: "root-consumer", name: "Products, Services & Consumer Life", votes: 8100, rating: 4.6, kind: "issue" }
  ];

  forest.splice(0, forest.length, ...roots);

  if (typeof nodeById !== "undefined" && typeof parentById !== "undefined" && typeof rootById !== "undefined" && typeof annotate === "function") {
    nodeById.clear();
    parentById.clear();
    rootById.clear();
    forest.forEach(root => annotate(root));
  }

  if (typeof focusPath !== "undefined") focusPath = [];
  if (typeof cameraY !== "undefined") cameraY = 0;
  if (typeof render === "function") render();
})();