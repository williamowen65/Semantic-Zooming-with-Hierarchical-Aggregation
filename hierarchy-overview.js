// Layer-height control for the hierarchy.
(() => {
  if (typeof render !== 'function' || typeof levelGeometry !== 'function') return;
  const minus=document.querySelector('#hierarchy-zoom-out'),plus=document.querySelector('#hierarchy-zoom-in'),readout=document.querySelector('#hierarchy-zoom-readout');
  if(!minus||!plus||!readout)return;
  const setting=readout.closest('.hierarchy-zoom-setting'),settingLabel=setting?.querySelector('.theme-setting-label');
  if(settingLabel)settingLabel.textContent='Layer height';
  minus.setAttribute('aria-label','Decrease layer height');plus.setAttribute('aria-label','Increase layer height');
  const presets=[
    {id:'tiny',label:'Very compact',percent:20,factor:.20},
    {id:'compact',label:'Compact',percent:35,factor:.35},
    {id:'short',label:'Short',percent:55,factor:.55},
    {id:'medium',label:'Medium',percent:72,factor:.72},
    {id:'tall',label:'Tall',percent:86,factor:.86},
    {id:'standard',label:'Standard',percent:100,factor:1}
  ];
  const storageKey='atlas-layer-height';let saved=null;try{saved=localStorage.getItem(storageKey);}catch(_){}
  let presetIndex=presets.findIndex(p=>p.id===saved);if(presetIndex<0)presetIndex=presets.length-1;
  const baseLevelGeometry=levelGeometry;
  levelGeometry=function(compactMobile,contentTop){const geometry=baseLevelGeometry(compactMobile,contentTop),factor=presets[presetIndex]?.factor||1;return{...geometry,h:Math.max(64,geometry.h*factor)};};
  function updateReadout(){const preset=presets[presetIndex];readout.textContent=`${preset.label} · ${preset.percent}%`;minus.disabled=presetIndex===0;plus.disabled=presetIndex===presets.length-1;document.body.dataset.layerHeight=preset.id;if(document.body.dataset.hierarchyZoom)delete document.body.dataset.hierarchyZoom;}
  function applyPreset(index,persist=true){presetIndex=Math.max(0,Math.min(presets.length-1,index));updateReadout();render();if(typeof applyCamera==='function')applyCamera(false);if(persist){try{localStorage.setItem(storageKey,presets[presetIndex].id);}catch(_){}}}
  minus.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();applyPreset(presetIndex-1);});
  plus.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();applyPreset(presetIndex+1);});
  updateReadout();requestAnimationFrame(()=>{render();if(typeof applyCamera==='function')applyCamera(false);});
})();

// Experimental card-stack navigation. Once a node is selected, historical
// selected graphical layers disappear and their context cards become the path.
// Only the current node's child layer remains graphical, and only the newest
// card keeps the sub-issues / solutions toggle.
(() => {
  if (typeof render !== 'function' || typeof stage === 'undefined') return;
  document.body.classList.add('card-stack-mode');
  const style=document.createElement('style');
  style.textContent='body.card-stack-mode.has-card-stack .context-cluster,body.card-stack-mode.has-card-stack .root-layer-label,body.card-stack-mode.has-card-stack path.hierarchy-link,body.card-stack-mode.has-card-stack circle.link-dot{display:none!important}';
  document.head.appendChild(style);
  function parseTranslate(node){const m=(node?.getAttribute('transform')||'').match(/translate\(\s*([-\d.]+)(?:[ ,]+)([-\d.]+)/);return m?{x:Number(m[1]),y:Number(m[2])}:{x:0,y:0};}
  function moveToY(node,y){if(!node||!Number.isFinite(y))return;const t=parseTranslate(node);node.setAttribute('transform',`translate(${t.x},${y})`);}
  function layerHeight(node){const h=Number(node?.dataset?.layerHeight);if(Number.isFinite(h)&&h>0)return h;try{return node?.querySelector('.cluster-outline')?.getBBox?.().height||0;}catch(_){return 0;}}
  function arrange(){
    const active=Array.isArray(focusPath)&&focusPath.length>0;document.body.classList.toggle('has-card-stack',active);if(!active)return;
    const entries=stage.selectAll('.layer-context-entry').nodes();let y=width<720?132:98;
    entries.forEach((entry,index)=>{entry.removeAttribute('transform');const card=entry.querySelector('foreignObject:not(.layer-kind-toggle-host)');if(!card)return;card.removeAttribute('transform');card.setAttribute('y',y);const h=Number(card.getAttribute('height'))||66;const toggle=entry.querySelector('foreignObject.layer-kind-toggle-host'),current=index===entries.length-1;if(toggle){toggle.removeAttribute('transform');toggle.style.display=current?'':'none';if(current){toggle.setAttribute('y',y+h+4);y+=h+4+(Number(toggle.getAttribute('height'))||24)+18;}else y+=h+10;}else y+=h+10;});
    const child=stage.select('.child-cluster').node();
    if(child){const childTop=y+18;moveToY(child,childTop);stage.selectAll('text.canvas-caption').each(function(){const t=d3.select(this);if((t.text()||'').includes('· children'))t.attr('y',childTop-24);});if(Array.isArray(levelCenters)){levelCenters.length=0;entries.forEach(entry=>{const card=entry.querySelector('foreignObject:not(.layer-kind-toggle-host)');if(card)levelCenters.push((Number(card.getAttribute('y'))||0)+(Number(card.getAttribute('height'))||66)/2);});levelCenters.push(childTop+layerHeight(child)/2);}worldHeight=Math.max(height,childTop+layerHeight(child)+96);}else worldHeight=Math.max(height,y+96);
    if(typeof applyCamera==='function')applyCamera(false);
  }
  const baseRender=render;render=function(...args){const result=baseRender(...args);arrange();return result;};requestAnimationFrame(arrange);
})();