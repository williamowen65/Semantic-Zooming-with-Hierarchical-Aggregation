// Dense environment demo branches used to exercise lower-level Atlas navigation.
// Kept separate from app.js so this exploratory content can evolve independently.
(() => {
  if (typeof nodeById === 'undefined' || typeof annotate !== 'function') return;

  const expansions = {
    'environment-wildfire': [
      { id:'environment-wildfire-fuel', name:'Overgrown and Fire-Prone Fuels', votes:2460, rating:4.8, kind:'issue', children:[
        { id:'environment-wildfire-dense-understory', name:'Dense Forest Understory', votes:1580, rating:4.7, kind:'issue' },
        { id:'environment-wildfire-deadwood', name:'Accumulated Dead Wood', votes:1470, rating:4.7, kind:'issue' },
        { id:'environment-wildfire-invasive-grass', name:'Fire-Prone Invasive Grasses', votes:1330, rating:4.6, kind:'issue' },
        { id:'environment-wildfire-prescribed-fire', name:'Prescribed Fire Programs', votes:1720, rating:4.7, kind:'solution' },
        { id:'environment-wildfire-thinning', name:'Ecological Forest Thinning', votes:1510, rating:4.6, kind:'solution' }
      ]},
      { id:'environment-wildfire-drought', name:'Drought-Stressed Forests', votes:2290, rating:4.8, kind:'issue', children:[
        { id:'environment-wildfire-tree-mortality', name:'Heat and Drought Tree Mortality', votes:1520, rating:4.8, kind:'issue' },
        { id:'environment-wildfire-bark-beetle', name:'Bark Beetle Outbreaks', votes:1340, rating:4.6, kind:'issue' },
        { id:'environment-wildfire-low-snowpack', name:'Low Snowpack and Early Drying', votes:1290, rating:4.7, kind:'issue' },
        { id:'environment-wildfire-drought-monitoring', name:'Forest Drought Early-Warning Networks', votes:1160, rating:4.5, kind:'solution' }
      ]},
      { id:'environment-wildfire-habitat', name:'Post-Fire Habitat Damage', votes:2110, rating:4.7, kind:'issue', children:[
        { id:'environment-wildfire-severe-burn', name:'Large High-Severity Burn Patches', votes:1390, rating:4.7, kind:'issue' },
        { id:'environment-wildfire-stream-ash', name:'Ash and Sediment in Streams', votes:1280, rating:4.7, kind:'issue' },
        { id:'environment-wildfire-nesting', name:'Loss of Nesting and Cover Habitat', votes:1190, rating:4.6, kind:'issue' },
        { id:'environment-wildfire-reseed', name:'Native Post-Fire Revegetation', votes:1260, rating:4.6, kind:'solution' }
      ]},
      { id:'environment-wildfire-smoke', name:'Wildfire Smoke Exposure', votes:2050, rating:4.8, kind:'issue' },
      { id:'environment-wildfire-wui', name:'Homes Expanding Into Fire-Prone Areas', votes:1860, rating:4.6, kind:'issue' },
      { id:'environment-wildfire-ignitions', name:'Human-Caused Ignitions', votes:1740, rating:4.7, kind:'issue' },
      { id:'environment-wildfire-defensible-space', name:'Community Defensible-Space Programs', votes:1610, rating:4.6, kind:'solution' },
      { id:'environment-wildfire-cultural-burning', name:'Indigenous Cultural Burning Partnerships', votes:1460, rating:4.8, kind:'solution' }
    ],

    'environment-air': [
      { id:'environment-air-ozone', name:'Ground-Level Ozone Damage', votes:2140, rating:4.7, kind:'issue', children:[
        { id:'environment-air-ozone-crops', name:'Ozone Damage to Crops', votes:1320, rating:4.6, kind:'issue' },
        { id:'environment-air-ozone-forests', name:'Ozone Stress on Forest Growth', votes:1260, rating:4.7, kind:'issue' },
        { id:'environment-air-ozone-urban', name:'Urban Ozone Hotspots', votes:1180, rating:4.7, kind:'issue' },
        { id:'environment-air-ozone-monitoring', name:'Neighborhood Ozone Monitoring', votes:1040, rating:4.5, kind:'solution' }
      ]},
      { id:'environment-air-particulates', name:'Fine Particle Pollution', votes:2070, rating:4.8, kind:'issue', children:[
        { id:'environment-air-diesel', name:'Diesel Exhaust Near Roads and Ports', votes:1450, rating:4.8, kind:'issue' },
        { id:'environment-air-woodsmoke', name:'Residential Wood Smoke', votes:1210, rating:4.6, kind:'issue' },
        { id:'environment-air-dust', name:'Construction and Road Dust', votes:1130, rating:4.5, kind:'issue' },
        { id:'environment-air-filtration', name:'Community Clean-Air and Filtration Sites', votes:1280, rating:4.7, kind:'solution' }
      ]},
      { id:'environment-air-nitrogen', name:'Nitrogen Deposition on Ecosystems', votes:1840, rating:4.7, kind:'issue', children:[
        { id:'environment-air-nitrogen-soil', name:'Soil Nutrient Imbalance', votes:1170, rating:4.6, kind:'issue' },
        { id:'environment-air-nitrogen-water', name:'Nitrogen Loading Into Waters', votes:1110, rating:4.7, kind:'issue' },
        { id:'environment-air-nitrogen-sensitive', name:'Damage to Sensitive Plant Communities', votes:980, rating:4.6, kind:'issue' }
      ]},
      { id:'environment-air-acid', name:'Acidifying Air Deposition', votes:1660, rating:4.6, kind:'issue' },
      { id:'environment-air-toxic', name:'Toxic Industrial Air Emissions', votes:1590, rating:4.8, kind:'issue' },
      { id:'environment-air-agriculture', name:'Agricultural Ammonia Emissions', votes:1430, rating:4.5, kind:'issue' },
      { id:'environment-air-emissions-zones', name:'Low-Emission Freight and Port Zones', votes:1510, rating:4.6, kind:'solution' },
      { id:'environment-air-sensors', name:'Dense Community Air-Sensor Networks', votes:1320, rating:4.6, kind:'solution' }
    ],

    'environment-restoration': [
      { id:'environment-restoration-riparian', name:'Streamside Habitat Restoration', votes:1880, rating:4.8, kind:'solution', children:[
        { id:'environment-restoration-riparian-trees', name:'Native Streamside Tree Planting', votes:1280, rating:4.7, kind:'solution' },
        { id:'environment-restoration-riparian-shade', name:'Restoring Cool-Water Shade', votes:1190, rating:4.8, kind:'solution' },
        { id:'environment-restoration-riparian-invasive', name:'Removing Invasive Riparian Plants', votes:1050, rating:4.6, kind:'solution' },
        { id:'environment-restoration-riparian-erosion', name:'Stabilizing Eroding Streambanks', votes:980, rating:4.6, kind:'solution' }
      ]},
      { id:'environment-restoration-wetlands', name:'Wetland Restoration', votes:1810, rating:4.8, kind:'solution', children:[
        { id:'environment-restoration-wetland-hydrology', name:'Reconnecting Wetland Hydrology', votes:1240, rating:4.8, kind:'solution' },
        { id:'environment-restoration-wetland-buffer', name:'Restoring Wetland Buffers', votes:1090, rating:4.7, kind:'solution' },
        { id:'environment-restoration-wetland-species', name:'Reestablishing Native Wetland Plants', votes:1030, rating:4.7, kind:'solution' },
        { id:'environment-restoration-wetland-drainage', name:'Legacy Drainage and Ditch Impacts', votes:940, rating:4.6, kind:'issue' }
      ]},
      { id:'environment-restoration-prairie', name:'Native Prairie and Meadow Recovery', votes:1650, rating:4.7, kind:'solution', children:[
        { id:'environment-restoration-prairie-seed', name:'Locally Adapted Native Seed', votes:1050, rating:4.6, kind:'solution' },
        { id:'environment-restoration-prairie-pollinator', name:'Pollinator Habitat Patches', votes:1130, rating:4.7, kind:'solution' },
        { id:'environment-restoration-prairie-invasive', name:'Invasive Grass Suppression', votes:970, rating:4.5, kind:'solution' }
      ]},
      { id:'environment-restoration-urban', name:'Urban Native Habitat Patches', votes:1570, rating:4.6, kind:'solution' },
      { id:'environment-restoration-shoreline', name:'Living Shoreline Restoration', votes:1510, rating:4.7, kind:'solution' },
      { id:'environment-restoration-culverts', name:'Small Stream and Culvert Restoration', votes:1430, rating:4.7, kind:'solution' },
      { id:'environment-restoration-stewardship', name:'Long-Term Community Stewardship', votes:1360, rating:4.6, kind:'solution' },
      { id:'environment-restoration-monitoring', name:'Post-Restoration Ecological Monitoring', votes:1290, rating:4.6, kind:'solution' }
    ]
  };

  Object.entries(expansions).forEach(([id, children]) => {
    const parent = nodeById.get(id);
    if (!parent) return;
    parent.children = children;
    const root = rootById.get(id) || parent;
    children.forEach(child => annotate(child, parent, root));
  });

  if (typeof render === 'function') render();
})();
