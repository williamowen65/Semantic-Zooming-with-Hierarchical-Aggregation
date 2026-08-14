// Give the demo forest a realistic mix of public-post phrasing without changing
// hierarchy or semantic types. Issues may be topics, questions, or positions;
// solutions may be proposals or questions; challenges and implementations get
// similar variation. The choice is deterministic by node id so demos stay stable.
(() => {
  if (!Array.isArray(forestData)) return;

  const originalNames = new Map();
  const walk = (node, fn) => { fn(node); (node.children || []).forEach(child => walk(child, fn)); };
  forestData.forEach(root => walk(root, node => originalNames.set(node.id, node.name)));

  const explicit = {
    'root-health': 'What would a healthier society look like?',
    'root-economy': 'Economic security and opportunity',
    'root-housing': 'Housing should work better for everyone',
    'root-education': 'How should education change for the next generation?',
    'root-environment': 'Protecting the natural world',
    'root-government': 'Government should work better for people',
    'root-safety': 'What would make our communities safer?',
    'root-food': 'Building a food system that works for everyone',
    'root-family': 'Families and communities need stronger support',
    'root-technology': 'How should technology serve people?',
    'root-infrastructure': 'The infrastructure we depend on',
    'root-law': 'Can our justice system be fairer and more effective?',
    'root-energy': 'Rethinking energy and resource use',
    'root-culture': 'Culture, recreation, and shared public life',
    'root-products': 'Goods and services should work better for people',
    'root-migration': 'How can migration systems work better for people?',

    'housing-homelessness': 'No one should have to live without shelter',
    'housing-affordability': 'Why is housing so hard to afford?',
    'housing-supply': 'We need more homes where people want to live',
    'health-mental-access': 'Mental health care should be easier to reach',
    'health-primary-care': 'Why is finding a primary care provider so difficult?',
    'education-teacher-shortages': 'Teacher shortages are hurting schools',
    'education-literacy': 'How do we close early literacy gaps?',
    'environment-biodiversity': 'Biodiversity loss needs much more attention',
    'environment-orca': 'Can Southern Resident orcas recover?',
    'economy-wage-pressure': 'Paychecks are not keeping up with living costs',
    'economy-job-instability': 'Workers deserve more predictable schedules',
    'housing-rent-burden': 'Rent is taking too much of people’s income'
  };

  const lowerFirst = value => value ? value.charAt(0).toLowerCase() + value.slice(1) : value;
  const clean = value => String(value || '').replace(/[?.!]+$/g, '').trim();
  const hash = value => {
    let h = 2166136261;
    for (const ch of String(value || '')) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
    return h;
  };
  const choice = (node, count) => hash(node.id) % count;

  function issueSubject(name) {
    const text = clean(name);
    let m;
    if ((m = text.match(/^(.+?)\s+access$/i))) return { type: 'access', subject: lowerFirst(m[1]) };
    if ((m = text.match(/^(.+?)\s+availability$/i))) return { type: 'availability', subject: lowerFirst(m[1]) };
    if ((m = text.match(/^(.+?)\s+shortages?$/i))) return { type: 'shortage', subject: lowerFirst(m[1]) };
    if ((m = text.match(/^shortage of\s+(.+)$/i))) return { type: 'shortage', subject: lowerFirst(m[1]) };
    if ((m = text.match(/^(.+?)\s+gaps?$/i))) return { type: 'gap', subject: lowerFirst(m[1]) };
    if ((m = text.match(/^(.+?)\s+barriers?$/i))) return { type: 'barrier', subject: lowerFirst(m[1]) };
    if ((m = text.match(/^(.+?)\s+backlogs?$/i))) return { type: 'backlog', subject: lowerFirst(m[1]) };
    if ((m = text.match(/^(.+?)\s+delays?$/i))) return { type: 'delay', subject: lowerFirst(m[1]) };
    if ((m = text.match(/^(.+?)\s+burden$/i))) return { type: 'burden', subject: lowerFirst(m[1]) };
    if ((m = text.match(/^(.+?)\s+decline$/i))) return { type: 'decline', subject: lowerFirst(m[1]) };
    if ((m = text.match(/^(.+?)\s+loss$/i))) return { type: 'loss', subject: lowerFirst(m[1]) };
    return { type: 'topic', subject: lowerFirst(text) };
  }

  function issueQuestion(info) {
    const s = info.subject;
    if (info.type === 'access') return `Why is ${s} still so hard to access?`;
    if (info.type === 'availability') return `What would make ${s} more available?`;
    if (info.type === 'shortage') return `What would it take to fix the shortage of ${s}?`;
    if (info.type === 'gap') return `Where are the biggest gaps in ${s}?`;
    if (info.type === 'barrier') return `What barriers are getting in the way of ${s}?`;
    if (info.type === 'backlog') return `Why are backlogs in ${s} so persistent?`;
    if (info.type === 'delay') return `What would meaningfully reduce delays in ${s}?`;
    if (info.type === 'burden') return `How much of a burden is ${s}, and what should change?`;
    if (info.type === 'decline') return `Can we reverse the decline of ${s}?`;
    if (info.type === 'loss') return `What would actually slow the loss of ${s}?`;
    return `What should we do about ${s}?`;
  }

  function issuePosition(info) {
    const s = info.subject;
    if (info.type === 'access') return `People need better access to ${s}`;
    if (info.type === 'availability') return `${clean(s)} needs to be more available`;
    if (info.type === 'shortage') return `The shortage of ${s} needs attention`;
    if (info.type === 'gap') return `The gaps in ${s} are too large`;
    if (info.type === 'barrier') return `We should remove barriers to ${s}`;
    if (info.type === 'backlog') return `Backlogs in ${s} are leaving people waiting too long`;
    if (info.type === 'delay') return `Delays in ${s} have become a real problem`;
    if (info.type === 'burden') return `${clean(s)} is putting too much pressure on people`;
    if (info.type === 'decline') return `The decline of ${s} should not be accepted as inevitable`;
    if (info.type === 'loss') return `We are losing too much ${s}`;
    return `${clean(info.subject)} deserves more attention`;
  }

  function phraseIssue(node, original) {
    if (explicit[node.id]) return explicit[node.id];
    if (/\?$/.test(original)) return original;
    const mode = choice(node, 5);
    if (mode === 0) return original; // plain topic labels remain part of the mix
    const info = issueSubject(original);
    if (mode === 1 || mode === 4) return issueQuestion(info);
    if (mode === 2) return issuePosition(info);
    return `What would better progress on ${info.subject} look like?`;
  }

  function phraseSolution(node, original) {
    const text = clean(original);
    const mode = choice(node, 5);
    if (mode === 0) return original;
    if (mode === 1) return `Let’s try ${lowerFirst(text)}`;
    if (mode === 2) return `Could ${lowerFirst(text)} make a real difference?`;
    if (mode === 3) return `${text} is worth expanding`;
    return `What would it take to make ${lowerFirst(text)} work at scale?`;
  }

  function phraseChallenge(node, original) {
    const text = clean(original);
    const mode = choice(node, 5);
    if (mode === 0) return original;
    if (/funding and delivery capacity/i.test(text)) {
      return [
        original,
        'Can we fund and staff this sustainably?',
        'Capacity may be the real bottleneck',
        'Who actually has the capacity to deliver this?',
        'Funding the idea is only part of the challenge'
      ][mode];
    }
    if (/adoption and coordination barriers/i.test(text)) {
      return [
        original,
        'Will people and institutions actually adopt it?',
        'Coordination could be harder than the idea itself',
        'Who needs to cooperate for this to work?',
        'Adoption may be the biggest obstacle'
      ][mode];
    }
    if (mode === 1) return `What could prevent ${lowerFirst(text)}?`;
    if (mode === 2) return `${text} could become a serious obstacle`;
    if (mode === 3) return `How do we get past ${lowerFirst(text)}?`;
    return `This may fail if we cannot address ${lowerFirst(text)}`;
  }

  function phraseImplementation(node, original) {
    const text = clean(original);
    const mode = choice(node, 5);
    if (/^pilot\s+/i.test(text)) {
      const subject = text.replace(/^pilot\s+/i, '');
      return [
        original,
        `Start with a small pilot of ${subject}`,
        `Test ${subject} locally before scaling`,
        `Would a limited pilot of ${subject} prove the idea?`,
        `Try ${subject} in one area first`
      ][mode];
    }
    if (/^scale\s+.+\s+with measured outcomes$/i.test(text)) {
      const subject = text.replace(/^scale\s+/i, '').replace(/\s+with measured outcomes$/i, '');
      return [
        original,
        `Expand ${subject} and track what changes`,
        `Scale ${subject}, but measure the results`,
        `What outcomes should we track as ${subject} expands?`,
        `Grow ${subject} in stages and learn as we go`
      ][mode];
    }
    if (mode === 0) return original;
    if (mode === 1) return `Start by testing ${lowerFirst(text)}`;
    if (mode === 2) return `${text}, with clear outcome tracking`;
    if (mode === 3) return `Could we pilot ${lowerFirst(text)} first?`;
    return `Roll out ${lowerFirst(text)} in stages`;
  }

  function rewrite(node) {
    const original = originalNames.get(node.id) || node.name;
    const semanticKind = node.semanticKind || node.kind;
    if (semanticKind === 'issue') node.name = phraseIssue(node, original);
    else if (semanticKind === 'solution') node.name = phraseSolution(node, original);
    else if (semanticKind === 'challenge') node.name = phraseChallenge(node, original);
    else if (semanticKind === 'implementation') node.name = phraseImplementation(node, original);
  }

  forestData.forEach(root => walk(root, rewrite));

  // Names feed labels, cards, breadcrumbs, and generated context views.
  if (typeof render === 'function') render();
})();