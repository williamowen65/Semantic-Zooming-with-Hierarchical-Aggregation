// Bottom sheet for context belonging to the currently selected Atlas topic.
(() => {
  const sheet=document.querySelector('#topic-sheet'),tab=document.querySelector('#topic-sheet-tab');
  if(!sheet||!tab)return;
  const title=document.querySelector('#topic-sheet-title'),kind=document.querySelector('#topic-sheet-kind'),locations=document.querySelector('#topic-affected-locations'),votes=document.querySelector('#topic-votes'),rating=document.querySelector('#topic-rating'),children=document.querySelector('#topic-children');
  let open=false,startY=null,startOpen=false;
  const fmt=n=>n>=1000?`${(n/1000).toFixed(1)}k`:String(n??0);
  function locationCount(node){
    if(!node||node.kind!=='issue')return null;
    if(Array.isArray(node.affectedLocations))return node.affectedLocations.length;
    if(Number.isFinite(node.affectedLocationCount))return node.affectedLocationCount;
    // Demo fallback until affected locations are first-class dataset records.
    return Math.max(1,Math.min(12,Math.round((node.votes||1000)/1450)));
  }
  function selectedNode(){const id=focusPath&&focusPath.length?focusPath[focusPath.length-1]:null;return id?nodeById.get(id):null;}
  function update(){
    const node=selectedNode();
    if(!node){title.textContent='Select a topic';kind.textContent='Topic details';locations.textContent='—';votes.textContent='—';rating.textContent='—';children.textContent='—';return;}
    title.textContent=node.name;kind.textContent=node.kind==='solution'?'Solution':'Issue';votes.textContent=fmt(node.votes);rating.textContent=node.rating?`${node.rating.toFixed(1)} / 5`:'—';children.textContent=String((node.children||[]).length);
    const count=locationCount(node);locations.textContent=count==null?'Not applicable':`${count} affected location${count===1?'':'s'}`;
  }
  function setOpen(value){open=!!value;sheet.classList.toggle('is-open',open);tab.setAttribute('aria-expanded',String(open));}
  tab.addEventListener('click',()=>{update();setOpen(!open);});
  tab.addEventListener('pointerdown',e=>{startY=e.clientY;startOpen=open;tab.setPointerCapture?.(e.pointerId);});
  tab.addEventListener('pointerup',e=>{if(startY==null)return;const dy=e.clientY-startY;if(Math.abs(dy)>24)setOpen(dy<0);startY=null;});
  const originalFocus=focusNode;
  focusNode=function(id){originalFocus(id);update();};
  document.querySelector('#reset')?.addEventListener('click',()=>{requestAnimationFrame(update);});
  update();
})();