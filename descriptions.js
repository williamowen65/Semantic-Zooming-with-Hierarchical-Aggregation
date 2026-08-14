// Concise public-facing summaries for Atlas topics.
(() => {
  if (!Array.isArray(forestData)) return;

  const rootDescriptions = {
    'root-homelessness': 'Explore why people become or remain homeless, where current responses fall short, and what combinations of housing, services, prevention, treatment, public policy, community support, and other approaches could improve outcomes.',
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
  const semanticKind = node => node?.semanticKind || node?.kind;

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

  function describe(node) {
    if (!node.description) node.description = makeDescription(node);
    (node.children || []).forEach(describe);
  }
  forestData.forEach(describe);

  function bridgeKinds(node) {
    if (node.kind === 'challenge') {
      node.semanticKind = 'challenge';
      node.kind = 'issue';
    } else if (node.kind === 'implementation') {
      node.semanticKind = 'implementation';
      node.kind = 'solution';
    }
    (node.children || []).forEach(bridgeKinds);
  }
  forestData.forEach(bridgeKinds);

  if (typeof nodeById?.clear === 'function' && typeof annotate === 'function') {
    nodeById.clear();
    parentById.clear();
    rootById.clear();
    forestData.forEach(root => annotate(root));
  }

  const countsFor = item => {
    const counts = { issue: 0, solution: 0, challenge: 0, implementation: 0 };
    (item?.children || []).forEach(child => {
      const kind = semanticKind(child);
      if (Object.prototype.hasOwnProperty.call(counts, kind)) counts[kind] += 1;
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
    const kind = semanticKind(item);
    const score = `${compact(item.votes || 0)} votes · avg ${averageVote(item)}`;
    if (kind === 'solution') {
      return [score, `${counts.challenge} ${counts.challenge === 1 ? 'challenge' : 'challenges'} · ${counts.implementation} ${counts.implementation === 1 ? 'implementation' : 'implementations'}`];
    }
    if (kind === 'challenge' || kind === 'implementation') return [score, ''];
    return [score, `${counts.issue} ${counts.issue === 1 ? 'sub-issue' : 'sub-issues'} · ${counts.solution} ${counts.solution === 1 ? 'sub-solution' : 'sub-solutions'}`];
  };

  metadataText = item => metadataLines(item).filter(Boolean).join(' · ');
  semanticGlyph = item => ({ solution: '✓', challenge: '!', implementation: '→' }[semanticKind(item)] || '⚠');

  function typedCountLabel(kind, count) {
    if (kind === 'challenge') return `${count} ${count === 1 ? 'challenge' : 'challenges'}`;
    if (kind === 'implementation') return `${count} ${count === 1 ? 'implementation' : 'implementations'}`;
    return `${count}`;
  }

  function syncTypedContextLabels() {
    const entries = Array.from(document.querySelectorAll('#viz .layer-context-entry'));
    entries.forEach((entry, index) => {
      const id = focusPath?.[index];
      const node = id ? nodeById.get(id) : null;
      if (!node) return;
      const kind = semanticKind(node);
      const kindEl = entry.querySelector('.layer-context-kind');
      if (kindEl) kindEl.textContent = ({ issue: 'Issue', solution: 'Solution', challenge: 'Challenge', implementation: 'Implementation' })[kind] || 'Topic';

      const card = entry.querySelector('.layer-context-card');
      if (card) {
        card.classList.remove('is-issue', 'is-solution', 'is-challenge', 'is-implementation');
        card.classList.add(`is-${kind}`);
      }

      if (kind === 'solution') {
        const counts = countsFor(node);
        const stats = Array.from(entry.querySelectorAll('.layer-context-stat'));
        if (stats.length >= 4) {
          const first = stats[stats.length - 2], second = stats[stats.length - 1];
          first.textContent = typedCountLabel('challenge', counts.challenge);
          second.textContent = typedCountLabel('implementation', counts.implementation);
        }
        const buttons = Array.from(entry.querySelectorAll('.layer-kind-toggle button'));
        if (buttons[0]) buttons[0].textContent = typedCountLabel('challenge', counts.challenge);
        if (buttons[1]) buttons[1].textContent = typedCountLabel('implementation', counts.implementation);
        const group = entry.querySelector('.layer-kind-toggle');
        if (group) group.setAttribute('aria-label', 'Show solution challenges or implementations');
      }
    });
  }

  if (typeof render === 'function') render();

  setTimeout(() => {
    if (typeof render !== 'function') return;
    const finalRender = render;
    render = function() {
      finalRender();
      syncTypedContextLabels();
    };
    syncTypedContextLabels();
  }, 0);

  const viz = document.querySelector('#viz');
  if (viz && typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(mutations => {
      const addedToggle = mutations.some(mutation => Array.from(mutation.addedNodes || []).some(node =>
        node.nodeType === 1 && (node.matches?.('.layer-kind-toggle') || node.querySelector?.('.layer-kind-toggle'))
      ));
      if (addedToggle) requestAnimationFrame(syncTypedContextLabels);
    });
    observer.observe(viz, { childList: true, subtree: true });
  }
})();