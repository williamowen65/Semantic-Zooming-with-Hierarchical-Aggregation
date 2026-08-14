// Card-stack navigation. The root layer now uses the same card/layer pattern as
// every selected hierarchy level.
(() => {
  if(typeof render!=='function'||typeof stage==='undefined')return;
  document.body.classList.add('card-stack-mode');
  const visible=new Map();let rootOpen=true,previous=[];
  const style=document.createElement('style');
  style.textContent=`
    body.card-stack-mode.has-card-stack .context-cluster,
    body.card-stack-mode.has-card-stack .root-layer-label,
    body.card-stack-mode.has-card-stack path.hierarchy-link,
    body.card-stack-mode.has-card-stack circle.link-dot{display:none!important}
    body.card-stack-mode.has-card-stack .context-cluster.card-stack-layer-visible{display:inline!important}
    body.card-stack-mode.has-card-stack .child-cluster.card-stack-layer-hidden{display:none!important}
    body.card-stack-mode .layer-context-entry foreignObject:not(.layer-kind-toggle-host),body.card-stack-mode .root-context-entry foreignObject{pointer-events:auto}
    body.card-stack-mode .layer-context-card{pointer-events:auto;cursor:pointer;transition:box-shadow .18s ease,background-color .18s ease}
    body.card-stack-mode .layer-context-card.children-visible{box-shadow:0 5px 14px rgba(20,30,40,.08)}
    body.card-stack-mode .layer-context-card.children-locked{cursor:default}
  `;document.head.appendChild(style);
  const tr=n=>{const m=(n?.getAttribute('transform')||'').match(/translate\(\s*([-\d.]+)(?:[ ,]+)([-\d.]+)/);return m?{x:+m[1],y:+m[2]}:{x:0,y:0};};
  const h=n=>{const d=+n?.dataset?.layerHeight;if(Number.isFinite(d)&&d>0)return d;try{return n?.querySelector('.cluster-outline')?.getBBox?.().height||0;}catch(_){return 0;}};
  const same=p=>p.length===previous.length&&p.every((id,i)=>id===previous[i]);
  const setY=(n,y,a)=>{if(!n)return;const t=tr(n),v=`translate(${t.x},${y})`,s=d3.select(n).interrupt();a&&!matchMedia('(prefers-reduced-motion: reduce)').matches?s.transition().duration(220).ease(d3.easeCubicOut).attr('transform',v):n.setAttribute('transform',v);};
  const setCardY=(n,y,a)=>{if(!n)return;const s=d3.select(n).interrupt();a&&!matchMedia('(prefers-reduced-motion: reduce)').matches?s.transition().duration(200).ease(d3.easeCubicOut).attr('y',y):s.attr('y',y);};
  function sync(){const p=Array.isArray(focusPath)?focusPath:[];if(same(p))return;rootOpen=p.length===0;visible.clear();p.forEach((id,i)=>visible.set(id,i===p.length-1));previous=[...p];}
  function rootLayer(){return (focusPath?.length?stage.select('.context-cluster.depth-0'):stage.select('.root-overview')).node();}
  function layerFor(i,last){return (i===last?stage.select('.child-cluster'):stage.select(`.context-cluster.depth-${i+1}`)).node();}
  function box(){const w=width<720?Math.max(120,width-20):Math.min(width-32,width*.76);return{x:width<720?10:Math.max(16,width*.12),w};}
  function rootCard(y){
    stage.selectAll('.root-context-entry').remove();const b=box(),ch=66,votes=(forestData||[]).reduce((s,n)=>s+(+n.votes||0),0),voteText=votes>=1000?`${(votes/1000).toFixed(1)}k`:String(votes);
    const html=`<div xmlns="http://www.w3.org/1999/xhtml" class="layer-context-card is-issue ${rootOpen?'children-visible':''}" role="button" tabindex="0" aria-pressed="${rootOpen}"><div class="layer-context-copy"><div class="layer-context-primary"><span class="layer-context-kind">Issue collection</span><span class="layer-context-name">Root challenges</span></div><div class="layer-context-description">The value of an idea doesn’t correspond to its scale. A tiny, reproducible practice that thousands of people can copy might ultimately matter more than an enormous proposal nobody knows how to implement.</div></div><div class="layer-context-stats"><span class="layer-context-stat"><strong>${voteText}</strong> votes</span><span class="layer-context-stat"><strong>${(forestData||[]).length}</strong> roots</span></div></div>`;
    const fo=stage.append('g').attr('class','root-context-entry').append('foreignObject').attr('x',b.x).attr('y',y).attr('width',b.w).attr('height',ch).html(html).node(),card=fo?.querySelector('.layer-context-card');
    const toggle=()=>{rootOpen=!rootOpen;layout(true);};if(card){card.setAttribute('aria-label',`${rootOpen?'Hide':'Show'} root challenges`);card.onclick=e=>{e.preventDefault();e.stopPropagation();toggle();};card.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}};}return ch;
  }
  function wire(entry,id,isCurrent){
    const fo=entry.querySelector('foreignObject:not(.layer-kind-toggle-host)'),card=fo?.querySelector('.layer-context-card'),node=nodeById.get(id);if(!fo||!card||!node)return null;
    const children=(node.children||[]).length>0,locked=isCurrent&&children;if(locked)visible.set(id,true);const open=children&&(locked||visible.get(id)===true);
    card.classList.toggle('children-visible',open);card.classList.toggle('children-locked',locked);card.setAttribute('role','button');card.setAttribute('tabindex',locked?'-1':'0');card.setAttribute('aria-pressed',String(open));card.setAttribute('aria-disabled',String(locked));card.setAttribute('aria-label',locked?`Child layer for ${node.name} is always shown`:`${open?'Hide':'Show'} child layer for ${node.name}`);
    const toggle=()=>{if(!children||locked)return;visible.set(id,visible.get(id)!==true);layout(true);};card.onclick=e=>{e.preventDefault();e.stopPropagation();toggle();};card.onkeydown=e=>{if(!locked&&(e.key==='Enter'||e.key===' ')){e.preventDefault();toggle();}};return fo;
  }
  function layout(animate=false){
    sync();const path=Array.isArray(focusPath)?focusPath:[],entries=stage.selectAll('.layer-context-entry').nodes();document.body.classList.add('has-card-stack');
    stage.selectAll('.context-cluster').classed('card-stack-layer-visible',false);stage.select('.child-cluster').classed('card-stack-layer-hidden',false);stage.selectAll('.card-stack-controls-host-v2').remove();let y=width<720?132:98;
    y+=rootCard(y)+10;const root=rootLayer();if(rootOpen&&root){path.length?root.classList.add('card-stack-layer-visible'):root.classList.remove('card-stack-layer-hidden');setY(root,y,animate);y+=h(root)+12;}else if(!path.length&&root)root.classList.add('card-stack-layer-hidden');
    entries.forEach((entry,i)=>{const id=path[i],current=i===entries.length-1,fo=wire(entry,id,current);if(!id||!fo)return;entry.removeAttribute('transform');fo.removeAttribute('transform');setCardY(fo,y,animate);const ch=+fo.getAttribute('height')||66,node=nodeById.get(id),open=(current&&(node?.children||[]).length>0)||(visible.get(id)===true&&(node?.children||[]).length>0),layer=layerFor(i,entries.length-1),toggle=entry.querySelector('foreignObject.layer-kind-toggle-host');if(toggle){toggle.removeAttribute('transform');toggle.style.display=open&&layer?'':'none';}if(open&&layer){i<entries.length-1?layer.classList.add('card-stack-layer-visible'):layer.classList.remove('card-stack-layer-hidden');const th=toggle?(+toggle.getAttribute('height')||24):0,ty=y+ch+4;if(toggle)d3.select(toggle).attr('y',ty);const top=ty+th/2;setY(layer,top,animate);y=top+h(layer)+12;}else{if(i===entries.length-1&&layer)layer.classList.add('card-stack-layer-hidden');y+=ch+10;}});
    stage.selectAll('text.canvas-caption').filter(function(){return(d3.select(this).text()||'').includes('· children');}).remove();if(Array.isArray(levelCenters)){levelCenters.length=0;const r=stage.select('.root-context-entry foreignObject').node();if(r)levelCenters.push((+r.getAttribute('y')||0)+(+r.getAttribute('height')||66)/2);entries.forEach(e=>{const c=e.querySelector('foreignObject:not(.layer-kind-toggle-host)');if(c)levelCenters.push((+c.getAttribute('y')||0)+(+c.getAttribute('height')||66)/2);});}worldHeight=Math.max(height,y+96);if(typeof applyCamera==='function')applyCamera(false);
  }
  window.atlasChildrenVisibleFor=id=>visible.get(id)===true;const baseRender=render;render=function(...args){const r=baseRender(...args);layout(false);return r;};requestAnimationFrame(()=>layout(false));
})();