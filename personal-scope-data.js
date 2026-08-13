// Adds smaller-scope examples to the same forest used by the broad civic topics.
// These deliberately mix personal, household, small-team, and neighborhood issues
// into the hierarchy so the visualization can be evaluated across very different scopes.
(() => {
  if (typeof forestData === "undefined" || typeof annotate !== "function") return;

  const scopedExamples = [
    {
      id: "root-personal-life",
      name: "Personal Life & Everyday Problems",
      votes: 1450,
      rating: 4.6,
      kind: "issue",
      color: "#8b7896",
      children: [
        {
          id: "personal-procrastination",
          name: "I Keep Putting Off Important Tasks",
          votes: 620,
          rating: 4.7,
          kind: "issue",
          children: [
            { id: "personal-procrastination-overwhelm", name: "I Avoid Starting When a Task Feels Too Big", votes: 390, rating: 4.8, kind: "issue" },
            { id: "personal-procrastination-phone", name: "My Phone Pulls Me Away From Focus", votes: 360, rating: 4.6, kind: "issue" },
            { id: "personal-procrastination-deadlines", name: "I Lose Track of Deadlines", votes: 285, rating: 4.5, kind: "issue" },
            { id: "personal-procrastination-start", name: "Start With Just Ten Minutes", votes: 410, rating: 4.7, kind: "solution" },
            { id: "personal-procrastination-body-double", name: "Use an Accountability or Body-Double Session", votes: 330, rating: 4.6, kind: "solution" },
            { id: "personal-procrastination-blockers", name: "Block Distracting Apps During Focus Time", votes: 300, rating: 4.5, kind: "solution" }
          ]
        },
        {
          id: "personal-sleep",
          name: "My Sleep Schedule Is a Mess",
          votes: 540,
          rating: 4.6,
          kind: "issue",
          children: [
            { id: "personal-sleep-late-phone", name: "I Stay on My Phone Too Late", votes: 330, rating: 4.6, kind: "issue" },
            { id: "personal-sleep-weekend", name: "My Weekend Schedule Throws Off the Week", votes: 250, rating: 4.5, kind: "issue" },
            { id: "personal-sleep-winddown", name: "Create a Short Repeatable Wind-Down Routine", votes: 350, rating: 4.7, kind: "solution" },
            { id: "personal-sleep-wake", name: "Keep One Consistent Wake-Up Time", votes: 310, rating: 4.6, kind: "solution" }
          ]
        },
        { id: "personal-clutter", name: "My Home Keeps Getting Cluttered", votes: 490, rating: 4.5, kind: "issue" },
        { id: "personal-job-decision", name: "I Need to Decide Whether to Change Jobs", votes: 470, rating: 4.7, kind: "issue" },
        { id: "personal-new-city", name: "I Feel Isolated After Moving Somewhere New", votes: 430, rating: 4.7, kind: "issue" },
        { id: "personal-weekly-reset", name: "Weekly Personal Reset Routine", votes: 390, rating: 4.5, kind: "solution" }
      ]
    },
    {
      id: "root-relationships-household",
      name: "Family, Friends & Household",
      votes: 2050,
      rating: 4.7,
      kind: "issue",
      color: "#92776f",
      children: [
        {
          id: "relationships-friend-conflict",
          name: "Tension With a Close Friend",
          votes: 820,
          rating: 4.8,
          kind: "issue",
          children: [
            { id: "relationships-friend-texting", name: "Text Messages Keep Getting Misread", votes: 410, rating: 4.6, kind: "issue" },
            { id: "relationships-friend-avoidance", name: "We Keep Avoiding the Real Conversation", votes: 380, rating: 4.8, kind: "issue" },
            { id: "relationships-friend-assumptions", name: "We Are Making Assumptions About Each Other", votes: 340, rating: 4.7, kind: "issue" },
            { id: "relationships-friend-talk", name: "Ask for a Short In-Person Conversation", votes: 470, rating: 4.7, kind: "solution" },
            { id: "relationships-friend-specific", name: "Describe One Specific Moment Instead of Generalizing", votes: 390, rating: 4.6, kind: "solution" }
          ]
        },
        {
          id: "household-chores",
          name: "Dividing Household Chores Fairly",
          votes: 760,
          rating: 4.7,
          kind: "issue",
          children: [
            { id: "household-chores-invisible", name: "Invisible Planning Work Is Uneven", votes: 430, rating: 4.8, kind: "issue" },
            { id: "household-chores-standards", name: "We Have Different Standards for What Counts as Done", votes: 390, rating: 4.6, kind: "issue" },
            { id: "household-chores-rotate", name: "Rotate Ownership of Recurring Tasks", votes: 420, rating: 4.6, kind: "solution" },
            { id: "household-chores-board", name: "Use a Shared Household Task Board", votes: 360, rating: 4.5, kind: "solution" }
          ]
        },
        { id: "family-aging-parent", name: "Supporting an Aging Parent Without Burning Out", votes: 680, rating: 4.8, kind: "issue" },
        { id: "family-boundaries", name: "Setting Better Boundaries With Family", votes: 640, rating: 4.7, kind: "issue" },
        { id: "household-checkin", name: "Weekly Household Check-In", votes: 510, rating: 4.6, kind: "solution" }
      ]
    },
    {
      id: "root-small-team",
      name: "Small Team & Workplace Problems",
      votes: 2500,
      rating: 4.6,
      kind: "issue",
      color: "#6f8791",
      children: [
        {
          id: "team-long-meetings",
          name: "Our Team Meetings Run Too Long",
          votes: 980,
          rating: 4.7,
          kind: "issue",
          children: [
            { id: "team-meeting-no-agenda", name: "Meetings Start Without a Clear Agenda", votes: 540, rating: 4.7, kind: "issue" },
            { id: "team-meeting-status", name: "Too Much Time Goes to Status Updates", votes: 500, rating: 4.6, kind: "issue" },
            { id: "team-meeting-decisions", name: "Decisions Are Not Clearly Recorded", votes: 420, rating: 4.7, kind: "issue" },
            { id: "team-meeting-agenda", name: "Require an Agenda and Desired Decision", votes: 560, rating: 4.7, kind: "solution" },
            { id: "team-meeting-async", name: "Move Routine Status Updates Async", votes: 520, rating: 4.6, kind: "solution" }
          ]
        },
        { id: "team-onboarding", name: "New Hire Onboarding Is Inconsistent", votes: 870, rating: 4.6, kind: "issue" },
        { id: "team-workload", name: "Workload Is Uneven Across the Team", votes: 840, rating: 4.7, kind: "issue" },
        { id: "team-ownership", name: "It Is Hard to Know Who Owns a Task", votes: 760, rating: 4.6, kind: "issue" },
        { id: "team-triage", name: "Weekly Fifteen-Minute Work Triage", votes: 690, rating: 4.5, kind: "solution" }
      ]
    },
    {
      id: "root-neighborhood",
      name: "Neighborhood & Local Community",
      votes: 3050,
      rating: 4.7,
      kind: "issue",
      color: "#7b8d70",
      children: [
        {
          id: "neighborhood-intersection",
          name: "Unsafe Intersection Near My Home",
          votes: 1260,
          rating: 4.8,
          kind: "issue",
          children: [
            { id: "neighborhood-intersection-speed", name: "Drivers Enter the Intersection Too Fast", votes: 760, rating: 4.8, kind: "issue" },
            { id: "neighborhood-intersection-visibility", name: "Parked Cars Block Sight Lines", votes: 650, rating: 4.7, kind: "issue" },
            { id: "neighborhood-intersection-crosswalk", name: "There Is No Clear Pedestrian Crossing", votes: 610, rating: 4.8, kind: "issue" },
            { id: "neighborhood-intersection-request", name: "Submit a Traffic-Calming Request With Photos", votes: 720, rating: 4.7, kind: "solution" },
            { id: "neighborhood-intersection-neighbors", name: "Collect Neighbor Reports of Near Misses", votes: 580, rating: 4.6, kind: "solution" }
          ]
        },
        { id: "neighborhood-noise", name: "Noisy Late-Night Traffic on Our Street", votes: 980, rating: 4.6, kind: "issue" },
        { id: "neighborhood-childcare", name: "Finding Nearby Childcare With Openings", votes: 940, rating: 4.8, kind: "issue" },
        { id: "neighborhood-packages", name: "Package Theft in Our Apartment Building", votes: 820, rating: 4.6, kind: "issue" },
        { id: "neighborhood-contact-tree", name: "Neighborhood Contact and Help Tree", votes: 710, rating: 4.5, kind: "solution" }
      ]
    }
  ];

  const existingIds = new Set(forestData.map(root => root.id));
  scopedExamples.forEach(root => {
    if (existingIds.has(root.id)) return;
    forestData.push(root);
    annotate(root);
  });

  if (typeof render === "function") render();
})();
