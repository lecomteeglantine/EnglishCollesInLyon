/* English Colles in Lyon — shared navigation and class/colle transfer loop */
(() => {
  'use strict';

  const VERSION = '2026-07-15-1';
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

  function safeText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function injectStyles() {
    if (document.getElementById('eclx-style')) return;
    const style = document.createElement('style');
    style.id = 'eclx-style';
    style.textContent = `
      .eclx-transfer-banner,
      .eclx-mission-section,
      .eclx-dashboard{font-family:var(--font,"Atkinson Hyperlegible",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif)}
      .eclx-transfer-banner{background:linear-gradient(90deg,rgba(36,59,83,.98),rgba(49,90,120,.96));color:#fff;border-bottom:1px solid rgba(255,255,255,.18)}
      .eclx-transfer-banner .eclx-inner{max-width:var(--maxw,1120px);margin:0 auto;padding:11px 20px;display:flex;align-items:center;justify-content:center;gap:10px;text-align:center;font-size:.91rem;line-height:1.45}
      .eclx-transfer-banner strong{color:#fff;font-weight:800}.eclx-transfer-banner a{color:#fff;text-decoration:underline;text-underline-offset:3px;font-weight:700}
      .eclx-mission-section,.eclx-dashboard{max-width:var(--maxw,1120px);margin:34px auto;padding:0 20px}
      .eclx-card{background:var(--card,#fff);border:1px solid var(--line,#E6D8C8);border-radius:var(--r,16px);box-shadow:var(--shadow,0 10px 30px rgba(36,59,83,.07));overflow:hidden}
      .eclx-card-head{padding:22px 24px 17px;background:linear-gradient(135deg,rgba(196,106,74,.11),rgba(122,155,118,.13));border-bottom:1px solid var(--line,#E6D8C8)}
      .eclx-eyebrow{font-size:.72rem;letter-spacing:.15em;text-transform:uppercase;font-weight:800;color:var(--terra,#C46A4A);margin-bottom:6px}
      .eclx-title{margin:0;color:var(--navy,#243B53);font-family:var(--display,"Fraunces",Georgia,serif);font-size:clamp(1.35rem,2.5vw,1.85rem);line-height:1.2}
      .eclx-sub{margin:8px 0 0;color:var(--muted,#5d6b66);font-size:.96rem;line-height:1.55}
      .eclx-card-body{padding:22px 24px 24px}
      .eclx-task-label{display:block;font-size:.77rem;text-transform:uppercase;letter-spacing:.1em;font-weight:800;color:var(--navy,#243B53);margin-bottom:8px}
      .eclx-task-input{width:100%;min-height:94px;resize:vertical;border:1px solid var(--line,#E6D8C8);border-radius:12px;padding:13px 14px;background:var(--bg2,#FFF7ED);color:var(--ink,#22312F);font:inherit;line-height:1.5}
      .eclx-task-input:focus{outline:3px solid rgba(196,106,74,.24);border-color:var(--terra,#C46A4A)}
      .eclx-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:15px;align-items:center}
      .eclx-btn{min-height:44px;padding:0 16px;border-radius:11px;border:2px solid transparent;font:inherit;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;text-decoration:none;transition:transform .15s,box-shadow .2s,background .2s}
      .eclx-btn:hover{transform:translateY(-1px)}
      .eclx-primary{background:var(--terra,#C46A4A);color:#fff;box-shadow:var(--shadow,0 10px 30px rgba(36,59,83,.07))}
      .eclx-secondary{background:var(--navy,#243B53);color:#fff}.eclx-ghost{background:transparent;color:var(--navy,#243B53);border-color:var(--line,#E6D8C8)}
      .eclx-feedback{min-height:1.4em;margin-top:10px;font-size:.9rem;font-weight:700;color:var(--sage,#617c5f)}
      .eclx-status-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-top:18px}
      .eclx-status{display:flex;align-items:flex-start;gap:8px;border:1px solid var(--line,#E6D8C8);border-radius:11px;padding:10px;background:var(--bg2,#FFF7ED);font-size:.86rem;line-height:1.3}
      .eclx-status input{margin-top:2px;accent-color:var(--terra,#C46A4A);width:17px;height:17px;flex:0 0 auto}
      .eclx-dashboard-grid{display:grid;gap:13px;margin-top:16px}
      .eclx-empty{padding:18px;border:1px dashed var(--line,#E6D8C8);border-radius:12px;color:var(--muted,#5d6b66);background:var(--bg2,#FFF7ED)}
      .eclx-mission-item{border:1px solid var(--line,#E6D8C8);border-radius:13px;padding:15px;background:#fff}
      .eclx-mission-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
      .eclx-domain{display:inline-flex;align-items:center;border-radius:999px;padding:4px 10px;background:rgba(36,59,83,.09);color:var(--navy,#243B53);font-size:.75rem;font-weight:800;letter-spacing:.05em;text-transform:uppercase}
      .eclx-mission-task{margin:9px 0 0;color:var(--ink,#22312F);line-height:1.5}
      .eclx-remove{border:0;background:transparent;color:var(--muted,#5d6b66);font-size:1.2rem;cursor:pointer;padding:2px 5px;border-radius:7px}
      .eclx-remove:hover{background:rgba(196,106,74,.12);color:var(--terra,#C46A4A)}
      .eclx-progress-wrap{margin-top:16px}.eclx-progress-meta{display:flex;justify-content:space-between;gap:12px;font-size:.85rem;font-weight:700;color:var(--muted,#5d6b66);margin-bottom:6px}
      .eclx-progress{height:10px;border-radius:999px;background:var(--line,#E6D8C8);overflow:hidden}.eclx-progress>span{display:block;height:100%;background:linear-gradient(90deg,var(--terra,#C46A4A),var(--sage,#7A9B76));width:0;transition:width .25s}
      .eclx-stale-note{margin-top:9px;padding:8px 10px;border-radius:9px;background:#fff3cd;color:#6b5200;border:1px solid #ead791;font-size:.8rem;line-height:1.35}
      @media(max-width:760px){.eclx-status-row{grid-template-columns:1fr 1fr}.eclx-card-head,.eclx-card-body{padding-left:18px;padding-right:18px}.eclx-transfer-banner .eclx-inner{font-size:.85rem}.eclx-actions .eclx-btn{width:100%}}
      @media(max-width:460px){.eclx-status-row{grid-template-columns:1fr}}
      body.contrast .eclx-transfer-banner,body.high-contrast .eclx-transfer-banner{background:#000;color:#fff}
      body.contrast .eclx-card,body.high-contrast .eclx-card,body.contrast .eclx-mission-item,body.high-contrast .eclx-mission-item{border-color:#000;box-shadow:none}
    `;
    document.head.appendChild(style);
  }

  function normalizeNavigation() {
    const current = pageFile || 'index.html';
    const candidates = document.querySelectorAll('nav.nav, nav.foot-nav');
    candidates.forEach(nav => {
      const existing = [...nav.querySelectorAll('a[href]')];
      const knownCount = existing.filter(a => KNOWN_HREFS.has((a.getAttribute('href') || '').split('#')[0].toLowerCase()) || /about\.html$/i.test(a.getAttribute('href') || '')).length;
      if (knownCount < 3) return;
      nav.innerHTML = '';
      NAV_LINKS.forEach(([href, label]) => {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = label;
        if (current === href) {
          a.classList.add('active');
          a.setAttribute('aria-current', 'page');
        }
        nav.appendChild(a);
      });
    });
    document.querySelectorAll('a[href$="about.html"]').forEach(a => a.remove());
  }

  function pageProfile() {
    const title = safeText(document.querySelector('h1')?.textContent) || safeText(document.title.split('—')[0].split('·')[0]);
    const p = pageFile;

    if (/^cpge_grammar_chapter/.test(p)) return {
      id: 'grammar', domain: 'Grammar',
      task: `Choose one structure from “${title}”. Produce one accurate example aloud in English class, use it spontaneously in your next colle, then note the correction or feedback you received.`
    };
    if (/^cpge_vocab_/.test(p) || p === 'flashcards.html') return {
      id: 'vocabulary', domain: 'Vocabulary',
      task: `Choose two useful expressions from “${title}”. Use both aloud in English class and reuse at least one naturally in your next colle.`
    };
    if (/^colle-atlas-|^atlas-engine/.test(p)) return {
      id: 'civilisation', domain: 'Civilisation',
      task: `Keep one precise fact and one central tension from “${title}”. Explain the connection aloud in class and reuse it as a contextualised example in your next colle.`
    };

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
    return {
      id: 'practice', domain: 'Independent practice',
      task: `Choose one useful idea from “${title}”. Explain it aloud in English class, test it in your next colle and improve it through teacher feedback.`
    };
  }

  function loadMissions() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"items":[]}');
      if (!parsed || !Array.isArray(parsed.items)) return { items: [] };
      return parsed;
    } catch (_) {
      return { items: [] };
    }
  }

  function saveMissions(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (_) {}
  }

  function upsertMission(profile, task) {
    const data = loadMissions();
    const now = new Date().toISOString();
    const existingIndex = data.items.findIndex(item => item.id === profile.id);
    const previous = existingIndex >= 0 ? data.items[existingIndex] : null;
    const item = {
      id: profile.id,
      domain: profile.domain,
      task: safeText(task),
      page: pageFile,
      pageTitle: safeText(document.querySelector('h1')?.textContent || document.title),
      updatedAt: now,
      status: previous?.status || { prepared: false, class: false, colle: false, feedback: false }
    };
    if (existingIndex >= 0) data.items[existingIndex] = item;
    else data.items.unshift(item);
    data.items = data.items.slice(0, 10);
    saveMissions(data);
    window.dispatchEvent(new CustomEvent('eclx-missions-updated'));
    return item;
  }

  function updateStatus(id, key, checked) {
    const data = loadMissions();
    const item = data.items.find(entry => entry.id === id);
    if (!item) return;
    item.status = item.status || {};
    item.status[key] = Boolean(checked);
    item.updatedAt = new Date().toISOString();
    saveMissions(data);
    window.dispatchEvent(new CustomEvent('eclx-missions-updated'));
  }

  function removeMission(id) {
    const data = loadMissions();
    data.items = data.items.filter(item => item.id !== id);
    saveMissions(data);
    window.dispatchEvent(new CustomEvent('eclx-missions-updated'));
  }

  function statusMarkup(item) {
    const s = item.status || {};
    const checks = [
      ['prepared', 'Prepared here'],
      ['class', 'Used in class'],
      ['colle', 'Tested in a colle'],
      ['feedback', 'Improved after feedback']
    ];
    return `<div class="eclx-status-row">${checks.map(([key, label]) => `
      <label class="eclx-status"><input type="checkbox" data-eclx-status="${key}" data-eclx-id="${escapeHtml(item.id)}" ${s[key] ? 'checked' : ''}><span>${label}</span></label>
    `).join('')}</div>`;
  }

  function insertTransferBanner() {
    if (document.querySelector('.eclx-transfer-banner')) return;
    const banner = document.createElement('div');
    banner.className = 'eclx-transfer-banner';
    banner.setAttribute('role', 'note');
    banner.innerHTML = `<div class="eclx-inner"><span><strong>English classes and regular colles are indispensable.</strong> Prepare here, use it aloud in class, test it in a real colle and improve through teacher feedback.${isHome ? '' : ' <a href="index.html#class-colle-mission">View your mission</a>'}</span></div>`;

    const header = document.querySelector('header, .top, .site-header');
    if (header && header.parentNode) header.insertAdjacentElement('afterend', banner);
    else document.body.insertAdjacentElement('afterbegin', banner);
  }

  function insertPageMission() {
    if (isHome || document.querySelector('.eclx-mission-section')) return;
    const profile = pageProfile();
    const section = document.createElement('section');
    section.className = 'eclx-mission-section';
    section.id = 'class-colle-transfer';
    section.setAttribute('aria-labelledby', 'eclx-mission-title');
    section.innerHTML = `
      <div class="eclx-card">
        <div class="eclx-card-head">
          <div class="eclx-eyebrow">Prepare → Class → Colle → Feedback</div>
          <h2 class="eclx-title" id="eclx-mission-title">Do not stop at the screen.</h2>
          <p class="eclx-sub">Save one concrete task. The page is only preparation: the skill must be spoken in class, tested in a real colle and adjusted through teacher feedback.</p>
        </div>
        <div class="eclx-card-body">
          <label class="eclx-task-label" for="eclx-task-input">Suggested class &amp; colle mission</label>
          <textarea class="eclx-task-input" id="eclx-task-input">${escapeHtml(profile.task)}</textarea>
          <div class="eclx-actions">
            <button type="button" class="eclx-btn eclx-primary" id="eclx-add-mission">Add to my mission</button>
            <a class="eclx-btn eclx-ghost" href="index.html#class-colle-mission">Open mission dashboard</a>
          </div>
          <div class="eclx-feedback" id="eclx-add-feedback" aria-live="polite"></div>
        </div>
      </div>`;

    const footer = document.querySelector('footer');
    if (footer?.parentNode) footer.parentNode.insertBefore(section, footer);
    else document.body.appendChild(section);

    section.querySelector('#eclx-add-mission')?.addEventListener('click', () => {
      const task = section.querySelector('#eclx-task-input')?.value || profile.task;
      upsertMission(profile, task);
      const feedback = section.querySelector('#eclx-add-feedback');
      if (feedback) feedback.textContent = 'Mission saved on this device. It is now visible on the homepage.';
    });
  }

  function renderDashboard() {
    const host = document.querySelector('#eclx-dashboard-list');
    if (!host) return;
    const data = loadMissions();
    const items = data.items || [];
    if (!items.length) {
      host.innerHTML = `<div class="eclx-empty">No mission yet. Open any section, choose one concrete task and select <strong>Add to my mission</strong>. Your goal is not to finish pages: it is to reuse useful work in English class and in real colles.</div>`;
      const bar = document.querySelector('#eclx-progress-bar');
      if (bar) bar.style.width = '0%';
      const meta = document.querySelector('#eclx-progress-count');
      if (meta) meta.textContent = '0 of 0 transfer steps completed';
      return;
    }

    host.innerHTML = items.map(item => `
      <article class="eclx-mission-item">
        <div class="eclx-mission-top">
          <div><span class="eclx-domain">${escapeHtml(item.domain)}</span><p class="eclx-mission-task">${escapeHtml(item.task)}</p></div>
          <button class="eclx-remove" type="button" data-eclx-remove="${escapeHtml(item.id)}" aria-label="Remove ${escapeHtml(item.domain)} mission">×</button>
        </div>
        ${statusMarkup(item)}
      </article>
    `).join('');

    const total = items.length * 4;
    const done = items.reduce((sum, item) => sum + Object.values(item.status || {}).filter(Boolean).length, 0);
    const percent = total ? Math.round((done / total) * 100) : 0;
    const bar = document.querySelector('#eclx-progress-bar');
    if (bar) bar.style.width = `${percent}%`;
    const meta = document.querySelector('#eclx-progress-count');
    if (meta) meta.textContent = `${done} of ${total} transfer steps completed`;
  }

  function insertDashboard() {
    if (!isHome || document.querySelector('.eclx-dashboard')) return;
    const section = document.createElement('section');
    section.className = 'eclx-dashboard';
    section.id = 'class-colle-mission';
    section.setAttribute('aria-labelledby', 'eclx-dashboard-title');
    section.innerHTML = `
      <div class="eclx-card">
        <div class="eclx-card-head">
          <div class="eclx-eyebrow">Your active transfer loop</div>
          <h2 class="eclx-title" id="eclx-dashboard-title">Your class &amp; colle mission</h2>
          <p class="eclx-sub">Independent work is preparation, not the final destination. Track what you have actually used in English class, tested in a real colle and improved after feedback.</p>
        </div>
        <div class="eclx-card-body">
          <div class="eclx-progress-wrap">
            <div class="eclx-progress-meta"><span>Real-world transfer</span><span id="eclx-progress-count">0 of 0 transfer steps completed</span></div>
            <div class="eclx-progress" aria-hidden="true"><span id="eclx-progress-bar"></span></div>
          </div>
          <div class="eclx-dashboard-grid" id="eclx-dashboard-list"></div>
          <div class="eclx-actions">
            <button type="button" class="eclx-btn eclx-secondary" id="eclx-copy-missions">Copy my mission</button>
            <button type="button" class="eclx-btn eclx-ghost" id="eclx-clear-completed">Remove completed missions</button>
          </div>
          <div class="eclx-feedback" id="eclx-dashboard-feedback" aria-live="polite"></div>
        </div>
      </div>`;

    const anchor = document.querySelector('.pathway, section.pathway, [class*="pathway"]');
    if (anchor?.parentNode) anchor.parentNode.insertBefore(section, anchor);
    else {
      const main = document.querySelector('main');
      if (main) main.appendChild(section);
      else document.body.appendChild(section);
    }

    section.addEventListener('change', event => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || !target.matches('[data-eclx-status]')) return;
      updateStatus(target.dataset.eclxId, target.dataset.eclxStatus, target.checked);
    });
    section.addEventListener('click', async event => {
      const removeButton = event.target.closest('[data-eclx-remove]');
      if (removeButton) {
        removeMission(removeButton.dataset.eclxRemove);
        return;
      }
      if (event.target.closest('#eclx-clear-completed')) {
        const data = loadMissions();
        data.items = data.items.filter(item => !['prepared','class','colle','feedback'].every(key => item.status?.[key]));
        saveMissions(data);
        window.dispatchEvent(new CustomEvent('eclx-missions-updated'));
        return;
      }
      if (event.target.closest('#eclx-copy-missions')) {
        const data = loadMissions();
        const text = data.items.map(item => `${item.domain}: ${item.task}`).join('\n');
        const feedback = section.querySelector('#eclx-dashboard-feedback');
        if (!text) {
          if (feedback) feedback.textContent = 'Add at least one mission first.';
          return;
        }
        try {
          await navigator.clipboard.writeText(text);
          if (feedback) feedback.textContent = 'Mission copied. Bring it to class or keep it with your colle notes.';
        } catch (_) {
          if (feedback) feedback.textContent = 'Copying was blocked by the browser. Select the mission text manually.';
        }
      }
    });

    window.addEventListener('eclx-missions-updated', renderDashboard);
    renderDashboard();
  }

  function bindStatusChangesOutsideDashboard() {
    document.addEventListener('change', event => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || !target.matches('[data-eclx-status]')) return;
      if (target.closest('.eclx-dashboard')) return;
      updateStatus(target.dataset.eclxId, target.dataset.eclxStatus, target.checked);
    });
  }

  function addFreshnessWarning() {
    if (!isHome) return;
    const dateEl = document.querySelector('.news-date');
    if (!dateEl) return;
    const check = () => {
      const text = safeText(dateEl.textContent);
      const parsed = Date.parse(text);
      if (!Number.isFinite(parsed)) return;
      const ageDays = Math.floor((Date.now() - parsed) / 86400000);
      const existing = document.querySelector('.eclx-stale-note');
      if (ageDays > 2 && !existing) {
        const note = document.createElement('div');
        note.className = 'eclx-stale-note';
        note.textContent = `Last successful update: ${text}. The automatic brief may be delayed; verify current information before reusing it in class or in a colle.`;
        (dateEl.closest('.news-body') || dateEl.parentElement)?.appendChild(note);
      } else if (ageDays <= 2 && existing) existing.remove();
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(dateEl, { childList: true, characterData: true, subtree: true });
  }

  function init() {
    injectStyles();
    normalizeNavigation();
    insertTransferBanner();
    insertDashboard();
    insertPageMission();
    bindStatusChangesOutsideDashboard();
    addFreshnessWarning();
    document.documentElement.dataset.eclxCore = VERSION;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
