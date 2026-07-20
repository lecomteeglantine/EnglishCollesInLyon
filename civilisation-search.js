/**
 * Civilisation search — English Colles in Lyon
 * Google-style suggestions across the Civilisation hub and the eight country atlases.
 */
(() => {
  'use strict';

  const inputBeforeClone = document.getElementById('countrySearch');
  if (!inputBeforeClone) return;

  /*
   * The old inline script attached a filtering listener to this field.
   * Cloning the input removes those old listeners without changing its appearance.
   */
  const input = inputBeforeClone.cloneNode(true);
  input.value = inputBeforeClone.value || '';
  inputBeforeClone.replaceWith(input);

  const controls = input.closest('.controls') || input.parentElement;
  if (!controls) return;

  const CURRENT_PAGE = 'civilisation.html';
  const MAX_RESULTS = 9;
  const MIN_QUERY_LENGTH = 2;

  const COUNTRY_DATA = [
    {
      code: 'gb',
      country: 'United Kingdom',
      page: 'colle-atlas-gb.html',
      overview: 'Monarchy, Parliament, Brexit, the NHS, devolution and the four nations.',
      topics: [
        'The monarchy',
        'Parliament',
        'The House of Commons',
        'The House of Lords',
        'The British Constitution',
        'Brexit',
        'The European Union',
        'The NHS',
        'Devolution',
        'Scotland and independence',
        'Northern Ireland',
        'The four nations',
        'The electoral system',
        'Immigration',
        'British identity',
        'Class and inequality'
      ]
    },
    {
      code: 'us',
      country: 'United States',
      page: 'colle-atlas-us.html',
      overview: 'The Constitution, federalism, race, guns, inequality and political polarisation.',
      topics: [
        'The US Constitution',
        'Separation of powers',
        'Checks and balances',
        'Federalism',
        'The Electoral College',
        'The Supreme Court',
        'Congress',
        'The presidency',
        'Civil rights',
        'Race and inequality',
        'Gun rights and gun control',
        'Immigration',
        'Healthcare',
        'Political polarisation',
        'American identity',
        'The four regions'
      ]
    },
    {
      code: 'ie',
      country: 'Ireland',
      page: 'colle-atlas-ie.html',
      overview: 'Independence, partition, the border, the Troubles and rapid social change.',
      topics: [
        'Irish independence',
        'The Easter Rising',
        'The partition of Ireland',
        'Northern Ireland',
        'The Troubles',
        'The Good Friday Agreement',
        'The Irish border',
        'Irish reunification',
        'The Catholic Church',
        'Rapid social change',
        'The Celtic Tiger',
        'Housing and inequality',
        'Ireland and the European Union',
        'The great paradoxes'
      ]
    },
    {
      code: 'ca',
      country: 'Canada',
      page: 'colle-atlas-ca.html',
      overview: 'Federalism, Quebec, multiculturalism and Indigenous reconciliation.',
      topics: [
        'Canadian federalism',
        'Quebec',
        'Bilingualism',
        'Multiculturalism',
        'The Charter of Rights and Freedoms',
        'Indigenous peoples in Canada',
        'Residential schools',
        'Intergenerational trauma',
        'The Truth and Reconciliation Commission',
        'Reconciliation',
        'Immigration',
        'Climate policy',
        'Canadian identity',
        'Unity and diversity'
      ]
    },
    {
      code: 'au',
      country: 'Australia',
      page: 'colle-atlas-au.html',
      overview: 'The monarchy debate, migration, climate and Indigenous Australia.',
      topics: [
        'The monarchy and the republic debate',
        'Aboriginal and Torres Strait Islander peoples',
        'The Uluru Statement from the Heart',
        'Voice, Treaty and Truth',
        'The Indigenous Voice referendum',
        'The Stolen Generations',
        'Reconciliation',
        'Immigration',
        'Multicultural Australia',
        'Climate change',
        'Bushfires',
        'Mining',
        'Australian federalism',
        'Australian identity'
      ]
    },
    {
      code: 'nz',
      country: 'New Zealand',
      page: 'colle-atlas-nz.html',
      overview: 'Te Tiriti o Waitangi, Māori identity, biculturalism and a small-nation model.',
      topics: [
        'Te Tiriti o Waitangi',
        'The Treaty of Waitangi',
        'Māori identity',
        'Māori rights',
        'The Crown and Māori',
        'Biculturalism',
        'Multiculturalism',
        'Treaty settlements',
        'Sovereignty',
        'The monarchy',
        'MMP electoral system',
        'New Zealand identity',
        'Aotearoa New Zealand',
        'Small nation and global voice'
      ]
    },
    {
      code: 'in',
      country: 'India',
      page: 'colle-atlas-in.html',
      overview: 'Democracy, partition, inequality and the rise of a global power.',
      topics: [
        'The British Raj',
        'Indian independence',
        'The Partition of India',
        'India and Pakistan',
        'Mahatma Gandhi',
        'Jawaharlal Nehru',
        'The Indian Constitution',
        'Federalism in India',
        'The caste system',
        'Religious nationalism',
        'Hindutva',
        'Democracy and majoritarianism',
        'Economic growth',
        'Inequality',
        'Kashmir',
        'India as a global power'
      ]
    },
    {
      code: 'za',
      country: 'South Africa',
      page: 'colle-atlas-za.html',
      overview: 'Apartheid, reconciliation, inequality and the promises of the rainbow nation.',
      topics: [
        'Apartheid',
        'Nelson Mandela',
        'The African National Congress',
        'The end of apartheid',
        'The Truth and Reconciliation Commission',
        'The South African Constitution',
        'The rainbow nation',
        'Racial inequality',
        'Economic inequality',
        'Land reform',
        'Townships',
        'Reconciliation',
        'Xenophobia',
        'Load shedding'
      ]
    }
  ];

  const SPECIAL_RESULTS = [
    {
      title: 'Explore countries by theme',
      type: 'Civilisation activity',
      country: 'Cross-country thinking',
      description: 'Compare democracy, identity, empire, inequality and sovereignty across countries.',
      href: `${CURRENT_PAGE}#themes`,
      keywords: 'themes comparison democracy identity empire inequality sovereignty'
    },
    {
      title: 'Country Detective',
      type: 'Practice activity',
      country: 'Civilisation',
      description: 'Identify a country from three clues.',
      href: `${CURRENT_PAGE}#games`,
      keywords: 'game retrieval clues country detective practice'
    },
    {
      title: 'Tension Match',
      type: 'Practice activity',
      country: 'Civilisation',
      description: 'Match a political or social tension with the country that illustrates it.',
      href: `${CURRENT_PAGE}#games`,
      keywords: 'tension match game retrieval key question'
    },
    {
      title: '60-second Comparison',
      type: 'Speaking activity',
      country: 'Civilisation',
      description: 'Compare two countries aloud through a shared theme.',
      href: `${CURRENT_PAGE}#games`,
      keywords: 'speaking oral comparison sixty second countries'
    },
    {
      title: 'Key Question Builder',
      type: 'Method activity',
      country: 'Civilisation',
      description: 'Choose the key question that reveals a genuine tension.',
      href: `${CURRENT_PAGE}#games`,
      keywords: 'key question problematic problematique tension method'
    }
  ];

  const VIDEO_RESULTS = [
    ['An introduction to Parliament', 'United Kingdom', 'gb', 'UK Parliament government House of Commons House of Lords monarchy'],
    ['Separation of powers and checks and balances', 'United States', 'us', 'Constitution branches executive legislative judicial federal government'],
    ['The Good Friday Agreement explained', 'Ireland', 'ie', 'Troubles Northern Ireland peace border Belfast Agreement'],
    ['Residential schools and intergenerational trauma', 'Canada', 'ca', 'Indigenous reconciliation residential school children families communities'],
    ['The Uluru Statement from the Heart explained', 'Australia', 'au', 'Aboriginal Torres Strait Islander Voice Treaty Truth recognition'],
    ['Te Tiriti o Waitangi explained', 'New Zealand', 'nz', 'Treaty Waitangi Maori Māori Crown sovereignty rights'],
    ['The Partition of India explained', 'India', 'in', '1947 British India Pakistan partition migration religious tensions'],
    ['Apartheid explained', 'South Africa', 'za', 'racial segregation Mandela inequality reconciliation']
  ];

  const normalise = value =>
    String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[’‘]/g, "'")
      .replace(/[–—-]/g, ' ')
      .replace(/[^a-z0-9' ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const escapeHtml = value =>
    String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const index = [];
  const dedupe = new Set();

  function addEntry(entry) {
    if (!entry || !entry.title || !entry.href) return;

    const key = normalise(`${entry.title}|${entry.href}|${entry.type || ''}`);
    if (dedupe.has(key)) return;
    dedupe.add(key);

    const searchable = normalise([
      entry.title,
      entry.type,
      entry.country,
      entry.description,
      entry.keywords
    ].filter(Boolean).join(' '));

    index.push({
      title: entry.title.trim(),
      type: entry.type || 'Civilisation',
      country: entry.country || '',
      description: entry.description || '',
      href: entry.href,
      code: entry.code || '',
      currentPageTarget: entry.currentPageTarget || '',
      searchable
    });
  }

  function currentPageLink(code, searchText) {
    const params = new URLSearchParams({
      country: code,
      open: searchText
    });
    return `${CURRENT_PAGE}?${params.toString()}#countries`;
  }

  /*
   * A reliable curated index ensures that the main concepts are available
   * immediately, even before the detailed atlas pages have been fetched.
   */
  COUNTRY_DATA.forEach(country => {
    addEntry({
      title: country.country,
      type: 'Country atlas',
      country: country.country,
      description: country.overview,
      href: country.page,
      code: country.code,
      keywords: `${country.country} ${country.overview}`
    });

    country.topics.forEach(topic => {
      addEntry({
        title: topic,
        type: 'Atlas topic',
        country: country.country,
        description: `Open the ${country.country} civilisation atlas.`,
        href: country.page,
        code: country.code,
        keywords: `${country.country} ${country.overview}`
      });
    });
  });

  SPECIAL_RESULTS.forEach(addEntry);

  VIDEO_RESULTS.forEach(([title, countryName, code, keywords]) => {
    addEntry({
      title,
      type: 'Video and guided practice',
      country: countryName,
      description: `Watch the video and use the guided questions in a colle.`,
      href: currentPageLink(code, title),
      code,
      currentPageTarget: title,
      keywords
    });
  });

  /*
   * Index all meaningful content that already exists on civilisation.html:
   * cards, key questions, tensions, videos and activity sections.
   */
  document.querySelectorAll('.country-card').forEach(card => {
    const countryName = card.querySelector('h3')?.textContent.trim() || 'Country';
    const code = card.dataset.country || '';
    const atlasHref = card.querySelector('a.btn.primary')?.getAttribute('href') || CURRENT_PAGE;
    const cardText = card.textContent.replace(/\s+/g, ' ').trim();

    addEntry({
      title: countryName,
      type: 'Country overview',
      country: countryName,
      description: card.querySelector('.country-focus')?.textContent.trim() || '',
      href: atlasHref,
      code,
      keywords: cardText
    });

    card.querySelectorAll('.tension-tags span').forEach(tag => {
      const title = tag.textContent.trim();
      addEntry({
        title,
        type: 'Key tension',
        country: countryName,
        description: `A central tension in the ${countryName} atlas.`,
        href: atlasHref,
        code,
        keywords: `${title} ${cardText}`
      });
    });

    const keyQuestion = card.querySelector('.country-question');
    if (keyQuestion) {
      const text = keyQuestion.textContent
        .replace(/^Key question\s*/i, '')
        .trim();

      addEntry({
        title: text,
        type: 'Key question',
        country: countryName,
        description: `Use this analytical question in class or in a colle.`,
        href: atlasHref,
        code,
        keywords: `${countryName} ${cardText}`
      });
    }

    card.querySelectorAll('details').forEach(detail => {
      const title = detail.querySelector('summary')?.textContent
        .replace(/^[▶▼\s]+/, '')
        .trim();

      if (!title) return;

      addEntry({
        title,
        type: 'Video and guided practice',
        country: countryName,
        description: detail.textContent.replace(/\s+/g, ' ').trim().slice(0, 180),
        href: currentPageLink(code, title),
        code,
        currentPageTarget: title,
        keywords: `${countryName} ${detail.textContent}`
      });
    });
  });

  document.querySelectorAll('main section[id]').forEach(section => {
    if (section.id === 'countries') return;

    const heading = section.querySelector('h2, h3');
    if (!heading) return;

    addEntry({
      title: heading.textContent.trim(),
      type: 'Civilisation section',
      country: 'Civilisation',
      description: section.querySelector('.section-head p, .sec-head p')?.textContent.trim() || '',
      href: `${CURRENT_PAGE}#${section.id}`,
      keywords: section.textContent
    });
  });

  /*
   * Search interface.
   */
  controls.classList.add('civilisation-search-shell');
  controls.style.position = 'relative';
  controls.style.display = 'block';

  input.setAttribute('autocomplete', 'off');
  input.setAttribute('spellcheck', 'false');
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', 'civilisationSuggestions');
  input.setAttribute('placeholder', 'Search a country, event, institution or key tension…');

  const results = document.createElement('div');
  results.id = 'civilisationSuggestions';
  results.className = 'civilisation-suggestions';
  results.setAttribute('role', 'listbox');
  results.hidden = true;
  controls.appendChild(results);

  const style = document.createElement('style');
  style.textContent = `
    .civilisation-search-shell {
      width: 100%;
      position: relative;
      z-index: 60;
    }

    #countrySearch {
      width: 100%;
    }

    .civilisation-suggestions {
      position: absolute;
      top: calc(100% + 7px);
      left: 0;
      right: 0;
      z-index: 3000;
      max-height: min(470px, 70vh);
      overflow-y: auto;
      padding: 7px;
      background: #fff;
      border: 1px solid rgba(36, 59, 85, .18);
      border-radius: 18px;
      box-shadow:
        0 22px 60px rgba(36, 59, 85, .19),
        0 3px 12px rgba(36, 59, 85, .08);
    }

    .civilisation-suggestions[hidden] {
      display: none !important;
    }

    .civilisation-suggestion {
      display: grid;
      grid-template-columns: 34px minmax(0, 1fr) auto;
      gap: 11px;
      align-items: center;
      width: 100%;
      min-height: 63px;
      padding: 9px 11px;
      border: 0;
      border-radius: 12px;
      background: transparent;
      color: #243b55;
      text-align: left;
      font: inherit;
      cursor: pointer;
    }

    .civilisation-suggestion + .civilisation-suggestion {
      border-top: 1px solid rgba(36, 59, 85, .08);
    }

    .civilisation-suggestion:hover,
    .civilisation-suggestion.is-active,
    .civilisation-suggestion:focus-visible {
      background: #fff4eb;
      outline: none;
    }

    .civilisation-suggestion-icon {
      display: grid;
      place-items: center;
      width: 32px;
      height: 32px;
      border: 1px solid rgba(36, 59, 85, .12);
      border-radius: 50%;
      background: #f8f3ec;
      color: #243b55;
      font-size: 15px;
      line-height: 1;
    }

    .civilisation-suggestion-main {
      min-width: 0;
    }

    .civilisation-suggestion-title {
      display: block;
      overflow: hidden;
      color: #243b55;
      font-weight: 800;
      line-height: 1.3;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .civilisation-suggestion-meta {
      display: block;
      overflow: hidden;
      margin-top: 3px;
      color: #687471;
      font-size: .79rem;
      line-height: 1.35;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .civilisation-suggestion-kind {
      padding: 5px 8px;
      border: 1px solid rgba(196, 99, 62, .20);
      border-radius: 999px;
      color: #a95032;
      background: #fffaf6;
      font-size: .68rem;
      font-weight: 750;
      white-space: nowrap;
    }

    .civilisation-search-message {
      padding: 15px 14px;
      color: #687471;
      font-size: .88rem;
      line-height: 1.45;
    }

    .civilisation-search-footer {
      padding: 9px 12px 7px;
      border-top: 1px solid rgba(36, 59, 85, .10);
      color: #7a8481;
      font-size: .72rem;
    }

    @media (max-width: 640px) {
      .civilisation-suggestion {
        grid-template-columns: 30px minmax(0, 1fr);
      }

      .civilisation-suggestion-kind {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);

  let activeIndex = -1;
  let visibleMatches = [];
  let atlasIndexingFinished = false;
  let renderTimer = null;

  function iconFor(type) {
    if (/country atlas|country overview/i.test(type)) return '⌂';
    if (/video/i.test(type)) return '▶';
    if (/question/i.test(type)) return '?';
    if (/tension/i.test(type)) return '↔';
    if (/activity|practice|speaking|method/i.test(type)) return '✓';
    return '⌕';
  }

  function scoreEntry(entry, query, words) {
    const title = normalise(entry.title);
    const country = normalise(entry.country);
    const type = normalise(entry.type);
    const text = entry.searchable;
    let score = 0;

    if (title === query) score += 1200;
    if (country === query) score += 1000;
    if (title.startsWith(query)) score += 760;
    if (country.startsWith(query)) score += 650;
    if (title.includes(query)) score += 520;
    if (country.includes(query)) score += 400;
    if (type.includes(query)) score += 180;
    if (text.includes(query)) score += 280;

    const titleWords = title.split(' ');
    words.forEach(word => {
      if (titleWords.some(titleWord => titleWord.startsWith(word))) score += 95;
      if (country.split(' ').some(countryWord => countryWord.startsWith(word))) score += 70;
      if (text.includes(word)) score += 28;
    });

    if (words.length > 1 && words.every(word => text.includes(word))) score += 240;
    if (entry.type === 'Country atlas') score += 20;

    return score;
  }

  function closeResults() {
    results.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    activeIndex = -1;
  }

  function setActive(indexToActivate) {
    const buttons = Array.from(results.querySelectorAll('.civilisation-suggestion'));
    if (!buttons.length) return;

    activeIndex = Math.max(0, Math.min(indexToActivate, buttons.length - 1));

    buttons.forEach((button, indexOfButton) => {
      const active = indexOfButton === activeIndex;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });

    const activeButton = buttons[activeIndex];
    input.setAttribute('aria-activedescendant', activeButton.id);
    activeButton.scrollIntoView({ block: 'nearest' });
  }

  function navigate(entry) {
    if (!entry || !entry.href) return;
    window.location.href = entry.href;
  }

  function renderSuggestions() {
    const query = normalise(input.value);
    results.innerHTML = '';
    activeIndex = -1;

    if (query.length < MIN_QUERY_LENGTH) {
      closeResults();
      return;
    }

    const words = query.split(' ').filter(Boolean);

    visibleMatches = index
      .map(entry => ({ entry, score: scoreEntry(entry, query, words) }))
      .filter(item => item.score > 0)
      .sort((a, b) =>
        b.score - a.score ||
        a.entry.title.localeCompare(b.entry.title, 'en')
      )
      .slice(0, MAX_RESULTS)
      .map(item => item.entry);

    results.hidden = false;
    input.setAttribute('aria-expanded', 'true');

    if (!visibleMatches.length) {
      const message = document.createElement('div');
      message.className = 'civilisation-search-message';
      message.textContent = atlasIndexingFinished
        ? 'No result found. Try another country, event, institution or key tension.'
        : 'Searching the eight detailed country atlases…';
      results.appendChild(message);
      return;
    }

    visibleMatches.forEach((entry, indexOfEntry) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.id = `civilisationSuggestion-${indexOfEntry}`;
      button.className = 'civilisation-suggestion';
      button.setAttribute('role', 'option');
      button.setAttribute('aria-selected', 'false');

      const icon = document.createElement('span');
      icon.className = 'civilisation-suggestion-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = iconFor(entry.type);

      const main = document.createElement('span');
      main.className = 'civilisation-suggestion-main';

      const title = document.createElement('span');
      title.className = 'civilisation-suggestion-title';
      title.textContent = entry.title;

      const meta = document.createElement('span');
      meta.className = 'civilisation-suggestion-meta';
      meta.textContent = [entry.country, entry.description]
        .filter(Boolean)
        .join(' · ');

      const kind = document.createElement('span');
      kind.className = 'civilisation-suggestion-kind';
      kind.textContent = entry.type;

      main.append(title, meta);
      button.append(icon, main, kind);

      button.addEventListener('mousedown', event => {
        event.preventDefault();
      });

      button.addEventListener('click', () => navigate(entry));
      button.addEventListener('mouseenter', () => setActive(indexOfEntry));

      results.appendChild(button);
    });

    const footer = document.createElement('div');
    footer.className = 'civilisation-search-footer';
    footer.textContent = atlasIndexingFinished
      ? 'Use ↑ and ↓ to browse, then press Enter.'
      : 'Detailed atlas pages are still being indexed…';
    results.appendChild(footer);
  }

  function scheduleRender() {
    window.clearTimeout(renderTimer);
    renderTimer = window.setTimeout(renderSuggestions, 70);
  }

  input.addEventListener('input', scheduleRender);
  input.addEventListener('search', scheduleRender);
  input.addEventListener('focus', () => {
    if (normalise(input.value).length >= MIN_QUERY_LENGTH) {
      renderSuggestions();
    }
  });

  input.addEventListener('keydown', event => {
    const buttons = results.querySelectorAll('.civilisation-suggestion');

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (results.hidden) renderSuggestions();
      if (buttons.length) setActive(activeIndex < 0 ? 0 : activeIndex + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (buttons.length) setActive(activeIndex < 0 ? buttons.length - 1 : activeIndex - 1);
    } else if (event.key === 'Enter') {
      if (!results.hidden && visibleMatches.length) {
        event.preventDefault();
        navigate(visibleMatches[activeIndex >= 0 ? activeIndex : 0]);
      }
    } else if (event.key === 'Escape') {
      closeResults();
    }
  });

  document.addEventListener('click', event => {
    if (!controls.contains(event.target)) closeResults();
  });

  /*
   * On links back to civilisation.html, open the relevant country card/video.
   */
  function applyCurrentPageTarget() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('country');
    const target = normalise(params.get('open'));

    if (!code) return;

    const card = document.querySelector(`.country-card[data-country="${CSS.escape(code)}"]`);
    if (!card) return;

    if (target) {
      card.querySelectorAll('details').forEach(detail => {
        detail.open = normalise(detail.textContent).includes(target);
      });
    }

    window.setTimeout(() => {
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 180);
  }

  /*
   * Fetch the eight linked atlas pages and add their headings and text blocks.
   * This keeps the suggestions up to date when an atlas is expanded later.
   */
  async function indexAtlasPage(country) {
    try {
      const response = await fetch(country.page, { cache: 'no-store' });
      if (!response.ok) return;

      const html = await response.text();
      const copy = new DOMParser().parseFromString(html, 'text/html');

      copy.querySelectorAll('script, style, nav, header, footer, noscript').forEach(node => node.remove());

      const main = copy.querySelector('main') || copy.body;
      const headings = Array.from(main.querySelectorAll('h1, h2, h3, h4'));

      headings.forEach(heading => {
        const title = heading.textContent.replace(/\s+/g, ' ').trim();
        if (!title || title.length < 3) return;

        const container =
          heading.closest('section, article, .panel, .topic, .chapter') ||
          heading.parentElement ||
          main;

        const text = container.textContent.replace(/\s+/g, ' ').trim();

        addEntry({
          title,
          type: 'Atlas section',
          country: country.country,
          description: text.slice(0, 175),
          href: country.page,
          code: country.code,
          keywords: `${country.country} ${text}`
        });
      });

      Array.from(main.querySelectorAll('[data-topic], [data-title], button, summary, a'))
        .slice(0, 250)
        .forEach(element => {
          const title = (
            element.dataset.topic ||
            element.dataset.title ||
            element.textContent
          ).replace(/\s+/g, ' ').trim();

          if (
            title.length < 4 ||
            title.length > 100 ||
            /^(back|next|close|open|start|new|reveal|site|home)$/i.test(title)
          ) return;

          addEntry({
            title,
            type: 'Atlas item',
            country: country.country,
            description: `Open the ${country.country} civilisation atlas.`,
            href: country.page,
            code: country.code,
            keywords: `${country.country} ${main.textContent}`
          });
        });
    } catch (error) {
      console.warn(`Civilisation search could not index ${country.page}.`, error);
    }
  }

  Promise.allSettled(COUNTRY_DATA.map(indexAtlasPage)).then(() => {
    atlasIndexingFinished = true;
    if (!results.hidden && normalise(input.value).length >= MIN_QUERY_LENGTH) {
      renderSuggestions();
    }
  });

  applyCurrentPageTarget();
})();
