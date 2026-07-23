(function(){
  'use strict';
  if(window.ECLShell) return;
  document.body.classList.add('ecl-shell-installed');

  const SHELL_VERSION='20260723-path-1';
  const STORE={
    get(key,fallback){try{const value=localStorage.getItem(key);return value===null?fallback:value}catch(_){return fallback}},
    set(key,value){try{localStorage.setItem(key,value)}catch(_){} }
  };
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const isLesson=/^cpge_(grammar|vocab)_/.test(path)||path==='flashcards.html';
  const isAtlas=/^colle-atlas-/.test(path);
  const staticShell=isLesson||isAtlas;
  const routes=[
    ['index.html','Home'],['methodology.html','Methodology'],['civilisation.html','Civilisation'],
    ['vocabulary.html','Vocabulary'],['grammar.html','Grammar'],['pronunciation.html','Pronunciation'],
    ['timelines.html','Timelines'],['colle-trainer.html','Colle Trainer'],['resources.html','Resources'],
    ['jury-reports.html','Jury Reports']
  ];
  const activeHref=path.startsWith('cpge_grammar_')?'grammar.html':
    (path.startsWith('cpge_vocab_')||path==='flashcards.html')?'vocabulary.html':
    path.startsWith('colle-atlas-')?'civilisation.html':path;
  const icons={
    search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>',
    progress:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V9M10 19V5M16 19v-8M22 19V2"></path></svg>',
    access:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="4" r="1.5"></circle><path d="M5 8h14M9 8 8 20M15 8l1 12M12 8v6"></path></svg>',
    close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg>',
    arrow:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5"></path></svg>'
  };

  function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function ensureMainTarget(){
    let main=document.querySelector('main');
    if(main&&!main.id) main.id='main';
    if(!main){const candidate=document.querySelector('[role="main"],.main,.page,.container');if(candidate&&!candidate.id)candidate.id='main'}
  }
  function applyPrefs(){
    const size=STORE.get('eclyon_shell_size','0');
    document.documentElement.classList.toggle('ecl-shell-size-1',size==='1');
    document.documentElement.classList.toggle('ecl-shell-size-2',size==='2');
    ['contrast','readable','no-motion','focus'].forEach(name=>{
      document.body.classList.toggle('ecl-shell-'+name,STORE.get('eclyon_shell_'+name,'0')==='1');
    });
  }
  function navMarkup(){return routes.map(([href,label])=>`<a href="${href}" class="${href===activeHref?'active':''}" ${href===activeHref?'aria-current="page"':''}>${escapeHtml(label)}</a>`).join('')}
  function headerMarkup(){
    const progressActive=path==='learning-path.html';
    return `<a class="ecl-shell-skip" href="#main">Skip to content</a>
      <div class="ecl-shell-header ${staticShell?'ecl-shell-static':''}" role="banner" lang="en">
        <div class="ecl-shell-wrap ecl-shell-main">
          <a class="ecl-shell-brand" href="index.html" aria-label="English Colles in Lyon — home">
            <span class="ecl-shell-brand-name">English Colles in Lyon</span>
            <span class="ecl-shell-brand-author">by Eglantine Lecomte</span>
            <span class="ecl-shell-brand-sub">CPGE English · Independent practice · Colles</span>
          </a>
          <div class="ecl-shell-tools">
            <div class="ecl-shell-accent" role="group" aria-label="Choose an English accent">
              ${['UK','US','AU','CA'].map(a=>`<button type="button" data-ecl-shell-accent="${a}" aria-pressed="false">${a}</button>`).join('')}
            </div>
            <button class="ecl-shell-tool ecl-shell-search" id="eclShellSearchOpen" type="button" aria-haspopup="dialog" aria-expanded="false" aria-label="Search the whole site">${icons.search}<span class="ecl-shell-tool-label">Search</span></button>
            <a class="ecl-shell-tool ecl-shell-progress" href="learning-path.html" ${progressActive?'aria-current="page"':''} aria-label="Open My Learning Path">${icons.progress}<span class="ecl-shell-tool-label">My Learning Path</span></a>
            <button class="ecl-shell-tool ecl-shell-access" id="eclShellA11yOpen" type="button" aria-haspopup="dialog" aria-expanded="false">${icons.access}<span class="ecl-shell-tool-label">Accessibility</span></button>
            <button class="ecl-shell-menu-button" id="eclShellMenuButton" type="button" aria-label="Open navigation" aria-expanded="false">☰</button>
          </div>
        </div>
        <div class="ecl-shell-nav-row" id="eclShellNavRow"><nav class="ecl-shell-wrap ecl-shell-nav" aria-label="Main navigation">${navMarkup()}</nav></div>
        <span class="ecl-shell-accent-status" id="eclShellAccentStatus" aria-live="polite"></span>
      </div>`;
  }
  function a11yMarkup(){return `<div class="ecl-shell-scrim" id="eclShellScrim"></div>
    <aside class="ecl-shell-a11y" id="eclShellA11y" lang="en" role="dialog" aria-modal="true" aria-label="Accessibility settings" aria-hidden="true">
      <div class="ecl-shell-a11y-head"><h2>Accessibility</h2><button class="ecl-shell-close" id="eclShellA11yClose" type="button" aria-label="Close">×</button></div>
      <div class="ecl-shell-a11y-body">
        <div class="ecl-shell-field"><span class="ecl-shell-field-title">Text size</span><div class="ecl-shell-segment">
          <button type="button" data-ecl-shell-size="0" aria-pressed="false">A</button><button type="button" data-ecl-shell-size="1" aria-pressed="false">A+</button><button type="button" data-ecl-shell-size="2" aria-pressed="false">A++</button>
        </div></div>
        <div class="ecl-shell-field"><span class="ecl-shell-field-title">Display</span>
          <button class="ecl-shell-toggle" type="button" data-ecl-shell-pref="contrast" aria-pressed="false"><span>High contrast</span><span>Off</span></button>
          <button class="ecl-shell-toggle" type="button" data-ecl-shell-pref="readable" aria-pressed="false"><span>Reading-friendly text</span><span>Off</span></button>
          <button class="ecl-shell-toggle" type="button" data-ecl-shell-pref="no-motion" aria-pressed="false"><span>Reduce animations</span><span>Off</span></button>
          <button class="ecl-shell-toggle" type="button" data-ecl-shell-pref="focus" aria-pressed="false"><span>Focus mode</span><span>Off</span></button>
        </div>
        <p class="ecl-shell-a11y-note">These settings are saved on this device.</p>
      </div>
    </aside>`}
  function searchMarkup(){return `<div class="ecl-search-backdrop" id="eclSearchBackdrop"></div>
    <section class="ecl-search-dialog" id="eclSearchDialog" role="dialog" aria-modal="true" aria-labelledby="eclSearchTitle" aria-hidden="true" lang="en">
      <div class="ecl-search-head">
        <div><span class="ecl-search-eyebrow">Search the whole site</span><h2 id="eclSearchTitle">Find exactly what you need.</h2></div>
        <button class="ecl-search-close" id="eclSearchClose" type="button" aria-label="Close search">${icons.close}</button>
      </div>
      <div class="ecl-search-field-wrap">
        ${icons.search}
        <input id="eclSearchInput" type="search" inputmode="search" autocomplete="off" spellcheck="false" placeholder="Try ‘Brexit’, ‘present perfect’, ‘schwa’ or a French word…" aria-controls="eclSearchResults" aria-autocomplete="list">
        <kbd class="ecl-search-key">Esc</kbd>
      </div>
      <div class="ecl-search-status" id="eclSearchStatus" aria-live="polite">Type at least two letters.</div>
      <div class="ecl-search-body">
        <div class="ecl-search-results" id="eclSearchResults" role="listbox" aria-label="Search suggestions"></div>
      </div>
      <div class="ecl-search-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Ctrl</kbd> + <kbd>K</kbd> search anywhere</span></div>
    </section>`}
  function footerMarkup(){return `<div class="ecl-shell-footer" role="contentinfo" lang="en">
      <div class="ecl-shell-footer-grid">
        <div><div class="ecl-shell-footer-title">English Colles in Lyon</div><div class="ecl-shell-footer-author">Designed and created by Eglantine Lecomte</div><p class="ecl-shell-footer-copy">Build knowledge independently, practise it actively, then reuse it in class and in real colles.</p></div>
        <nav class="ecl-shell-footer-links" aria-label="Footer navigation"><a href="index.html">Home</a><button type="button" id="eclFooterSearch">Search</button><a href="colle-trainer.html">Colle Trainer</a><a href="resources.html">Resources</a><a href="learning-path.html">My Learning Path</a><a href="#main">Back to top ↑</a></nav>
      </div><div class="ecl-shell-footer-bottom">CPGE English · Independent practice · Classroom transfer · Colles</div>
    </div>`}
  function syncA11yControls(){
    const size=STORE.get('eclyon_shell_size','0');
    document.querySelectorAll('[data-ecl-shell-size]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.eclShellSize===size)));
    document.querySelectorAll('[data-ecl-shell-pref]').forEach(b=>{const on=STORE.get('eclyon_shell_'+b.dataset.eclShellPref,'0')==='1';b.setAttribute('aria-pressed',String(on));const state=b.querySelector('span:last-child');if(state)state.textContent=on?'On':'Off'});
  }
  function syncAccent(){
    const selected=STORE.get('eclyon_accent','UK');
    document.querySelectorAll('[data-ecl-shell-accent]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.eclShellAccent===selected)));
  }

  /* ---------- Global search ---------- */
  const SEARCH={core:null,vocab:null,corePromise:null,vocabPromise:null,results:[],active:-1,query:'',lastFocus:null};
  function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘]/g,"'").replace(/[–—]/g,'-').replace(/[^a-z0-9'\- ]+/g,' ').replace(/\s+/g,' ').trim()}
  function words(value){return norm(value).split(' ').filter(Boolean)}
  function distanceWithin(a,b,max){
    if(Math.abs(a.length-b.length)>max)return false;
    if(a===b)return true;
    let prev=Array.from({length:b.length+1},(_,i)=>i);
    for(let i=1;i<=a.length;i++){
      const cur=[i];let rowMin=i;
      for(let j=1;j<=b.length;j++){
        const value=Math.min(cur[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
        cur[j]=value;if(value<rowMin)rowMin=value;
      }
      if(rowMin>max)return false;
      prev=cur;
    }
    return prev[b.length]<=max;
  }
  function prepareCore(entries){return entries.map(e=>Object.assign({},e,{_t:norm(e.title),_c:norm(e.context),_d:norm(e.description),_k:norm(e.keywords),_w:words(e.title)}))}
  function prepareVocab(payload){
    const chapters=payload.chapters||[];
    return (payload.entries||[]).map((row,index)=>{
      const chapter=chapters[row[2]]||{};
      return {id:'v'+index,title:row[0],french:row[1],category:'Vocabulary',context:[chapter.title,row[3]].filter(Boolean).join(' · '),description:row[1]?'French: '+row[1]+'.':'Vocabulary entry.',url:chapter.file||'vocabulary.html',target:row[0],priority:72,_t:norm(row[0]),_f:norm(row[1]),_c:norm((chapter.title||'')+' '+(row[3]||'')),_w:words(row[0])};
    });
  }
  async function loadCore(){
    if(SEARCH.core)return SEARCH.core;
    if(!SEARCH.corePromise)SEARCH.corePromise=fetch('search-index.json?v='+SHELL_VERSION,{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error('Search index unavailable');return r.json()}).then(d=>SEARCH.core=prepareCore(d.entries||[]));
    return SEARCH.corePromise;
  }
  async function loadVocab(){
    if(SEARCH.vocab)return SEARCH.vocab;
    if(!SEARCH.vocabPromise)SEARCH.vocabPromise=fetch('search-vocabulary-index.json?v='+SHELL_VERSION,{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error('Vocabulary index unavailable');return r.json()}).then(d=>SEARCH.vocab=prepareVocab(d));
    return SEARCH.vocabPromise;
  }
  function scoreEntry(entry,query,tokens,isVocab){
    const title=entry._t,context=entry._c||'',description=entry._d||'',keywords=isVocab?(entry._f||'')+' '+context:(entry._k||'');
    let score=(entry.priority||50)*.12;
    if(title===query)score+=180;
    else if(title.startsWith(query))score+=125;
    else if(title.includes(query))score+=88;
    if(context.includes(query))score+=34;
    if(keywords.includes(query))score+=26;
    if(description.includes(query))score+=16;
    if(isVocab&&entry._f===query)score+=165;
    else if(isVocab&&entry._f&&entry._f.startsWith(query))score+=108;
    let matched=0;
    for(const token of tokens){
      let tokenScore=0;
      if(entry._w.includes(token))tokenScore=38;
      else if(entry._w.some(w=>w.startsWith(token)))tokenScore=27;
      else if(title.includes(token))tokenScore=18;
      else if(context.includes(token))tokenScore=12;
      else if(keywords.includes(token))tokenScore=9;
      else if(token.length>=4&&entry._w.some(w=>distanceWithin(token,w,token.length>=8?2:1)))tokenScore=8;
      if(tokenScore){matched++;score+=tokenScore}
    }
    if(tokens.length>1&&matched===tokens.length)score+=35;
    if(!score||matched===0&&![title,context,keywords,description].some(v=>v.includes(query)))return -1;
    return score;
  }
  function categoryClass(value){return norm(value).replace(/[^a-z0-9]+/g,'-')}
  function resultUrl(entry){
    try{
      const url=new URL(entry.url,location.href);
      if(entry.target)url.searchParams.set('eclFind',entry.target);
      return url.pathname.split('/').pop()+url.search+url.hash;
    }catch(_){return entry.url}
  }
  function quickLinks(){
    return `<div class="ecl-search-empty"><p>Popular starting points</p><div class="ecl-search-quick"><a href="learning-path.html"><strong>Open My Learning Path</strong><span>Progress, priorities and next steps</span></a>
      <a href="colle-trainer.html"><strong>Prepare my next colle</strong><span>Document, timing and oral practice</span></a>
      <a href="methodology.html"><strong>Improve my method</strong><span>Summary, key question, plan and examples</span></a>
      <a href="help.html"><strong>Follow a guided plan</strong><span>A clear route when English feels difficult</span></a>
      <a href="pronunciation.html"><strong>Work on pronunciation</strong><span>Sounds, stress, rhythm and intonation</span></a>
    </div></div>`;
  }
  function renderResults(results,query){
    const box=document.getElementById('eclSearchResults'),status=document.getElementById('eclSearchStatus');
    SEARCH.results=results;SEARCH.active=-1;
    if(!query){box.innerHTML=quickLinks();status.textContent='Type at least two letters.';return}
    if(!results.length){box.innerHTML=`<div class="ecl-search-no-results"><strong>No exact match yet.</strong><span>Try a shorter term, a French equivalent or a broader topic.</span></div>`;status.textContent='No result for “'+query+'”.';return}
    box.innerHTML=results.map((r,i)=>`<a class="ecl-search-result" id="eclSearchResult${i}" role="option" aria-selected="false" href="${escapeHtml(resultUrl(r))}" data-index="${i}">
      <span class="ecl-search-badge ecl-search-badge-${categoryClass(r.category)}">${escapeHtml(r.category)}</span>
      <span class="ecl-search-result-main"><strong>${escapeHtml(r.title)}</strong><span class="ecl-search-context">${escapeHtml(r.context||'English Colles in Lyon')}</span><span class="ecl-search-desc">${escapeHtml(r.description||'Open this result.')}</span></span>
      <span class="ecl-search-go">${icons.arrow}</span>
    </a>`).join('');
    status.textContent=results.length+' suggestion'+(results.length===1?'':'s')+' for “'+query+'”.';
    box.querySelectorAll('.ecl-search-result').forEach(link=>link.addEventListener('click',()=>closeSearch(false)));
  }
  function setActive(index){
    const items=Array.from(document.querySelectorAll('.ecl-search-result'));
    if(!items.length)return;
    SEARCH.active=(index+items.length)%items.length;
    items.forEach((item,i)=>{const active=i===SEARCH.active;item.classList.toggle('active',active);item.setAttribute('aria-selected',String(active))});
    const active=items[SEARCH.active];active.scrollIntoView({block:'nearest'});
    document.getElementById('eclSearchInput').setAttribute('aria-activedescendant',active.id);
  }
  let searchTimer=0;
  async function performSearch(raw){
    const query=norm(raw);SEARCH.query=query;
    if(query.length<2){renderResults([],query?'':'');return}
    const status=document.getElementById('eclSearchStatus');status.textContent='Searching the site…';
    try{
      const core=await loadCore();
      if(query!==SEARCH.query)return;
      const tokens=query.split(' ').filter(Boolean);
      let candidates=[];
      for(const entry of core){const score=scoreEntry(entry,query,tokens,false);if(score>=0)candidates.push({entry,score})}
      if(SEARCH.vocab){for(const entry of SEARCH.vocab){const score=scoreEntry(entry,query,tokens,true);if(score>=0)candidates.push({entry,score})}}
      candidates.sort((a,b)=>b.score-a.score||String(a.entry.title).localeCompare(String(b.entry.title)));
      const results=[];const seen=new Set();const perCategory={};
      for(const item of candidates){
        const entry=item.entry,cat=entry.category||'Page';
        const key=(cat==='Vocabulary'?cat+'|'+norm(entry.title):norm(entry.title)+'|'+entry.url+'|'+entry.target);
        if(seen.has(key))continue;
        if((perCategory[cat]||0)>=4)continue;
        seen.add(key);perCategory[cat]=(perCategory[cat]||0)+1;results.push(entry);
        if(results.length>=12)break;
      }
      renderResults(results,raw.trim());
      if(!SEARCH.vocab){
        status.textContent=results.length+' suggestion'+(results.length===1?'':'s')+' · loading vocabulary…';
        loadVocab().then(()=>{if(query===SEARCH.query)performSearch(raw)}).catch(()=>{});
      }
    }catch(_){renderResults([],raw.trim());status.textContent='Search is temporarily unavailable. You can still use the main navigation.'}
  }
  function openSearch(){
    const dialog=document.getElementById('eclSearchDialog'),backdrop=document.getElementById('eclSearchBackdrop'),button=document.getElementById('eclShellSearchOpen');
    if(!dialog)return;
    SEARCH.lastFocus=document.activeElement;
    dialog.classList.add('open');backdrop.classList.add('open');dialog.setAttribute('aria-hidden','false');if(button)button.setAttribute('aria-expanded','true');document.body.classList.add('ecl-search-open');
    const input=document.getElementById('eclSearchInput');setTimeout(()=>{input.focus();input.select()},30);
    if(!SEARCH.core)loadCore().catch(()=>{});if(!SEARCH.vocab)loadVocab().catch(()=>{});
  }
  function closeSearch(restoreFocus=true){
    const dialog=document.getElementById('eclSearchDialog'),backdrop=document.getElementById('eclSearchBackdrop'),button=document.getElementById('eclShellSearchOpen');
    if(!dialog||!dialog.classList.contains('open'))return;
    dialog.classList.remove('open');backdrop.classList.remove('open');dialog.setAttribute('aria-hidden','true');if(button)button.setAttribute('aria-expanded','false');document.body.classList.remove('ecl-search-open');
    if(restoreFocus&&SEARCH.lastFocus&&SEARCH.lastFocus.focus)SEARCH.lastFocus.focus();
  }
  function bindSearch(){
    const openButton=document.getElementById('eclShellSearchOpen'),closeButton=document.getElementById('eclSearchClose'),backdrop=document.getElementById('eclSearchBackdrop'),input=document.getElementById('eclSearchInput');
    if(openButton)openButton.addEventListener('click',openSearch);if(closeButton)closeButton.addEventListener('click',()=>closeSearch());if(backdrop)backdrop.addEventListener('click',()=>closeSearch());
    if(input){
      input.addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>performSearch(input.value),80)});
      input.addEventListener('keydown',event=>{
        if(event.key==='ArrowDown'){event.preventDefault();setActive(SEARCH.active+1)}
        else if(event.key==='ArrowUp'){event.preventDefault();setActive(SEARCH.active-1)}
        else if(event.key==='Enter'){const index=SEARCH.active>=0?SEARCH.active:0;const item=document.getElementById('eclSearchResult'+index);if(item){event.preventDefault();item.click()}}
      });
    }
    document.addEventListener('keydown',event=>{
      const tag=(event.target&&event.target.tagName||'').toLowerCase();const typing=['input','textarea','select'].includes(tag)||event.target&&event.target.isContentEditable;
      if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openSearch()}
      else if(event.key==='/'&&!typing&&!event.ctrlKey&&!event.metaKey&&!event.altKey){event.preventDefault();openSearch()}
      else if(event.key==='Escape'&&document.getElementById('eclSearchDialog')?.classList.contains('open'))closeSearch();
      else if(event.key==='Tab'&&document.getElementById('eclSearchDialog')?.classList.contains('open')){
        const dialog=document.getElementById('eclSearchDialog');
        const focusable=Array.from(dialog.querySelectorAll('button,input,a[href],[tabindex]:not([tabindex="-1"])')).filter(el=>!el.disabled&&el.offsetParent!==null);
        if(focusable.length){const first=focusable[0],last=focusable[focusable.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}
      }
    });
  }

  function bind(){
    const menu=document.getElementById('eclShellMenuButton'),nav=document.getElementById('eclShellNavRow');
    if(menu&&nav) menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰'});
    document.querySelectorAll('[data-ecl-shell-accent]').forEach(button=>button.addEventListener('click',()=>{
      const accent=button.dataset.eclShellAccent;STORE.set('eclyon_accent',accent);syncAccent();
      const labels={UK:'UK English',US:'US English',AU:'Australian English',CA:'Canadian English'};
      const status=document.getElementById('eclShellAccentStatus');if(status)status.textContent='Accent selected: '+labels[accent];
      window.dispatchEvent(new CustomEvent('eclyon:accentchange',{detail:{accent}}));
    }));
    const panel=document.getElementById('eclShellA11y'),scrim=document.getElementById('eclShellScrim'),openBtn=document.getElementById('eclShellA11yOpen'),closeBtn=document.getElementById('eclShellA11yClose');
    let lastFocus=null;
    const open=()=>{lastFocus=document.activeElement;panel.classList.add('open');scrim.classList.add('open');panel.setAttribute('aria-hidden','false');openBtn.setAttribute('aria-expanded','true');closeBtn.focus()};
    const close=()=>{panel.classList.remove('open');scrim.classList.remove('open');panel.setAttribute('aria-hidden','true');openBtn.setAttribute('aria-expanded','false');if(lastFocus&&lastFocus.focus)lastFocus.focus()};
    if(openBtn)openBtn.addEventListener('click',open);if(closeBtn)closeBtn.addEventListener('click',close);if(scrim)scrim.addEventListener('click',close);
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&panel&&panel.classList.contains('open'))close()});
    document.querySelectorAll('[data-ecl-shell-size]').forEach(button=>button.addEventListener('click',()=>{STORE.set('eclyon_shell_size',button.dataset.eclShellSize);applyPrefs();syncA11yControls()}));
    document.querySelectorAll('[data-ecl-shell-pref]').forEach(button=>button.addEventListener('click',()=>{const key='eclyon_shell_'+button.dataset.eclShellPref;STORE.set(key,STORE.get(key,'0')==='1'?'0':'1');applyPrefs();syncA11yControls()}));
    bindSearch();
  }
  function renderHeader(){
    const target=document.getElementById('ecl-site-header');if(!target||target.dataset.rendered)return;
    target.dataset.rendered='true';target.innerHTML=headerMarkup()+a11yMarkup()+searchMarkup();ensureMainTarget();applyPrefs();syncAccent();syncA11yControls();bind();
  }
  function renderFooter(){
    const target=document.getElementById('ecl-site-footer');if(target&&!target.dataset.rendered){target.dataset.rendered='true';target.innerHTML=footerMarkup();const footerSearch=document.getElementById('eclFooterSearch');if(footerSearch)footerSearch.addEventListener('click',openSearch)}
  }

  /* ---------- Direct links to indexed content ---------- */
  function visible(element){const style=getComputedStyle(element);return style.display!=='none'&&style.visibility!=='hidden'&&element.getClientRects().length>0}
  function revealTarget(element){
    let details=element.closest('details');if(details)details.open=true;
    const card=element.closest('.event-card,.lesson-card,.module-card,.resource-card,.report-card,.jr-card');
    if(card){
      if(card.classList.contains('event-card')&&!card.classList.contains('open')){const toggle=card.querySelector('.event-toggle');if(toggle)toggle.click()}
      const toggle=card.querySelector('[aria-expanded="false"]');if(toggle&&toggle.tagName==='BUTTON')toggle.click();
    }
    let hiddenParent=element.parentElement;
    while(hiddenParent&&hiddenParent!==document.body){if(hiddenParent.hidden)hiddenParent.hidden=false;hiddenParent=hiddenParent.parentElement}
    element.classList.add('ecl-search-target');
    element.setAttribute('tabindex','-1');
    element.scrollIntoView({behavior:document.body.classList.contains('ecl-shell-no-motion')?'auto':'smooth',block:'center'});
    setTimeout(()=>element.focus({preventScroll:true}),380);
    setTimeout(()=>element.classList.remove('ecl-search-target'),5200);
  }
  function findTargetElement(target){
    const wanted=norm(target);if(!wanted)return null;
    const selectors='h1,h2,h3,h4,h5,h6,[data-search-title],.event-main h3,.event-card h3,.module-title,.lesson-title,.vocab-term,.term,dt,.resource-title,.video-title,.card-title';
    const preferred=Array.from(document.querySelectorAll(selectors)).filter(el=>!el.closest('.ecl-legacy-shell'));
    let exact=preferred.find(el=>norm(el.textContent)===wanted);if(exact)return exact;
    let close=preferred.find(el=>{const text=norm(el.textContent);return text.startsWith(wanted)||wanted.startsWith(text)});if(close)return close;
    const main=document.querySelector('main')||document.body;
    const all=Array.from(main.querySelectorAll('strong,b,button,a,span,p,div')).filter(el=>el.childElementCount<=2&&visible(el));
    exact=all.find(el=>{const text=norm(el.textContent);return text===wanted&&text.length<180});if(exact)return exact;
    return all.find(el=>{const text=norm(el.textContent);return text.includes(wanted)&&text.length<=Math.max(180,wanted.length*4)})||null;
  }
  function focusIndexedTarget(){
    const params=new URLSearchParams(location.search),target=params.get('eclFind');if(!target)return;
    let found=false,observer=null;
    const tryFind=()=>{
      if(found)return true;
      const element=findTargetElement(target);
      if(!element)return false;
      found=true;if(observer)observer.disconnect();revealTarget(element);
      params.delete('eclFind');const query=params.toString();history.replaceState(null,'',location.pathname+(query?'?'+query:'')+location.hash);return true;
    };
    if(tryFind())return;
    observer=new MutationObserver(()=>tryFind());observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden','open']});
    [250,600,1200,2200,4000,7000].forEach(ms=>setTimeout(tryFind,ms));
    setTimeout(()=>{if(observer)observer.disconnect()},9000);
  }

  function recordLearningActivity(){
    const excluded=new Set(['learning-path.html','progress-backup.html']);
    if(excluded.has(path))return;
    const category=path.startsWith('cpge_grammar_')?'Grammar':path.startsWith('cpge_vocab_')||path==='flashcards.html'?'Vocabulary':path.startsWith('colle-atlas-')?'Civilisation':({
      'methodology.html':'Methodology','civilisation.html':'Civilisation','vocabulary.html':'Vocabulary','grammar.html':'Grammar','pronunciation.html':'Pronunciation','timelines.html':'Timelines','colle-trainer.html':'Colle practice','resources.html':'Resources','jury-reports.html':'Jury Reports','help.html':'Guided plan','index.html':'Home'
    }[path]||'Learning activity');
    const title=(document.querySelector('main h1')?.textContent||document.title||path).trim().replace(/\s+/g,' ');
    let items=[];try{items=JSON.parse(STORE.get('ecl_learning_activity_v1','[]'))||[]}catch(_){items=[]}
    const now=Date.now(),last=items[0];
    if(last&&last.path===path&&now-new Date(last.ts).getTime()<30*60*1000){last.ts=new Date(now).toISOString();last.title=title;last.category=category}
    else items.unshift({path,title,category,ts:new Date(now).toISOString()});
    STORE.set('ecl_learning_activity_v1',JSON.stringify(items.slice(0,50)));
  }

  window.ECLShell={renderHeader,renderFooter,applyPrefs,openSearch,focusIndexedTarget};
  renderHeader();
  const ready=()=>{ensureMainTarget();renderFooter();focusIndexedTarget();recordLearningActivity()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
