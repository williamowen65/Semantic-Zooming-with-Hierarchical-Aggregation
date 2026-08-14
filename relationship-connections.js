// Prototype first-class cross-branch relationships. Relationship content is stored
// once, while lightweight appearances let the current single-parent hierarchy show
// the same connection from more than one branch.
(() => {
  if (typeof render !== 'function' || !window.__atlasLayerKinds) return;

  const state = window.__atlasLayerKinds;
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const plural = (count, singular, pluralForm = `${singular}s`) => `${count} ${count === 1 ? singular : pluralForm}`;
  const isRelationshipContent = node => !!(node && node.relationshipId && node.sourceId && node.targetId && node.relationshipLabel);

  function endpointTitle(node, side) {
    const id = side === 'source' ? node?.sourceId : node?.targetId;
    const fallback = side === 'source' ? node?.sourceLabel : node?.targetLabel;
    return nodeById.get(id)?.name || fallback || 'Related topic';
  }

  function optionsFor(node, counts) {
    const kind = state.semanticKind(node);
    if (kind === 'solution') return [['challenge',plural(counts.challenges,'challenge')],['implementation',plural(counts.implementations,'implementation')],['yay',plural(counts.yays,'yay')],['nay',plural(counts.nays,'nay')],['connection',plural(counts.connections,'connection')]];
    return [['issue',plural(counts.issues,'sub-issue','sub-issues')],['solution',plural(counts.solutions,'solution')],['connection',plural(counts.connections,'connection')]];
  }

  function upgradeConnectionToggles() {
    [...document.querySelectorAll('#viz .layer-context-entry')].forEach((entry,index) => {
      const node=focusPath?.[index]?nodeById.get(focusPath[index]):null;
      const host=entry.querySelector('foreignObject.layer-kind-toggle-host');
      if(!node||!host)return;
      const counts=state.kindCounts(node); if(!counts.connections)return;
      const mode=window.atlasLayerKindModeFor?.(node.id)||state.availableMode(node);
      const options=optionsFor(node,counts);
      const cardFo=entry.querySelector('foreignObject:not(.layer-kind-toggle-host)');
      const cardX=Number(cardFo?.getAttribute('x'))||0;
      const cardW=Number(cardFo?.getAttribute('width'))||Math.max(300,window.innerWidth-28);
      const visibleWidth=Math.min(cardW,window.innerWidth<720?Math.max(250,window.innerWidth-32):460);
      host.setAttribute('width',visibleWidth); host.setAttribute('x',cardX+(cardW-visibleWidth)/2); host.style.overflow='hidden';
      host.innerHTML=`<div xmlns="http://www.w3.org/1999/xhtml" class="relationship-toggle-scroll"><div class="layer-kind-toggle relationship-aware-toggle" role="group" aria-label="Show child content by relationship to this node">${options.map(([kind,label])=>`<button type="button" class="${mode===kind?'is-active':''}" ${state.countForMode(counts,kind)?'':'disabled'} data-parent-id="${esc(node.id)}" data-kind="${kind}">${esc(label)}</button>`).join('')}</div></div>`;
      const scroller=host.querySelector('.relationship-toggle-scroll'),active=host.querySelector('button.is-active');
      if(scroller&&active)requestAnimationFrame(()=>active.scrollIntoView({block:'nearest',inline:'center',behavior:'auto'}));
    });
  }

  function relationshipBounds(poly){if(!Array.isArray(poly)||!poly.length)return null;let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;poly.forEach(p=>{minX=Math.min(minX,p[0]);minY=Math.min(minY,p[1]);maxX=Math.max(maxX,p[0]);maxY=Math.max(maxY,p[1]);});return{x:minX,y:minY,w:maxX-minX,h:maxY-minY};}

  function decorateRelationshipNodeLabels(){
    d3.selectAll('#viz g.cell').each(function(d){
      const item=d?.data?.item;if(!isRelationshipContent(item))return;
      const cell=d3.select(this);cell.select('text.cell-label').style('display','none');cell.selectAll('foreignObject.relationship-node-label-host').remove();
      const bounds=relationshipBounds(d.polygon);if(!bounds||bounds.w<70||bounds.h<70)return;
      const padX=Math.max(10,Math.min(28,bounds.w*.07)),padY=Math.max(10,Math.min(28,bounds.h*.07));
      const w=Math.max(40,bounds.w-padX*2),h=Math.max(40,bounds.h-padY*2);
      const meta=typeof metadataLines==='function'?metadataLines(item):[];
      const sourceTitle=endpointTitle(item,'source'),targetTitle=endpointTitle(item,'target');
      cell.append('foreignObject').attr('class','relationship-node-label-host').attr('x',bounds.x+padX).attr('y',bounds.y+padY).attr('width',w).attr('height',h)
        .html(`<div xmlns="http://www.w3.org/1999/xhtml" class="relationship-node-label"><div class="relationship-node-title"><span class="relationship-node-endpoint relationship-node-source">${esc(sourceTitle)}</span> <span class="relationship-node-keyword">${esc(item.relationshipLabel||'')}</span> <span class="relationship-node-endpoint relationship-node-target">${esc(targetTitle)}</span></div><div class="relationship-node-meta">${meta.map(line=>`<span>${esc(line)}</span>`).join('')}</div></div>`);
    });
  }

  function otherEndpointFor(node){if(!node)return null;const parent=parentById.get(node.id),parentId=parent?.id;if(parentId===node.sourceId)return{id:node.targetId,label:endpointTitle(node,'target')};if(parentId===node.targetId)return{id:node.sourceId,label:endpointTitle(node,'source')};const source=nodeById.get(node.sourceId),target=nodeById.get(node.targetId);if(source&&!target)return{id:node.sourceId,label:endpointTitle(node,'source')};if(target&&!source)return{id:node.targetId,label:endpointTitle(node,'target')};return target?{id:node.targetId,label:endpointTitle(node,'target')}:(source?{id:node.sourceId,label:endpointTitle(node,'source')}:null);}
  function relationshipAppearanceUnder(parent,relationshipId){return(parent?.children||[]).find(child=>(child.relationshipId===relationshipId||child.id===relationshipId||child.id?.startsWith(`${relationshipId}--`)))||null;}
  function selectedRelationshipCard(){const entries=[...document.querySelectorAll('#viz .layer-context-entry')];const entry=entries[focusPath.length-1]||entries[entries.length-1];return entry?.querySelector('.layer-context-card.is-relationship')||entry?.querySelector('.layer-context-card')||null;}
  function selectRelationshipInNewContext(id,message,screenAnchorTop){if(!nodeById.has(id))return;if(window.stopHierarchyMomentum)window.stopHierarchyMomentum();const stageNode=stage?.node?.(),previousVisibility=stageNode?.style?.visibility||'';if(stageNode)stageNode.style.visibility='hidden';try{focusPath=pathForNode(id);render();const card=selectedRelationshipCard();if(card&&Number.isFinite(screenAnchorTop)){const newTop=card.getBoundingClientRect().top,delta=screenAnchorTop-newTop;cameraY=clampCamera(cameraY+delta);applyCamera(false);}}finally{if(stageNode)stageNode.style.visibility=previousVisibility;}if(typeof window.atlasSyncUrlState==='function')window.atlasSyncUrlState();if(message)statusHost.textContent=message;}
  function switchRelationshipContext(node,sourceCard){const destination=otherEndpointFor(node);if(!destination?.id)return;const target=nodeById.get(destination.id);if(!target)return;const relationshipId=node.relationshipId||node.id.split('--from-')[0],relatedAppearance=relationshipAppearanceUnder(target,relationshipId),screenAnchorTop=sourceCard?.getBoundingClientRect().top;if(relatedAppearance)selectRelationshipInNewContext(relatedAppearance.id,`${endpointTitle(node,'source')} ${node.relationshipLabel} ${endpointTitle(node,'target')} selected in the ${target.name} branch.`,screenAnchorTop);else{focusPath=pathForNode(target.id);render();if(typeof window.atlasSyncUrlState==='function')window.atlasSyncUrlState();statusHost.textContent=`Switched context to ${target.name}.`;}}

  function renderRelationshipCards(){
    [...document.querySelectorAll('#viz .layer-context-entry')].forEach((entry,index)=>{
      const node=focusPath?.[index]?nodeById.get(focusPath[index]):null;if(!isRelationshipContent(node))return;
      const card=entry.querySelector('.layer-context-card'),kindEl=entry.querySelector('.layer-context-kind'),nameEl=entry.querySelector('.layer-context-name');
      const semanticKind=state.semanticKind(node);
      if(kindEl)kindEl.textContent=semanticKind==='implementation'?'Implementation':'Related Topic';
      if(card){card.classList.remove('is-issue','is-solution','is-challenge');if(semanticKind!=='implementation')card.classList.remove('is-implementation');card.classList.add('is-relationship');}
      if(nameEl){const sourceTitle=endpointTitle(node,'source'),targetTitle=endpointTitle(node,'target');nameEl.classList.add('relationship-title');nameEl.innerHTML=`<span class="relationship-endpoint">${esc(sourceTitle)}</span> <span class="relationship-vocabulary">${esc(node.relationshipLabel)}</span> <span class="relationship-endpoint">${esc(targetTitle)}</span>`;}
      const destination=otherEndpointFor(node);if(card&&destination?.id&&nodeById.has(destination.id)&&!card.querySelector('.relationship-context-switch')){const button=document.createElement('button');button.type='button';button.className='relationship-context-switch';button.innerHTML='<span>View related branch</span><span aria-hidden="true">↗</span>';button.setAttribute('aria-label',`Switch context to ${destination.label} and keep this related item selected`);button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();switchRelationshipContext(node,card);});card.appendChild(button);}
    });
  }

  function sync(){upgradeConnectionToggles();decorateRelationshipNodeLabels();renderRelationshipCards();}
  const baseRender=render;render=function(...args){const result=baseRender(...args);sync();return result;};
  const style=document.createElement('style');style.textContent=`
    .relationship-toggle-scroll{width:100%;height:24px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-ms-overflow-style:none;overscroll-behavior-x:contain;touch-action:pan-x;border-radius:999px}
    .relationship-toggle-scroll::-webkit-scrollbar{display:none}.relationship-aware-toggle{display:flex!important;width:100%!important;min-width:max-content!important;grid-template-columns:none!important;padding:2px!important;box-sizing:border-box!important}.relationship-aware-toggle button{flex:1 0 max-content!important;min-width:max-content!important;padding-left:11px!important;padding-right:11px!important;font-size:9.5px!important;white-space:nowrap!important}
    .relationship-node-label-host{overflow:visible;pointer-events:none}.relationship-node-label{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.08;padding:4px}.relationship-node-title{display:block;max-width:100%;font-size:clamp(13px,3.5vw,28px);font-weight:760;line-height:1.14;text-align:center;overflow-wrap:anywhere}.relationship-node-endpoint{display:inline;font:inherit}.relationship-node-keyword{display:inline-block;margin:0 .16em;padding:.12em .42em;border:2px solid currentColor;border-radius:999px;background:rgba(255,255,255,.34);font-size:.68em;font-weight:800;line-height:1.18;white-space:nowrap;vertical-align:.08em}.relationship-node-meta{display:flex;flex-direction:column;gap:2px;margin-top:9px;font-size:clamp(9px,1.65vw,14px);font-weight:650;opacity:.72;line-height:1.15}
    body.theme-bold-contrast .relationship-node-label,body.theme-vibrant-distinct .relationship-node-label,body.theme-soft-refined .relationship-node-label{color:#fff;text-shadow:0 1px 1px rgba(0,0,0,.22)}body.theme-bold-contrast .relationship-node-keyword,body.theme-vibrant-distinct .relationship-node-keyword,body.theme-soft-refined .relationship-node-keyword{background:rgba(20,30,40,.22)}.cell.is-faded .relationship-node-label{opacity:.68}.cell.is-selected .relationship-node-label{opacity:1}
    .layer-context-card.is-relationship{position:relative;padding-right:150px!important;pointer-events:auto}.layer-context-card.is-relationship .layer-context-kind{letter-spacing:.08em}.relationship-title{display:inline!important;line-height:1.45!important}.relationship-title .relationship-endpoint{display:inline}.relationship-title .relationship-vocabulary{display:inline-block;padding:1px 7px;margin:0 3px;border:1px solid currentColor;border-radius:999px;font-size:.82em;font-weight:750;line-height:1.35;white-space:nowrap;vertical-align:.05em}.relationship-context-switch{position:absolute;right:12px;top:50%;transform:translateY(-50%);display:inline-flex;align-items:center;gap:7px;border:1px solid rgba(27,43,61,.18);border-radius:999px;background:rgba(255,255,255,.94);color:var(--ink);padding:7px 10px;font:750 10px/1 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer;white-space:nowrap;box-shadow:0 2px 8px rgba(20,30,40,.08);touch-action:manipulation}.relationship-context-switch:active{transform:translateY(-50%) scale(.98)}@media(max-width:720px){.layer-context-card.is-relationship{padding-right:10px!important;padding-bottom:43px!important}.relationship-context-switch{top:auto;bottom:9px;right:10px;transform:none;padding:7px 10px}.relationship-context-switch:active{transform:scale(.98)}}`;
  document.head.appendChild(style);sync();
})();