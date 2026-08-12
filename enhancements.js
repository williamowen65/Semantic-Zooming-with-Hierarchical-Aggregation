// Interaction-only enhancements for the Atlas prototype.
// No dataset lives in this file.

// Stable Voronoi geometry: selection changes emphasis, not layout.
layoutCluster = function(items,w,h){
  const proxies=items.map(item=>({id:item.id,item,weight:Math.max(1,aggregateScore(item))}));
  const root=d3.hierarchy({children:proxies}).sum(d=>d.weight||0);
  const polygon=outerPolygon(w,h);
  const stableKey=items.map(item=>item.id).join("-");
  const seed=Array.from(stableKey).reduce((a,c)=>((a*31+c.charCodeAt(0))>>>0),2166136261)/4294967296;
  d3.voronoiTreemap().clip(polygon).prng(d3.randomLcg(seed||.42))(root);
  return{root,polygon};
};

// Slightly fluid shared boundaries.
function edgeKeyPoint(point){return `${point[0].toFixed(3)},${point[1].toFixed(3)}`;}
function curvedEdgeControls(a,b){
  const keyA=edgeKeyPoint(a),keyB=edgeKeyPoint(b),forward=keyA<=keyB,p0=forward?a:b,p1=forward?b:a;
  const dx=p1[0]-p0[0],dy=p1[1]-p0[1],length=Math.hypot(dx,dy)||1,nx=-dy/length,ny=dx/length;
  const hashText=`${edgeKeyPoint(p0)}|${edgeKeyPoint(p1)}`;let hash=2166136261;
  for(const ch of hashText)hash=Math.imul(hash^ch.charCodeAt(0),16777619)>>>0;
  const sign=(hash&1)?1:-1,variation=.72+((hash>>>1)%29)/100,amplitude=Math.min(10,Math.max(2.5,length*.075))*variation*sign;
  const c1=[p0[0]+dx*.33+nx*amplitude,p0[1]+dy*.33+ny*amplitude],c2=[p0[0]+dx*.67-nx*amplitude*.72,p0[1]+dy*.67-ny*amplitude*.72];
  return forward?[c1,c2]:[c2,c1];
}
polygonPath=function(poly){if(!poly||poly.length<2)return"";let d=`M${poly[0][0]},${poly[0][1]}`;for(let i=0;i<poly.length;i+=1){const a=poly[i],b=poly[(i+1)%poly.length],[c1,c2]=curvedEdgeControls(a,b);d+=`C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${b[0]},${b[1]}`;}return`${d}Z`;};

const baseRenderBreadcrumbs=renderBreadcrumbs;
renderBreadcrumbs=function(){baseRenderBreadcrumbs();requestAnimationFrame(()=>{breadcrumbHost.scrollLeft=breadcrumbHost.scrollWidth;});};

// Keep this override aligned with app.js: after render(), levelCenters contains
// one center for every selected/context layer plus one extra center for the child
// layer when the selected node has children. Target that extra center so the newly
// revealed children, not the selected parent, are what the viewport moves to.
focusNode=function(id){
  const node=nodeById.get(id);if(!node)return;
  if(window.stopHierarchyMomentum)window.stopHierarchyMomentum();
  focusPath=pathForNode(id);
  render();
  const hasChildren=(node.children||[]).length>0;
  const targetDepth=hasChildren?focusPath.length:Math.max(0,focusPath.length-1);
  requestAnimationFrame(()=>scrollToDepth(targetDepth,true));
  statusHost.textContent=hasChildren
    ?`${node.name} selected. Showing ${node.children.length} example children.`
    :`${node.name} selected. No child nodes have been added yet.`;
};

(() => {
  let momentumFrame=0,velocity=0,lastTouchY=null,lastTouchTime=0,touchOriginY=null,wheelTimer=0;
  const reducedMotion=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function stopMomentum(){if(momentumFrame)cancelAnimationFrame(momentumFrame);momentumFrame=0;velocity=0;clearTimeout(wheelTimer);}
  window.stopHierarchyMomentum=stopMomentum;
  function startMomentum(){if(reducedMotion()||Math.abs(velocity)<.35||momentumFrame)return;const tick=()=>{const before=cameraY;cameraY+=velocity;applyCamera(false);const hitBoundary=Math.abs(cameraY-before)<.01&&Math.abs(velocity)>.35;velocity*=.92;if(hitBoundary||Math.abs(velocity)<.35){momentumFrame=0;velocity=0;return;}momentumFrame=requestAnimationFrame(tick);};momentumFrame=requestAnimationFrame(tick);}
  host.addEventListener("wheel",event=>{if(!focusPath.length||worldHeight<=height)return;event.preventDefault();event.stopImmediatePropagation();if(momentumFrame)cancelAnimationFrame(momentumFrame);momentumFrame=0;const movement=-event.deltaY*.78;cameraY+=movement;applyCamera(false);velocity=Math.max(-42,Math.min(42,movement*.72));clearTimeout(wheelTimer);wheelTimer=setTimeout(startMomentum,52);},{passive:false,capture:true});
  host.addEventListener("touchstart",event=>{if(!focusPath.length||event.touches.length!==1)return;event.stopImmediatePropagation();stopMomentum();const touch=event.touches[0];lastTouchY=touch.clientY;touchOriginY=touch.clientY;lastTouchTime=performance.now();touchMoved=false;},{passive:true,capture:true});
  host.addEventListener("touchmove",event=>{if(lastTouchY==null||event.touches.length!==1||!focusPath.length)return;event.preventDefault();event.stopImmediatePropagation();const now=performance.now(),y=event.touches[0].clientY,dy=y-lastTouchY,dt=Math.max(8,now-lastTouchTime);if(Math.abs(y-touchOriginY)>6)touchMoved=true;cameraY+=dy;applyCamera(false);const instantaneous=dy*(16.667/dt);velocity=Math.max(-48,Math.min(48,velocity*.55+instantaneous*.45));lastTouchY=y;lastTouchTime=now;},{passive:false,capture:true});
  host.addEventListener("touchend",event=>{if(lastTouchY==null)return;event.stopImmediatePropagation();lastTouchY=null;lastTouchTime=0;touchOriginY=null;startMomentum();setTimeout(()=>{touchMoved=false;},80);},{passive:true,capture:true});
  host.addEventListener("touchcancel",()=>{lastTouchY=null;lastTouchTime=0;touchOriginY=null;stopMomentum();touchMoved=false;},{passive:true,capture:true});
})();

render();