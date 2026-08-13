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
  style.textContent=`
    body.card-stack-mode.has-card-stack .context-cluster,
    body.card-stack-mode.has-card-stack .root-layer-label,
    body.card-stack-mode.has-card-stack path.hierarchy-link,
    body.card-stack-mode.has-card-stack circle.link-dot{display:none!important}
    body.card-stack-mode.has-card-stack.show-all-roots .context-cluster.depth-0,
    body.card-stack-mode.has-card-stack.show-all-roots .root-layer-label{display:initial!important}
    .show-all-roots-control{overflow:visible}
    .show-all-roots-control button{
      width:100%;height:30px;border:1px solid rgba(70,82,75,.28);border-radius:999px;
      background:rgba(255,255,255,.94);color:#3e4b43;font:600 12px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      box-shadow:0 1px 4px rgba(40,50,44,.10);cursor:pointer
    }
    .show-all-roots-control button:hover{background:#fff}
    .show-all-roots-control button:focus-visible{outline:2px solid currentColor;outline-offset:2px}
  `;
  document.head.appendChild(style);
  let rootsVisible=false;
  stage.node()?.addEventListener('click',event=>{
    if(!rootsVisible)return;
    const cell=event.target?.closest?.('.context-cluster.depth-0 .cell');
    if(!cell)return;
    rootsVisible=false;
    document.body.classList.remove('show-all-roots');
  },true);
  function parseTranslate(node){const m=(node?.getAttribute('transform')||'').match(/translate\(\s*([-\d.]+)(?:[ ,]+)([-\d.]+)/);return m?{x:Number(m[1]),y:Number(m[2])}:{x:0,y:0};}
  function moveToY(node,y){if(!node||!Number.isFinite(y))return;const t=parseTranslate(node);node.setAttribute('transform',`translate(${t.x},${y})`);}
  function layerHeight(node){const h=Number(node?.dataset?.layerHeight);if(Number.isFinite(h)&&h>0)return h;try{return node?.querySelector('.cluster-outline')?.getBBox?.().height||0;}catch(_){return 0;}}
  function renderRootsControl(y){
    stage.selectAll('.show-all-roots-control').remove();
    const active=Array.isArray(focusPath)&&focusPath.length>0;
    if(!active)return 0;
    const controlWidth=132,controlHeight=30;
    const x=Math.max(10,(width-controlWidth)/2);
    const html=`<button xmlns="http://www.w3.org/1999/xhtml" type="button" aria-pressed="${rootsVisible?'true':'false'}">${rootsVisible?'Hide all roots':'Show all roots'}</button>`;
    const host=stage.append('foreignObject').attr('class','show-all-roots-control').attr('x',x).attr('y',y).attr('width',controlWidth).attr('height',controlHeight).html(html);
    const button=host.node()?.querySelector('button');
    if(button)button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();rootsVisible=!rootsVisible;document.body.classList.toggle('show-all-roots',rootsVisible);arrange();});
    return controlHeight;
  }
  function arrange(){
    const active=Array.isArray(focusPath)&&focusPath.length>0;
    document.body.classList.toggle('has-card-stack',active);
    if(!active){rootsVisible=false;document.body.classList.remove('show-all-roots');stage.selectAll('.show-all-roots-control').remove();return;}
    document.body.classList.toggle('show-all-roots',rootsVisible);
    const entries=stage.selectAll('.layer-context-entry').nodes();
    const baseTop=width<720?92:58;
    const rootCluster=stage.select('.context-cluster.depth-0').node();
    let y=baseTop;
    if(rootsVisible&&rootCluster){
      const rootTop=parseTranslate(rootCluster).y;
      const rootBottom=rootTop+layerHeight(rootCluster);
      y=Math.max(baseTop,rootBottom+10);
    }
    const controlHeight=renderRootsControl(y);
    y+=controlHeight+10;
    entries.forEach((entry,index)=>{entry.removeAttribute('transform');const card=entry.querySelector('foreignObject:not(.layer-kind-toggle-host)');if(!card)return;card.removeAttribute('transform');card.setAttribute('y',y);const h=Number(card.getAttribute('height'))||66;const toggle=entry.querySelector('foreignObject.layer-kind-toggle-host'),current=index===entries.length-1;if(toggle){toggle.removeAttribute('transform');toggle.style.display=current?'':'none';if(current){toggle.setAttribute('y',y+h+4);y+=h+4+(Number(toggle.getAttribute('height'))||24);}else y+=h+10;}else y+=h+10;});
    // The old child-layer caption is redundant now that the current card and
    // issue/solution toggle identify what the graphical layer contains.
    stage.selectAll('text.canvas-caption').filter(function(){return (d3.select(this).text()||'').includes('· children');}).remove();
    const child=stage.select('.child-cluster').node();
    if(child){const toggle=entries.length?entries[entries.length-1].querySelector('foreignObject.layer-kind-toggle-host'):null;const toggleHeight=toggle&&toggle.style.display!=='none'?(Number(toggle.getAttribute('height'))||24):0;const overlap=Math.max(0,toggleHeight/2);const childTop=y-overlap;moveToY(child,childTop);if(Array.isArray(levelCenters)){levelCenters.length=0;if(rootsVisible&&rootCluster)levelCenters.push(parseTranslate(rootCluster).y+layerHeight(rootCluster)/2);entries.forEach(entry=>{const card=entry.querySelector('foreignObject:not(.layer-kind-toggle-host)');if(card)levelCenters.push((Number(card.getAttribute('y'))||0)+(Number(card.getAttribute('height'))||66)/2);});levelCenters.push(childTop+layerHeight(child)/2);}worldHeight=Math.max(height,childTop+layerHeight(child)+96);}else worldHeight=Math.max(height,y+96);
    if(typeof applyCamera==='function')applyCamera(false);
  }
  const baseRender=render;render=function(...args){const result=baseRender(...args);arrange();return result;};requestAnimationFrame(arrange);
})();