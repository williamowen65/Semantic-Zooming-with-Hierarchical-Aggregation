// Atlas data container. Demo content is defined separately in intentional-forest-data.js.
const forestData = [];

const host=document.querySelector("#viz"),breadcrumbHost=document.querySelector("#breadcrumbs"),resetButton=document.querySelector("#reset"),statusHost=document.querySelector("#status");
let width=host.clientWidth,height=host.clientHeight,focusPath=[],cameraY=0,worldHeight=height,levelCenters=[],touchStartY=null,touchLastY=null,touchMoved=false;
const svg=d3.select(host).append("svg").attr("role","img").attr("aria-label","Weighted clustered hierarchy").attr("viewBox",[0,0,width,height]),stage=svg.append("g").attr("class","stage"),nodeById=new Map(),parentById=new Map(),rootById=new Map();
function annotate(node,parent=null,root=node){nodeById.set(node.id,node);parentById.set(node.id,parent);rootById.set(node.id,root);(node.children||[]).forEach(child=>annotate(child,node,root));} forestData.forEach(root=>annotate(root));
function directScore(node){const votes=Math.max(1,node.votes||1),rating=Math.max(.5,Math.min(5,node.rating||3));return votes*(.35+.65*rating/5);} 
// Node area reflects only that node's own votes and average rating. Descendant
// count/depth must not make a parent visually larger than an otherwise equally
// supported sibling.
function aggregateScore(node){return directScore(node);} 
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
function focusNode(id){const node=nodeById.get(id);if(!node)return;focusPath=pathForNode(id);render();const hasChildren=(node.children||[]).length>0,targetDepth=hasChildren?focusPath.length:focusPath.length-1;scrollToDepth(targetDepth,true);statusHost.textContent=hasChildren?`${node.name} selected. Showing ${node.children.length} example children.`:`${node.name} selected.`;}
function panToBreadcrumb(index){if(!focusPath.length)return;scrollToDepth(index,true);}
function renderBreadcrumbs(){breadcrumbHost.replaceChildren();const all=document.createElement("button");all.type="button";all.textContent="All roots";all.addEventListener("click",()=>{focusPath=[];cameraY=0;render();});breadcrumbHost.append(all);focusPath.forEach((id,index)=>{const sep=document.createElement("span");sep.className="crumb-separator";sep.textContent="›";breadcrumbHost.append(sep);const button=document.createElement("button");button.type="button";button.textContent=nodeById.get(id).name;button.className=index===focusPath.length-1?"current":"";button.addEventListener("click",()=>panToBreadcrumb(index));breadcrumbHost.append(button);});}
function selectedCentroid(rendered,id,x,y){const leaf=rendered.leaves.find(d=>d.data.id===id);if(!leaf)return null;const[cx,cy]=d3.polygonCentroid(leaf.polygon);return{x:x+cx,y:y+cy};}
function levelGeometry(compactMobile,contentTop){const availableViewport=Math.max(360,height-contentTop-72),h=Math.max(compactMobile?340:420,Math.min(availableViewport*.92,compactMobile?width*.9:width*.38));return{x:0,w:width,h};}
function render(){
  width=host.clientWidth;height=host.clientHeight;svg.attr("viewBox",[0,0,width,height]);stage.selectAll("*").remove();levelCenters=[];renderBreadcrumbs();const compactMobile=width<720,contentTop=compactMobile?132:98,geometry=levelGeometry(compactMobile,contentTop),gap=compactMobile?88:110;
  if(!focusPath.length){cameraY=0;worldHeight=height;stage.attr("transform","translate(0,0)");if(forestData.length)renderCluster({items:forestData,x:0,y:contentTop,w:geometry.w,h:geometry.h,interactive:true,className:"root-overview"});return;}
  let cursorY=contentTop;for(let depth=0;depth<focusPath.length;depth++){const selectedId=focusPath[depth],selected=nodeById.get(selectedId),siblings=depth===0?forestData:(parentById.get(selectedId)?.children||[selected]);renderCluster({items:siblings,x:0,y:cursorY,w:geometry.w,h:geometry.h,selectedId,faded:true,interactive:true,className:`context-cluster depth-${depth}`});levelCenters.push(cursorY+geometry.h/2);cursorY+=geometry.h+gap;}
  const selected=currentNode(),children=selected?.children||[];if(children.length){renderCluster({items:children,x:0,y:cursorY,w:geometry.w,h:geometry.h,interactive:true,className:"child-cluster"});levelCenters.push(cursorY+geometry.h/2);cursorY+=geometry.h+gap;}
  worldHeight=Math.max(height,cursorY+24);applyCamera(false);
}
host.addEventListener("wheel",event=>{if(!focusPath.length||worldHeight<=height)return;event.preventDefault();cameraY-=event.deltaY*.78;applyCamera(false);},{passive:false});
host.addEventListener("touchstart",event=>{if(!focusPath.length||event.touches.length!==1)return;touchStartY=event.touches[0].clientY;touchLastY=touchStartY;touchMoved=false;},{passive:true});
host.addEventListener("touchmove",event=>{if(touchLastY==null||event.touches.length!==1||!focusPath.length)return;const y=event.touches[0].clientY,dy=y-touchLastY;if(Math.abs(y-touchStartY)>6)touchMoved=true;if(worldHeight>height){event.preventDefault();cameraY+=dy;applyCamera(false);}touchLastY=y;},{passive:false});
host.addEventListener("touchend",()=>{touchStartY=null;touchLastY=null;setTimeout(()=>{touchMoved=false;},0);},{passive:true});
resetButton.addEventListener("click",()=>{focusPath=[];cameraY=0;render();statusHost.textContent="Showing all Atlas root inquiries.";});
window.addEventListener("resize",()=>{render();applyCamera(false);});
render();