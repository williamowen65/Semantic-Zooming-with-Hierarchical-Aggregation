// Minimal intentional Atlas dataset for testing the top-level experience.
(() => {
  if (typeof forestData === "undefined" || typeof annotate !== "function") return;

  const roots = [
    {
      id: "root-atlas-public-think-tank",
      name: "Building Atlas as a Public Think Tank",
      description: "Help us build a better way for people to think and solve problems together. Use this space to examine Atlas itself: what works, what doesn’t, what’s missing, and what could be done differently. Your feedback, problems, and ideas can directly help shape how the public think tank evolves.",
      votes: 0,
      rating: 0,
      kind: "issue",
      color: "#71879a",
      children: []
    },
    {
      id: "root-homelessness",
      name: "Solving the Homelessness Crisis",
      description: "Explore why people become or remain homeless, where current responses fall short, and what combinations of housing, services, prevention, treatment, public policy, community support, and other approaches could improve outcomes.",
      votes: 0,
      rating: 0,
      kind: "issue",
      color: "#71879a",
      children: []
    },
    {
      id: "root-help-world",
      name: "What ideas could help make the world better?",
      description: "An intentionally broad, open-ended inquiry where anyone can contribute an idea they believe could make the world better. Ideas can be large or small, practical or ambitious, local or global—the point is to create a place for possibilities that people think are worth exploring and building on together.",
      votes: 0,
      rating: 0,
      kind: "issue",
      color: "#71879a",
      children: [
        {
          id: "solution-ranked-choice-voting",
          name: "Use Ranked-Choice Voting in More Elections",
          description: "Allow voters to rank candidates in order of preference instead of choosing only one. If no candidate initially has enough support to win, lower-ranked candidates can be eliminated and those voters’ next choices counted until a winner is determined. The approach can reduce spoiler effects and give voters more freedom to support their preferred candidates without relying as heavily on strategic voting.",
          votes: 0,
          rating: 0,
          kind: "solution",
          color: "#71879a",
          children: [
            {
              id: "solution-rcv-more-candidates",
              name: "Ranked-choice voting could encourage more people to run for office",
              description: "If ranked-choice voting became more common, candidates outside the usual two-party or establishment pathways might have more reason to enter races because voters could support them without the same spoiler concerns. A larger candidate pool could give voters more choices and potentially improve the odds that capable people enter public service. Evidence so far is mixed: some research finds an initial increase in candidate entry after RCV is adopted, but it has not established that RCV consistently produces more viable or higher-quality candidates over time.",
              votes: 0,
              rating: 0,
              kind: "solution",
              color: "#71879a",
              children: []
            }
          ]
        }
      ]
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
