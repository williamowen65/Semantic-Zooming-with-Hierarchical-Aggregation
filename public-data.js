// Richer synthetic Atlas data meant to resemble public participation rather than
// a generic taxonomy. It deliberately mixes observations, concrete problems,
// proposed solutions, implementation questions, and uneven branch depths.
(() => {
  if (!Array.isArray(window.forestData) && typeof forestData === "undefined") return;
  const forest = typeof forestData !== "undefined" ? forestData : window.forestData;

  const issue = (id, name, votes, rating, children = []) => ({ id, name, votes, rating, kind: "issue", ...(children.length ? { children } : {}) });
  const solution = (id, name, votes, rating, children = []) => ({ id, name, votes, rating, kind: "solution", ...(children.length ? { children } : {}) });

  // Remove the earlier generated "Access / Capacity / Cost / Quality" stress-test
  // branches. They were useful for density testing but made unrelated domains feel
  // like copies of one another.
  forest.forEach(root => {
    if (root.children) root.children = root.children.filter(child => !String(child.id || "").startsWith("bulk-"));
  });

  const ecosystems = {
    climate: [
      issue("public-climate-home-insurance", "Home insurance is disappearing in high-risk areas", 1840, 4.6, [
        issue("public-climate-nonrenewals", "Insurers are not renewing policies after repeated wildfire seasons", 920, 4.7),
        issue("public-climate-flood-maps", "Flood maps do not match what residents are seeing on the ground", 760, 4.5),
        solution("public-climate-risk-disclosure", "Require clearer property-level climate risk disclosure before a sale", 710, 4.4),
        solution("public-climate-resilience-discounts", "Give insurance discounts for verified resilience upgrades", 640, 4.5, [
          issue("public-climate-discount-proof", "Homeowners need a simple way to prove mitigation work was completed", 350, 4.4),
          solution("public-climate-home-cert", "Create a portable resilience certificate for homes", 330, 4.6)
        ])
      ]),
      issue("public-climate-heat-workers", "Outdoor workers are being exposed to dangerous heat", 1510, 4.7, [
        issue("public-climate-heat-breaks", "Workers say heat breaks are inconsistent or discouraged", 740, 4.7),
        issue("public-climate-night-shifts", "Some jobs cannot simply move to cooler hours", 520, 4.3),
        solution("public-climate-heat-standard", "Set enforceable heat-rest and hydration standards", 810, 4.8)
      ]),
      solution("public-climate-neighborhood-cooling", "Fund neighborhood cooling projects where heat exposure is highest", 1330, 4.6, [
        solution("public-climate-tree-canopy", "Prioritize shade trees on walking routes and near bus stops", 690, 4.7),
        solution("public-climate-cool-roofs", "Subsidize cool roofs for older low-income housing", 620, 4.6),
        issue("public-climate-maintenance", "Cities plant trees but often do not fund long-term maintenance", 470, 4.5)
      ])
    ],

    infrastructure: [
      issue("public-infra-bus-unreliable", "My bus is scheduled every 15 minutes but often two arrive together", 2060, 4.7, [
        issue("public-infra-bus-bunching", "Bus bunching makes the published schedule meaningless", 1080, 4.7),
        issue("public-infra-signal-delay", "Buses lose time at the same congested intersections every day", 760, 4.4),
        solution("public-infra-transit-signal", "Give late buses priority at traffic signals", 930, 4.6, [
          issue("public-infra-priority-fairness", "Transit priority should not block emergency vehicles or pedestrians", 390, 4.2),
          solution("public-infra-priority-rules", "Publish clear rules for when signal priority activates", 360, 4.4)
        ]),
        solution("public-infra-live-headways", "Show riders actual spacing between buses, not only scheduled arrival times", 840, 4.5)
      ]),
      issue("public-infra-water-main", "The same water main keeps breaking on our street", 1640, 4.6, [
        issue("public-infra-patch-cycle", "Repairs keep patching the failure instead of replacing the old segment", 840, 4.7),
        issue("public-infra-road-repeat", "The road is repaved and then dug up again months later", 710, 4.5),
        solution("public-infra-utility-coordination", "Coordinate road paving with planned utility replacement", 900, 4.7)
      ]),
      issue("public-infra-sidewalk", "Wheelchair users are forced into the street where sidewalks disappear", 1480, 4.8, [
        issue("public-infra-curb-cuts", "Some curb ramps point into traffic instead of the crosswalk", 690, 4.8),
        issue("public-infra-obstructions", "Poles and utility boxes leave less than a wheelchair-width path", 610, 4.7),
        solution("public-infra-accessibility-audit", "Let residents map inaccessible sidewalk segments and track repairs publicly", 810, 4.7)
      ]),
      solution("public-infra-fix-first", "Reserve more capital funding for repairing existing infrastructure before expansion", 1260, 4.5, [
        issue("public-infra-condition-data", "Residents cannot see how repair priorities are scored", 540, 4.4),
        solution("public-infra-public-scorecard", "Publish condition scores and the reason each project was prioritized", 720, 4.6)
      ])
    ],

    education: [
      issue("public-edu-iep-wait", "Families wait months for special-education evaluations", 1930, 4.8, [
        issue("public-edu-evaluator-shortage", "There are not enough school psychologists and evaluators", 990, 4.7),
        issue("public-edu-process-confusing", "Parents do not know what deadlines the school is supposed to meet", 780, 4.6),
        solution("public-edu-iep-tracker", "Give families a simple case tracker with required dates and next steps", 940, 4.8, [
          solution("public-edu-iep-reminders", "Send automatic reminders before evaluation and meeting deadlines", 410, 4.7),
          issue("public-edu-iep-privacy", "The tracker must protect sensitive student records", 360, 4.6)
        ])
      ]),
      issue("public-edu-teacher-churn", "Students keep getting a new teacher in the middle of the year", 1680, 4.6, [
        issue("public-edu-housing-cost", "Teachers say local housing costs make it hard to stay", 770, 4.5),
        issue("public-edu-planning-time", "Teachers are doing planning and paperwork late at night", 700, 4.6),
        solution("public-edu-mentor-load", "Reduce first-year teaching loads and pair new teachers with paid mentors", 820, 4.7)
      ]),
      issue("public-edu-credit-transfer", "Community-college credits do not transfer cleanly to four-year schools", 1290, 4.5, [
        issue("public-edu-surprise-repeat", "Students discover after transferring that they must repeat courses", 650, 4.6),
        solution("public-edu-transfer-map", "Show guaranteed course-to-course transfer paths before students enroll", 760, 4.7)
      ]),
      solution("public-edu-after-school", "Keep school buildings open for supervised after-school study and activities", 1170, 4.4, [
        issue("public-edu-late-bus", "Students without a ride home cannot use after-school programs", 610, 4.6),
        solution("public-edu-late-transport", "Coordinate late buses with after-school program schedules", 650, 4.6)
      ])
    ],

    healthcare: [
      issue("public-health-new-patient", "I called ten primary-care offices and none were taking new patients", 2280, 4.8, [
        issue("public-health-directory-wrong", "Insurance directories list doctors who are not actually accepting patients", 1240, 4.8),
        issue("public-health-months-wait", "The next available appointment can be months away", 1080, 4.7),
        solution("public-health-live-directory", "Require insurers to show verified, recently updated appointment availability", 1190, 4.8, [
          issue("public-health-directory-update", "Practices need an easy way to update availability without extra paperwork", 470, 4.4),
          solution("public-health-directory-api", "Let scheduling systems update insurer directories automatically", 520, 4.6)
        ])
      ]),
      issue("public-health-medical-bill", "The bill arrives months later and I cannot tell what I actually owe", 1990, 4.7, [
        issue("public-health-eob-confusion", "The explanation of benefits does not match the provider bill", 920, 4.7),
        issue("public-health-code-language", "Billing codes are meaningless to most patients", 760, 4.6),
        solution("public-health-one-bill", "Provide one plain-language statement showing insurer payment and remaining balance", 1030, 4.8)
      ]),
      issue("public-health-rural-maternity", "Pregnant patients are driving more than an hour for maternity care", 1570, 4.8, [
        issue("public-health-ob-closures", "Small hospitals are closing obstetric units", 830, 4.8),
        solution("public-health-mobile-prenatal", "Use mobile prenatal clinics for routine visits in maternity-care deserts", 710, 4.6),
        solution("public-health-maternity-transport", "Guarantee transportation for high-risk prenatal appointments", 620, 4.7)
      ]),
      solution("public-health-community-workers", "Pay community health workers to help people navigate care locally", 1260, 4.7, [
        issue("public-health-chw-reimbursement", "Clinics struggle to bill for navigation work", 530, 4.5),
        solution("public-health-chw-benefit", "Make navigation a reimbursable health benefit", 670, 4.7)
      ])
    ],

    economy: [
      issue("public-econ-rent-wages", "Rent rose much faster than my pay", 2340, 4.7, [
        issue("public-econ-second-job", "People are taking second jobs just to cover fixed expenses", 1110, 4.6),
        issue("public-econ-commute-housing", "Affordable housing is farther from major job centers", 960, 4.5),
        solution("public-econ-wage-data", "Publish local wage growth next to housing and transportation costs", 720, 4.3)
      ]),
      issue("public-econ-childcare-shift", "Childcare hours do not match evening and weekend work", 1810, 4.8, [
        issue("public-econ-night-care", "There are almost no licensed options for overnight shifts", 910, 4.8),
        issue("public-econ-schedule-change", "Workers sometimes get their schedule only a few days in advance", 840, 4.7),
        solution("public-econ-nonstandard-care", "Subsidize licensed childcare that covers nonstandard work hours", 960, 4.8)
      ]),
      issue("public-econ-small-business-lease", "Small businesses cannot predict what their commercial rent will be next year", 1420, 4.5, [
        issue("public-econ-triple-net", "Unexpected pass-through building costs can make a lease unaffordable", 650, 4.4),
        solution("public-econ-lease-summary", "Require a standardized plain-language commercial lease cost summary", 690, 4.5)
      ]),
      solution("public-econ-benefit-portability", "Make basic worker benefits portable when people change jobs or work multiple gigs", 1390, 4.6, [
        issue("public-econ-who-pays", "A portable system needs a fair way to split contributions among employers", 680, 4.4),
        solution("public-econ-prorated-benefit", "Require prorated benefit contributions based on hours or earnings", 740, 4.6)
      ])
    ],

    environment: [
      issue("public-env-creek-after-rain", "The creek turns brown and smells like sewage after heavy rain", 1710, 4.7, [
        issue("public-env-overflow", "Stormwater is entering aging sewer lines and causing overflows", 880, 4.7),
        issue("public-env-warning", "Residents often learn about contamination after they have already used the water", 690, 4.6),
        solution("public-env-alerts", "Send immediate public alerts when monitoring detects an overflow", 810, 4.7)
      ]),
      issue("public-env-tree-loss", "Mature neighborhood trees are being removed faster than they are replaced", 1480, 4.6, [
        issue("public-env-canopy-heat", "The hottest blocks also tend to have the least tree canopy", 760, 4.7),
        solution("public-env-tree-survival", "Track whether replacement trees survive five years, not just whether they were planted", 790, 4.7)
      ]),
      issue("public-env-plastic-pellets", "Tiny plastic pellets keep washing onto the shoreline near industrial sites", 1120, 4.5, [
        issue("public-env-source-unclear", "Residents can see the pollution but cannot identify which facility released it", 540, 4.5),
        solution("public-env-pellet-report", "Require facilities to report pellet spills and cleanup publicly", 610, 4.6)
      ]),
      solution("public-env-citizen-monitor", "Let community monitoring data feed into official environmental dashboards", 980, 4.6, [
        issue("public-env-data-quality", "Agencies need transparent standards for validating community measurements", 480, 4.5),
        solution("public-env-calibration", "Provide shared calibration kits and sampling protocols", 520, 4.7)
      ])
    ],

    governance: [
      issue("public-gov-permit-status", "Permit applications disappear into a black box for weeks", 1860, 4.7, [
        issue("public-gov-no-owner", "Applicants do not know which reviewer currently has the file", 890, 4.6),
        issue("public-gov-repeat-docs", "Different departments ask for the same documents again", 720, 4.5),
        solution("public-gov-permit-tracker", "Show each review step, responsible office, and expected response date", 1050, 4.8)
      ]),
      issue("public-gov-meeting-time", "Important public meetings happen while most people are at work", 1510, 4.6, [
        issue("public-gov-comment-format", "Remote public comment rules vary from meeting to meeting", 660, 4.4),
        solution("public-gov-async-comment", "Allow written and recorded comments before the meeting and display them with the agenda", 820, 4.7)
      ]),
      issue("public-gov-contract-search", "It is hard to see who is winning public contracts and whether projects were delivered", 1390, 4.6, [
        issue("public-gov-vendor-names", "The same vendor can appear under different legal names", 570, 4.4),
        solution("public-gov-contract-graph", "Connect contracts, vendors, change orders, payments, and performance in one public view", 760, 4.7)
      ]),
      solution("public-gov-service-receipt", "Give residents a tracking receipt whenever they submit a government request", 1200, 4.7, [
        solution("public-gov-receipt-escalate", "Escalate requests automatically when the promised response date passes", 610, 4.7),
        issue("public-gov-receipt-spam", "The system should merge duplicate reports without hiding how many people reported the problem", 520, 4.5)
      ])
    ],

    "social-equity": [
      issue("public-equity-language-school", "Parents miss school information because translations arrive late or not at all", 1640, 4.8, [
        issue("public-equity-machine-translation", "Automatic translation can be dangerously wrong for special-education and disciplinary notices", 780, 4.8),
        solution("public-equity-human-review", "Require human review for high-stakes translated notices", 850, 4.8)
      ]),
      issue("public-equity-disability-events", "Public events say they are accessible but do not describe what accessibility actually means", 1320, 4.7, [
        issue("public-equity-access-details", "People need details about entrances, seating, captions, bathrooms, and sensory conditions", 710, 4.8),
        solution("public-equity-access-template", "Use a standard accessibility information card for public events", 730, 4.7)
      ]),
      issue("public-equity-id-documents", "People without stable housing struggle to replace identification documents", 1210, 4.8, [
        issue("public-equity-address-proof", "Many replacement processes require proof of address", 610, 4.7),
        solution("public-equity-doc-navigator", "Create one navigator process for replacing ID, birth records, and benefit cards", 680, 4.8)
      ]),
      solution("public-equity-paid-participation", "Pay community members for time spent on formal advisory boards", 1010, 4.6, [
        issue("public-equity-who-can-serve", "Unpaid advisory work favors people with flexible jobs and disposable time", 580, 4.7)
      ])
    ],

    technology: [
      issue("public-tech-fake-jobs", "Fake job listings are getting harder to distinguish from real employers", 2080, 4.8, [
        issue("public-tech-interview-scam", "Scammers conduct realistic text interviews before asking for money or banking details", 1030, 4.8),
        issue("public-tech-reposted-jobs", "Expired or copied job postings stay online for months", 760, 4.5),
        solution("public-tech-employer-verification", "Require verified employer identity for high-reach job listings", 1110, 4.8, [
          issue("public-tech-small-employer", "Verification cannot be so expensive that small employers are excluded", 490, 4.4),
          solution("public-tech-tiered-verification", "Use stronger verification only when a listing reaches large audiences or asks for sensitive data", 570, 4.6)
        ])
      ]),
      issue("public-tech-ai-appeal", "An automated decision denied me and there was no meaningful way to appeal", 1940, 4.8, [
        issue("public-tech-ai-reason", "The explanation is often a generic score or category instead of the actual reason", 970, 4.8),
        solution("public-tech-human-review", "Guarantee human review for consequential automated decisions", 1160, 4.9),
        solution("public-tech-decision-record", "Give people a record of the data and rules that affected the decision", 980, 4.8)
      ]),
      issue("public-tech-account-recovery", "Losing a phone can lock someone out of essential accounts", 1530, 4.6, [
        issue("public-tech-number-recycled", "Phone numbers are recycled and can become a security weakness", 690, 4.5),
        solution("public-tech-recovery-key", "Offer recovery methods that do not depend on a single phone number", 790, 4.7)
      ]),
      solution("public-tech-content-provenance", "Show where synthetic images and videos came from without hiding unverified media", 1270, 4.5, [
        issue("public-tech-provenance-missing", "Older and independently produced media may not contain provenance metadata", 560, 4.3),
        solution("public-tech-provenance-layers", "Display provenance confidence and evidence instead of a binary real/fake badge", 690, 4.6)
      ])
    ],

    energy: [
      issue("public-energy-interconnection", "A solar project can wait years for a grid interconnection study", 1770, 4.7, [
        issue("public-energy-queue-opacity", "Developers cannot see which grid upgrades are holding up the queue", 820, 4.6),
        issue("public-energy-duplicate-studies", "Similar projects repeatedly pay for overlapping studies", 650, 4.4),
        solution("public-energy-queue-map", "Publish feeder-level hosting capacity and queued upgrade needs", 940, 4.7)
      ]),
      issue("public-energy-bill-spike", "My electric bill spikes even though my household usage barely changes", 1690, 4.6, [
        issue("public-energy-rate-confusing", "Bills mix supply, delivery, riders, and time-based charges in ways that are hard to understand", 810, 4.6),
        solution("public-energy-bill-explain", "Show a plain-language explanation of exactly what changed from the previous bill", 890, 4.7)
      ]),
      issue("public-energy-renter-efficiency", "Renters pay high energy bills but cannot choose major efficiency upgrades", 1480, 4.8, [
        issue("public-energy-split-incentive", "Landlords pay for improvements while tenants receive much of the utility savings", 770, 4.7),
        solution("public-energy-rental-standard", "Set minimum efficiency standards when rental units change tenants", 790, 4.7),
        solution("public-energy-onbill", "Finance upgrades through the meter so costs can transfer with the property", 620, 4.4)
      ]),
      solution("public-energy-community-storage", "Let neighborhoods share battery storage for outages and peak demand", 1120, 4.5, [
        issue("public-energy-storage-control", "Residents need clear rules for who controls shared batteries during an outage", 530, 4.5),
        solution("public-energy-resilience-reserve", "Reserve part of community battery capacity for emergency use", 610, 4.7)
      ])
    ]
  };

  const byId = new Map(forest.map(root => [root.id, root]));
  Object.entries(ecosystems).forEach(([rootId, additions]) => {
    const root = byId.get(rootId);
    if (!root) return;
    const existing = new Set((root.children || []).map(child => child.id));
    root.children = [...(root.children || []), ...additions.filter(child => !existing.has(child.id))];
  });

  // Rebuild lookup maps because the core prototype uses these for breadcrumbs,
  // parent/sibling context, connectors, and focus behavior.
  if (typeof nodeById !== "undefined" && typeof parentById !== "undefined" && typeof rootById !== "undefined" && typeof annotate === "function") {
    nodeById.clear(); parentById.clear(); rootById.clear();
    forest.forEach(root => annotate(root));
  }

  // Keep only roots that actually lead to content.
  for (let i = forest.length - 1; i >= 0; i -= 1) {
    if (!forest[i].children?.length) forest.splice(i, 1);
  }

  // This file runs after the prototype's original semantic pass, so explicit
  // issue/solution kinds here remain authoritative for these synthetic records.
  if (typeof render === "function") render();
})();