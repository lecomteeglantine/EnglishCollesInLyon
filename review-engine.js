(function(){
  'use strict';
  if(window.ECLReview)return;
  const KEY='ecl_spaced_review_v1';
  const VERSION=1;
  const DAY=86400000;
  const MINUTE=60000;
  const now=()=>Date.now();
  const safeParse=(raw,fallback)=>{try{return JSON.parse(raw)}catch(_){return fallback}};
  const slug=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90);
  const hash=value=>{let h=2166136261;for(const ch of String(value||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
  function empty(){return {version:VERSION,items:{},meta:{createdAt:new Date().toISOString(),lastSyncAt:null}}}
  function load(){
    let raw='';try{raw=localStorage.getItem(KEY)||''}catch(_){}
    const data=safeParse(raw,null);
    if(!data||typeof data!=='object')return empty();
    if(!data.items||typeof data.items!=='object')data.items={};
    if(!data.meta||typeof data.meta!=='object')data.meta={};
    data.version=VERSION;return data;
  }
  let db=load();
  function persist(reason){
    db.meta.updatedAt=new Date().toISOString();
    try{localStorage.setItem(KEY,JSON.stringify(db))}catch(_){}
    window.dispatchEvent(new CustomEvent('eclreview:change',{detail:{reason:reason||'update',stats:stats()}}));
  }
  function cleanText(value,limit){const text=String(value||'').replace(/\s+/g,' ').trim();return limit&&text.length>limit?text.slice(0,limit-1).trim()+'…':text}
  function normaliseItem(input){
    const type=cleanText(input.type||'general',30).toLowerCase();
    const title=cleanText(input.title||input.prompt||'Review item',180);
    const id=cleanText(input.id||`${type}:${slug(title)}`,180);
    const date=new Date().toISOString();
    return {
      id,type,title,
      prompt:cleanText(input.prompt||title,900),
      answer:cleanText(input.answer||input.description||'',1800),
      context:cleanText(input.context||'',220),
      url:cleanText(input.url||'',300),
      target:cleanText(input.target||'',180),
      source:cleanText(input.source||'',80),
      tags:Array.isArray(input.tags)?input.tags.map(x=>cleanText(x,50)).filter(Boolean).slice(0,12):[],
      createdAt:input.createdAt||date,updatedAt:date,
      dueAt:input.dueAt||date,
      intervalDays:Number.isFinite(+input.intervalDays)?+input.intervalDays:0,
      ease:Number.isFinite(+input.ease)?+input.ease:2.3,
      repetitions:Number.isFinite(+input.repetitions)?+input.repetitions:0,
      lapses:Number.isFinite(+input.lapses)?+input.lapses:0,
      lastGrade:input.lastGrade||'',lastReviewedAt:input.lastReviewedAt||null,
      masteredAt:input.masteredAt||null,suspended:!!input.suspended,
      origin:input.origin||'manual'
    };
  }
  function add(input,options){
    if(!input)return null;
    const item=normaliseItem(input),existing=db.items[item.id];
    if(existing){
      const keep=['createdAt','dueAt','intervalDays','ease','repetitions','lapses','lastGrade','lastReviewedAt','masteredAt','suspended'];
      keep.forEach(k=>{if(existing[k]!==undefined)item[k]=existing[k]});
      if(options&&options.dueNow&&!existing.lastReviewedAt)item.dueAt=new Date().toISOString();
      db.items[item.id]={...existing,...item,updatedAt:new Date().toISOString()};
    }else{
      if(options&&options.delayDays){item.dueAt=new Date(now()+options.delayDays*DAY).toISOString()}
      if(options&&options.dueNow)item.dueAt=new Date().toISOString();
      db.items[item.id]=item;
    }
    if(!options||options.persist!==false)persist('add');
    return db.items[item.id];
  }
  function remove(id){if(db.items[id]){delete db.items[id];persist('remove');return true}return false}
  function suspend(id,on=true){if(!db.items[id])return false;db.items[id].suspended=!!on;db.items[id].updatedAt=new Date().toISOString();persist('suspend');return true}
  function grade(id,value){
    const item=db.items[id];if(!item)return null;
    const t=now();let days=0;
    if(value==='again'){
      item.lapses=(item.lapses||0)+1;item.repetitions=0;item.ease=Math.max(1.35,(item.ease||2.3)-.2);days=10*MINUTE/DAY;
    }else if(value==='difficult'){
      item.repetitions=(item.repetitions||0)+1;item.ease=Math.max(1.35,(item.ease||2.3)-.1);days=item.intervalDays?Math.max(1,Math.round(item.intervalDays*1.3)):1;
    }else if(value==='almost'){
      item.repetitions=(item.repetitions||0)+1;days=item.intervalDays?Math.max(2,Math.round(item.intervalDays*(item.ease||2.3))):2;
    }else if(value==='mastered'){
      item.repetitions=(item.repetitions||0)+1;item.ease=Math.min(3.4,(item.ease||2.3)+.08);days=item.intervalDays?Math.max(5,Math.round(item.intervalDays*((item.ease||2.3)+.7))):5;item.masteredAt=new Date(t).toISOString();
    }else return null;
    item.intervalDays=days;item.lastGrade=value;item.lastReviewedAt=new Date(t).toISOString();item.dueAt=new Date(t+days*DAY).toISOString();item.updatedAt=item.lastReviewedAt;
    persist('grade');return item;
  }
  function all(){return Object.values(db.items).filter(Boolean)}
  function isDue(item,at=now()){return !item.suspended&&new Date(item.dueAt||0).getTime()<=at}
  function stats(at=now()){
    const items=all(),active=items.filter(x=>!x.suspended),due=active.filter(x=>isDue(x,at));
    const difficult=active.filter(x=>['again','difficult'].includes(x.lastGrade)||((x.lapses||0)>1&&x.lastGrade!=='mastered'));
    const mastered=active.filter(x=>x.masteredAt&&at-new Date(x.masteredAt).getTime()<=30*DAY);
    const future=active.filter(x=>!isDue(x,at)).sort((a,b)=>new Date(a.dueAt)-new Date(b.dueAt));
    return {total:active.length,due:due.length,difficult:difficult.length,mastered:mastered.length,suspended:items.length-active.length,nextDue:future[0]?.dueAt||null,byType:active.reduce((m,x)=>(m[x.type]=(m[x.type]||0)+1,m),{})};
  }
  function dueItems(options){
    const opts=options||{},at=opts.at?new Date(opts.at).getTime():now();
    let items=all().filter(x=>!x.suspended&&isDue(x,at));
    if(opts.types&&opts.types.length)items=items.filter(x=>opts.types.includes(x.type));
    if(opts.difficult)items=items.filter(x=>['again','difficult'].includes(x.lastGrade)||(x.lapses||0)>0);
    items.sort((a,b)=>{
      const ad=new Date(a.dueAt).getTime(),bd=new Date(b.dueAt).getTime();
      const ap=['again','difficult'].includes(a.lastGrade)?0:1,bp=['again','difficult'].includes(b.lastGrade)?0:1;
      return ap-bp||ad-bd||(b.lapses||0)-(a.lapses||0)||a.title.localeCompare(b.title);
    });
    return Number.isFinite(+opts.limit)?items.slice(0,+opts.limit):items;
  }
  async function fetchJSON(url){const r=await fetch(url,{cache:'no-cache'});if(!r.ok)throw new Error(url+' unavailable');return r.json()}
  async function syncVocabulary(){
    let savedRaw='[]',mistakesRaw='[]';try{savedRaw=localStorage.getItem('ecl_vocab_saved')||'[]';mistakesRaw=localStorage.getItem('ecl_vocab_mistakes')||'[]'}catch(_){}
    const saved=safeParse(savedRaw,[]),mistakes=safeParse(mistakesRaw,[]);
    const wanted=new Set([...(Array.isArray(saved)?saved:[]),...(Array.isArray(mistakes)?mistakes:[])]);if(!wanted.size)return {added:0};
    const data=await fetchJSON('review-vocabulary-index.json');let added=0;
    const mistakesSet=new Set(Array.isArray(mistakes)?mistakes:[]);
    for(const row of data.entries||[]){
      const key=row[0],term=row[1],fr=row[2],def=row[3],example=row[4],file=row[5],chapter=row[6];if(!wanted.has(key))continue;
      const id='vocab:'+key,isMistake=mistakesSet.has(key),previous=db.items[id];
      if(!previous)added++;
      const item=add({id,type:'vocabulary',title:term,prompt:`Recall and use “${term}”.`,answer:[fr,def,example?`Example: ${example}`:''].filter(Boolean).join(' — '),context:chapter,url:file,target:term,source:'Vocabulary',origin:isMistake?'mistake':'saved'},
        {persist:false,delayDays:isMistake?0:(hash(key)%8)});
      if(isMistake&&(!previous||previous.origin!=='mistake'))item.dueAt=new Date().toISOString();
    }
    return {added};
  }
  async function syncGrammar(){
    let progressRaw='{}';try{progressRaw=localStorage.getItem('eclGrammarProgressV1')||'{}'}catch(_){}
    const progress=safeParse(progressRaw,{});const ids=Object.keys(progress).filter(k=>progress[k]==='revise');if(!ids.length)return {added:0};
    const data=await fetchJSON('review-grammar-index.json');let added=0;
    for(const chapter of data.chapters||[]){if(!ids.includes(String(chapter.n)))continue;const id='grammar:'+chapter.n;if(!db.items[id])added++;
      const q=chapter.question,choices=q&&Array.isArray(q.options)?q.options:[];
      const prompt=q?[q.q,...choices.map((option,index)=>`${String.fromCharCode(65+index)}. ${option}`)].join('\n'):`Explain the key rule in “${chapter.title}”, then produce one sentence you could use in a colle.`;
      const correct=q&&choices[q.answer]!==undefined?choices[q.answer]:'';
      add({id,type:'grammar',title:chapter.title,prompt,answer:q?`${correct}${q.explain?` — ${q.explain}`:''}`:(chapter.desc||'Open the chapter, retrieve the rule without notes, then use it aloud.'),context:`Grammar · Chapter ${chapter.n}`,url:chapter.file,target:chapter.title,source:'Grammar',origin:'needs-revision'}, {persist:false,dueNow:true});
    }
    return {added};
  }
  async function syncSources(){
    let added=0,errors=[];
    try{added+=(await syncVocabulary()).added}catch(e){errors.push('vocabulary')}
    try{added+=(await syncGrammar()).added}catch(e){errors.push('grammar')}
    db.meta.lastSyncAt=new Date().toISOString();db.meta.lastSyncErrors=errors;persist('sync');return {added,errors,stats:stats()};
  }
  function makeUrl(item){
    if(!item.url)return'';try{const u=new URL(item.url,location.href);if(item.target)u.searchParams.set('eclFind',item.target);return u.pathname.split('/').pop()+u.search+u.hash}catch(_){return item.url}
  }
  function addFromElement(kind,element){
    if(kind==='timeline'){
      const event=element.closest('.event'),title=element.querySelector('.event-main h3')?.textContent,date=event?.querySelector('.date')?.textContent,summary=element.querySelector('.summary')?.textContent;
      const paragraphs=[...element.querySelectorAll('.details-grid p')].map(x=>x.textContent.trim());const colle=element.querySelector('.colle')?.textContent.replace(/^Colle angle:\s*/i,'').trim();const country=document.querySelector('#country')?.value||'country';
      return add({id:`timeline:${country}:${slug(date+'-'+title)}`,type:'timeline',title:`${date} — ${title}`,prompt:`What happened in ${date}, and why does “${title}” still matter?`,answer:[summary,...paragraphs,colle?`Colle angle: ${colle}`:''].filter(Boolean).join(' '),context:`Timeline · ${document.querySelector('#tlName')?.textContent||country}`,url:`timelines.html?country=${country}`,target:title,source:'Timelines'});
    }
    if(kind==='pronunciation'){
      const title=element.querySelector('h3')?.textContent||'Pronunciation lesson',focus=element.querySelector('.focus')?.textContent||'',goal=element.querySelector('.goal')?.textContent||'',phrase=element.querySelector('[data-say]')?.dataset.say||element.querySelector('.speak-chip')?.textContent||'';
      const module=element.dataset.module||slug(title);return add({id:`pronunciation:${module}`,type:'pronunciation',title,prompt:phrase?`Say this phrase clearly, then explain the lesson focus: “${phrase}”`:`Demonstrate the pronunciation skill: ${title}.`,answer:[focus,goal,phrase?`Practice phrase: ${phrase}`:''].filter(Boolean).join(' '),context:'Pronunciation',url:'pronunciation.html',target:title,source:'Pronunciation'});
    }
    if(kind==='jury'){
      const warning=element.querySelector('h3')?.textContent||'Examiner warning',link=element.querySelector('a'),work=link?.textContent.replace(/→/g,'').trim()||'Turn this warning into deliberate practice.';
      return add({id:`jury:${slug(warning)}`,type:'jury',title:warning,prompt:`What practical change should you make when examiners warn: “${warning}”?`,answer:work,context:'Jury Reports',url:link?.getAttribute('href')||'jury-reports.html',target:warning,source:'Jury Reports'});
    }
    if(kind==='atlas'){
      const card=element.closest('[data-card-id]')||element.closest('.knowledge-card,.timeline-item');if(!card)return null;const title=card.querySelector('h3')?.textContent||card.querySelector('h4')?.textContent||'Civilisation fact';const date=card.querySelector('.timeline-date,.date-badge')?.textContent||'';const summary=card.querySelector('.card-summary,.timeline-content>p,.revision-item p')?.textContent||'';const detail=[...card.querySelectorAll('.detail-line p,.colle-line')].map(x=>x.textContent.trim()).join(' ');const country=(document.querySelector('main h1')?.textContent||document.title).replace(/—.*/,'').trim();const cid=card.dataset.cardId||slug(title);
      return add({id:`civilisation:${slug(country)}:${cid}`,type:'civilisation',title:date?`${date} — ${title}`:title,prompt:`Explain “${title}” and connect it to a wider debate in ${country}.`,answer:[summary,detail].filter(Boolean).join(' '),context:`Civilisation · ${country}`,url:location.pathname.split('/').pop(),target:title,source:'Civilisation atlas'});
    }
    return null;
  }
  function button(label){const b=document.createElement('button');b.type='button';b.className='ecl-review-add';b.textContent=label||'Add to spaced review';return b}
  function enhanceTimeline(root=document){root.querySelectorAll('.event-card:not([data-ecl-review])').forEach(card=>{card.dataset.eclReview='1';const host=card.querySelector('.golinks')||card.querySelector('.details');if(!host)return;const b=button('＋ Add to spaced review');b.addEventListener('click',()=>{addFromElement('timeline',card);b.textContent='✓ Added to review';b.classList.add('added')});host.appendChild(b)})}
  function enhancePronunciation(root=document){root.querySelectorAll('.lesson-card[data-module]:not([data-ecl-review])').forEach(card=>{card.dataset.eclReview='1';const host=card.querySelector('.lesson-copy')||card;const b=button('＋ Review this skill later');b.addEventListener('click',()=>{addFromElement('pronunciation',card);b.textContent='✓ Added to review';b.classList.add('added')});host.appendChild(b)})}
  function enhanceJury(root=document){root.querySelectorAll('.action-card:not([data-ecl-review])').forEach(card=>{card.dataset.eclReview='1';const b=button('＋ Add this warning to review');b.addEventListener('click',()=>{addFromElement('jury',card);b.textContent='✓ Added to review';b.classList.add('added')});card.appendChild(b)})}
  function enhanceAtlas(root=document){root.querySelectorAll('.save-btn:not([data-ecl-review-hook])').forEach(b=>{b.dataset.eclReviewHook='1';b.addEventListener('click',()=>setTimeout(()=>{if(b.classList.contains('saved'))addFromElement('atlas',b)},80));if(b.classList.contains('saved'))addFromElement('atlas',b)})}
  const pageName=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const enhancer=pageName==='timelines.html'?enhanceTimeline:
    pageName==='pronunciation.html'?enhancePronunciation:
    pageName==='jury-reports.html'?enhanceJury:
    pageName.startsWith('colle-atlas-')?enhanceAtlas:null;
  function enhanceDocument(){if(enhancer)enhancer()}
  let mo=null;function startEnhancers(){
    if(!enhancer)return;
    enhanceDocument();
    mo=new MutationObserver(()=>enhanceDocument());
    mo.observe(document.body,{childList:true,subtree:true});
  }
  window.ECLReview={KEY,load:()=>db,all,add,remove,suspend,grade,stats,dueItems,isDue,syncSources,makeUrl,enhanceDocument,reload:()=>{db=load();return db}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startEnhancers,{once:true});else startEnhancers();
})();
