// Present structural issues as short, inviting questions without changing their
// underlying type. Semantic challenges remain challenges and keep their wording.
(() => {
  if (!Array.isArray(forestData)) return;

  const rootQuestions = {
    'root-health': 'How can we improve health and wellbeing?',
    'root-economy': 'How can we improve economic security and opportunity?',
    'root-housing': 'How can we make housing work better for everyone?',
    'root-education': 'How can we improve education and access to knowledge?',
    'root-environment': 'How can we protect the environment and natural world?',
    'root-government': 'How can government serve people better?',
    'root-safety': 'How can we make people and communities safer?',
    'root-food': 'How can we build a better food system?',
    'root-family': 'How can we strengthen families and communities?',
    'root-technology': 'How can technology work better for people?',
    'root-infrastructure': 'How can we improve essential infrastructure?',
    'root-law': 'How can we make laws and justice more fair and effective?',
    'root-energy': 'How can we improve how energy and resources are managed?',
    'root-culture': 'How can we strengthen culture and shared public life?',
    'root-products': 'How can goods and services work better for people?',
    'root-migration': 'How can migration and settlement work better for people?'
  };

  const overrides = {
    'housing-homelessness': 'How can we reduce unsheltered homelessness?',
    'housing-affordability': 'How can we make housing more affordable?',
    'housing-supply': 'How can we increase the supply of housing?',
    'health-mental-access': 'How can we improve access to mental health care?',
    'health-primary-care': 'How can we improve access to primary care?',
    'education-literacy': 'How can we close early literacy gaps?',
    'environment-biodiversity': 'How can we slow biodiversity loss?',
    'environment-orca': 'How can we reverse the decline of Southern Resident orcas?',
    'economy-wage-pressure': 'How can wages keep up with the cost of living?',
    'root-housing': 'How can we make housing work better for everyone?'
  };

  const lowerFirst = value => value ? value.charAt(0).toLowerCase() + value.slice(1) : value;
  const stripQuestion = value => String(value || '').replace(/[?.!]+$/g, '').trim();

  function questionFor(node) {
    if (rootQuestions[node.id]) return rootQuestions[node.id];
    if (overrides[node.id]) return overrides[node.id];

    const original = stripQuestion(node.name);
    if (!original) return node.name;
    if (/^(how|what|why|where|when|who|which|should|could|can|is|are|do|does)\b/i.test(original)) return `${original}?`;

    let match;
    if ((match = original.match(/^(.+?)\s+access$/i)))
      return `How can we improve access to ${lowerFirst(match[1])}?`;
    if ((match = original.match(/^(.+?)\s+availability$/i)))
      return `How can we improve the availability of ${lowerFirst(match[1])}?`;
    if ((match = original.match(/^(.+?)\s+shortages?$/i)))
      return `How can we reduce shortages of ${lowerFirst(match[1])}?`;
    if ((match = original.match(/^shortage of\s+(.+)$/i)))
      return `How can we reduce the shortage of ${lowerFirst(match[1])}?`;
    if ((match = original.match(/^few\s+(.+)$/i)))
      return `How can we increase the number of ${lowerFirst(match[1])}?`;
    if ((match = original.match(/^limited\s+(.+)$/i)))
      return `How can we expand ${lowerFirst(match[1])}?`;
    if ((match = original.match(/^insufficient\s+(.+)$/i)))
      return `How can we provide more ${lowerFirst(match[1])}?`;
    if ((match = original.match(/^high\s+(.+)$/i)))
      return `How can we reduce ${lowerFirst(match[1])}?`;
    if ((match = original.match(/^large\s+(.+)$/i)))
      return `How can we reduce ${lowerFirst(match[1])}?`;
    if ((match = original.match(/^long\s+(.+)$/i)))
      return `How can we reduce ${lowerFirst(match[1])}?`;
    if ((match = original.match(/^(.+?)\s+gaps?$/i)))
      return `How can we close gaps in ${lowerFirst(match[1])}?`;
    if ((match = original.match(/^(.+?)\s+barriers?$/i)))
      return `How can we remove barriers to ${lowerFirst(match[1])}?`;
    if ((match = original.match(/^(.+?)\s+backlogs?$/i)))
      return `How can we reduce backlogs in ${lowerFirst(match[1])}?`;
    if ((match = original.match(/^(.+?)\s+delays?$/i)))
      return `How can we reduce delays in ${lowerFirst(match[1])}?`;
    if ((match = original.match(/^(.+?)\s+burden$/i)))
      return `How can we reduce the burden of ${lowerFirst(match[1])}?`;
    if ((match = original.match(/^(.+?)\s+cost pressure$/i)))
      return `How can we reduce cost pressure on ${lowerFirst(match[1])}?`;
    if ((match = original.match(/^(.+?)\s+decline$/i)))
      return `How can we reverse the decline of ${lowerFirst(match[1])}?`;
    if ((match = original.match(/^(.+?)\s+loss$/i)))
      return `How can we reduce the loss of ${lowerFirst(match[1])}?`;
    if ((match = original.match(/^(.+?)\s+fragmentation$/i)))
      return `How can we reduce fragmentation of ${lowerFirst(match[1])}?`;
    if (/^unsafe\s+or\s+poorly\s+maintained\s+rentals$/i.test(original))
      return 'How can we improve rental safety and maintenance?';
    if (/^teacher burnout$/i.test(original))
      return 'How can we reduce teacher burnout?';
    if (/^unpredictable work schedules$/i.test(original))
      return 'How can we make work schedules more predictable?';
    if (/^wages lagging living costs$/i.test(original))
      return 'How can wages keep up with living costs?';
    if (/^rent rising faster than pay$/i.test(original))
      return 'How can we keep rent from outpacing pay?';
    if (/^food costs outpacing raises$/i.test(original))
      return 'How can we keep food costs from outpacing wages?';

    return `How can we address ${lowerFirst(original)}?`;
  }

  function rewrite(node) {
    const semanticKind = node.semanticKind || node.kind;
    if (node.kind === 'issue' && semanticKind !== 'challenge') node.name = questionFor(node);
    (node.children || []).forEach(rewrite);
  }

  forestData.forEach(rewrite);

  // Names are used by breadcrumbs and cards, so redraw after rewriting them.
  if (typeof render === 'function') render();
})();