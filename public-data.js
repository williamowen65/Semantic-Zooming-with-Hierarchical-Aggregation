// Broad-root Atlas test data. The root level is intentionally a small set of
// durable public-interest umbrellas; deeper content can become much more specific.
(() => {
  if (!Array.isArray(window.forestData) && typeof forestData === "undefined") return;
  const forest = typeof forestData !== "undefined" ? forestData : window.forestData;

  const issue = (id, name, votes, rating, children = []) => ({ id, name, votes, rating, kind: "issue", ...(children.length ? { children } : {}) });
  const solution = (id, name, votes, rating, children = []) => ({ id, name, votes, rating, kind: "solution", ...(children.length ? { children } : {}) });

  // These roots are deliberately broad enough for ordinary public posts, not just
  // formal policy topics. Children are only provisional examples for navigation.
  const roots = [
    issue("root-health", "Health & Wellbeing", 9800, 4.7, [
      issue("health-care-access", "Healthcare access and affordability", 3100, 4.7),
      issue("health-mental", "Mental health and addiction", 2700, 4.8),
      issue("health-disability", "Disability, aging, and independent living", 1900, 4.6),
      issue("health-prevention", "Prevention, nutrition, and everyday wellbeing", 1700, 4.5)
    ]),
    issue("root-economy", "Money, Work & Economy", 9400, 4.6, [
      issue("economy-jobs", "Jobs, wages, and working conditions", 3000, 4.7),
      issue("economy-affordability", "Cost of living and household finances", 2900, 4.8),
      issue("economy-business", "Small businesses and entrepreneurship", 1900, 4.4),
      issue("economy-opportunity", "Economic mobility and inequality", 2100, 4.6)
    ]),
    issue("root-housing", "Housing & Built Environment", 9000, 4.7, [
      issue("housing-affordability", "Housing affordability", 3200, 4.8),
      issue("housing-homelessness", "Homelessness and housing instability", 2500, 4.8),
      issue("housing-neighborhoods", "Neighborhood design and land use", 1900, 4.4),
      issue("housing-buildings", "Building quality, accessibility, and repair", 1700, 4.5)
    ]),
    issue("root-education", "Education & Knowledge", 8500, 4.6, [
      issue("education-schools", "Schools and early learning", 2800, 4.7),
      issue("education-higher", "College and higher education", 1900, 4.4),
      issue("education-skills", "Skills, training, and lifelong learning", 2100, 4.6),
      issue("education-knowledge", "Research and access to knowledge", 1700, 4.5)
    ]),
    issue("root-environment", "Environment & Natural World", 9300, 4.8, [
      issue("environment-climate", "Climate change", 3400, 4.9),
      issue("environment-pollution", "Pollution and environmental health", 2200, 4.7),
      issue("environment-nature", "Biodiversity, wildlife, and ecosystems", 2000, 4.7),
      issue("environment-water", "Water, land, and natural resources", 1700, 4.6)
    ]),
    issue("root-infrastructure", "Infrastructure, Transportation & Utilities", 8200, 4.5, [
      issue("infrastructure-transport", "Roads, transit, walking, and biking", 2700, 4.6),
      issue("infrastructure-water", "Water, sewer, and stormwater systems", 1900, 4.6),
      issue("infrastructure-public", "Public facilities and shared infrastructure", 1700, 4.4),
      issue("infrastructure-connectivity", "Communications and connectivity infrastructure", 1900, 4.5)
    ]),
    issue("root-energy", "Energy & Resources", 7600, 4.5, [
      issue("energy-grid", "Electricity generation and the grid", 2600, 4.7),
      issue("energy-cost", "Energy affordability and reliability", 1900, 4.6),
      issue("energy-transition", "Energy transition and electrification", 1800, 4.5),
      issue("energy-materials", "Minerals, fuels, and resource use", 1300, 4.3)
    ]),
    issue("root-government", "Government & Public Institutions", 8300, 4.5, [
      issue("government-services", "Public services and administration", 2500, 4.5),
      issue("government-democracy", "Elections, representation, and participation", 2300, 4.7),
      issue("government-trust", "Transparency, corruption, and public trust", 2100, 4.7),
      issue("government-tax", "Taxes, budgets, and public spending", 1700, 4.4)
    ]),
    issue("root-justice", "Law, Rights & Justice", 8500, 4.7, [
      issue("justice-courts", "Courts and access to legal help", 2100, 4.6),
      issue("justice-policing", "Policing and criminal justice", 2400, 4.6),
      issue("justice-rights", "Civil rights, liberties, and discrimination", 2500, 4.8),
      issue("justice-laws", "Laws, regulation, and enforcement", 1500, 4.4)
    ]),
    issue("root-safety", "Safety, Conflict & Security", 7900, 4.6, [
      issue("safety-community", "Personal and community safety", 2200, 4.6),
      issue("safety-disasters", "Disasters and emergency preparedness", 1900, 4.7),
      issue("safety-war", "War, violence, and armed conflict", 2400, 4.8),
      issue("safety-security", "National and international security", 1400, 4.4)
    ]),
    issue("root-technology", "Technology & Information", 8800, 4.7, [
      issue("technology-ai", "AI and automation", 2800, 4.7),
      issue("technology-privacy", "Privacy, cybersecurity, and digital identity", 2200, 4.7),
      issue("technology-platforms", "Social media and online platforms", 2100, 4.6),
      issue("technology-information", "Information quality, access, and misinformation", 1700, 4.7)
    ]),
    issue("root-community", "Family, Relationships & Community", 7800, 4.6, [
      issue("community-family", "Family life, parenting, and childcare", 2300, 4.7),
      issue("community-relationships", "Relationships and social connection", 1900, 4.5),
      issue("community-local", "Neighborhood and community life", 2100, 4.6),
      issue("community-loneliness", "Loneliness, belonging, and isolation", 1500, 4.7)
    ]),
    issue("root-culture", "Culture, Media & Recreation", 7200, 4.4, [
      issue("culture-arts", "Arts, music, and creative life", 1700, 4.5),
      issue("culture-entertainment", "Entertainment, events, and recreation", 1800, 4.3),
      issue("culture-media", "Journalism and media", 1700, 4.6),
      issue("culture-sports", "Sports, hobbies, and leisure", 1100, 4.2),
      issue("culture-belief", "Religion, traditions, and cultural practices", 900, 4.3)
    ]),
    issue("root-food", "Food & Agriculture", 7300, 4.6, [
      issue("food-access", "Food access and affordability", 2300, 4.8),
      issue("food-farming", "Farming, fisheries, and food production", 1900, 4.5),
      issue("food-safety", "Food safety and nutrition", 1600, 4.6),
      issue("food-waste", "Food waste and distribution", 1500, 4.5)
    ]),
    issue("root-migration", "Human Movement & Migration", 6900, 4.5, [
      issue("migration-immigration", "Immigration and citizenship", 2200, 4.6),
      issue("migration-refugees", "Refugees and forced displacement", 1900, 4.8),
      issue("migration-borders", "Borders and migration systems", 1600, 4.4),
      issue("migration-mobility", "Regional mobility and relocation", 1200, 4.3)
    ]),
    issue("root-consumer", "Products, Services & Consumer Life", 8100, 4.6, [
      issue("consumer-pricing", "Fees, pricing, subscriptions, and billing", 2500, 4.7),
      issue("consumer-products", "Product quality, repairability, and safety", 2000, 4.6),
      issue("consumer-service", "Customer service and consumer protections", 2100, 4.7),
      issue("consumer-travel", "Travel, ticketing, retail, and everyday services", 1500, 4.4)
    ])
  ];

  // Replace the prototype's previous top-level taxonomy completely. This lets us
  // evaluate the root vocabulary first before deciding how much old deep sample
  // data should be migrated beneath these umbrellas.
  forest.splice(0, forest.length, ...roots);

  if (typeof nodeById !== "undefined" && typeof parentById !== "undefined" && typeof rootById !== "undefined" && typeof annotate === "function") {
    nodeById.clear(); parentById.clear(); rootById.clear();
    forest.forEach(root => annotate(root));
  }

  if (typeof render === "function") render();
})();