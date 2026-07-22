(function(){
  'use strict';
  if(window.ECLShell) return;
  document.body.classList.add('ecl-shell-installed');

  const STORE={
    get(key,fallback){try{const value=localStorage.getItem(key);return value===null?fallback:value}catch(_){return fallback}},
    set(key,value){try{localStorage.setItem(key,value)}catch(_){}}
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
    access:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="4" r="1.5"></circle><path d="M5 8h14M9 8 8 20M15 8l1 12M12 8v6"></path></svg>'
  };

  function escapeHtml(value){return String(value).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
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
      const cls='ecl-shell-'+name;
      document.body.classList.toggle(cls,STORE.get('eclyon_shell_'+name,'0')==='1');
    });
  }
  function navMarkup(){return routes.map(([href,label])=>`<a href="${href}" class="${href===activeHref?'active':''}" ${href===activeHref?'aria-current="page"':''}>${escapeHtml(label)}</a>`).join('')}
  function headerMarkup(){
    const progressActive=path==='progress-backup.html';
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
            <a class="ecl-shell-tool ecl-shell-search" href="index.html#siteSearch" aria-label="Search the site">${icons.search}<span class="ecl-shell-tool-label">Search</span></a>
            <a class="ecl-shell-tool" href="progress-backup.html" ${progressActive?'aria-current="page"':''} aria-label="My progress and backups">${icons.progress}<span class="ecl-shell-tool-label">My progress</span></a>
            <button class="ecl-shell-tool" id="eclShellA11yOpen" type="button" aria-haspopup="dialog" aria-expanded="false">${icons.access}<span class="ecl-shell-tool-label">Accessibility</span></button>
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
  function footerMarkup(){return `<div class="ecl-shell-footer" role="contentinfo" lang="en">
      <div class="ecl-shell-footer-grid">
        <div><div class="ecl-shell-footer-title">English Colles in Lyon</div><div class="ecl-shell-footer-author">Designed and created by Eglantine Lecomte</div><p class="ecl-shell-footer-copy">Build knowledge independently, practise it actively, then reuse it in class and in real colles.</p></div>
        <nav class="ecl-shell-footer-links" aria-label="Footer navigation"><a href="index.html">Home</a><a href="colle-trainer.html">Colle Trainer</a><a href="resources.html">Resources</a><a href="progress-backup.html">My progress</a><a href="#main">Back to top ↑</a></nav>
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
  }
  function renderHeader(){
    const target=document.getElementById('ecl-site-header');if(!target||target.dataset.rendered)return;
    target.dataset.rendered='true';target.innerHTML=headerMarkup()+a11yMarkup();ensureMainTarget();applyPrefs();syncAccent();syncA11yControls();bind();
  }
  function renderFooter(){const target=document.getElementById('ecl-site-footer');if(target&&!target.dataset.rendered){target.dataset.rendered='true';target.innerHTML=footerMarkup()}}

  window.ECLShell={renderHeader,renderFooter,applyPrefs};
  renderHeader();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{ensureMainTarget();renderFooter()},{once:true});else{ensureMainTarget();renderFooter()}
})();
