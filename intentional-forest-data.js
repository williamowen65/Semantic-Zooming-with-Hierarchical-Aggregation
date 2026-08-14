// Intentional Atlas demo content.
// This replaces the broad encyclopedia-style prototype forest while preserving
// the existing node schema and rendering code. Root nodes are starting inquiries,
// not an attempt to classify every major problem in the world.
(() => {
  const I = (id, name, votes, rating, children = []) => ({ id, name, votes, rating, kind: 'issue', children });
  const S = (id, name, votes, rating, children = []) => ({ id, name, votes, rating, kind: 'solution', children });
  const C = (id, name, votes, rating, children = []) => ({ id, name, votes, rating, kind: 'issue', semanticKind: 'challenge', children });
  const M = (id, name, votes, rating, children = []) => ({ id, name, votes, rating, kind: 'solution', semanticKind: 'implementation', children });

  const roots = [
    I('root-homelessness', 'How can we address homelessness more effectively?', 4860, 4.8, [
      I('homeless-prevention', 'Too many people receive help only after losing housing', 2780, 4.8, [
        I('homeless-eviction-risk', 'People at risk of eviction are often identified too late', 1540, 4.7),
        I('homeless-discharge', 'Leaving hospitals, foster care, or jail without stable housing', 1310, 4.7),
        S('homeless-prevention-fund', 'Create rapid prevention funds before a household loses housing', 1830, 4.7, [
          C('homeless-prevention-eligibility', 'Can help reach people before the crisis becomes obvious?', 940, 4.6),
          C('homeless-prevention-fraud', 'How do we keep eligibility simple without making the fund easy to exploit?', 720, 4.4),
          M('homeless-prevention-pilot', 'Pilot a rapid prevention fund with local courts and service providers', 810, 4.6),
          M('homeless-prevention-referral', 'Launch an eviction-risk referral process before court judgments', 690, 4.5)
        ])
      ]),
      I('homeless-permanent-housing', 'People can remain homeless for years while waiting for stable housing', 3010, 4.8, [
        S('homeless-supportive', 'Expand permanent supportive housing for people with the highest needs', 2240, 4.8, [
          C('homeless-supportive-supply', 'There may not be enough units in the places people need them', 1160, 4.7),
          C('homeless-supportive-services', 'Housing without reliable support services may not be enough', 1090, 4.8),
          M('homeless-supportive-acquire', 'Acquire or convert an initial group of buildings for supportive housing', 890, 4.6),
          M('homeless-supportive-team', 'Assign multidisciplinary support teams to the first housing sites', 760, 4.7)
        ]),
        S('homeless-navigation', 'Give each person one consistent navigator across housing and services', 1710, 4.6)
      ]),
      I('homeless-encampments', 'What is a humane and effective response to encampments?', 2390, 4.6),
      I('homeless-health', 'Mental health and addiction care are difficult to access while unhoused', 2260, 4.8),
      S('homeless-by-name', 'Coordinate agencies around a shared by-name list instead of disconnected caseloads', 1650, 4.6)
    ]),

    I('root-animals', 'How can humans build a better relationship with animals?', 3940, 4.8, [
      I('animals-shelters', 'Too many companion animals enter shelters without a reliable path back to a home', 1810, 4.7, [
        S('animals-foster', 'Build larger community foster networks before expanding shelter capacity', 1430, 4.7, [
          C('animals-foster-retention', 'Volunteer foster families can burn out quickly', 730, 4.6),
          M('animals-foster-pilot', 'Recruit and support an initial foster network through three local veterinary clinics', 620, 4.6)
        ]),
        S('animals-pet-support', 'Help people keep pets through temporary financial or housing crises', 1280, 4.8)
      ]),
      I('animals-wildlife', 'Human infrastructure keeps fragmenting wildlife habitat', 1970, 4.8, [
        I('animals-roads', 'Roads interrupt migration routes and kill wildlife', 1240, 4.7),
        S('animals-crossings', 'Build wildlife crossings where collision and migration data show the greatest need', 1510, 4.8, [
          C('animals-crossings-cost', 'Large crossings are expensive and need long-term political support', 790, 4.5),
          M('animals-crossings-map', 'Map collision hot spots and migration corridors before selecting the first crossing sites', 710, 4.7)
        ])
      ]),
      I('animals-farmed', 'What responsibilities do we have toward animals raised for food?', 1880, 4.6),
      I('animals-coexistence', 'How should communities respond when people and wildlife increasingly share the same space?', 1560, 4.7),
      S('animals-welfare-data', 'Make animal-welfare outcomes easier for the public to see and compare', 1170, 4.5)
    ]),

    I('root-democracy', 'How can democratic representation and political participation work better in the United States?', 4520, 4.7, [
      I('democracy-choice', 'Many voters feel forced to choose between two options they do not really support', 2640, 4.8, [
        S('democracy-rcv', 'Use ranked-choice voting in more elections', 2210, 4.7, [
          C('democracy-rcv-understanding', 'Will voters understand a different ballot well enough to trust the result?', 1120, 4.6),
          C('democracy-rcv-transition', 'Changing election systems can become a partisan fight before people evaluate the system itself', 990, 4.6),
          M('democracy-rcv-local', 'Pilot ranked-choice voting in eligible local elections with a public education campaign', 960, 4.7),
          M('democracy-rcv-audit', 'Publish ballot simulations and post-election audits during the first rollout', 720, 4.6)
        ]),
        S('democracy-proportional', 'Explore proportional representation for legislative elections', 1730, 4.6)
      ]),
      I('democracy-polarization', 'Political incentives often reward conflict more than cooperation', 2510, 4.7, [
        I('democracy-primary', 'Primary elections can reward candidates who appeal to a narrower electorate', 1390, 4.6),
        I('democracy-media', 'Political attention is often captured by the most inflammatory voices', 1510, 4.6)
      ]),
      I('democracy-districts', 'Voters should choose representatives, not the other way around', 2190, 4.8, [
        S('democracy-commissions', 'Use independent redistricting commissions', 1760, 4.7)
      ]),
      I('democracy-trust', 'What would make people trust democratic institutions more?', 2050, 4.6),
      S('democracy-deliberation', 'Create more structured ways for ordinary citizens to deliberate on public decisions', 1580, 4.6)
    ]),

    I('root-atlas', 'How can we build Atlas into an effective public think tank?', 3720, 4.9, [
      I('atlas-structure', 'How should thousands of overlapping public ideas be organized without becoming overwhelming?', 2380, 4.9, [
        S('atlas-semantic-zoom', 'Use semantic zooming to reveal detail as people move deeper into an inquiry', 2140, 4.9, [
          C('atlas-semantic-context', 'People can lose context when they move between levels', 1280, 4.8),
          C('atlas-semantic-mobile', 'Dense branching has to remain understandable on a phone', 1190, 4.8),
          M('atlas-semantic-prototype', 'Test the semantic-zooming interaction with realistic multi-level inquiry data', 1080, 4.9),
          M('atlas-semantic-mobile-test', 'Run the core navigation flows on narrow mobile layouts before adding more controls', 870, 4.8)
        ]),
        S('atlas-contextual-types', 'Organize contributions by their role: Issue, Solution, Challenge, or Implementation', 1860, 4.8)
      ]),
      I('atlas-quality', 'How can useful contributions rise without turning Atlas into a popularity contest?', 2260, 4.8, [
        S('atlas-ranking-signals', 'Rank contributions using several quality signals rather than votes alone', 1710, 4.7),
        S('atlas-synthesis', 'Use AI to summarize and connect discussion while keeping people as the source of the ideas', 1690, 4.7)
      ]),
      I('atlas-disagreement', 'How can people who deeply disagree still build on the same body of knowledge?', 2150, 4.9),
      I('atlas-governance', 'Who should decide what Atlas features, moderates, or changes?', 1940, 4.8),
      I('atlas-inquiries', 'People should be able to start inquiries without every inquiry taking over the main discovery screen', 1810, 4.8, [
        S('atlas-profile-inquiries', 'Let users keep the inquiries they create and follow on their profiles', 1620, 4.8, [
          C('atlas-profile-abandonment', 'What happens to a shared inquiry if its creator disappears?', 880, 4.7),
          M('atlas-profile-library', 'Add a profile inquiry library with created, saved, and followed sections', 790, 4.8)
        ]),
        S('atlas-featured-inquiries', 'Separate creating an inquiry from Atlas choosing to feature it', 1740, 4.9, [
          M('atlas-featured-state', 'Add an explicit featured status that does not affect whether an inquiry continues to exist', 850, 4.8)
        ])
      ])
    ]),

    I('root-better-world', 'What would make the world noticeably better within our lifetime?', 4310, 4.8, [
      I('better-normalized', 'What problems have we gotten so used to that we no longer question them?', 2680, 4.9),
      I('better-inevitable', 'What are we accepting as inevitable that does not have to be?', 2540, 4.9),
      I('better-undertried', 'What good ideas are not being tried — and why?', 2410, 4.8),
      I('better-access', 'What should everyone have access to simply because they are human?', 2320, 4.8),
      I('better-daily-life', 'What parts of everyday life are unnecessarily difficult?', 2110, 4.7),
      I('better-institutions', 'What institutions would we design differently if we were starting today?', 2070, 4.8),
      S('better-cheap-wins', 'Look for changes that could improve many lives with relatively modest resources', 1760, 4.7)
    ]),

    I('root-hope', 'What would make you more hopeful about the future?', 4190, 4.9, [
      I('hope-security', 'Knowing that ordinary people can still build a stable life', 2380, 4.8),
      I('hope-cooperation', 'Seeing people solve difficult problems across political and cultural divides', 2290, 4.9),
      I('hope-progress', 'Seeing measurable progress on problems that currently feel permanent', 2170, 4.8),
      I('hope-agency', 'Feeling that individual and community action can still matter', 2080, 4.8),
      I('hope-future-generations', 'Believing the next generation will inherit real opportunities', 1960, 4.8)
    ]),

    I('root-wrong', 'What are we wrong about?', 4050, 4.9, [
      I('wrong-assumptions', 'Which assumptions survive mostly because everyone repeats them?', 2450, 4.9),
      I('wrong-incentives', 'Where are our institutions measuring the wrong thing?', 2210, 4.8),
      I('wrong-solutions', 'Which popular solutions are treating symptoms instead of causes?', 2170, 4.8),
      I('wrong-future', 'What are we most likely misunderstanding about the next twenty years?', 2040, 4.8),
      I('wrong-minds', 'What evidence would actually make us change our minds?', 1980, 4.9)
    ]),

    I('root-one-change', 'If you could change one thing about the world, what would you change?', 3980, 4.8, [
      I('one-change-opportunity', 'Give every child a genuine chance to build a good life', 2190, 4.8),
      I('one-change-loneliness', 'Make it easier for people to form lasting friendships and community', 2070, 4.8),
      I('one-change-suffering', 'Reduce suffering that is preventable with tools we already have', 2240, 4.9),
      I('one-change-agency', 'Give ordinary people more influence over decisions that shape their lives', 2160, 4.8),
      I('one-change-longterm', 'Make long-term consequences matter more in decisions made today', 2010, 4.8)
    ])
  ];

  roots.forEach(root => { root.color = '#71879a'; });
  forestData.splice(0, forestData.length, ...roots);
})();
