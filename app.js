// Broad Atlas demo dataset. Every root has children, with several dense branches extending 4-5 levels deep.
const forestData = [
  { id:"root-health", name:"Health & Wellbeing", votes:9800, rating:4.7, kind:"issue", color:"#71879a", children:[
    { id:"health-mental-access", name:"Mental Health Care Access", votes:4100, rating:4.8, kind:"issue", children:[
      { id:"health-mental-waits", name:"Long Therapy Waitlists", votes:2600, rating:4.7, kind:"issue", children:[
        { id:"health-mental-rural", name:"Rural Provider Shortages", votes:1500, rating:4.6, kind:"issue", children:[
          { id:"health-mental-telehealth", name:"Regional Telehealth Networks", votes:980, rating:4.5, kind:"solution" },
          { id:"health-mental-incentives", name:"Rural Clinician Incentives", votes:760, rating:4.4, kind:"solution" },
          { id:"health-mental-transport", name:"Long Travel Distances for Care", votes:690, rating:4.5, kind:"issue" },
          { id:"health-mental-specialists", name:"Shortage of Child Psychiatrists", votes:640, rating:4.7, kind:"issue" },
          { id:"health-mental-crisis", name:"Limited Rural Crisis Response", votes:610, rating:4.6, kind:"issue" }
        ]},
        { id:"health-mental-insurance", name:"Insurance Network Gaps", votes:1450, rating:4.7, kind:"issue" },
        { id:"health-mental-youth", name:"Youth Counseling Backlogs", votes:1320, rating:4.8, kind:"issue" },
        { id:"health-mental-language", name:"Few Multilingual Therapists", votes:920, rating:4.6, kind:"issue" },
        { id:"health-mental-evening", name:"Limited Evening Appointments", votes:850, rating:4.4, kind:"issue" },
        { id:"health-mental-triage", name:"Same-Day Mental Health Triage", votes:1200, rating:4.6, kind:"solution" },
        { id:"health-mental-group", name:"Community Group Therapy Programs", votes:910, rating:4.5, kind:"solution" },
        { id:"health-mental-navigation", name:"Central Behavioral Health Referral Line", votes:870, rating:4.5, kind:"solution" }
      ]},
      { id:"health-school-counseling", name:"School Counseling Access", votes:2100, rating:4.6, kind:"issue" },
      { id:"health-substance-care", name:"Substance Use Treatment Access", votes:2050, rating:4.7, kind:"issue" },
      { id:"health-crisis-response", name:"Behavioral Health Crisis Response", votes:1950, rating:4.7, kind:"issue" },
      { id:"health-peer-support", name:"Peer Support Programs", votes:1700, rating:4.5, kind:"solution" },
      { id:"health-integrated-care", name:"Integrated Primary and Mental Health Care", votes:1580, rating:4.6, kind:"solution" }
    ]},
    { id:"health-primary-care", name:"Primary Care Availability", votes:3300, rating:4.6, kind:"issue", children:[
      { id:"health-primary-new-patients", name:"Clinics Not Accepting New Patients", votes:1900, rating:4.7, kind:"issue" },
      { id:"health-primary-appointments", name:"Weeks-Long Appointment Delays", votes:1750, rating:4.6, kind:"issue" },
      { id:"health-primary-mobile", name:"Mobile Primary Care Clinics", votes:1100, rating:4.5, kind:"solution" },
      { id:"health-primary-nurse", name:"Expanded Nurse Practitioner Clinics", votes:980, rating:4.5, kind:"solution" }
    ]},
    { id:"health-costs", name:"Medical Cost Burden", votes:3200, rating:4.7, kind:"issue" },
    { id:"health-prevention", name:"Preventive Care Gaps", votes:2750, rating:4.5, kind:"issue" },
    { id:"health-community-clinics", name:"Community Health Clinics", votes:2800, rating:4.7, kind:"solution" }
  ]},
  { id:"root-economy", name:"Money, Work & Economy", votes:9400, rating:4.6, kind:"issue", color:"#71879a", children:[
    { id:"economy-wage-pressure", name:"Wages Lagging Living Costs", votes:5200, rating:4.8, kind:"issue", children:[
      { id:"economy-rent-wages", name:"Rent Rising Faster Than Pay", votes:3100, rating:4.8, kind:"issue" },
      { id:"economy-food-wages", name:"Food Costs Outpacing Raises", votes:2700, rating:4.7, kind:"issue" },
      { id:"economy-childcare-wages", name:"Childcare Costs Absorbing Income", votes:2550, rating:4.8, kind:"issue" },
      { id:"economy-medical-wages", name:"Health Costs Reducing Take-Home Pay", votes:2200, rating:4.6, kind:"issue" },
      { id:"economy-entry-pay", name:"Low Entry-Level Pay", votes:2050, rating:4.6, kind:"issue" },
      { id:"economy-pay-transparency", name:"Pay Transparency Requirements", votes:1700, rating:4.5, kind:"solution" },
      { id:"economy-living-wage-tools", name:"Local Living-Wage Calculators", votes:1150, rating:4.4, kind:"solution" }
    ]},
    { id:"economy-job-instability", name:"Unpredictable Work Schedules", votes:3400, rating:4.5, kind:"issue", children:[
      { id:"economy-last-minute", name:"Last-Minute Shift Changes", votes:1900, rating:4.6, kind:"issue" },
      { id:"economy-hours", name:"Unstable Weekly Hours", votes:1750, rating:4.6, kind:"issue" },
      { id:"economy-oncall", name:"Unpaid On-Call Time", votes:1320, rating:4.7, kind:"issue" },
      { id:"economy-fair-scheduling", name:"Fair Scheduling Standards", votes:1450, rating:4.5, kind:"solution" }
    ]},
    { id:"economy-benefits-gap", name:"Benefits Gaps for Part-Time Workers", votes:3150, rating:4.6, kind:"issue" },
    { id:"economy-small-business", name:"Small Business Cost Pressure", votes:2800, rating:4.5, kind:"issue" },
    { id:"economy-portable-benefits", name:"Portable Worker Benefits", votes:2500, rating:4.6, kind:"solution" }
  ]},
  { id:"root-housing", name:"Housing & Built Environment", votes:9000, rating:4.7, kind:"issue", color:"#71879a", children:[
    { id:"housing-affordability", name:"Housing Affordability", votes:4700, rating:4.8, kind:"issue", children:[
      { id:"housing-rent-burden", name:"High Rent Burden", votes:3500, rating:4.7, kind:"issue", children:[
        { id:"housing-entry-costs", name:"Move-In Costs and Deposits", votes:1900, rating:4.5, kind:"issue" },
        { id:"housing-rent-increases", name:"Large Annual Rent Increases", votes:1850, rating:4.7, kind:"issue" },
        { id:"housing-fees", name:"Mandatory Rental Fees", votes:1480, rating:4.6, kind:"issue" },
        { id:"housing-screening", name:"Rental Screening Barriers", votes:1360, rating:4.5, kind:"issue" },
        { id:"housing-roommate", name:"Few Affordable Family-Sized Units", votes:1310, rating:4.6, kind:"issue" },
        { id:"housing-commute", name:"Affordable Homes Far From Jobs", votes:1270, rating:4.6, kind:"issue" },
        { id:"housing-eviction-prevention", name:"Emergency Rent Assistance", votes:1700, rating:4.6, kind:"solution", children:[
          { id:"housing-auto-eligibility", name:"Automatic Eligibility Screening", votes:920, rating:4.5, kind:"solution" },
          { id:"housing-fast-payments", name:"Direct-to-Landlord Rapid Payments", votes:810, rating:4.5, kind:"solution" },
          { id:"housing-legal-referral", name:"Eviction Legal Aid Referral", votes:760, rating:4.6, kind:"solution" },
          { id:"housing-utility-arrears", name:"Utility Arrears Assistance", votes:690, rating:4.4, kind:"solution" }
        ]},
        { id:"housing-rental-navigation", name:"Affordable Rental Navigation Service", votes:1120, rating:4.5, kind:"solution" }
      ]},
      { id:"housing-supply", name:"Housing Supply Shortage", votes:3100, rating:4.6, kind:"issue", children:[
        { id:"housing-permits", name:"Slow Housing Permitting", votes:1700, rating:4.5, kind:"issue" },
        { id:"housing-small-units", name:"Few Small Starter Homes", votes:1550, rating:4.5, kind:"issue" },
        { id:"housing-infill", name:"Infill Housing Near Services", votes:1450, rating:4.5, kind:"solution" },
        { id:"housing-adus", name:"Accessory Dwelling Unit Support", votes:1320, rating:4.4, kind:"solution" }
      ]}
    ]},
    { id:"housing-homelessness", name:"Unsheltered Homelessness", votes:3900, rating:4.8, kind:"issue" },
    { id:"housing-accessibility", name:"Accessible Housing Shortage", votes:2600, rating:4.6, kind:"issue" },
    { id:"housing-maintenance", name:"Unsafe or Poorly Maintained Rentals", votes:2550, rating:4.6, kind:"issue" },
    { id:"housing-mixed-income", name:"Mixed-Income Housing Development", votes:2400, rating:4.5, kind:"solution" }
  ]},
  { id:"root-education", name:"Education & Knowledge", votes:8500, rating:4.6, kind:"issue", color:"#71879a", children:[
    { id:"education-teacher-shortages", name:"Teacher Shortages", votes:3600, rating:4.6, kind:"issue", children:[
      { id:"education-burnout", name:"Teacher Burnout", votes:2700, rating:4.6, kind:"issue", children:[
        { id:"education-class-size", name:"Large Class Sizes", votes:1880, rating:4.7, kind:"issue" },
        { id:"education-admin-load", name:"Administrative Workload", votes:1540, rating:4.5, kind:"issue" },
        { id:"education-planning-time", name:"Insufficient Planning Time", votes:1490, rating:4.6, kind:"issue" },
        { id:"education-behavior-support", name:"Limited Student Behavior Support", votes:1380, rating:4.6, kind:"issue" },
        { id:"education-sub-shortage", name:"Substitute Teacher Shortages", votes:1260, rating:4.5, kind:"issue" },
        { id:"education-planning-solution", name:"Protected Teacher Planning Blocks", votes:1210, rating:4.5, kind:"solution" }
      ]},
      { id:"education-special-ed", name:"Special Education Staffing Gaps", votes:2450, rating:4.8, kind:"issue" },
      { id:"education-rural-teachers", name:"Rural Teacher Recruitment", votes:1980, rating:4.6, kind:"issue" },
      { id:"education-stem-teachers", name:"Math and Science Teacher Shortages", votes:1870, rating:4.5, kind:"issue" },
      { id:"education-para", name:"Paraprofessional Shortages", votes:1690, rating:4.6, kind:"issue" },
      { id:"education-mentorship", name:"New Teacher Mentorship", votes:1800, rating:4.5, kind:"solution" },
      { id:"education-residency", name:"Paid Teacher Residency Programs", votes:1540, rating:4.6, kind:"solution" }
    ]},
    { id:"education-literacy", name:"Early Literacy Gaps", votes:3300, rating:4.7, kind:"issue" },
    { id:"education-special-needs", name:"Special Education Service Gaps", votes:3150, rating:4.7, kind:"issue" },
    { id:"education-childcare", name:"Early Childhood Education Access", votes:2900, rating:4.7, kind:"issue" },
    { id:"education-adult-skills", name:"Free Adult Skills Programs", votes:2100, rating:4.5, kind:"solution" }
  ]},
  { id:"root-environment", name:"Environment & Natural World", votes:9300, rating:4.8, kind:"issue", color:"#71879a", children:[
    { id:"environment-biodiversity", name:"Biodiversity Loss", votes:3900, rating:4.7, kind:"issue", children:[
      { id:"environment-habitat-fragmentation", name:"Habitat Fragmentation", votes:2800, rating:4.7, kind:"issue", children:[
        { id:"environment-road-barriers", name:"Roads Blocking Wildlife Movement", votes:1700, rating:4.6, kind:"issue", children:[
          { id:"environment-roadkill", name:"Wildlife-Vehicle Collisions", votes:1180, rating:4.6, kind:"issue" },
          { id:"environment-fenced-roads", name:"Fencing Blocking Migration Routes", votes:830, rating:4.5, kind:"issue" },
          { id:"environment-small-crossings", name:"Road Barriers for Amphibians", votes:760, rating:4.5, kind:"issue" },
          { id:"environment-crossings", name:"Wildlife Crossing Corridors", votes:1300, rating:4.7, kind:"solution" },
          { id:"environment-seasonal-crossings", name:"Seasonal Wildlife Crossing Alerts", votes:620, rating:4.3, kind:"solution" }
        ]},
        { id:"environment-suburban-fragment", name:"Suburban Habitat Fragmentation", votes:1540, rating:4.6, kind:"issue" },
        { id:"environment-riparian-breaks", name:"Broken Riverbank Habitat Corridors", votes:1490, rating:4.7, kind:"issue" },
        { id:"environment-farm-fragment", name:"Loss of Hedgerows and Field Habitat", votes:1170, rating:4.5, kind:"issue" },
        { id:"environment-green-links", name:"Connected Urban Greenways", votes:1450, rating:4.6, kind:"solution" },
        { id:"environment-riparian-restoration", name:"Connected Riparian Restoration", votes:1320, rating:4.6, kind:"solution" }
      ]},
      { id:"environment-orca", name:"Southern Resident Orca Decline", votes:2760, rating:4.9, kind:"issue", children:[
        { id:"environment-orca-prey", name:"Chinook Salmon Prey Shortage", votes:2310, rating:4.9, kind:"issue", children:[
          { id:"environment-salmon-warm-streams", name:"Warm Salmon-Bearing Streams", votes:1620, rating:4.8, kind:"issue" },
          { id:"environment-salmon-barriers", name:"Fish Passage Barriers and Culverts", votes:1540, rating:4.8, kind:"issue" },
          { id:"environment-salmon-spawning", name:"Degraded Spawning Habitat", votes:1490, rating:4.7, kind:"issue" },
          { id:"environment-salmon-estuary", name:"Loss of Estuary Nursery Habitat", votes:1360, rating:4.7, kind:"issue" },
          { id:"environment-salmon-low-flow", name:"Low Summer Stream Flows", votes:1280, rating:4.7, kind:"issue" },
          { id:"environment-salmon-foodweb", name:"Reduced Salmon Food Availability", votes:1110, rating:4.6, kind:"issue" },
          { id:"environment-salmon-culvert-fix", name:"Fish-Friendly Culvert Replacement", votes:1430, rating:4.8, kind:"solution" },
          { id:"environment-salmon-coldwater", name:"Cold-Water Refuge Restoration", votes:1370, rating:4.8, kind:"solution" },
          { id:"environment-salmon-estuary-fix", name:"Estuary Habitat Restoration", votes:1260, rating:4.7, kind:"solution" }
        ]},
        { id:"environment-orca-noise", name:"Vessel Noise and Disturbance", votes:1980, rating:4.8, kind:"issue", children:[
          { id:"environment-orca-ship-noise", name:"Commercial Ship Noise", votes:1320, rating:4.7, kind:"issue" },
          { id:"environment-orca-recreation", name:"Recreational Vessel Disturbance", votes:1160, rating:4.7, kind:"issue" },
          { id:"environment-orca-approach", name:"Close Vessel Approaches", votes:1040, rating:4.8, kind:"issue" },
          { id:"environment-orca-slow-zones", name:"Seasonal Vessel Slow Zones", votes:1280, rating:4.7, kind:"solution" },
          { id:"environment-orca-routing", name:"Voluntary Ship Routing Away From Orcas", votes:940, rating:4.6, kind:"solution" }
        ]},
        { id:"environment-orca-contaminants", name:"Toxic Contaminants in the Food Web", votes:1810, rating:4.8, kind:"issue", children:[
          { id:"environment-orca-pcb", name:"Legacy PCB Contamination", votes:1130, rating:4.7, kind:"issue" },
          { id:"environment-orca-stormwater", name:"Toxic Urban Stormwater Runoff", votes:1080, rating:4.8, kind:"issue" },
          { id:"environment-orca-toxics", name:"Reduce Persistent Toxic Discharges", votes:990, rating:4.7, kind:"solution" },
          { id:"environment-orca-stormwater-fix", name:"Green Stormwater Treatment", votes:930, rating:4.6, kind:"solution" }
        ]},
        { id:"environment-orca-small-pop", name:"Small Population Vulnerability", votes:1510, rating:4.7, kind:"issue" },
        { id:"environment-orca-climate", name:"Climate-Driven Food Web Changes", votes:1470, rating:4.7, kind:"issue" },
        { id:"environment-orca-salmon-recovery", name:"Regional Chinook Habitat Recovery", votes:1680, rating:4.8, kind:"solution" },
        { id:"environment-orca-monitoring", name:"Real-Time Orca Location Alerts", votes:1190, rating:4.6, kind:"solution" }
      ]},
      { id:"environment-pollinators", name:"Pollinator Decline", votes:2300, rating:4.6, kind:"issue", children:[
        { id:"environment-pollinator-habitat", name:"Loss of Flower-Rich Habitat", votes:1510, rating:4.7, kind:"issue" },
        { id:"environment-pollinator-pesticides", name:"Pesticide Exposure", votes:1430, rating:4.7, kind:"issue" },
        { id:"environment-pollinator-mowing", name:"Frequent Mowing of Roadside Habitat", votes:870, rating:4.4, kind:"issue" },
        { id:"environment-pollinator-native", name:"Native Pollinator Plantings", votes:1320, rating:4.7, kind:"solution" },
        { id:"environment-pollinator-corridors", name:"Pollinator Habitat Corridors", votes:1190, rating:4.6, kind:"solution" },
        { id:"environment-pollinator-pesticide-reduction", name:"Targeted Pesticide Reduction", votes:1060, rating:4.6, kind:"solution" }
      ]},
      { id:"environment-invasive", name:"Invasive Species Pressure", votes:2190, rating:4.7, kind:"issue", children:[
        { id:"environment-invasive-aquatic", name:"Aquatic Invasive Species", votes:1390, rating:4.6, kind:"issue" },
        { id:"environment-invasive-forest", name:"Forest Pests and Pathogens", votes:1260, rating:4.6, kind:"issue" },
        { id:"environment-invasive-plants", name:"Invasive Plants Displacing Native Habitat", votes:1180, rating:4.6, kind:"issue" },
        { id:"environment-invasive-detection", name:"Early Detection and Rapid Response", votes:1240, rating:4.7, kind:"solution" },
        { id:"environment-invasive-clean", name:"Boat and Gear Cleaning Stations", votes:870, rating:4.5, kind:"solution" }
      ]},
      { id:"environment-freshwater-biodiversity", name:"Freshwater Species Decline", votes:2080, rating:4.7, kind:"issue", children:[
        { id:"environment-stream-temp", name:"Rising Stream Temperatures", votes:1420, rating:4.8, kind:"issue" },
        { id:"environment-stream-flow", name:"Altered Seasonal Stream Flows", votes:1280, rating:4.7, kind:"issue" },
        { id:"environment-wetland-loss", name:"Wetland Habitat Loss", votes:1240, rating:4.7, kind:"issue" },
        { id:"environment-riparian-shade", name:"Riparian Shade Restoration", votes:1180, rating:4.7, kind:"solution" },
        { id:"environment-wetland-restoration", name:"Wetland Restoration", votes:1110, rating:4.7, kind:"solution" }
      ]},
      { id:"environment-marine-biodiversity", name:"Marine Biodiversity Decline", votes:2010, rating:4.7, kind:"issue", children:[
        { id:"environment-kelp", name:"Kelp Forest Decline", votes:1290, rating:4.7, kind:"issue" },
        { id:"environment-ocean-heat", name:"Marine Heatwaves", votes:1250, rating:4.7, kind:"issue" },
        { id:"environment-marine-debris", name:"Marine Debris and Plastics", votes:1190, rating:4.6, kind:"issue" },
        { id:"environment-kelp-restoration", name:"Kelp Habitat Restoration", votes:1060, rating:4.6, kind:"solution" }
      ]},
      { id:"environment-biodiversity-monitoring", name:"Community Biodiversity Monitoring", votes:1520, rating:4.6, kind:"solution" },
      { id:"environment-habitat-network", name:"Regional Habitat Connectivity Network", votes:1490, rating:4.7, kind:"solution" }
    ]},
    { id:"environment-water", name:"Waterway Pollution", votes:3400, rating:4.7, kind:"issue", children:[
      { id:"environment-stormwater", name:"Urban Stormwater Pollution", votes:2180, rating:4.7, kind:"issue" },
      { id:"environment-nutrients", name:"Nutrient Runoff and Algal Blooms", votes:1960, rating:4.7, kind:"issue" },
      { id:"environment-plastics", name:"Plastic and Microplastic Pollution", votes:1830, rating:4.6, kind:"issue" },
      { id:"environment-green-infrastructure", name:"Green Stormwater Infrastructure", votes:1710, rating:4.7, kind:"solution" }
    ]},
    { id:"environment-wildfire", name:"Wildfire and Ecosystem Stress", votes:3280, rating:4.8, kind:"issue" },
    { id:"environment-air", name:"Air Pollution and Ecosystem Damage", votes:2850, rating:4.6, kind:"issue" },
    { id:"environment-restoration", name:"Local Habitat Restoration", votes:2300, rating:4.6, kind:"solution" }
  ]},
  { id:"root-infrastructure", name:"Infrastructure, Transportation & Utilities", votes:8200, rating:4.5, kind:"issue", color:"#71879a", children:[
    { id:"infra-transit-gaps", name:"Transit Service Gaps", votes:3900, rating:4.7, kind:"issue", children:[
      { id:"infra-evening", name:"Limited Evening Transit", votes:2050, rating:4.6, kind:"issue" },
      { id:"infra-weekend", name:"Infrequent Weekend Service", votes:1890, rating:4.6, kind:"issue" },
      { id:"infra-rural", name:"Rural Transit Gaps", votes:1840, rating:4.7, kind:"issue" },
      { id:"infra-first-last", name:"First-and-Last-Mile Gaps", votes:1720, rating:4.6, kind:"issue" },
      { id:"infra-accessibility", name:"Inaccessible Stops and Stations", votes:1590, rating:4.7, kind:"issue" },
      { id:"infra-frequency", name:"Higher Frequency Bus Corridors", votes:1730, rating:4.6, kind:"solution" },
      { id:"infra-microtransit", name:"Community Microtransit", votes:1310, rating:4.5, kind:"solution" }
    ]},
    { id:"infra-water-aging", name:"Aging Water Infrastructure", votes:3500, rating:4.6, kind:"issue" },
    { id:"infra-sidewalks", name:"Missing Sidewalk and Crossing Links", votes:3300, rating:4.7, kind:"issue" },
    { id:"infra-broadband", name:"Broadband Service Gaps", votes:3000, rating:4.6, kind:"issue" },
    { id:"infra-complete-streets", name:"Complete Streets Upgrades", votes:2500, rating:4.5, kind:"solution" }
  ]},
  { id:"root-energy", name:"Energy & Resources", votes:7600, rating:4.5, kind:"issue", color:"#71879a", children:[
    { id:"energy-bill-burden", name:"High Household Energy Bills", votes:3700, rating:4.7, kind:"issue", children:[
      { id:"energy-rental-efficiency", name:"Inefficient Rental Housing", votes:2030, rating:4.6, kind:"issue" },
      { id:"energy-heating-cost", name:"High Winter Heating Costs", votes:1900, rating:4.7, kind:"issue" },
      { id:"energy-cooling-cost", name:"High Summer Cooling Costs", votes:1620, rating:4.6, kind:"issue" },
      { id:"energy-weatherization-lowincome", name:"Targeted Low-Income Weatherization", votes:1710, rating:4.7, kind:"solution" }
    ]},
    { id:"energy-grid-resilience", name:"Grid Reliability During Extreme Weather", votes:3500, rating:4.7, kind:"issue" },
    { id:"energy-storage", name:"Energy Storage Access", votes:2900, rating:4.5, kind:"issue" },
    { id:"energy-resource-waste", name:"Material and Resource Waste", votes:2750, rating:4.5, kind:"issue" },
    { id:"energy-weatherization", name:"Home Weatherization Grants", votes:2300, rating:4.6, kind:"solution" }
  ]},
  { id:"root-government", name:"Government & Public Institutions", votes:8300, rating:4.5, kind:"issue", color:"#71879a", children:[
    { id:"government-service-access", name:"Hard-to-Access Public Services", votes:3100, rating:4.5, kind:"issue", children:[
      { id:"government-forms", name:"Confusing Forms and Eligibility Rules", votes:2200, rating:4.5, kind:"issue" },
      { id:"government-language", name:"Limited Language Access", votes:1900, rating:4.6, kind:"issue" },
      { id:"government-office-hours", name:"Office Hours Conflict With Work", votes:1710, rating:4.5, kind:"issue" },
      { id:"government-phone-waits", name:"Long Public-Service Phone Waits", votes:1650, rating:4.5, kind:"issue" },
      { id:"government-digital-access", name:"Digital-Only Service Barriers", votes:1560, rating:4.6, kind:"issue" },
      { id:"government-case-status", name:"No Clear Application Status", votes:1480, rating:4.5, kind:"issue" },
      { id:"government-one-stop", name:"One-Stop Public Service Portal", votes:1900, rating:4.4, kind:"solution" },
      { id:"government-callback", name:"Scheduled Callback Service", votes:1240, rating:4.4, kind:"solution" }
    ]},
    { id:"government-transparency", name:"Public Decision Transparency", votes:2900, rating:4.6, kind:"issue" },
    { id:"government-meetings", name:"Public Meetings Hard to Attend", votes:2450, rating:4.5, kind:"issue" },
    { id:"government-procurement", name:"Slow Public Procurement", votes:2150, rating:4.4, kind:"issue" },
    { id:"government-participation", name:"Accessible Public Participation Tools", votes:1810, rating:4.5, kind:"solution" }
  ]},
  { id:"root-justice", name:"Law, Rights & Justice", votes:8500, rating:4.7, kind:"issue", color:"#71879a", children:[
    { id:"justice-legal-access", name:"Affordable Legal Help", votes:4200, rating:4.8, kind:"issue", children:[
      { id:"justice-housing-law", name:"Housing Legal Aid Gaps", votes:2380, rating:4.8, kind:"issue" },
      { id:"justice-family-law", name:"Family Law Assistance Gaps", votes:2170, rating:4.7, kind:"issue" },
      { id:"justice-debt-law", name:"Consumer Debt Legal Help", votes:1840, rating:4.6, kind:"issue" },
      { id:"justice-rural-law", name:"Rural Legal Service Gaps", votes:1720, rating:4.7, kind:"issue" },
      { id:"justice-selfhelp", name:"Plain-Language Court Self-Help", votes:1680, rating:4.6, kind:"solution" },
      { id:"justice-community-legal", name:"Community Legal Clinics", votes:2400, rating:4.7, kind:"solution" }
    ]},
    { id:"justice-court-delays", name:"Court Backlogs and Delays", votes:3100, rating:4.5, kind:"issue" },
    { id:"justice-language", name:"Language Access in Legal Systems", votes:2850, rating:4.7, kind:"issue" },
    { id:"justice-records", name:"Difficulty Correcting Public Records", votes:2140, rating:4.5, kind:"issue" }
  ]},
  { id:"root-safety", name:"Safety, Conflict & Security", votes:7900, rating:4.6, kind:"issue", color:"#71879a", children:[
    { id:"safety-disaster-readiness", name:"Disaster Preparedness Gaps", votes:3600, rating:4.7, kind:"issue", children:[
      { id:"safety-heat", name:"Extreme Heat Preparedness", votes:2140, rating:4.7, kind:"issue" },
      { id:"safety-smoke", name:"Wildfire Smoke Preparedness", votes:2070, rating:4.8, kind:"issue" },
      { id:"safety-flood", name:"Flood Evacuation Planning", votes:1780, rating:4.6, kind:"issue" },
      { id:"safety-power", name:"Extended Power Outage Readiness", votes:1690, rating:4.6, kind:"issue" },
      { id:"safety-language-alerts", name:"Multilingual Emergency Alerts", votes:1510, rating:4.7, kind:"solution" },
      { id:"safety-neighborhood-response", name:"Neighborhood Emergency Response Teams", votes:2200, rating:4.5, kind:"solution" }
    ]},
    { id:"safety-domestic-violence", name:"Domestic Violence Support Access", votes:3300, rating:4.8, kind:"issue" },
    { id:"safety-road", name:"Traffic Injury Risk", votes:3100, rating:4.7, kind:"issue" },
    { id:"safety-cyber", name:"Community Cybersecurity Readiness", votes:2720, rating:4.5, kind:"issue" }
  ]},
  { id:"root-technology", name:"Technology & Information", votes:8800, rating:4.7, kind:"issue", color:"#71879a", children:[
    { id:"technology-misinformation", name:"Online Misinformation", votes:4300, rating:4.7, kind:"issue", children:[
      { id:"technology-local-rumors", name:"False Local Emergency Rumors", votes:2800, rating:4.6, kind:"issue", children:[
        { id:"technology-source-confusion", name:"Unclear Source Credibility", votes:1900, rating:4.6, kind:"issue", children:[
          { id:"technology-anonymous-screens", name:"Anonymous Screenshots Without Sources", votes:1280, rating:4.6, kind:"issue" },
          { id:"technology-old-images", name:"Old Images Reposted as Current", votes:1190, rating:4.6, kind:"issue" },
          { id:"technology-fake-agencies", name:"Accounts Impersonating Public Agencies", votes:1160, rating:4.7, kind:"issue" },
          { id:"technology-context-collapse", name:"Quotes Shared Without Context", votes:1090, rating:4.5, kind:"issue" },
          { id:"technology-source-labels", name:"Community Source Context Labels", votes:1250, rating:4.5, kind:"solution" },
          { id:"technology-origin-links", name:"Original Source Linking", votes:1100, rating:4.6, kind:"solution" },
          { id:"technology-timestamp", name:"Prominent Original Publication Dates", votes:940, rating:4.5, kind:"solution" }
        ]},
        { id:"technology-rumor-weather", name:"False Severe Weather Claims", votes:1670, rating:4.6, kind:"issue" },
        { id:"technology-rumor-crime", name:"Unverified Crime Alerts", votes:1580, rating:4.6, kind:"issue" },
        { id:"technology-rumor-school", name:"False School Closure Posts", votes:1320, rating:4.5, kind:"issue" },
        { id:"technology-rumor-health", name:"False Local Health Warnings", votes:1260, rating:4.6, kind:"issue" },
        { id:"technology-official-feed", name:"Verified Local Emergency Feed", votes:1510, rating:4.7, kind:"solution" },
        { id:"technology-rumor-friction", name:"Reshare Friction for Unverified Alerts", votes:1180, rating:4.5, kind:"solution" }
      ]},
      { id:"technology-ai-media", name:"Synthetic Media Confusion", votes:2710, rating:4.7, kind:"issue" },
      { id:"technology-health-misinfo", name:"Health Misinformation", votes:2590, rating:4.8, kind:"issue" },
      { id:"technology-scam-content", name:"Fraudulent Advice and Scam Content", votes:2470, rating:4.8, kind:"issue" },
      { id:"technology-media-literacy", name:"Practical Media Literacy Guides", votes:2200, rating:4.6, kind:"solution" },
      { id:"technology-community-notes", name:"Community Context and Corrections", votes:1940, rating:4.5, kind:"solution" }
    ]},
    { id:"technology-digital-divide", name:"Digital Access Divide", votes:3600, rating:4.7, kind:"issue", children:[
      { id:"technology-rural-broadband", name:"Rural Broadband Gaps", votes:2340, rating:4.7, kind:"issue" },
      { id:"technology-device-cost", name:"Device Affordability", votes:2010, rating:4.6, kind:"issue" },
      { id:"technology-digital-skills", name:"Digital Skills Gaps", votes:1880, rating:4.6, kind:"issue" },
      { id:"technology-public-wifi", name:"Reliable Public Wi-Fi", votes:1570, rating:4.5, kind:"solution" }
    ]},
    { id:"technology-privacy-risk", name:"Everyday Digital Privacy Risks", votes:3440, rating:4.7, kind:"issue" },
    { id:"technology-accessibility", name:"Inaccessible Digital Services", votes:2980, rating:4.7, kind:"issue" },
    { id:"technology-privacy", name:"Privacy-Preserving Digital Services", votes:2500, rating:4.6, kind:"solution" }
  ]},
  { id:"root-community", name:"Family, Relationships & Community", votes:7800, rating:4.6, kind:"issue", color:"#71879a", children:[
    { id:"community-loneliness", name:"Social Isolation and Loneliness", votes:3900, rating:4.7, kind:"issue", children:[
      { id:"community-seniors", name:"Senior Isolation", votes:2260, rating:4.7, kind:"issue" },
      { id:"community-young-adults", name:"Young Adult Loneliness", votes:2110, rating:4.7, kind:"issue" },
      { id:"community-new-residents", name:"New Residents Struggling to Connect", votes:1670, rating:4.5, kind:"issue" },
      { id:"community-third-places", name:"More Free Community Gathering Spaces", votes:2500, rating:4.6, kind:"solution" },
      { id:"community-neighbor-events", name:"Neighborhood Welcome Events", votes:1320, rating:4.4, kind:"solution" }
    ]},
    { id:"community-caregiving", name:"Caregiver Support Gaps", votes:3200, rating:4.7, kind:"issue" },
    { id:"community-childcare", name:"Childcare and Family Support Gaps", votes:3060, rating:4.7, kind:"issue" },
    { id:"community-public-space", name:"Loss of Informal Gathering Places", votes:2760, rating:4.6, kind:"issue" },
    { id:"community-mutual-aid", name:"Local Mutual Aid Networks", votes:2180, rating:4.6, kind:"solution" }
  ]},
  { id:"root-culture", name:"Culture, Media & Recreation", votes:7200, rating:4.4, kind:"issue", color:"#71879a", children:[
    { id:"culture-local-news", name:"Loss of Local News", votes:3300, rating:4.6, kind:"issue", children:[
      { id:"culture-news-deserts", name:"Local News Deserts", votes:2050, rating:4.7, kind:"issue" },
      { id:"culture-civic-reporting", name:"Loss of Local Government Reporting", votes:1880, rating:4.7, kind:"issue" },
      { id:"culture-local-sports", name:"Loss of Local Sports and Community Coverage", votes:1320, rating:4.4, kind:"issue" },
      { id:"culture-nonprofit-news", name:"Nonprofit Local Newsrooms", votes:1650, rating:4.6, kind:"solution" },
      { id:"culture-library-news", name:"Library-Supported Community Information", votes:1130, rating:4.4, kind:"solution" }
    ]},
    { id:"culture-arts-access", name:"Unequal Access to Arts and Recreation", votes:2800, rating:4.5, kind:"issue" },
    { id:"culture-public-space", name:"Loss of Cultural Gathering Spaces", votes:2630, rating:4.5, kind:"issue" },
    { id:"culture-youth-rec", name:"Limited Youth Recreation", votes:2510, rating:4.6, kind:"issue" },
    { id:"culture-public-programming", name:"Free Public Cultural Programming", votes:2100, rating:4.5, kind:"solution" }
  ]},
  { id:"root-food", name:"Food & Agriculture", votes:7300, rating:4.6, kind:"issue", color:"#71879a", children:[
    { id:"food-affordability", name:"Healthy Food Affordability", votes:4100, rating:4.8, kind:"issue", children:[
      { id:"food-produce-cost", name:"High Fresh Produce Prices", votes:2550, rating:4.8, kind:"issue" },
      { id:"food-rural-access", name:"Long Travel to Full Grocery Stores", votes:2130, rating:4.7, kind:"issue" },
      { id:"food-benefit-gap", name:"Food Benefits Not Lasting the Month", votes:2040, rating:4.8, kind:"issue" },
      { id:"food-dietary-cost", name:"High Cost of Special-Diet Foods", votes:1690, rating:4.6, kind:"issue" },
      { id:"food-school-break", name:"School-Break Meal Gaps", votes:1570, rating:4.7, kind:"issue" },
      { id:"food-mobile-market", name:"Mobile Produce Markets", votes:1540, rating:4.6, kind:"solution" },
      { id:"food-double-benefits", name:"Produce Benefit Matching", votes:1430, rating:4.7, kind:"solution" }
    ]},
    { id:"food-waste", name:"Food Waste", votes:2800, rating:4.5, kind:"issue" },
    { id:"food-farm-viability", name:"Small Farm Viability", votes:2710, rating:4.6, kind:"issue" },
    { id:"food-soil", name:"Soil Health Decline", votes:2490, rating:4.6, kind:"issue" },
    { id:"food-community-markets", name:"Community Produce Markets", votes:2200, rating:4.6, kind:"solution" }
  ]},
  { id:"root-migration", name:"Human Movement & Migration", votes:6900, rating:4.5, kind:"issue", color:"#71879a", children:[
    { id:"migration-settlement", name:"Newcomer Settlement Barriers", votes:3400, rating:4.6, kind:"issue", children:[
      { id:"migration-language", name:"Language Access Barriers", votes:2240, rating:4.7, kind:"issue" },
      { id:"migration-housing", name:"Difficulty Finding Housing", votes:2080, rating:4.7, kind:"issue" },
      { id:"migration-credentials", name:"Foreign Credential Recognition", votes:1970, rating:4.7, kind:"issue" },
      { id:"migration-school", name:"School Enrollment Navigation", votes:1530, rating:4.5, kind:"issue" },
      { id:"migration-health", name:"Health System Navigation", votes:1490, rating:4.6, kind:"issue" },
      { id:"migration-navigation", name:"Multilingual Newcomer Navigation Hubs", votes:2100, rating:4.6, kind:"solution" }
    ]},
    { id:"migration-family-reunification", name:"Family Reunification Delays", votes:3000, rating:4.7, kind:"issue" },
    { id:"migration-refugee-support", name:"Refugee Resettlement Capacity", votes:2680, rating:4.6, kind:"issue" },
    { id:"migration-seasonal", name:"Seasonal Worker Housing and Services", votes:2350, rating:4.6, kind:"issue" },
    { id:"migration-community-liaisons", name:"Community Newcomer Liaison Programs", votes:1830, rating:4.5, kind:"solution" }
  ]},
  { id:"root-consumer", name:"Products, Services & Consumer Life", votes:8100, rating:4.6, kind:"issue", color:"#71879a", children:[
    { id:"consumer-repairability", name:"Products That Are Hard to Repair", votes:3700, rating:4.7, kind:"issue", children:[
      { id:"consumer-parts", name:"Replacement Parts Unavailable", votes:2250, rating:4.7, kind:"issue" },
      { id:"consumer-batteries", name:"Sealed or Glued-In Batteries", votes:2110, rating:4.7, kind:"issue" },
      { id:"consumer-manuals", name:"Repair Manuals Withheld", votes:1790, rating:4.6, kind:"issue" },
      { id:"consumer-software-lock", name:"Software Locks on Replacement Parts", votes:1740, rating:4.7, kind:"issue" },
      { id:"consumer-tool-cost", name:"Proprietary Repair Tool Costs", votes:1480, rating:4.5, kind:"issue" },
      { id:"consumer-repair-score", name:"Repairability Scores on Product Labels", votes:1630, rating:4.6, kind:"solution" },
      { id:"consumer-parts-standard", name:"Long-Term Replacement Parts Standards", votes:1510, rating:4.6, kind:"solution" }
    ]},
    { id:"consumer-fees", name:"Hidden Fees and Confusing Pricing", votes:3500, rating:4.8, kind:"issue", children:[
      { id:"consumer-ticket-fees", name:"Ticketing Service Fees", votes:2120, rating:4.7, kind:"issue" },
      { id:"consumer-hotel-fees", name:"Mandatory Hotel Fees", votes:1880, rating:4.7, kind:"issue" },
      { id:"consumer-subscription", name:"Hard-to-Cancel Subscriptions", votes:2060, rating:4.8, kind:"issue" },
      { id:"consumer-upfront", name:"All-In Upfront Pricing", votes:1940, rating:4.7, kind:"solution" }
    ]},
    { id:"consumer-accessibility", name:"Inaccessible Products and Services", votes:3050, rating:4.7, kind:"issue" },
    { id:"consumer-warranty", name:"Confusing Warranty Coverage", votes:2820, rating:4.5, kind:"issue" },
    { id:"consumer-standard-labels", name:"Plain-Language Price and Repair Labels", votes:2400, rating:4.6, kind:"solution" }
  ]}
];

const host=document.querySelector("#viz"),breadcrumbHost=document.querySelector("#breadcrumbs"),resetButton=document.querySelector("#reset"),statusHost=document.querySelector("#status");
let width=host.clientWidth,height=host.clientHeight,focusPath=[],cameraY=0,worldHeight=height,levelCenters=[],touchStartY=null,touchLastY=null,touchMoved=false;
const svg=d3.select(host).append("svg").attr("role","img").attr("aria-label","Weighted clustered hierarchy").attr("viewBox",[0,0,width,height]),stage=svg.append("g").attr("class","stage"),nodeById=new Map(),parentById=new Map(),rootById=new Map();
function annotate(node,parent=null,root=node){nodeById.set(node.id,node);parentById.set(node.id,parent);rootById.set(node.id,root);(node.children||[]).forEach(child=>annotate(child,node,root));} forestData.forEach(root=>annotate(root));
function directScore(node){const votes=Math.max(1,node.votes||1),rating=Math.max(.5,Math.min(5,node.rating||3));return votes*(.35+.65*rating/5);} 
function aggregateScore(node){return directScore(node)+(node.children||[]).reduce((sum,child)=>sum+aggregateScore(child),0);} 
function rootColor(node){return rootById.get(node.id)?.color||"#71879a";} 
function lighten(hex,amount=.2){const c=d3.color(hex);return c?d3.interpolateRgb(c,d3.rgb(255,255,255))(amount):hex;} 
function compact(value){if(value>=1000)return `${(value/1000).toFixed(value>=10000?0:1)}k`;return `${Math.round(value)}`;} 
function polygonPath(poly){return `M${poly.map(p=>p.join(",")).join("L")}Z`;} 
function outerPolygon(w,h){return [[0,0],[w,0],[w,h],[0,h]];}
function semanticGlyph(item){return item.kind==="solution"?"✓":"⚠";}
function childKindCounts(item){let issues=0,solutions=0;(item.children||[]).forEach(child=>{if(child.kind==="solution")solutions+=1;else issues+=1;});return{issues,solutions};}
function averageVote(item){const value=Number(item.rating);return Number.isFinite(value)?value.toFixed(1):"—";}
function metadataLines(item){const counts=childKindCounts(item);return [`${compact(item.votes||0)} votes · avg ${averageVote(item)}`,`${counts.issues} ${counts.issues===1?"sub-issue":"sub-issues"} · ${counts.solutions} ${counts.solutions===1?"sub-solution":"sub-solutions"}`];}
function metadataText(item){return metadataLines(item).join(" · ");}
function layoutCluster(items,w,h,seedKey){const proxies=items.map(item=>({id:item.id,item,weight:Math.max(1,aggregateScore(item))})),root=d3.hierarchy({children:proxies}).sum(d=>d.weight||0),polygon=outerPolygon(w,h),seed=Array.from(seedKey).reduce((a,c)=>((a*31+c.charCodeAt(0))>>>0),2166136261)/4294967296;d3.voronoiTreemap().clip(polygon).prng(d3.randomLcg(seed||.42))(root);return{root,polygon};}
function polygonSpanAtY(poly,y){const xs=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];if(a[1]===b[1])continue;const lo=Math.min(a[1],b[1]),hi=Math.max(a[1],b[1]);if(y<lo||y>=hi)continue;const t=(y-a[1])/(b[1]-a[1]);xs.push(a[0]+t*(b[0]-a[0]));}xs.sort((a,b)=>a-b);return xs.length>=2?[xs[0],xs[xs.length-1]]:null;}
const labelMeasureCanvas=document.createElement("canvas"),labelMeasureContext=labelMeasureCanvas.getContext("2d");
function measuredWidth(text,fontSize,fontWeight){labelMeasureContext.font=`${fontWeight} ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;return labelMeasureContext.measureText(text).width;}
function layoutPolygonLabel(item,poly,cx,cy,baseFont,fontWeight){
  const words=`${semanticGlyph(item)} ${item.name}`.split(/\s+/),maxLines=7,meta=metadataLines(item),baseMetaFont=baseFont*.68;
  for(let scale=1;scale>=.08;scale-=.04){
    const effectiveFont=baseFont*scale,effectiveMeta=baseMetaFont*scale,lineH=effectiveFont*1.08,metaH=effectiveMeta*1.22,pad=Math.max(1.5,effectiveFont*.38);
    for(let lineCountGuess=1;lineCountGuess<=maxLines;lineCountGuess++){
      const blockH=(lineCountGuess-1)*lineH+effectiveFont+metaH*2,y0=cy-blockH*.44,lines=[];let cursor=0,failed=false;
      for(let li=0;li<lineCountGuess&&cursor<words.length;li++){
        const y=y0+li*lineH,span=polygonSpanAtY(poly,y-effectiveFont*.25);if(!span){failed=true;break;}const available=Math.max(0,span[1]-span[0]-pad*2);let line="";
        while(cursor<words.length){const candidate=line?`${line} ${words[cursor]}`:words[cursor],candidateWidth=measuredWidth(candidate,effectiveFont,fontWeight);if(candidateWidth<=available||!line){if(candidateWidth>available&&!line){failed=true;break;}line=candidate;cursor++;}else break;}
        if(failed||!line){failed=true;break;}lines.push({text:line,span,y});
      }
      if(failed||cursor<words.length||!lines.length)continue;
      const meta1Y=y0+lines.length*lineH+.1*effectiveFont,meta2Y=meta1Y+metaH,meta1Span=polygonSpanAtY(poly,meta1Y),meta2Span=polygonSpanAtY(poly,meta2Y);
      if(!meta1Span||!meta2Span)continue;
      if(measuredWidth(meta[0],effectiveMeta,560)>meta1Span[1]-meta1Span[0]-pad*2)continue;
      if(measuredWidth(meta[1],effectiveMeta,560)>meta2Span[1]-meta2Span[0]-pad*2)continue;
      return{scale,baseFont,baseMetaFont,lines,y0,meta,meta1Span,meta2Span};
    }
  }
  return null;
}
function renderCluster({items,x,y,w,h,selectedId=null,faded=false,interactive=true,className=""}){
  const {root,polygon}=layoutCluster(items,w,h,items.map(d=>d.id).join("-")),g=stage.append("g").attr("class",`cluster ${className}`).attr("transform",`translate(${x},${y})`);g.append("path").attr("class","cluster-outline").attr("d",polygonPath(polygon));
  const leaves=root.leaves(),cells=g.selectAll("g.cell").data(leaves,d=>d.data.id).join("g").attr("class",d=>`cell ${d.data.id===selectedId?"is-selected":""} ${faded&&d.data.id!==selectedId?"is-faded":""}`).attr("tabindex",interactive?0:null).attr("role",interactive?"button":null).attr("aria-label",d=>`${d.data.item.name}, ${metadataText(d.data.item)}`).on("click",(event,d)=>{if(!interactive||touchMoved)return;event.stopPropagation();focusNode(d.data.item.id);}).on("keydown",(event,d)=>{if(interactive&&(event.key==="Enter"||event.key===" ")){event.preventDefault();focusNode(d.data.item.id);}});
  cells.append("path").attr("class","cell-shape").attr("d",d=>polygonPath(d.polygon)).attr("fill",d=>{const base=rootColor(d.data.item);return faded&&d.data.id!==selectedId?lighten(base,.7):lighten(base,.22);});
  cells.each(function(d){
    const item=d.data.item,[cx,cy]=d3.polygonCentroid(d.polygon),area=Math.abs(d3.polygonArea(d.polygon)),selected=item.id===selectedId,fontWeight=selected?750:620,baseFont=Math.max(9,Math.min(18,Math.sqrt(area)/8.5)),layout=layoutPolygonLabel(item,d.polygon,cx,cy,baseFont,fontWeight);if(!layout)return;
    const {scale,baseMetaFont,lines,y0,meta,meta1Span,meta2Span}=layout,localY=cy+(y0-cy)/scale,text=d3.select(this).append("text").attr("class","cell-label").attr("x",cx).attr("y",localY).attr("text-anchor","middle").attr("data-fit-scale",scale).attr("data-fit-anchor-x",cx).attr("data-fit-anchor-y",cy).attr("transform",`translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`).style("font-size",`${baseFont}px`).style("font-weight",fontWeight);
    lines.forEach((line,i)=>{const lineCenter=(line.span[0]+line.span[1])/2,localX=cx+(lineCenter-cx)/scale;text.append("tspan").attr("x",localX).attr("dy",i===0?0:baseFont*1.08).text(line.text);});
    const meta1Center=(meta1Span[0]+meta1Span[1])/2,meta2Center=(meta2Span[0]+meta2Span[1])/2,meta1LocalX=cx+(meta1Center-cx)/scale,meta2LocalX=cx+(meta2Center-cx)/scale;
    text.append("tspan").attr("class","score-label metadata-line").attr("x",meta1LocalX).attr("dy",baseFont*1.12).style("font-size",`${baseMetaFont}px`).style("font-weight",560).text(meta[0]);
    text.append("tspan").attr("class","score-label metadata-line child-counts").attr("x",meta2LocalX).attr("dy",baseMetaFont*1.25).style("font-size",`${baseMetaFont}px`).style("font-weight",560).text(meta[1]);
  });
  return{g,leaves};
}
function currentNode(){return focusPath.length?nodeById.get(focusPath[focusPath.length-1]):null;}
function siblingSet(node){if(!node)return forestData;const parent=parentById.get(node.id);return parent?parent.children||[]:forestData;}
function pathForNode(id){const path=[];let node=nodeById.get(id);while(node){path.unshift(node.id);node=parentById.get(node.id);}return path;}
function cameraBounds(){const toolbarAllowance=width<720?118:78,bottomAllowance=54;return{min:Math.min(0,height-worldHeight-bottomAllowance),max:Math.max(0,toolbarAllowance-20)};}
function clampCamera(value){const{min,max}=cameraBounds();return Math.max(min,Math.min(max,value));}
function applyCamera(animate=false){cameraY=clampCamera(cameraY);stage.interrupt();if(animate&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){stage.transition().duration(520).ease(d3.easeCubicOut).attr("transform",`translate(0,${cameraY})`);}else stage.attr("transform",`translate(0,${cameraY})`);}
function scrollToDepth(index,animate=true){if(!levelCenters.length)return;const safeIndex=Math.max(0,Math.min(levelCenters.length-1,index)),viewportTarget=height*(width<720?.48:.5);cameraY=viewportTarget-levelCenters[safeIndex];applyCamera(animate);}
function focusNode(id){const node=nodeById.get(id);if(!node)return;focusPath=pathForNode(id);render();const hasChildren=(node.children||[]).length>0,targetDepth=hasChildren?focusPath.length:focusPath.length-1;scrollToDepth(targetDepth,true);statusHost.textContent=hasChildren?`${node.name} selected. Showing ${node.children.length} example children.`:`${node.name} selected. No child nodes have been added yet.`;}
function panToBreadcrumb(index){if(!focusPath.length)return;scrollToDepth(index,true);}
function renderBreadcrumbs(){breadcrumbHost.replaceChildren();const all=document.createElement("button");all.type="button";all.textContent="All roots";all.addEventListener("click",()=>{focusPath=[];cameraY=0;render();});breadcrumbHost.append(all);focusPath.forEach((id,index)=>{const sep=document.createElement("span");sep.className="crumb-separator";sep.textContent="›";breadcrumbHost.append(sep);const button=document.createElement("button");button.type="button";button.textContent=nodeById.get(id).name;button.className=index===focusPath.length-1?"current":"";button.addEventListener("click",()=>panToBreadcrumb(index));breadcrumbHost.append(button);});}
function selectedCentroid(rendered,id,x,y){const leaf=rendered.leaves.find(d=>d.data.id===id);if(!leaf)return null;const[cx,cy]=d3.polygonCentroid(leaf.polygon);return{x:x+cx,y:y+cy};}
function levelGeometry(compactMobile,contentTop){const availableViewport=Math.max(360,height-contentTop-72),h=Math.max(compactMobile?340:420,Math.min(availableViewport*.92,compactMobile?width*.9:width*.38));return{x:0,w:width,h};}
function render(){
  width=host.clientWidth;height=host.clientHeight;svg.attr("viewBox",[0,0,width,height]);stage.selectAll("*").remove();levelCenters=[];renderBreadcrumbs();const compactMobile=width<720,contentTop=compactMobile?132:98,centerX=width/2,geometry=levelGeometry(compactMobile,contentTop),gap=compactMobile?88:110;
  if(!focusPath.length){cameraY=0;worldHeight=height;stage.attr("transform","translate(0,0)");renderCluster({items:forestData,x:0,y:contentTop,w:geometry.w,h:geometry.h,interactive:true,className:"root-overview"});stage.append("text").attr("class","canvas-caption").attr("x",centerX).attr("y",Math.min(height-22,contentTop+geometry.h+32)).attr("text-anchor","middle").text("Broad Atlas roots · populated demo hierarchy");return;}
  let cursorY=contentTop;for(let depth=0;depth<focusPath.length;depth++){const selectedId=focusPath[depth],selected=nodeById.get(selectedId),siblings=depth===0?forestData:(parentById.get(selectedId)?.children||[selected]);renderCluster({items:siblings,x:0,y:cursorY,w:geometry.w,h:geometry.h,selectedId,faded:true,interactive:true,className:`context-cluster depth-${depth}`});levelCenters.push(cursorY+geometry.h/2);cursorY+=geometry.h+gap;}
  const selected=currentNode(),children=selected?.children||[];if(children.length){renderCluster({items:children,x:0,y:cursorY,w:geometry.w,h:geometry.h,interactive:true,className:"child-cluster"});levelCenters.push(cursorY+geometry.h/2);stage.append("text").attr("class","canvas-caption").attr("x",centerX).attr("y",cursorY-24).attr("text-anchor","middle").text(`${selected.name} · children`);cursorY+=geometry.h+gap;}else{stage.append("text").attr("class","leaf-message").attr("x",centerX).attr("y",cursorY-30).attr("text-anchor","middle").text("No child nodes yet");}
  worldHeight=Math.max(height,cursorY+24);applyCamera(false);
}
host.addEventListener("wheel",event=>{if(!focusPath.length||worldHeight<=height)return;event.preventDefault();cameraY-=event.deltaY*.78;applyCamera(false);},{passive:false});
host.addEventListener("touchstart",event=>{if(!focusPath.length||event.touches.length!==1)return;touchStartY=event.touches[0].clientY;touchLastY=touchStartY;touchMoved=false;},{passive:true});
host.addEventListener("touchmove",event=>{if(touchLastY==null||event.touches.length!==1||!focusPath.length)return;const y=event.touches[0].clientY,dy=y-touchLastY;if(Math.abs(y-touchStartY)>6)touchMoved=true;if(worldHeight>height){event.preventDefault();cameraY+=dy;applyCamera(false);}touchLastY=y;},{passive:false});
host.addEventListener("touchend",()=>{touchStartY=null;touchLastY=null;setTimeout(()=>{touchMoved=false;},0);},{passive:true});
resetButton.addEventListener("click",()=>{focusPath=[];cameraY=0;render();statusHost.textContent="Showing all broad Atlas roots.";});
window.addEventListener("resize",()=>{render();applyCamera(false);});
render();