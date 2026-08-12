// Concise public-facing summaries for Atlas topics. Explicit summaries can be
// added to any node as `description`; this pass guarantees every demo post has
// one while keeping wording broad enough for children to carry the specifics.
(() => {
  if (!Array.isArray(forestData)) return;

  const rootDescriptions = {
    'root-health': 'Conditions and systems that shape physical and mental wellbeing.',
    'root-economy': 'How people earn, afford necessities, and participate in the economy.',
    'root-housing': 'Housing access, affordability, quality, and the places people live.',
    'root-education': 'Access to learning, knowledge, skills, and educational opportunity.',
    'root-environment': 'The health of ecosystems, species, climate, and the natural world.',
    'root-government': 'How public institutions govern, serve people, and earn trust.',
    'root-safety': 'Threats to personal, community, and public safety and security.',
    'root-food': 'How food is produced, accessed, distributed, and sustained.',
    'root-family': 'Conditions affecting families, relationships, care, and community life.',
    'root-technology': 'How technology and information affect people and society.',
    'root-infrastructure': 'Systems that move people, goods, utilities, and essential services.',
    'root-law': 'Rights, laws, justice systems, fairness, and access to legal protection.',
    'root-energy': 'How energy and natural resources are produced, used, and managed.',
    'root-culture': 'Culture, media, recreation, expression, and shared public life.',
    'root-products': 'Goods and services people rely on and the systems around them.',
    'root-migration': 'Why people move and the systems shaping migration and settlement.'
  };

  const lower = value => value ? value.charAt(0).toLowerCase() + value.slice(1) : value;
  function makeDescription(node) {
    if (rootDescriptions[node.id]) return rootDescriptions[node.id];
    const subject = lower(node.name.replace(/\.$/, ''));
    if (node.kind === 'solution') {
      if (/program|service|network|clinic|care|support|assistance|aid|referral|navigation|corridor|restoration|mentorship|residency|standard|requirement|tool|calculator|alert/i.test(node.name))
        return `An approach intended to improve ${subject}.`;
      return `A proposed response centered on ${subject}.`;
    }
    if (/shortage|gap|lack|few|limited|insufficient|barrier|backlog|delay|wait|decline|loss|burden|cost|pressure|instability|unsafe|poor|collision|fragmentation/i.test(node.name))
      return `A broad concern involving ${subject}.`;
    return `An issue concerning ${subject}.`;
  }

  function visit(node) {
    if (!node.description) node.description = makeDescription(node);
    (node.children || []).forEach(visit);
  }
  forestData.forEach(visit);
})();