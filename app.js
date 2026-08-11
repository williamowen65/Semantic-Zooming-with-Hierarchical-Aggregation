const forestData = [
  {
    id: "climate", name: "Climate Change", color: "#86b75b", votes: 9800, rating: 4.6,
    children: [
      { id: "migration", name: "Migration", votes: 2200, rating: 4.2, children: [
        { id: "displacement", name: "Displacement", votes: 1150, rating: 4.4 },
        { id: "border-policy", name: "Border Policy", votes: 820, rating: 3.8 },
        { id: "refugee-support", name: "Refugee Support", votes: 910, rating: 4.5 },
        { id: "legal-pathways", name: "Legal Pathways", votes: 630, rating: 4.1 },
        { id: "integration", name: "Integration Programs", votes: 760, rating: 4.3 }
      ]},
      { id: "adaptation", name: "Adaptation", votes: 1900, rating: 4.5, children: [
        { id: "coastal", name: "Coastal Resilience", votes: 780, rating: 4.6 },
        { id: "heat", name: "Urban Heat", votes: 650, rating: 4.3 },
        { id: "water", name: "Water Security", votes: 720, rating: 4.4 }
      ]},
      { id: "resilience", name: "Resilience", votes: 1650, rating: 4.1 },
      { id: "policy", name: "Policy & Regulation", votes: 2050, rating: 4.0 },
      { id: "public-awareness", name: "Public Awareness", votes: 1600, rating: 4.4, children: [
        { id: "outreach", name: "Outreach & Education", votes: 720, rating: 4.3 },
        { id: "media", name: "Media & Communication", votes: 680, rating: 4.5, children: [
          { id: "traditional-media", name: "Traditional Media", votes: 280, rating: 3.8 },
          { id: "social-media", name: "Social Media", votes: 520, rating: 4.2 },
          { id: "storytelling", name: "Storytelling", votes: 390, rating: 4.6 },
          { id: "misinformation", name: "Misinformation Response", votes: 470, rating: 4.7 }
        ]},
        { id: "community", name: "Community Engagement", votes: 590, rating: 4.6 },
        { id: "behavior", name: "Behavior Change", votes: 520, rating: 4.1 },
        { id: "citizen-science", name: "Citizen Science", votes: 430, rating: 4.2 }
      ]},
      { id: "finance", name: "Finance & Investment", votes: 1750, rating: 4.0 }
    ]
  },
  { id: "infrastructure", name: "Infrastructure", color: "#6ea6df", votes: 7000, rating: 4.4, children: [{ id: "transport", name: "Transportation", votes: 2600, rating: 4.2 }, { id: "utilities", name: "Utilities", votes: 2200, rating: 4.3 }, { id: "housing-infra", name: "Housing", votes: 1800, rating: 4.0 }] },
  { id: "education", name: "Education", color: "#9276cf", votes: 5600, rating: 4.5, children: [{ id: "k12", name: "K-12", votes: 2100, rating: 4.4 }, { id: "higher-ed", name: "Higher Education", votes: 1800, rating: 4.2 }, { id: "skills", name: "Skills & Training", votes: 1600, rating: 4.5 }] },
  { id: "healthcare", name: "Healthcare", color: "#e5af43", votes: 4800, rating: 4.3, children: [{ id: "access", name: "Access", votes: 1900, rating: 4.5 }, { id: "cost", name: "Cost", votes: 1700, rating: 4.0 }, { id: "prevention", name: "Prevention", votes: 1400, rating: 4.4 }] },
  { id: "economy", name: "Economy", color: "#df776b", votes: 4500, rating: 4.0, children: [{ id: "jobs", name: "Jobs", votes: 1800, rating: 4.1 }, { id: "markets", name: "Markets", votes: 1500, rating: 3.9 }, { id: "trade", name: "Trade", votes: 1200, rating: 3.8 }] },
  { id: "environment", name: "Environment", color: "#7d70b8", votes: 3900, rating: 4.5, children: [{ id: "biodiversity", name: "Biodiversity", votes: 1700, rating: 4.6 }, { id: "pollution", name: "Pollution", votes: 1500, rating: 4.4 }, { id: "conservation", name: "Conservation", votes: 1300, rating: 4.5 }] },
  { id: "governance", name: "Governance", color: "#62b7b0", votes: 3100, rating: 4.1, children: [{ id: "institutions", name: "Institutions", votes: 1300, rating: 4.2 }, { id: "elections", name: "Elections", votes: 1100, rating: 3.9 }, { id: "transparency", name: "Transparency", votes: 1200, rating: 4.5 }] },
  { id: "social-equity", name: "Social Equity", color: "#c99062", votes: 2800, rating: 4.4, children: [{ id: "rights", name: "Rights", votes: 1200, rating: 4.5 }, { id: "opportunity", name: "Opportunity", votes: 1050, rating: 4.3 }, { id: "inclusion", name: "Inclusion", votes: 900, rating: 4.5 }] },
  { id: "technology", name: "Technology", color: "#8e969d", votes: 3400, rating: 4.2 },
  { id: "energy", name: "Energy", color: "#766ac6", votes: 4300, rating: 4.5 }
];

const bulkBranchSpecs = {
  infrastructure: ["Bridge Maintenance","Road Safety","Transit Reliability","Freight Capacity","Port Congestion","Airport Access","Sidewalk Gaps","Bike Network Gaps","Stormwater Capacity","Sewer Reliability","Drinking Water Systems","Grid Hardening","Broadband Backhaul","Public Building Repair","School Facilities","Hospital Infrastructure","Rail Modernization","Traffic Safety","Construction Backlog","Asset Monitoring","Rural Roads","Dam Safety","Levee Maintenance","Emergency Communications","Street Lighting","Utility Coordination","Permitting Delays","Capital Planning"],
  education: ["Early Childhood Access","Teacher Shortages","Special Education Capacity","School Attendance","Literacy Gaps","Math Achievement","Career Education","School Nutrition","Student Transportation","Counselor Capacity","School Safety","Digital Learning Access","College Affordability","Student Debt","Campus Housing","Adult Literacy","Credential Recognition","Apprenticeships","Workforce Alignment","Language Learners","Rural Schools","Arts Education","STEM Access","Library Access","Learning Recovery","Teacher Training","Class Size","Family Engagement"],
  healthcare: ["Primary Care Shortage","Specialist Access","Emergency Department Crowding","Maternal Health","Infant Health","Mental Health Access","Substance Use Care","Dental Access","Vision Care","Prescription Costs","Insurance Gaps","Medical Debt","Nursing Shortage","Home Health Capacity","Long Term Care","Rural Hospitals","Telehealth Access","Preventive Screening","Vaccination Access","Chronic Disease","Disability Services","Care Coordination","Health Data Exchange","Language Access in Care","Transportation to Care","Public Health Staffing","Community Clinics","Hospital Capacity"],
  economy: ["Wage Stagnation","Underemployment","Job Displacement","Small Business Closures","Credit Access","Regional Inequality","Supply Chain Fragility","Price Volatility","Household Debt","Retirement Security","Youth Employment","Worker Training","Benefits Portability","Informal Work","Seasonal Employment","Manufacturing Capacity","Export Barriers","Local Procurement","Entrepreneurship Access","Commercial Vacancies","Main Street Recovery","Childcare Costs","Productivity Gaps","Remote Work Access","Economic Mobility","Consumer Confidence","Business Succession","Cooperative Ownership"],
  governance: ["Administrative Capacity","Public Records Access","Procurement Oversight","Ethics Enforcement","Election Administration","Civic Participation","Public Consultation","Interagency Coordination","Local Government Capacity","Budget Transparency","Tax Administration","Service Backlogs","Permit Processing","Benefits Delivery","Digital Identity","Public Data Quality","Cyber Resilience","Emergency Governance","Workforce Retention","Regulatory Complexity","Complaint Resolution","Ombudsman Access","Language Services","Rural Administration","Performance Measurement","Audit Capacity","Open Meetings","Public Trust"],
  technology: ["Algorithmic Bias","AI Safety","Model Transparency","Data Privacy","Identity Theft","Online Fraud","Platform Accountability","Content Authenticity","Deepfake Detection","Child Online Safety","Cybersecurity Skills","Critical Systems Security","Software Supply Chain","Cloud Concentration","Digital Identity Risks","Biometric Governance","Facial Recognition","Automated Decisions","Data Portability","Interoperability","Open Standards","Digital Divide","Device Affordability","Broadband Adoption","Accessibility Technology","Quantum Readiness","Robotics Transition","Workplace Automation"],
  energy: ["Transmission Congestion","Distribution Reliability","Transformer Shortage","Energy Storage","Peak Demand","Grid Interconnection","Renewable Integration","Building Efficiency","Industrial Efficiency","Heat Pump Access","Home Weatherization","Energy Burden","Utility Arrears","Community Solar","Rooftop Solar Access","Wind Siting","Geothermal Access","Hydropower Reliability","Nuclear Operations","Fuel Supply Risk","EV Charging","Fleet Electrification","Battery Recycling","Critical Minerals","Workforce Training","Microgrids","Demand Response","Grid Cybersecurity"]
};
function slug(value){return value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
Object.entries(bulkBranchSpecs).forEach(([rootId,names],rootIndex)=>{
  const root=forestData.find(d=>d.id===rootId); if(!root)return;
  const additions=names.map((name,index)=>{
    const id=`bulk-${rootId}-${slug(name)}`;
    const node={id,name,votes:Math.max(180,1900-index*47+rootIndex*31),rating:3.8+((index+rootIndex)%9)*0.1};
    if(index%4===0){
      node.children=Array.from({length:7+(index%3)},(_,j)=>({
        id:`${id}-branch-${j+1}`,
        name:["Access","Capacity","Cost","Quality","Coverage","Workforce","Reliability","Oversight","Local Delivery"][(j+index)%9]+` ${j+1}`,
        votes:Math.max(90,720-j*61-index*5), rating:3.9+((j+index)%7)*0.1,
        ...(j===1&&index%8===0?{children:Array.from({length:6},(_,k)=>({id:`${id}-branch-${j+1}-detail-${k+1}`,name:["Planning","Funding","Implementation","Training","Measurement","Feedback"][k],votes:260-k*27,rating:4.0+(k%5)*0.1}))}:{})
      }));
    }
    return node;
  });
  root.children=[...(root.children||[]),...additions];
});

// The root overview only represents topics that actually have hierarchy below them.
for (let i=forestData.length-1;i>=0;i-=1) if(!forestData[i].children?.length) forestData.splice(i,1);

const host = document.querySelector("#viz");
const breadcrumbHost = document.querySelector("#breadcrumbs");
const resetButton = document.querySelector("#reset");
const statusHost = document.querySelector("#status");
let width = host.clientWidth;
let height = host.clientHeight;
let focusPath = [];
let cameraY = 0;
let worldHeight = height;
let levelCenters = [];
let touchStartY = null;
let touchLastY = null;
let touchMoved = false;
const svg = d3.select(host).append("svg").attr("role", "img").attr("aria-label", "Weighted clustered hierarchy").attr("viewBox", [0, 0, width, height]);
const stage = svg.append("g").attr("class", "stage");
const nodeById = new Map();
const parentById = new Map();
const rootById = new Map();
function annotate(node, parent = null, root = node) { nodeById.set(node.id,node); parentById.set(node.id,parent); rootById.set(node.id,root); (node.children||[]).forEach(child=>annotate(child,node,root)); }
forestData.forEach(root=>annotate(root));
function directScore(node) { const votes=Math.max(1,node.votes||1); const rating=Math.max(.5,Math.min(5,node.rating||3)); return votes*(.35+.65*rating/5); }
function aggregateScore(node) { return directScore(node)+(node.children||[]).reduce((sum,child)=>sum+aggregateScore(child),0); }
function rootColor(node) { return rootById.get(node.id)?.color||"#7d8a96"; }
function lighten(hex, amount=.2) { const c=d3.color(hex); return c?d3.interpolateRgb(c,d3.rgb(255,255,255))(amount):hex; }
function compact(value) { if(value>=1000)return `${(value/1000).toFixed(value>=10000?0:1)}k`; return `${Math.round(value)}`; }
function polygonPath(poly) { return `M${poly.map(p=>p.join(",")).join("L")}Z`; }
function outerPolygon(w,h) { return [[0,0],[w,0],[w,h],[0,h]]; }
function layoutCluster(items,w,h,seedKey) { const proxies=items.map(item=>({id:item.id,item,weight:Math.max(1,aggregateScore(item))})); const root=d3.hierarchy({children:proxies}).sum(d=>d.weight||0); const polygon=outerPolygon(w,h); const seed=Array.from(seedKey).reduce((a,c)=>((a*31+c.charCodeAt(0))>>>0),2166136261)/4294967296; d3.voronoiTreemap().clip(polygon).prng(d3.randomLcg(seed||.42))(root); return {root,polygon}; }
function wrapLabel(text,maxChars) { const words=text.split(/\s+/),lines=[]; let line=""; words.forEach(word=>{const next=line?`${line} ${word}`:word;if(next.length>maxChars&&line){lines.push(line);line=word;}else line=next;});if(line)lines.push(line);return lines.slice(0,3); }
function renderCluster({items,x,y,w,h,selectedId=null,faded=false,interactive=true,className=""}) {
 const {root,polygon}=layoutCluster(items,w,h,`${selectedId||"all"}-${items.map(d=>d.id).join("-")}`); const g=stage.append("g").attr("class",`cluster ${className}`).attr("transform",`translate(${x},${y})`); g.append("path").attr("class","cluster-outline").attr("d",polygonPath(polygon)); const leaves=root.leaves(); const cells=g.selectAll("g.cell").data(leaves,d=>d.data.id).join("g").attr("class",d=>`cell ${d.data.id===selectedId?"is-selected":""} ${faded&&d.data.id!==selectedId?"is-faded":""}`).attr("tabindex",interactive?0:null).attr("role",interactive?"button":null).attr("aria-label",d=>`${d.data.item.name}, ${compact(aggregateScore(d.data.item))} aggregate importance`).on("click",(event,d)=>{if(!interactive||touchMoved)return;event.stopPropagation();focusNode(d.data.item.id);}).on("keydown",(event,d)=>{if(interactive&&(event.key==="Enter"||event.key===" ")){event.preventDefault();focusNode(d.data.item.id);}});
 cells.append("path").attr("class","cell-shape").attr("d",d=>polygonPath(d.polygon)).attr("fill",d=>{const base=rootColor(d.data.item);return faded&&d.data.id!==selectedId?lighten(base,.7):lighten(base,.22);});
 cells.each(function(d){const item=d.data.item,[cx,cy]=d3.polygonCentroid(d.polygon),area=Math.abs(d3.polygonArea(d.polygon)),selected=item.id===selectedId,fontSize=Math.max(9,Math.min(18,Math.sqrt(area)/8.5)),maxChars=Math.max(9,Math.floor(Math.sqrt(area)/5.6)),lines=wrapLabel(item.name,maxChars);const text=d3.select(this).append("text").attr("class","cell-label").attr("x",cx).attr("y",cy-((lines.length-1)*fontSize*.52)-3).attr("text-anchor","middle").style("font-size",`${fontSize}px`).style("font-weight",selected?750:620);lines.forEach((line,i)=>text.append("tspan").attr("x",cx).attr("dy",i===0?0:fontSize*1.08).text(line));text.append("tspan").attr("class","score-label").attr("x",cx).attr("dy",fontSize*1.12).text(compact(aggregateScore(item)));}); return {g,leaves};
}
function currentNode(){return focusPath.length?nodeById.get(focusPath[focusPath.length-1]):null;}
function siblingSet(node){if(!node)return forestData;const parent=parentById.get(node.id);return parent?parent.children||[]:forestData;}
function pathForNode(id){const path=[];let node=nodeById.get(id);while(node){path.unshift(node.id);node=parentById.get(node.id);}return path;}
function cameraBounds(){const toolbarAllowance=width<720?118:78,bottomAllowance=54;return{min:Math.min(0,height-worldHeight-bottomAllowance),max:Math.max(0,toolbarAllowance-20)};}
function clampCamera(value){const{min,max}=cameraBounds();return Math.max(min,Math.min(max,value));}
function applyCamera(animate=false){cameraY=clampCamera(cameraY);stage.interrupt();if(animate&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){stage.transition().duration(520).ease(d3.easeCubicOut).attr("transform",`translate(0,${cameraY})`);}else stage.attr("transform",`translate(0,${cameraY})`);}
function scrollToDepth(index,animate=true){if(!levelCenters.length)return;const safeIndex=Math.max(0,Math.min(levelCenters.length-1,index)),viewportTarget=height*(width<720?.48:.5);cameraY=viewportTarget-levelCenters[safeIndex];applyCamera(animate);}
function focusNode(id){const node=nodeById.get(id);if(!node)return;focusPath=pathForNode(id);render();scrollToDepth(focusPath.length-1,true);statusHost.textContent=node.children?.length?`${node.name} selected. ${node.children.length} child issues shown below. Scroll vertically to revisit ancestors.`:`${node.name} selected. This is a leaf node in the prototype. Scroll upward to revisit ancestors.`;}
function panToBreadcrumb(index){if(!focusPath.length)return;scrollToDepth(index,true);const id=focusPath[Math.max(0,Math.min(focusPath.length-1,index))];statusHost.textContent=`${nodeById.get(id).name} brought back into view. The deeper branch remains expanded below.`;}
function renderBreadcrumbs(){breadcrumbHost.replaceChildren();const all=document.createElement("button");all.type="button";all.textContent="All roots";all.addEventListener("click",()=>{if(focusPath.length)panToBreadcrumb(0);});breadcrumbHost.append(all);focusPath.forEach((id,index)=>{const sep=document.createElement("span");sep.className="crumb-separator";sep.textContent="›";breadcrumbHost.append(sep);const button=document.createElement("button");button.type="button";button.textContent=nodeById.get(id).name;button.className=index===focusPath.length-1?"current":"";button.addEventListener("click",()=>panToBreadcrumb(index));breadcrumbHost.append(button);});}
function selectedCentroid(rendered,id,x,y){const leaf=rendered.leaves.find(d=>d.data.id===id);if(!leaf)return null;const[cx,cy]=d3.polygonCentroid(leaf.polygon);return{x:x+cx,y:y+cy};}
function levelGeometry(compactMobile,contentTop){const w=width,availableViewport=Math.max(360,height-contentTop-72),h=Math.max(compactMobile?340:420,Math.min(availableViewport*.92,compactMobile?width*.9:width*.38));return{x:0,w,h};}
function render(){width=host.clientWidth;height=host.clientHeight;svg.attr("viewBox",[0,0,width,height]);stage.selectAll("*").remove();levelCenters=[];renderBreadcrumbs();const compactMobile=width<720,contentTop=compactMobile?132:98,centerX=width/2,geometry=levelGeometry(compactMobile,contentTop);if(!focusPath.length){cameraY=0;worldHeight=height;stage.attr("transform","translate(0,0)");const y=contentTop;renderCluster({items:forestData,x:0,y,w:geometry.w,h:geometry.h,selectedId:null,faded:false,interactive:true,className:"root-overview"});stage.append("text").attr("class","canvas-caption").attr("x",centerX).attr("y",Math.min(height-22,y+geometry.h+32)).attr("text-anchor","middle").text("Choose any root issue to focus its hierarchy");return;}const clusterW=geometry.w,clusterH=geometry.h,clusterX=0,levelGap=compactMobile?160:190,startY=contentTop;let previousSelectedPoint=null,cursorY=startY;focusPath.forEach((id,index)=>{const selected=nodeById.get(id),siblings=siblingSet(selected),rendered=renderCluster({items:siblings,x:clusterX,y:cursorY,w:clusterW,h:clusterH,selectedId:selected.id,faded:true,interactive:true,className:`context-cluster depth-${index}`}),point=selectedCentroid(rendered,selected.id,clusterX,cursorY);levelCenters.push(cursorY+clusterH/2);if(previousSelectedPoint&&point){const topY=cursorY,midY=(previousSelectedPoint.y+topY)/2;stage.insert("path",".cluster").attr("class","hierarchy-link").attr("d",`M${previousSelectedPoint.x},${previousSelectedPoint.y+22} C${previousSelectedPoint.x},${midY} ${point.x},${midY} ${point.x},${topY}`);stage.insert("circle",".cluster").attr("class","link-dot").attr("cx",point.x).attr("cy",topY).attr("r",3.5);}previousSelectedPoint=point;cursorY+=clusterH+levelGap;});const selected=currentNode();if(selected?.children?.length){const childY=cursorY;if(previousSelectedPoint){const midY=(previousSelectedPoint.y+childY)/2;stage.insert("path",".cluster").attr("class","hierarchy-link").attr("d",`M${previousSelectedPoint.x},${previousSelectedPoint.y+22} C${previousSelectedPoint.x},${midY} ${centerX},${midY} ${centerX},${childY}`);stage.insert("circle",".cluster").attr("class","link-dot").attr("cx",centerX).attr("cy",childY).attr("r",3.5);}renderCluster({items:selected.children,x:0,y:childY,w:geometry.w,h:geometry.h,selectedId:null,faded:false,interactive:true,className:"child-cluster"});levelCenters.push(childY+geometry.h/2);stage.append("text").attr("class","canvas-caption").attr("x",centerX).attr("y",childY+geometry.h+32).attr("text-anchor","middle").text(`Click a child of ${selected.name} to continue down`);worldHeight=childY+geometry.h+90;}else{stage.append("text").attr("class","leaf-message").attr("x",centerX).attr("y",cursorY-levelGap+58).attr("text-anchor","middle").text("Leaf node · scroll upward or use a breadcrumb to revisit an ancestor");worldHeight=cursorY-levelGap+118;}applyCamera(false);}
host.addEventListener("wheel",event=>{if(!focusPath.length||worldHeight<=height)return;event.preventDefault();cameraY-=event.deltaY*.78;applyCamera(false);},{passive:false});
host.addEventListener("touchstart",event=>{if(!focusPath.length||event.touches.length!==1)return;touchStartY=event.touches[0].clientY;touchLastY=touchStartY;touchMoved=false;},{passive:true});
host.addEventListener("touchmove",event=>{if(touchLastY==null||event.touches.length!==1||!focusPath.length)return;const y=event.touches[0].clientY,dy=y-touchLastY;if(Math.abs(y-touchStartY)>6)touchMoved=true;if(worldHeight>height){event.preventDefault();cameraY+=dy;applyCamera(false);}touchLastY=y;},{passive:false});
host.addEventListener("touchend",()=>{touchStartY=null;touchLastY=null;window.setTimeout(()=>{touchMoved=false;},0);},{passive:true});
resetButton.addEventListener("click",()=>{focusPath=[];cameraY=0;render();statusHost.textContent="Showing all root issues.";});
window.addEventListener("resize",()=>{render();applyCamera(false);});
render();