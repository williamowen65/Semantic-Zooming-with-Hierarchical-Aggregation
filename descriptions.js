// Concise public-facing summaries for Atlas topics. This pass also gives every
// solution a small experimental implementation layer: challenges describe what
// could make the solution difficult, while implementations describe concrete
// ways to put it into practice.
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
  const clampRating = value => Math.max(1, Math.min(5, Number(value) || 3));
  const derivedVotes = (node, share) => Math.max(1, Math.round(Math.max(1, Number(node.votes) || 1) * share));

  function generatedSolutionChildren(node) {
    const baseRating = clampRating(node.rating);
    return [
      {
        id: `${node.id}-challenge-capacity`,
        name: 'Funding and delivery capacity',
        votes: derivedVotes(node, .12),
        rating: clampRating(baseRating - .1),
        kind: 'challenge',
        description: `A potential capacity constraint on putting ${lower(node.name)} into practice.`
      },
      {
        id: `${node.id}-challenge-adoption`,
        name: 'Adoption and coordination barriers',
        votes: derivedVotes(node, .09),
        rating: clampRating(baseRating - .2),
        kind: 'challenge',
        description: `A potential coordination or adoption challenge for ${lower(node.name)}.`
      },
      {
        id: `${node.id}-implementation-pilot`,
        name: `Pilot ${node.name} in a limited area`,
        votes: derivedVotes(node, .11),
        rating: clampRating(baseRating),
        kind: 'implementation',
        description: `A limited pilot that tests how ${lower(node.name)} works in practice before broader rollout.`
      },
      {
        id: `${node.id}-implementation-scale`,
        name: `Scale ${node.name} with measured outcomes`,
        votes: derivedVotes(node, .08),
        rating: clampRating(baseRating + .1),
        kind: 'implementation',
        description: `A broader rollout of ${lower(node.name)} paired with measurement and iteration.`
      }
    ];
  }

  function seedSolutionChildren(node) {
    // Visit the existing tree first so nested solutions receive their own layer
    // before generated children are appended to their parent.
    (node.children || []).slice().forEach(seedSolutionChildren);
    if (node.kind !== 'solution') return;

    const children = Array.isArray(node.children) ? node.children : (node.children = []);
    const kinds = new Set(children.map(child => child.kind));
    const generated = generatedSolutionChildren(node);
    if (!kinds.has('challenge')) children.push(...generated.filter(child => child.kind === 'challenge'));
    if (!kinds.has('implementation')) children.push(...generated.filter(child => child.kind === 'implementation'));
  }

  forestData.forEach(seedSolutionChildren);

  // The core maps were built before this extension script ran. Rebuild them so
  // newly generated challenge/implementation nodes participate in navigation.
  if (typeof nodeById?.clear === 'function' && typeof annotate === 'function') {
    nodeById.clear();
    parentById.clear();
    rootById.clear();
    forestData.forEach(root => annotate(root));
  }

  function makeDescription(node) {
    if (rootDescriptions[node.id]) return rootDescriptions[node.id];
    const subject = lower(node.name.replace(/\.$/, ''));
    if (node.kind === 'solution') {
      if (/program|service|network|clinic|care|support|assistance|aid|referral|navigation|corridor|restoration|mentorship|residency|standard|requirement|tool|calculator|alert/i.test(node.name))
        return `An approach intended to improve ${subject}.`;
      return `A proposed response centered on ${subject}.`;
    }
    if (node.kind === 'challenge') return `A challenge that could affect how ${subject} is addressed or carried out.`;
    if (node.kind === 'implementation') return `A concrete implementation approach centered on ${subject}.`;
    if (/shortage|gap|lack|few|limited|insufficient|barrier|backlog|delay|wait|decline|loss|burden|cost|pressure|instability|unsafe|poor|collision|fragmentation/i.test(node.name))
      return `A broad concern involving ${subject}.`;
    return `An issue concerning ${subject}.`;
  }

  function visit(node) {
    if (!node.description) node.description = makeDescription(node);
    (node.children || []).forEach(visit);
  }
  forestData.forEach(visit);

  // Keep the compact node metadata aligned with the parent type. Issues expose
  // sub-issues/solutions; solutions expose challenges/implementations.
  const countsFor = item => {
    const counts = { issue: 0, solution: 0, challenge: 0, implementation: 0 };
    (item?.children || []).forEach(child => {
      if (Object.prototype.hasOwnProperty.call(counts, child.kind)) counts[child.kind] += 1;
    });
    return counts;
  };

  childKindCounts = function(item) {
    const counts = countsFor(item);
    return {
      issues: counts.issue,
      solutions: counts.solution,
      challenges: counts.challenge,
      implementations: counts.implementation
    };
  };

  metadataLines = function(item) {
    const counts = countsFor(item);
    const score = `${compact(item.votes || 0)} votes · avg ${averageVote(item)}`;
    if (item.kind === 'solution') {
      return [score, `${counts.challenge} ${counts.challenge === 1 ? 'challenge' : 'challenges'} · ${counts.implementation} ${counts.implementation === 1 ? 'implementation' : 'implementations'}`];
    }
    if (item.kind === 'challenge') return [score, 'Challenge'];
    if (item.kind === 'implementation') return [score, 'Implementation'];
    return [score, `${counts.issue} ${counts.issue === 1 ? 'sub-issue' : 'sub-issues'} · ${counts.solution} ${counts.solution === 1 ? 'sub-solution' : 'sub-solutions'}`];
  };

  metadataText = item => metadataLines(item).join(' · ');
  semanticGlyph = item => ({ solution: '✓', challenge: '!', implementation: '→' }[item?.kind] || '⚠');

  if (typeof render === 'function') render();
})();