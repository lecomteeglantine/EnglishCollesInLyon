/* English Colles in Lyon — shared navigation, accessibility and class/colle transfer loop */
(() => {
  'use strict';

  const VERSION = '2026-07-15-3';
  const STORAGE_KEY = 'eclClassColleMissionsV1';
  const pageFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isHome = pageFile === 'index.html' || pageFile === '';

  const NAV_LINKS = [
    ['index.html', 'Home'],
    ['methodology.html', 'Methodology'],
    ['civilisation.html', 'Civilisation'],
    ['vocabulary.html', 'Vocabulary'],
    ['grammar.html', 'Grammar'],
    ['pronunciation.html', 'Pronunciation'],
    ['timelines.html', 'Timelines'],
    ['colle-trainer.html', 'Colle Trainer'],
    ['resources.html', 'Resources'],
    ['jury-reports.html', 'Jury Reports']
  ];
  const KNOWN_HREFS = new Set(NAV_LINKS.map(([href]) => href));

  const safeText = value => String(value || '').replace(/\s+/g, ' ').trim();
  const escapeHtml = value => String(value || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

  function injectStyles() {
    if (document.getElementById('eclx-style')) return;
    const style = document.createElement('style');
    style.id = 'eclx-style';
    style.textContent = `
      .eclx-transfer-banner,.eclx-mission-section,.eclx-dashboard,.eclx-a11y-dialog{font-family:var(--font,"Atkinson Hyperlegible",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif)}
      .eclx-transfer-banner{background:linear-gradient(90deg,rgba(36,59,83,.98),rgba(49,90,120,.96));color:#fff;border-bottom:1px solid rgba(255,255,255,.18)}
      .eclx-transfer-banner .eclx-inner{max-width:var(--maxw,1120px);margin:0 auto;padding:11px 20px;display:flex;align-items:center;justify-content:center;gap:10px;text-align:center;font-size:.91rem;line-height:1.45}
      .eclx-transfer-banner strong{color:#fff;font-weight:800}.eclx-transfer-banner a{color:#fff;text-decoration:underline;text-underline-offset:3px;font-weight:700}
      .eclx-mission-section,.eclx-dashboard{max-width:var(--maxw,1120px);margin:34px auto;padding:0 20px}
      .eclx-card{background:var(--card,#fff);border:1px solid var(--line,#E6D8C8);border-radius:var(--r,16px);box-shadow:var(--shadow,0 10px 30px rgba(36,59,83,.07));overflow:hidden}
      .eclx-card-head{padding:22px 24px 17px;background:linear-gradient(135deg,rgba(196,106,74,.11),rgba(122,155,118,.13));border-bottom:1px solid var(--line,#E6D8C8)}
      .eclx-eyebrow{font-size:.72rem;letter-spacing:.15em;text-transform:uppercase;font-weight:800;color:var(--terra,#C46A4A);margin-bottom:6px}
      .eclx-title{margin:0;color:var(--navy,#243B53);font-family:var(--display,"Fraunces",Georgia,serif);font-size:clamp(1.35rem,2.5vw,1.85rem);line-height:1.2}
      .eclx-sub{margin:8px 0 0;color:var(--muted,#5d6b66);font-size:.96rem;line-height:1.55}
      .eclx-card-body{padding:22px 24px 24px}.eclx-task-label{display:block;font-size:.77rem;text-transform:uppercase;letter-spacing:.1em;font-weight:800;color:var(--navy,#243B53);margin-bottom:8px}
      .eclx-task-input,.eclx-note-input{width:100%;resize:vertical;border:1px solid var(--line,#E6D8C8);border-radius:12px;padding:13px 14px;background:var(--bg2,#FFF7ED);color:var(--ink,#22312F);font:inherit;line-height:1.5}
      .eclx-task-input{min-height:94px}.eclx-note-input{min-height:70px;margin-top:9px}.eclx-task-input:focus,.eclx-note-input:focus{outline:3px solid rgba(196,106,74,.24);border-color:var(--terra,#C46A4A)}
      .eclx-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:15px;align-items:center}.eclx-btn{min-height:44px;padding:0 16px;border-radius:11px;border:2px solid transparent;font:inherit;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;text-decoration:none;transition:transform .15s,box-shadow .2s,background .2s}
      .eclx-btn:hover{transform:translateY(-1px)}.eclx-primary{background:var(--terra,#C46A4A);color:#fff;box-shadow:var(--shadow,0 10px 30px rgba(36,59,83,.07))}.eclx-secondary{background:var(--navy,#243B53);color:#fff}.eclx-ghost{background:transparent;color:var(--navy,#243B53);border-color:var(--line,#E6D8C8)}
      .eclx-feedback{min-height:1.4em;margin-top:10px;font-size:.9rem;font-weight:700;color:var(--sage,#617c5f)}.eclx-status-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-top:18px}
      .eclx-status{display:flex;align-items:flex-start;gap:8px;border:1px solid var(--line,#E6D8C8);border-radius:11px;padding:10px;background:var(--bg2,#FFF7ED);font-size:.86rem;line-height:1.3}.eclx-status input{margin-top:2px;accent-color:var(--terra,#C46A4A);width:17px;height:17px;flex:0 0 auto}
      .eclx-dashboard-grid{display:grid;gap:13px;margin-top:16px}.eclx-empty{padding:18px;border:1px dashed var(--line,#E6D8C8);border-radius:12px;color:var(--muted,#5d6b66);background:var(--bg2,#FFF7ED)}
      .eclx-mission-item{border:1px solid var(--line,#E6D8C8);border-radius:13px;padding:15px;background:#fff}.eclx-mission-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.eclx-domain{display:inline-flex;align-items:center;border-radius:999px;padding:4px 10px;background:rgba(36,59,83,.09);color:var(--navy,#243B53);font-size:.75rem;font-weight:800;letter-spacing:.05em;text-transform:uppercase}
      .eclx-mission-task{margin:9px 0 0;color:var(--ink,#22312F);line-height:1.5}.eclx-source{display:inline-flex;margin-top:8px;font-size:.82rem;font-weight:800;color:var(--terra,#C46A4A);text-decoration:none}.eclx-source:hover{text-decoration:underline}.eclx-generated-foot-nav{display:flex;flex-wrap:wrap;gap:7px;justify-content:center;margin:0 auto 16px;padding:0 16px;max-width:var(--maxw,1120px)}.eclx-generated-foot-nav a{font-size:.8rem;font-weight:700;color:var(--muted,#5d6b66);padding:5px 8px;border-radius:8px;text-decoration:none}.eclx-generated-foot-nav a:hover,.eclx-generated-foot-nav a.active{color:var(--terra,#C46A4A);background:var(--bg2,#FFF7ED)}.eclx-remove{border:0;background:transparent;color:var(--muted,#5d6b66);font-size:1.2rem;cursor:pointer;padding:2px 5px;border-radius:7px}.eclx-remove:hover{background:rgba(196,106,74,.12);color:var(--terra,#C46A4A)}
      .eclx-note{margin-top:12px;border-top:1px solid var(--line,#E6D8C8);padding-top:10px}.eclx-note summary{cursor:pointer;color:var(--navy,#243B53);font-size:.86rem;font-weight:800}.eclx-progress-wrap{margin-top:16px}.eclx-progress-meta{display:flex;justify-content:space-between;gap:12px;font-size:.85rem;font-weight:700;color:var(--muted,#5d6b66);margin-bottom:6px}.eclx-progress{height:10px;border-radius:999px;background:var(--line,#E6D8C8);overflow:hidden}.eclx-progress>span{display:block;height:100%;background:linear-gradient(90deg,var(--terra,#C46A4A),var(--sage,#7A9B76));width:0;transition:width .25s}
      .eclx-stale-note{margin-top:9px;padding:8px 10px;border-radius:9px;background:#fff3cd;color:#6b5200;border:1px solid #ead791;font-size:.8rem;line-height:1.35}
      .eclx-transfer-reminder{margin:26px auto!important}.eclx-transfer-reminder-inner{display:flex;gap:10px;align-items:flex-start;padding:15px 18px;border-left:5px solid var(--terra,#C46A4A);border-radius:10px;background:var(--bg2,#FFF7ED);color:var(--ink,#22312F);line-height:1.5}.eclx-transfer-reminder-inner strong{color:var(--navy,#243B53);white-space:nowrap}.eclx-transfer-reminder-inner span{color:var(--muted,#5d6b66)}
      .eclx-menu-button{display:none;min-height:42px;padding:8px 13px;border:1px solid var(--line,#E6D8C8);border-radius:10px;background:var(--card,#fff);color:var(--navy,#243B53);font:inherit;font-weight:800;cursor:pointer;margin-left:auto}
      .eclx-a11y-fab{position:fixed;right:18px;bottom:18px;z-index:9998;width:50px;height:50px;border-radius:50%;border:2px solid #fff;background:var(--navy,#243B53);color:#fff;box-shadow:0 8px 28px rgba(36,59,83,.25);font:700 1.15rem/1 var(--font,"Atkinson Hyperlegible",sans-serif);cursor:pointer}.eclx-a11y-scrim{position:fixed;inset:0;background:rgba(20,32,43,.46);z-index:9998;display:none}.eclx-a11y-scrim.open{display:block}.eclx-a11y-dialog{position:fixed;right:18px;bottom:80px;z-index:9999;width:min(360px,calc(100vw - 30px));background:var(--card,#fff);border:1px solid var(--line,#E6D8C8);border-radius:16px;box-shadow:0 24px 70px rgba(36,59,83,.25);padding:20px;display:none}.eclx-a11y-dialog.open{display:block}.eclx-a11y-dialog h2{margin:0 0 6px;color:var(--navy,#243B53);font-family:var(--display,"Fraunces",Georgia,serif);font-size:1.35rem}.eclx-a11y-dialog p{margin:0 0 14px;color:var(--muted,#5d6b66);font-size:.88rem}.eclx-a11y-grid{display:grid;gap:9px}.eclx-a11y-option{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:44px;padding:9px 11px;border:1px solid var(--line,#E6D8C8);border-radius:10px;background:var(--bg2,#FFF7ED);font:inherit;font-weight:700;color:var(--ink,#22312F);cursor:pointer}.eclx-a11y-option[aria-pressed="true"]{background:var(--navy,#243B53);color:#fff}.eclx-a11y-close{position:absolute;right:12px;top:10px;border:0;background:transparent;color:var(--muted,#5d6b66);font-size:1.4rem;cursor:pointer}
      html.eclx-large{font-size:112.5%!important}html.eclx-xlarge{font-size:125%!important}body.eclx-contrast{--bg:#fff;--bg2:#fff;--card:#fff;--ink:#000;--muted:#222;--line:#000;--navy:#000;--terra:#8b2100}body.eclx-contrast *{text-shadow:none!important}body.eclx-readable{font-family:"Atkinson Hyperlegible",Arial,sans-serif!important;letter-spacing:.015em}body.eclx-reduce *,body.eclx-reduce *::before,body.eclx-reduce *::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}
      @media(max-width:760px){.eclx-status-row{grid-template-columns:1fr 1fr}.eclx-card-head,.eclx-card-body{padding-left:18px;padding-right:18px}.eclx-transfer-banner .eclx-inner{font-size:.85rem}.eclx-actions .eclx-btn{width:100%}.eclx-menu-button{display:inline-flex;align-items:center;justify-content:center}.nav.eclx-open{display:flex!important;position:absolute!important;top:100%!important;left:12px!important;right:12px!important;z-index:9997!important;flex-direction:column!important;background:var(--card,#fff)!important;border:1px solid var(--line,#E6D8C8)!important;border-radius:14px!important;padding:10px!important;box-shadow:0 16px 45px rgba(36,59,83,.2)!important}.nav.eclx-open a{width:100%!important}}
      @media(max-width:460px){.eclx-status-row{grid-template-columns:1fr}.eclx-progress-meta{display:block}.eclx-progress-meta span{display:block;margin-bottom:4px}}
      body.contrast .eclx-transfer-banner,body.high-contrast .eclx-transfer-banner{background:#000;color:#fff}body.contrast .eclx-card,body.high-contrast .eclx-card,body.contrast .eclx-mission-item,body.high-contrast .eclx-mission-item{border-color:#000;box-shadow:none}
    `;
    document.head.appendChild(style);
  }

  function normalizeNavigation() {
    const current = pageFile || 'index.html';
    document.querySelectorAll('nav.nav, nav.foot-nav').forEach(nav => {
      const existing = [...nav.querySelectorAll('a[href]')];
      const knownCount = existing.filter(a => {
        const href = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
        return KNOWN_HREFS.has(href) || /about\.html$/i.test(href);
      }).length;
      if (knownCount < 3) return;
      nav.innerHTML = '';
      NAV_LINKS.forEach(([href, label]) => {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = label;
        if (current === href) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); }
        nav.appendChild(a);
      });
    });
    document.querySelectorAll('a[href$="about.html"]').forEach(a => a.remove());
  }

  function ensureHubFooterNavigation() {
    if (!KNOWN_HREFS.has(pageFile)) return;
    const footer = document.querySelector('footer');
    if (!footer || footer.querySelector('nav.foot-nav')) return;
    const nav = document.createElement('nav');
    nav.className = 'foot-nav eclx-generated-foot-nav';
    nav.setAttribute('aria-label', 'Footer navigation');
    NAV_LINKS.forEach(([href,label]) => {
      const a = document.createElement('a'); a.href = href; a.textContent = label;
      if (href === pageFile) { a.classList.add('active'); a.setAttribute('aria-current','page'); }
      nav.appendChild(a);
    });
    footer.insertAdjacentElement('afterbegin', nav);
  }

  function installMobileMenuFallback() {
    const nav = document.querySelector('nav.nav');
    if (!nav || document.querySelector('.burger, .menu-toggle, [aria-controls="nav"]')) return;
    const holder = nav.parentElement;
    if (!holder) return;
    holder.style.position = holder.style.position || 'relative';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'eclx-menu-button';
    button.textContent = 'Menu';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open main navigation');
    button.addEventListener('click', () => {
      const open = nav.classList.toggle('eclx-open');
      button.setAttribute('aria-expanded', String(open));
      button.textContent = open ? 'Close' : 'Menu';
    });
    nav.addEventListener('click', event => {
      if (!event.target.closest('a')) return;
      nav.classList.remove('eclx-open');
      button.setAttribute('aria-expanded', 'false');
      button.textContent = 'Menu';
    });
    holder.appendChild(button);
  }

  function pageProfile() {
    const title = safeText(document.querySelector('h1')?.textContent) || safeText(document.title.split('—')[0].split('·')[0]);
    const p = pageFile;
    if (/^cpge_grammar_chapter/.test(p)) return { id: `grammar:${p}`, domain: 'Grammar', task: `Choose one structure from “${title}”. Produce one accurate example aloud in English class, use it spontaneously in your next colle, then note the correction or feedback you received.` };
    if (/^cpge_vocab_/.test(p) || p === 'flashcards.html') return { id: `vocabulary:${p}`, domain: 'Vocabulary', task: `Choose two useful expressions from “${title}”. Use both aloud in English class and reuse at least one naturally in your next colle.` };
    if (/^colle-atlas-|^atlas-engine/.test(p)) return { id: `civilisation:${p}`, domain: 'Civilisation', task: `Keep one precise fact and one central tension from “${title}”. Explain the connection aloud in class and reuse it as a contextualised example in your next colle.` };
    const profiles = {
      'methodology.html': ['methodology', 'Methodology', 'Choose one method step from this page. Test it aloud in English class, apply it under real conditions in your next colle, and use your teacher’s feedback to set one new priority.'],
      'civilisation.html': ['civilisation', 'Civilisation', 'Choose one country or theme. Prepare one precise fact, one tension and one key question; explain them aloud in class and reuse them in your next colle.'],
      'vocabulary.html': ['vocabulary', 'Vocabulary', 'Select two precise expressions from today’s work. Use them aloud in English class and reuse at least one naturally in your next colle.'],
      'grammar.html': ['grammar', 'Grammar', 'Choose one grammar structure from today’s work. Produce it accurately in English class, then use it spontaneously in your next colle.'],
      'pronunciation.html': ['pronunciation', 'Pronunciation', 'Choose one sound, stress or intonation target. Practise it consciously in English class, monitor it in your next colle and record the feedback you receive.'],
      'timelines.html': ['timelines', 'Timelines', 'Choose one turning point. Explain why it matters in thirty seconds, connect it to a present-day debate in class and reuse it as a contextualised example in your next colle.'],
      'resources.html': ['resources', 'Resources', 'Bring one reliable fact and one genuine question from a source to English class. Reuse the source as evidence or context in your next colle.'],
      'jury-reports.html': ['jury-reports', 'Jury Reports', 'Choose one recurring jury warning. Turn it into a concrete checklist item, test it in your next colle and ask your teacher whether the improvement is visible.'],
      'colle-trainer.html': ['colle-trainer', 'Colle Trainer', 'Identify one weakness during this practice. Ask about it in English class, test one specific improvement in your next real colle and record the feedback afterwards.']
    };
    const entry = profiles[p];
    if (entry) return { id: entry[0], domain: entry[1], task: entry[2] };
    return { id: `practice:${p}`, domain: 'Independent practice', task: `Choose one useful idea from “${title}”. Explain it aloud in English class, test it in your next colle and improve it through teacher feedback.` };
  }

  function loadMissions() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"items":[]}');
      return parsed && Array.isArray(parsed.items) ? parsed : { items: [] };
    } catch (_) { return { items: [] }; }
  }
  function saveMissions(data) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (_) {} }

  function upsertMission(profile, task, extra = {}) {
    const data = loadMissions();
    const now = new Date().toISOString();
    const id = safeText(extra.id || profile.id || `practice:${pageFile}`);
    const existingIndex = data.items.findIndex(item => item.id === id);
    const previous = existingIndex >= 0 ? data.items[existingIndex] : null;
    const item = {
      id,
      domain: safeText(extra.domain || profile.domain || 'Independent practice'),
      task: safeText(task || profile.task),
      page: safeText(extra.page || pageFile),
      pageTitle: safeText(extra.pageTitle || document.querySelector('h1')?.textContent || document.title),
      updatedAt: now,
      note: previous?.note || '',
      status: previous?.status || { prepared: true, class: false, colle: false, feedback: false }
    };
    if (existingIndex >= 0) data.items[existingIndex] = item; else data.items.unshift(item);
    data.items = data.items.slice(0, 12);
    saveMissions(data);
    window.dispatchEvent(new CustomEvent('eclx-missions-updated'));
    return item;
  }
  function updateStatus(id, key, checked) {
    const data = loadMissions(), item = data.items.find(entry => entry.id === id);
    if (!item) return;
    item.status = item.status || {}; item.status[key] = Boolean(checked); item.updatedAt = new Date().toISOString();
    saveMissions(data); window.dispatchEvent(new CustomEvent('eclx-missions-updated'));
  }
  function updateNote(id, note) {
    const data = loadMissions(), item = data.items.find(entry => entry.id === id);
    if (!item) return;
    item.note = safeText(note); item.updatedAt = new Date().toISOString(); saveMissions(data);
  }
  function removeMission(id) { const data = loadMissions(); data.items = data.items.filter(item => item.id !== id); saveMissions(data); window.dispatchEvent(new CustomEvent('eclx-missions-updated')); }

  function statusMarkup(item) {
    const s = item.status || {};
    const checks = [['prepared','Prepared here'],['class','Used in class'],['colle','Tested in a colle'],['feedback','Improved after feedback']];
    return `<div class="eclx-status-row">${checks.map(([key,label]) => `<label class="eclx-status"><input type="checkbox" data-eclx-status="${key}" data-eclx-id="${escapeHtml(item.id)}" ${s[key]?'checked':''}><span>${label}</span></label>`).join('')}</div>`;
  }

  function insertTransferBanner() {
    if (isHome || document.querySelector('.eclx-transfer-banner')) return;
    const banner = document.createElement('div');
    banner.className = 'eclx-transfer-banner'; banner.setAttribute('role', 'note');
    banner.innerHTML = `<div class="eclx-inner"><span><strong>English classes and regular colles are indispensable.</strong> Prepare here, use it aloud in class, test it in a real colle and improve through teacher feedback.</span></div>`;
    const header = document.querySelector('header, .top, .site-header');
    if (header?.parentNode) header.insertAdjacentElement('afterend', banner); else document.body.insertAdjacentElement('afterbegin', banner);
  }

  function insertPageMission() {
    if (isHome || document.querySelector('.eclx-transfer-reminder')) return;
    const profile = pageProfile();
    const section = document.createElement('section');
    section.className = 'eclx-mission-section eclx-transfer-reminder';
    section.setAttribute('aria-label', 'Class and colle transfer');
    section.innerHTML = `<div class="eclx-transfer-reminder-inner"><strong>Use it beyond the screen.</strong><span>${escapeHtml(profile.task)}</span></div>`;
    const footer = document.querySelector('footer');
    if (footer?.parentNode) footer.parentNode.insertBefore(section, footer); else document.body.appendChild(section);
  }

  function renderDashboard() {
    const host = document.querySelector('#eclx-dashboard-list'); if (!host) return;
    const items = loadMissions().items || [];
    if (!items.length) {
      host.innerHTML = `<div class="eclx-empty">No mission yet. Open any section, choose one concrete task and select <strong>Add to my mission</strong>. Your goal is not to finish pages: it is to reuse useful work in English class and in real colles.</div>`;
      document.querySelector('#eclx-progress-bar')?.style.setProperty('width','0%');
      const meta = document.querySelector('#eclx-progress-count'); if (meta) meta.textContent = '0 of 0 transfer steps completed';
      return;
    }
    host.innerHTML = items.map(item => `<article class="eclx-mission-item"><div class="eclx-mission-top"><div><span class="eclx-domain">${escapeHtml(item.domain)}</span><p class="eclx-mission-task">${escapeHtml(item.task)}</p>${item.page && item.page !== 'index.html' ? `<a class="eclx-source" href="${escapeHtml(item.page)}">Open the source page →</a>` : ''}</div><button class="eclx-remove" type="button" data-eclx-remove="${escapeHtml(item.id)}" aria-label="Remove ${escapeHtml(item.domain)} mission">×</button></div>${statusMarkup(item)}<details class="eclx-note" ${item.note?'open':''}><summary>Teacher feedback &amp; next priority</summary><textarea class="eclx-note-input" data-eclx-note="${escapeHtml(item.id)}" placeholder="What did your teacher correct? What will you focus on next?">${escapeHtml(item.note || '')}</textarea></details></article>`).join('');
    const total = items.length * 4;
    const done = items.reduce((sum,item) => sum + Object.values(item.status || {}).filter(Boolean).length,0);
    const percent = total ? Math.round(done/total*100) : 0;
    document.querySelector('#eclx-progress-bar')?.style.setProperty('width',`${percent}%`);
    const meta = document.querySelector('#eclx-progress-count'); if (meta) meta.textContent = `${done} of ${total} transfer steps completed`;
  }

  function insertDashboard() {
    if (!isHome || document.querySelector('.eclx-dashboard')) return;
    const section = document.createElement('section');
    section.className='eclx-dashboard'; section.id='class-colle-mission'; section.setAttribute('aria-labelledby','eclx-dashboard-title');
    section.innerHTML=`<div class="eclx-card"><div class="eclx-card-head"><div class="eclx-eyebrow">Your active transfer loop</div><h2 class="eclx-title" id="eclx-dashboard-title">Your class &amp; colle mission</h2><p class="eclx-sub">Independent work is preparation, not the final destination. Track what you have actually used in English class, tested in a real colle and improved after feedback.</p></div><div class="eclx-card-body"><div class="eclx-progress-wrap"><div class="eclx-progress-meta"><span>Real-world transfer</span><span id="eclx-progress-count">0 of 0 transfer steps completed</span></div><div class="eclx-progress" aria-hidden="true"><span id="eclx-progress-bar"></span></div></div><div class="eclx-dashboard-grid" id="eclx-dashboard-list"></div><div class="eclx-actions"><button type="button" class="eclx-btn eclx-secondary" id="eclx-copy-missions">Copy my mission</button><button type="button" class="eclx-btn eclx-ghost" id="eclx-clear-completed">Remove completed missions</button></div><div class="eclx-feedback" id="eclx-dashboard-feedback" aria-live="polite"></div></div></div>`;
    const anchor = document.querySelector('.pathway, section.pathway, [class*="pathway"]');
    if (anchor?.parentNode) anchor.parentNode.insertBefore(section,anchor); else document.querySelector('main')?.appendChild(section) || document.body.appendChild(section);
    section.addEventListener('change', event => {
      const target=event.target;
      if (target instanceof HTMLInputElement && target.matches('[data-eclx-status]')) updateStatus(target.dataset.eclxId,target.dataset.eclxStatus,target.checked);
      if (target instanceof HTMLTextAreaElement && target.matches('[data-eclx-note]')) updateNote(target.dataset.eclxNote,target.value);
    });
    section.addEventListener('click', async event => {
      const removeButton=event.target.closest('[data-eclx-remove]'); if (removeButton) { removeMission(removeButton.dataset.eclxRemove); return; }
      if (event.target.closest('#eclx-clear-completed')) { const data=loadMissions(); data.items=data.items.filter(item=>!['prepared','class','colle','feedback'].every(key=>item.status?.[key])); saveMissions(data); window.dispatchEvent(new CustomEvent('eclx-missions-updated')); return; }
      if (event.target.closest('#eclx-copy-missions')) {
        const text=loadMissions().items.map(item=>`${item.domain}: ${item.task}${item.note?`\nFeedback/next priority: ${item.note}`:''}`).join('\n\n');
        const feedback=section.querySelector('#eclx-dashboard-feedback');
        if (!text) { if(feedback) feedback.textContent='Add at least one mission first.'; return; }
        try { await navigator.clipboard.writeText(text); if(feedback) feedback.textContent='Mission copied. Bring it to class or keep it with your colle notes.'; }
        catch(_) { if(feedback) feedback.textContent='Copying was blocked by the browser. Select the mission text manually.'; }
      }
    });
    window.addEventListener('eclx-missions-updated',renderDashboard); renderDashboard();
  }

  function bindExternalMissionAPI() {
    const add = detail => {
      const d = detail || {};
      const profile = { id: safeText(d.id || `practice:${pageFile}`), domain: safeText(d.domain || 'Independent practice'), task: safeText(d.task || pageProfile().task) };
      return upsertMission(profile,profile.task,{ page:d.page || pageFile,pageTitle:d.pageTitle || document.title });
    };
    window.ECLTransfer = { addMission:add, getMissions:() => loadMissions().items.slice() };
    window.addEventListener('eclx-add-mission', event => add(event.detail));
  }

  function removeLegacyMissionUI() {
    document.querySelectorAll('.eclx-dashboard').forEach(element => element.remove());
    document.querySelectorAll('a[href*="#class-colle-mission"]').forEach(link => link.remove());
  }

  function parseDisplayedDate(dateEl) {
    if (dateEl.dataset.iso) { const d=new Date(dateEl.dataset.iso); if(Number.isFinite(d.getTime())) return d; }
    const text=safeText(dateEl.textContent);
    const direct=new Date(text); if(Number.isFinite(direct.getTime())) return direct;
    const months={january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11};
    const m=text.toLowerCase().match(/(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)?\s*(\d{1,2})\s+([a-z]+)\s+(\d{4})/);
    if (!m || months[m[2]]===undefined) return null;
    return new Date(Number(m[3]),months[m[2]],Number(m[1]));
  }
  function addFreshnessWarning() {
    if (!isHome) return;
    const dateEl=document.querySelector('.news-date'); if(!dateEl) return;
    const check=()=>{
      const parsed=parseDisplayedDate(dateEl); if(!parsed) return;
      const ageDays=Math.floor((Date.now()-parsed.getTime())/86400000);
      const existing=document.querySelector('.eclx-stale-note');
      if(ageDays>2&&!existing){const note=document.createElement('div');note.className='eclx-stale-note';note.setAttribute('role','status');note.textContent=`Last successful update: ${safeText(dateEl.textContent)}. The automatic brief may be delayed; verify current information before reusing it in class or in a colle.`;(dateEl.closest('.news-body')||dateEl.parentElement)?.appendChild(note);} else if(ageDays<=2&&existing) existing.remove();
    };
    check(); new MutationObserver(check).observe(dateEl,{childList:true,characterData:true,subtree:true,attributes:true,attributeFilter:['data-iso']}); setTimeout(check,5000);
  }

  function insertAccessibilityFallback() {
    if (document.querySelector('#openA11y,.a11y-btn,[aria-label*="ccessibility"]')) return;
    const button=document.createElement('button'); button.type='button'; button.className='eclx-a11y-fab'; button.setAttribute('aria-label','Accessibility settings'); button.textContent='Aa';
    const scrim=document.createElement('div'); scrim.className='eclx-a11y-scrim';
    const dialog=document.createElement('aside'); dialog.className='eclx-a11y-dialog'; dialog.setAttribute('role','dialog'); dialog.setAttribute('aria-modal','true'); dialog.setAttribute('aria-label','Accessibility settings');
    dialog.innerHTML=`<button class="eclx-a11y-close" type="button" aria-label="Close">×</button><h2>Accessibility</h2><p>These settings are saved on this device.</p><div class="eclx-a11y-grid"><button class="eclx-a11y-option" type="button" data-eclx-a11y="large">Larger text <span>Off</span></button><button class="eclx-a11y-option" type="button" data-eclx-a11y="contrast">High contrast <span>Off</span></button><button class="eclx-a11y-option" type="button" data-eclx-a11y="readable">Reading-friendly text <span>Off</span></button><button class="eclx-a11y-option" type="button" data-eclx-a11y="reduce">Reduce motion <span>Off</span></button></div>`;
    const keys={large:'eclx-large',contrast:'eclx-contrast',readable:'eclx-readable',reduce:'eclx-reduce'};
    const apply=(key,on)=>{const cls=keys[key]; if(key==='large') document.documentElement.classList.toggle(cls,on); else document.body.classList.toggle(cls,on); try{localStorage.setItem(`eclxA11y:${key}`,on?'1':'0');}catch(_){} const opt=dialog.querySelector(`[data-eclx-a11y="${key}"]`); if(opt){opt.setAttribute('aria-pressed',String(on));opt.querySelector('span').textContent=on?'On':'Off';}};
    Object.keys(keys).forEach(key=>{let on=false;try{on=localStorage.getItem(`eclxA11y:${key}`)==='1';}catch(_){}apply(key,on);});
    const close=()=>{dialog.classList.remove('open');scrim.classList.remove('open');button.focus();};
    button.addEventListener('click',()=>{dialog.classList.add('open');scrim.classList.add('open');dialog.querySelector('button')?.focus();}); scrim.addEventListener('click',close); dialog.querySelector('.eclx-a11y-close').addEventListener('click',close);
    dialog.addEventListener('click',event=>{const opt=event.target.closest('[data-eclx-a11y]');if(!opt)return;apply(opt.dataset.eclxA11y,opt.getAttribute('aria-pressed')!=='true');});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&dialog.classList.contains('open'))close();});
    document.body.append(scrim,dialog,button);
  }

  function init() {
    injectStyles();
    removeLegacyMissionUI();
    normalizeNavigation();
    ensureHubFooterNavigation();
    installMobileMenuFallback();
    insertTransferBanner();
    insertPageMission();
    addFreshnessWarning();
    insertAccessibilityFallback();
    document.documentElement.dataset.eclxCore=VERSION;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
