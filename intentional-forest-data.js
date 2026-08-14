// Minimal intentional Atlas dataset for testing the top-level experience.
(() => {
  if (typeof forestData === "undefined" || typeof annotate !== "function") return;

  // Relationship records are first-class content. The hierarchy still expects one
  // parent per rendered node, so each branch gets a lightweight appearance that
  // points back to one canonical relationship record instead of duplicating its content.
  const surplusFoodHelpsHomelessness = {
    id:"relationship-surplus-food-helps-homelessness",
    kind:"relationship",
    sourceId:"solution-redirect-surplus-food",
    sourceLabel:"Redirecting surplus food",
    relationshipType:"helps-address",
    relationshipLabel:"helps address",
    targetId:"root-homelessness",
    targetLabel:"the homelessness crisis",
    name:"Redirecting surplus food helps address the homelessness crisis",
    description:"Connects the surplus-food idea with the homelessness inquiry by proposing that better recovery and distribution of usable surplus food could help meet some immediate food needs among people experiencing homelessness. The relationship itself is a claim that can be evaluated, challenged, supported, and developed further.",
    votes:0,
    rating:0,
    color:"#71879a",
    children:[]
  };

  window.atlasRelationships = new Map([[surplusFoodHelpsHomelessness.id, surplusFoodHelpsHomelessness]]);

  function relationshipAppearance(relationship, contextId) {
    return {
      id:`${relationship.id}--from-${contextId}`,
      kind:"relationship",
      relationshipId:relationship.id,
      sourceId:relationship.sourceId,
      sourceLabel:relationship.sourceLabel,
      relationshipType:relationship.relationshipType,
      relationshipLabel:relationship.relationshipLabel,
      targetId:relationship.targetId,
      targetLabel:relationship.targetLabel,
      name:relationship.name,
      description:relationship.description,
      votes:relationship.votes,
      rating:relationship.rating,
      color:relationship.color,
      children:relationship.children
    };
  }

  const surplusFoodSolution = {
    id:"solution-redirect-surplus-food",
    name:"Make it easier to redirect surplus food",
    description:"Restaurants and other food businesses can use simple, repeatable processes to route safe surplus food toward people or organizations that can use it instead of discarding it.",
    votes:0,
    rating:0,
    kind:"solution",
    color:"#71879a",
    children:[relationshipAppearance(surplusFoodHelpsHomelessness, "surplus-food")]
  };

  const roots = [
    { id:"root-atlas-public-think-tank", name:"Building Atlas as a Public Think Tank", description:"Help us build a better way for people to think and solve problems together. Use this space to examine Atlas itself: what works, what doesn’t, what’s missing, and what could be done differently. Your feedback, problems, and ideas can directly help shape how the public think tank evolves.", votes:0, rating:0, kind:"issue", color:"#71879a", children:[] },
    { id:"root-homelessness", name:"Solving the Homelessness Crisis", description:"Explore why people become or remain homeless, where current responses fall short, and what combinations of housing, services, prevention, treatment, public policy, community support, and other approaches could improve outcomes.", votes:0, rating:0, kind:"issue", color:"#71879a", children:[relationshipAppearance(surplusFoodHelpsHomelessness, "homelessness")] },
    {
      id:"root-help-world", name:"What ideas could help make the world better?", description:"An intentionally broad, open-ended inquiry where anyone can contribute an idea they believe could make the world better. Ideas can be large or small, practical or ambitious, local or global—the point is to create a place for possibilities that people think are worth exploring and building on together.", votes:0, rating:0, kind:"issue", color:"#71879a",
      children:[
        {
          id:"solution-ranked-choice-voting", name:"Use Ranked-Choice Voting in More Elections", description:"Allow voters to rank candidates in order of preference instead of choosing only one. If no candidate initially has enough support to win, lower-ranked candidates can be eliminated and those voters’ next choices counted until a winner is determined. The approach can reduce spoiler effects and give voters more freedom to support their preferred candidates without relying as heavily on strategic voting.", votes:0, rating:0, kind:"solution", color:"#71879a",
          children:[
            { id:"challenge-rcv-voter-understanding", name:"Voters may need time to learn a new ballot system", description:"Switching from choose-one ballots to ranked ballots introduces a learning curve. Clear ballot design, voter education, and transparent counting rules would be important parts of a successful transition.", votes:0, rating:0, kind:"challenge", color:"#71879a", children:[] },
            { id:"implementation-rcv-local-pilot", name:"Adopt ranked-choice voting in local elections first", description:"Cities or other local jurisdictions could introduce ranked-choice voting for selected elections, publish clear voter guidance, and evaluate ballot completion, voter understanding, election administration, and public response before broader adoption.", votes:0, rating:0, kind:"implementation", color:"#71879a", children:[] },
            { id:"yay-rcv-more-candidates", name:"Ranked-choice voting could encourage more people to run for office", description:"If ranked-choice voting became more common, candidates outside the usual two-party or establishment pathways might have more reason to enter races because voters could support them without the same spoiler concerns. A larger candidate pool could give voters more choices and potentially improve the odds that capable people enter public service.", votes:0, rating:0, kind:"yay", color:"#71879a", children:[] },
            { id:"nay-rcv-complexity", name:"Ranked-choice voting can make elections harder to understand", description:"Critics may argue that multiple rankings and transfer rounds make the final result less immediately intuitive than a simple plurality count, particularly for voters encountering the system for the first time.", votes:0, rating:0, kind:"nay", color:"#71879a", children:[] }
          ]
        },
        { id:"solution-neighborhood-tool-sharing", name:"Create neighborhood libraries for rarely used tools", description:"Neighbors could share tools and equipment that most people only need occasionally instead of every household buying its own. A simple local lending system could reduce costs and waste while making useful equipment more accessible.", votes:0, rating:0, kind:"solution", color:"#71879a", children:[] },
        { id:"solution-improve-class-participation", name:"Share simple teaching practices that improve participation", description:"When a teacher discovers a small change that substantially improves student participation, make the practice easy for other teachers to understand, adapt, test, and improve rather than leaving useful classroom knowledge isolated.", votes:0, rating:0, kind:"solution", color:"#71879a", children:[] },
        { id:"solution-shorter-meetings", name:"Use simple processes to make meetings shorter", description:"Teams can adopt lightweight meeting practices that reduce unnecessary discussion, clarify decisions, and return time to participants. Small process improvements can be copied by workplaces, volunteer groups, and community organizations almost anywhere.", votes:0, rating:0, kind:"solution", color:"#71879a", children:[] },
        surplusFoodSolution,
        { id:"solution-accessible-public-information", name:"Make public information easier to access across languages", description:"Public-facing information can be designed and translated so that people who do not primarily speak the dominant local language can more easily understand services, instructions, opportunities, and decisions that affect them.", votes:0, rating:0, kind:"solution", color:"#71879a", children:[] }
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