(() => {
  const data=window.ATLAS_DATA;
  const app=document.querySelector('#app'),breadcrumbs=document.querySelector('#breadcrumbs'),reset=document.querySelector('#reset');
  const nodes=new Map(data.nodes.map(node=>[node.id,node]));
  const childrenByParent=new Map();
  for(const edge of data.hierarchy){if(!childrenByParent.has(edge.parentId))childrenByParent.set(edge.parentId,[]);childrenByParent.get(edge.parentId).push(edge.childId);}
  const linksByNode=new Map();
  for(const rel of data.relationships){for(const id of [rel.from,rel.to]){if(!linksByNode.has(id))linksByNode.set(id,[]);linksByNode.get(id).push(rel);}}

  let path=[];
  const activeType=new Map();
  const collapsedLayers=new Set();

  function requested(node){return Array.isArray(node?.requestedChildTypes)?node.requestedChildTypes:[];}
  function children(node){return (childrenByParent.get(node.id)||[]).map(id=>nodes.get(id)).filter(Boolean);}
  function countType(node,type){return children(node).filter(child=>child.type===type).length;}
  function allowed(node,child){return requested(node).some(option=>option.type===child.type);}
  function validate(){const errors=[];for(const edge of data.hierarchy){const p=nodes.get(edge.parentId),c=nodes.get(edge.childId);if(!p||!c){errors.push(`Missing node for ${edge.parentId} -> ${edge.childId}`);continue;}if(!allowed(p,c))errors.push(`${c.id} (${c.type}) is not requested by ${p.id}`);}if(errors.length)console.warn('Atlas data validation',errors);}

  function effectiveType(node){const options=requested(node);if(!options.length)return null;const saved=activeType.get(node.id);if(saved&&options.some(o=>o.type===saved))return saved;const populated=options.find(o=>countType(node,o.type)>0);return (populated||options[0]).type;}

  function renderBreadcrumbs(){breadcrumbs.replaceChildren();const rootBtn=document.createElement('button');rootBtn.textContent='All roots';rootBtn.onclick=()=>{path=[];render();window.scrollTo({top:0,behavior:'auto'});};breadcrumbs.append(rootBtn);path.forEach((id,index)=>{const sep=document.createElement('span');sep.className='sep';sep.textContent='›';breadcrumbs.append(sep);const btn=document.createElement('button');btn.textContent=nodes.get(id)?.title||id;btn.setAttribute('aria-current',index===path.length-1?'page':'false');btn.onclick=()=>{path=path.slice(0,index+1);render();document.querySelector(`[data-card-id="${CSS.escape(id)}"]`)?.scrollIntoView({block:'center',behavior:'smooth'});};breadcrumbs.append(btn);});}

  function typeBadge(type){const span=document.createElement('span');span.className='type-badge';span.textContent=type;return span;}
  function makeCard(node,{root=false,collapsible=false}={}){
    const card=document.createElement('article');
    card.className=root?'root-card':'node-card';
    card.dataset.cardId=node.id;
    const layerKey=root?'__roots':node.id;
    if(collapsible){
      card.classList.add('layer-toggle-card');
      const collapsed=collapsedLayers.has(layerKey);
      card.classList.toggle('is-collapsed',collapsed);
      card.setAttribute('role','button');
      card.setAttribute('tabindex','0');
      card.setAttribute('aria-expanded',String(!collapsed));
      const toggle=()=>{collapsedLayers.has(layerKey)?collapsedLayers.delete(layerKey):collapsedLayers.add(layerKey);render();requestAnimationFrame(()=>document.querySelector(`[data-card-id="${CSS.escape(node.id)}"]`)?.scrollIntoView({block:'nearest',behavior:'auto'}));};
      card.addEventListener('click',event=>{if(event.target.closest('button,a'))return;toggle();});
      card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();toggle();}});
    }
    const head=document.createElement('div');head.className='node-head';head.append(typeBadge(node.type));const title=document.createElement('h2');title.textContent=node.title;head.append(title);
    if(collapsible){const indicator=document.createElement('span');indicator.className='collapse-indicator';indicator.setAttribute('aria-hidden','true');indicator.textContent=collapsedLayers.has(layerKey)?'▸':'▾';head.append(indicator);}
    card.append(head);const desc=document.createElement('p');desc.className='description';desc.textContent=node.description||'';card.append(desc);const meta=document.createElement('div');meta.className='meta';meta.textContent=`${children(node).length} direct responses · requests ${requested(node).length} response type${requested(node).length===1?'':'s'}`;card.append(meta);const related=linksByNode.get(node.id)||[];if(related.length){const wrap=document.createElement('div');wrap.className='crosslinks';for(const rel of related){const otherId=rel.from===node.id?rel.to:rel.from,other=nodes.get(otherId);if(!other)continue;const button=document.createElement('button');const label=rel.from===node.id?rel.label:`Related via ${rel.label.toLowerCase()}`;button.innerHTML=`<strong>${escapeHtml(label)}</strong> ${escapeHtml(other.title)}`;button.onclick=()=>navigateTo(other.id);wrap.append(button);}card.append(wrap);}return card;
  }

  function makeResponseBar(node){const bar=document.createElement('div');bar.className='response-bar';const selected=effectiveType(node);for(const option of requested(node)){const count=countType(node,option.type),button=document.createElement('button');button.type='button';button.dataset.type=option.type;button.classList.toggle('active',selected===option.type);button.classList.toggle('empty',count===0);button.textContent=`${count} ${option.label}`;button.onclick=()=>{activeType.set(node.id,option.type);const currentIndex=path.indexOf(node.id);if(currentIndex>=0)path=path.slice(0,currentIndex+1);render();document.querySelector(`[data-card-id="${CSS.escape(node.id)}"]`)?.scrollIntoView({block:'center',behavior:'auto'});};bar.append(button);}return bar;}

  function layerFor(node,{root=false}={}){const layer=document.createElement('section');layer.className='layer';const heading=document.createElement('div');heading.className='layer-heading';const left=document.createElement('span');let items=[];if(root){items=data.rootIds.map(id=>nodes.get(id)).filter(Boolean);left.textContent='Root nodes · all types shown together';}else{const type=effectiveType(node);items=children(node).filter(child=>child.type===type);const option=requested(node).find(o=>o.type===type);left.textContent=option?option.label:type||'Responses';}const right=document.createElement('span');right.textContent=`${items.length} node${items.length===1?'':'s'}`;heading.append(left,right);layer.append(heading);const visual=document.createElement('div');layer.append(visual);requestAnimationFrame(()=>window.renderAtlasDiagram(visual,items,{emptyText:'Nothing has been added here yet. The category remains visible because this node is asking for this kind of response.',onSelect:item=>selectChild(node?.id,item.id,root)}));return layer;}

  function selectChild(parentId,childId,root){if(root){path=[childId];}else{const parentIndex=path.indexOf(parentId);path=(parentIndex>=0?path.slice(0,parentIndex+1):[]).concat(childId);}render();requestAnimationFrame(()=>document.querySelector(`[data-card-id="${CSS.escape(childId)}"]`)?.scrollIntoView({block:'center',behavior:'smooth'}));}

  function findPath(targetId){if(data.rootIds.includes(targetId))return [targetId];const queue=data.rootIds.map(id=>[id]);const seen=new Set();while(queue.length){const current=queue.shift(),id=current[current.length-1];if(seen.has(id))continue;seen.add(id);for(const childId of childrenByParent.get(id)||[]){const next=[...current,childId];if(childId===targetId)return next;queue.push(next);}}return [targetId];}
  function navigateTo(id){path=findPath(id);render();requestAnimationFrame(()=>document.querySelector(`[data-card-id="${CSS.escape(id)}"]`)?.scrollIntoView({block:'center',behavior:'auto'}));}

  function render(){renderBreadcrumbs();app.replaceChildren();const stack=document.createElement('div');stack.className='stack';const rootSummary={id:'__roots',type:'collection',title:'Root challenges',description:'Starting points can use different types. Root nodes are shown together as an intentional exception to ordinary parent-requested type filtering.',requestedChildTypes:[]};const rootCard=makeCard(rootSummary,{root:true,collapsible:true});rootCard.querySelector('.meta').textContent=`${data.rootIds.length} roots · ${new Set(data.rootIds.map(id=>nodes.get(id)?.type).filter(Boolean)).size} types`;stack.append(rootCard);if(!collapsedLayers.has('__roots'))stack.append(layerFor(null,{root:true}));for(const id of path){const node=nodes.get(id);if(!node)continue;const hasLayer=requested(node).length>0;stack.append(makeCard(node,{collapsible:hasLayer}));if(hasLayer&&!collapsedLayers.has(node.id))stack.append(makeResponseBar(node),layerFor(node));}app.append(stack);}

  function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
  reset.onclick=()=>{path=[];render();window.scrollTo({top:0,behavior:'smooth'});};
  validate();render();
})();