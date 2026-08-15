(() => {
  function hashSeed(text){let h=2166136261;for(const ch of String(text)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return (h>>>0)/4294967296;}
  function polygonPath(poly){return `M${poly.map(p=>p.join(',')).join('L')}Z`;}
  function fitLabel(text,maxChars=30){const words=String(text).split(/\s+/),lines=[];let line='';for(const word of words){const candidate=line?`${line} ${word}`:word;if(candidate.length<=maxChars||!line)line=candidate;else{lines.push(line);line=word;}}if(line)lines.push(line);return lines.slice(0,4);}
  function css(name){return getComputedStyle(document.body).getPropertyValue(name).trim();}

  window.renderAtlasDiagram = function(container, items, options={}) {
    container.replaceChildren();
    if (!items.length) {
      const empty=document.createElement('div');empty.className='empty-layer';empty.textContent=options.emptyText||'No responses have been added in this category yet.';container.append(empty);return;
    }

    const width=Math.max(320,container.clientWidth||window.innerWidth||900),height=Math.max(300,Math.min(560,width*.48));
    const svg=d3.select(container).append('svg').attr('class','diagram').attr('viewBox',`0 0 ${width} ${height}`).attr('role','group');
    const defs=svg.append('defs');
    const gradients=[[css('--diagram-1a'),css('--diagram-1b')],[css('--diagram-2a'),css('--diagram-2b')],[css('--diagram-3a'),css('--diagram-3b')],[css('--diagram-4a'),css('--diagram-4b')]];
    gradients.forEach((pair,index)=>{const g=defs.append('linearGradient').attr('id',`atlas-gradient-${index}`).attr('x1',index%2?'0%':'12%').attr('y1','0%').attr('x2',index%2?'100%':'88%').attr('y2','100%');g.append('stop').attr('offset','0%').attr('stop-color',pair[0]);g.append('stop').attr('offset','100%').attr('stop-color',pair[1]);});

    const proxies=items.map(item=>({id:item.id,item,weight:Math.max(1,Number(item.weight)||1)}));
    const root=d3.hierarchy({children:proxies}).sum(d=>d.weight||0);
    d3.voronoiTreemap().clip([[0,0],[width,0],[width,height],[0,height]]).prng(d3.randomLcg(hashSeed(items.map(x=>x.id).join('|'))||.42))(root);

    const cells=svg.selectAll('g.cell').data(root.leaves(),d=>d.data.id).join('g').attr('class','cell').attr('tabindex',0).attr('role','button').attr('aria-label',d=>`${d.data.item.type}: ${d.data.item.title}`)
      .on('click',(event,d)=>options.onSelect?.(d.data.item)).on('keydown',(event,d)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();options.onSelect?.(d.data.item);}});

    cells.append('path').attr('d',d=>polygonPath(d.polygon)).attr('fill',(d,i)=>`url(#atlas-gradient-${i%gradients.length})`);
    cells.each(function(d){const [cx,cy]=d3.polygonCentroid(d.polygon),area=Math.abs(d3.polygonArea(d.polygon)),font=Math.max(10,Math.min(18,Math.sqrt(area)/10));const lines=fitLabel(d.data.item.title,Math.max(16,Math.round(Math.sqrt(area)/5.5)));const text=d3.select(this).append('text').attr('x',cx).attr('y',cy-(lines.length-1)*font*.55).attr('text-anchor','middle').style('font-size',`${font}px`);lines.forEach((line,i)=>text.append('tspan').attr('x',cx).attr('dy',i===0?0:font*1.1).text(line));text.append('tspan').attr('class','small').attr('x',cx).attr('dy',font*1.35).style('font-size',`${Math.max(9,font*.72)}px`).text(d.data.item.type);});
  };
})();
