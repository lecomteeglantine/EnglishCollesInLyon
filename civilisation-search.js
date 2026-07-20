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
    "country": "United Kingdom",
    "code": "gb",
    "file": "colle-atlas-gb.html",
    "key": "t2",
    "topic": "The Constitution & Parliament",
    "title": "The UK Constitution explained",
    "source": "The Constitution Society",
    "id": "1s0CkvROfcA",
    "url": "https://www.youtube.com/watch?v=1s0CkvROfcA"
  },
  {
    "country": "United Kingdom",
    "code": "gb",
    "file": "colle-atlas-gb.html",
    "key": "t3",
    "topic": "Devolution & the Union",
    "title": "Devolution in the United Kingdom",
    "source": "Educational explainer",
    "id": "cECYGPwfXYc",
    "url": "https://www.youtube.com/watch?v=cECYGPwfXYc"
  },
  {
    "country": "United Kingdom",
    "code": "gb",
    "file": "colle-atlas-gb.html",
    "key": "t4",
    "topic": "The Empire & its legacy",
    "title": "The British Empire and its legacy",
    "source": "BBC Ideas / OpenLearn",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=British+Empire+legacy+explained+BBC+Ideas+OpenLearn"
  },
  {
    "country": "United Kingdom",
    "code": "gb",
    "file": "colle-atlas-gb.html",
    "key": "t5",
    "topic": "The NHS",
    "title": "How does the NHS work and how is it changing?",
    "source": "The King’s Fund",
    "id": "blapgFKXv0I",
    "url": "https://www.youtube.com/watch?v=blapgFKXv0I"
  },
  {
    "country": "United Kingdom",
    "code": "gb",
    "file": "colle-atlas-gb.html",
    "key": "t6",
    "topic": "Social class",
    "title": "What is social class in Britain?",
    "source": "BBC",
    "id": "E9mHzOI9g_0",
    "url": "https://www.youtube.com/watch?v=E9mHzOI9g_0"
  },
  {
    "country": "United Kingdom",
    "code": "gb",
    "file": "colle-atlas-gb.html",
    "key": "t7",
    "topic": "Immigration & multiculturalism",
    "title": "Immigration and multicultural Britain",
    "source": "BBC Ideas / Migration Observatory",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=immigration+multicultural+Britain+explained+BBC+Ideas+Migration+Observatory"
  },
  {
    "country": "United Kingdom",
    "code": "gb",
    "file": "colle-atlas-gb.html",
    "key": "t8",
    "topic": "The media (BBC & tabloids)",
    "title": "The BBC, tabloids and the British media",
    "source": "BBC / Reuters Institute",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=British+media+BBC+tabloids+explained+Reuters+Institute"
  },
  {
    "country": "United Kingdom",
    "code": "gb",
    "file": "colle-atlas-gb.html",
    "key": "t9",
    "topic": "Brexit",
    "title": "Brexit explained",
    "source": "TDC",
    "id": "NgVhRVrANhA",
    "url": "https://www.youtube.com/watch?v=NgVhRVrANhA"
  },
  {
    "country": "United States",
    "code": "us",
    "file": "colle-atlas-us.html",
    "key": "elections",
    "topic": "The Electoral College",
    "title": "The Electoral College explained",
    "source": "Illustrate to Educate",
    "id": "j3NX1-lR4M0",
    "url": "https://www.youtube.com/watch?v=j3NX1-lR4M0"
  },
  {
    "country": "United States",
    "code": "us",
    "file": "colle-atlas-us.html",
    "key": "race",
    "topic": "Race & civil rights",
    "title": "Civil rights and the struggle for racial equality",
    "source": "Crash Course",
    "id": "S64zRnnn4Po",
    "url": "https://www.youtube.com/watch?v=S64zRnnn4Po"
  },
  {
    "country": "United States",
    "code": "us",
    "file": "colle-atlas-us.html",
    "key": "guns",
    "topic": "Guns & the 2nd Amendment",
    "title": "How the NRA changed the Second Amendment",
    "source": "Adam Ruins Everything",
    "id": "2Fpk6P4kOqE",
    "url": "https://www.youtube.com/watch?v=2Fpk6P4kOqE"
  },
  {
    "country": "United States",
    "code": "us",
    "file": "colle-atlas-us.html",
    "key": "dream",
    "topic": "The American Dream",
    "title": "The American Dream and inequality",
    "source": "Vox / PBS",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=American+Dream+inequality+explained+Vox+PBS"
  },
  {
    "country": "United States",
    "code": "us",
    "file": "colle-atlas-us.html",
    "key": "constitution",
    "topic": "The Constitution & the Court",
    "title": "How US government and the Constitution work",
    "source": "Crash Course",
    "id": "lrk4oY7UxpQ",
    "url": "https://www.youtube.com/watch?v=lrk4oY7UxpQ"
  },
  {
    "country": "United States",
    "code": "us",
    "file": "colle-atlas-us.html",
    "key": "presidency",
    "topic": "The presidency",
    "title": "Presidential power",
    "source": "Crash Course",
    "id": "5l02sK5LovI",
    "url": "https://www.youtube.com/watch?v=5l02sK5LovI"
  },
  {
    "country": "United States",
    "code": "us",
    "file": "colle-atlas-us.html",
    "key": "religion",
    "topic": "Religion & the culture wars",
    "title": "Religion and the American culture wars",
    "source": "PBS / Pew Research Center",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=religion+culture+wars+United+States+explained+PBS+Pew+Research"
  },
  {
    "country": "United States",
    "code": "us",
    "file": "colle-atlas-us.html",
    "key": "healthcare",
    "topic": "Healthcare & inequality",
    "title": "Why US healthcare is so different",
    "source": "Vox",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=why+US+healthcare+system+works+this+way+Vox"
  },
  {
    "country": "United States",
    "code": "us",
    "file": "colle-atlas-us.html",
    "key": "world",
    "topic": "America in the world",
    "title": "Why US foreign policy matters",
    "source": "CFR Education",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=Why+Does+US+Foreign+Policy+Matter+CFR+Education"
  },
  {
    "country": "Ireland",
    "code": "ie",
    "file": "colle-atlas-ie.html",
    "key": "t1",
    "topic": "Independence & partition",
    "title": "Ireland 1912–1916: from Home Rule to the Easter Rising",
    "source": "Century Ireland / RTÉ",
    "id": "722S-m6T7Hw",
    "url": "https://www.youtube.com/watch?v=722S-m6T7Hw"
  },
  {
    "country": "Ireland",
    "code": "ie",
    "file": "colle-atlas-ie.html",
    "key": "t2",
    "topic": "The Great Famine & the diaspora",
    "title": "Ireland’s Great Hunger and the Irish diaspora",
    "source": "Quinnipiac University",
    "id": "jMNqaNERDr4",
    "url": "https://www.youtube.com/watch?v=jMNqaNERDr4"
  },
  {
    "country": "Ireland",
    "code": "ie",
    "file": "colle-atlas-ie.html",
    "key": "t3",
    "topic": "The Irish language & identity",
    "title": "The revival of the Irish language",
    "source": "Irish-language documentary",
    "id": "m7MU64QuZtU",
    "url": "https://www.youtube.com/watch?v=m7MU64QuZtU"
  },
  {
    "country": "Ireland",
    "code": "ie",
    "file": "colle-atlas-ie.html",
    "key": "t4",
    "topic": "The Catholic Church & social change",
    "title": "Ireland’s social revolution",
    "source": "Democracy Now!",
    "id": "s0rV94woy-8",
    "url": "https://www.youtube.com/watch?v=s0rV94woy-8"
  },
  {
    "country": "Ireland",
    "code": "ie",
    "file": "colle-atlas-ie.html",
    "key": "t5",
    "topic": "Northern Ireland & reunification",
    "title": "The Good Friday Agreement explained",
    "source": "RTÉ News",
    "id": "MK40dtxzyvo",
    "url": "https://www.youtube.com/watch?v=MK40dtxzyvo"
  },
  {
    "country": "Ireland",
    "code": "ie",
    "file": "colle-atlas-ie.html",
    "key": "t6",
    "topic": "Brexit & the border",
    "title": "Brexit and the Irish border explained",
    "source": "Channel 4 News",
    "id": "1cfI5on5n84",
    "url": "https://www.youtube.com/watch?v=1cfI5on5n84"
  },
  {
    "country": "Ireland",
    "code": "ie",
    "file": "colle-atlas-ie.html",
    "key": "t7",
    "topic": "The Celtic Tiger & the economy",
    "title": "The Celtic Tiger and the Irish economy",
    "source": "Economic explainer",
    "id": "_TX8U1PCqFw",
    "url": "https://www.youtube.com/watch?v=_TX8U1PCqFw"
  },
  {
    "country": "Ireland",
    "code": "ie",
    "file": "colle-atlas-ie.html",
    "key": "t8",
    "topic": "Neutrality & Ireland in the world",
    "title": "Is Ireland neutral?",
    "source": "IIEA",
    "id": "p1ZJ6UzlJiE",
    "url": "https://www.youtube.com/watch?v=p1ZJ6UzlJiE"
  },
  {
    "country": "Ireland",
    "code": "ie",
    "file": "colle-atlas-ie.html",
    "key": "t9",
    "topic": "Modern Ireland: housing, immigration & inequality",
    "title": "Dublin’s housing crisis",
    "source": "DW Documentary",
    "id": "ZOTgP2D_qmQ",
    "url": "https://www.youtube.com/watch?v=ZOTgP2D_qmQ"
  },
  {
    "country": "Canada",
    "code": "ca",
    "file": "colle-atlas-ca.html",
    "key": "t1",
    "topic": "Bilingualism & the two founding peoples",
    "title": "Bilingualism and Canada’s two official languages",
    "source": "CBC / Historica Canada",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=Canada+bilingualism+two+official+languages+explained+CBC+Historica+Canada"
  },
  {
    "country": "Canada",
    "code": "ca",
    "file": "colle-atlas-ca.html",
    "key": "t2",
    "topic": "Quebec, separatism & national unity",
    "title": "Quebec separatism and the referendum",
    "source": "CBC Archives",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=Quebec+referendum+separatism+explained+CBC+Archives"
  },
  {
    "country": "Canada",
    "code": "ca",
    "file": "colle-atlas-ca.html",
    "key": "t3",
    "topic": "Multiculturalism (the mosaic)",
    "title": "Canadian multiculturalism: the cultural mosaic",
    "source": "Historica Canada / CBC",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=Canadian+multiculturalism+cultural+mosaic+explained+Historica+Canada+CBC"
  },
  {
    "country": "Canada",
    "code": "ca",
    "file": "colle-atlas-ca.html",
    "key": "t4",
    "topic": "Indigenous peoples & reconciliation",
    "title": "Residential schools in Canada: a timeline",
    "source": "Historica Canada",
    "id": "VFgNI1lfe0A",
    "url": "https://www.youtube.com/watch?v=VFgNI1lfe0A"
  },
  {
    "country": "Canada",
    "code": "ca",
    "file": "colle-atlas-ca.html",
    "key": "t5",
    "topic": "The relationship with the United States",
    "title": "Canada and the United States: a unique relationship",
    "source": "CBC / Council on Foreign Relations",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=Canada+United+States+relationship+explained+CBC+CFR"
  },
  {
    "country": "Canada",
    "code": "ca",
    "file": "colle-atlas-ca.html",
    "key": "t6",
    "topic": "The Constitution, the monarchy & federalism",
    "title": "Canada’s Constitution, monarchy and federalism",
    "source": "Parliament of Canada",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=Canadian+Constitution+monarchy+federalism+explained+Parliament+of+Canada"
  },
  {
    "country": "Canada",
    "code": "ca",
    "file": "colle-atlas-ca.html",
    "key": "t7",
    "topic": "Universal healthcare (Medicare)",
    "title": "How Canadian Medicare works",
    "source": "CBC / Health Canada",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=Canadian+Medicare+universal+healthcare+explained+CBC"
  },
  {
    "country": "Canada",
    "code": "ca",
    "file": "colle-atlas-ca.html",
    "key": "t8",
    "topic": "Natural resources, oil & climate",
    "title": "Oil, natural resources and climate policy in Canada",
    "source": "CBC News",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=Canada+oil+sands+climate+policy+explained+CBC+News"
  },
  {
    "country": "Canada",
    "code": "ca",
    "file": "colle-atlas-ca.html",
    "key": "t9",
    "topic": "Immigration & the housing crisis",
    "title": "Immigration and Canada’s housing crisis",
    "source": "CBC News",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=Canada+immigration+housing+crisis+explained+CBC+News"
  },
  {
    "country": "Australia",
    "code": "au",
    "file": "colle-atlas-au.html",
    "key": "t1",
    "topic": "Indigenous Australians & reconciliation",
    "title": "The Uluru Statement from the Heart explained",
    "source": "ABC News Australia",
    "id": "ZLyDUCtegZE",
    "url": "https://www.youtube.com/watch?v=ZLyDUCtegZE"
  },
  {
    "country": "Australia",
    "code": "au",
    "file": "colle-atlas-au.html",
    "key": "t2",
    "topic": "Convict origins & national myths",
    "title": "Australia’s convict origins and national myths",
    "source": "ABC Education / National Museum of Australia",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=Australia+convict+origins+national+myths+ABC+Education"
  },
  {
    "country": "Australia",
    "code": "au",
    "file": "colle-atlas-au.html",
    "key": "t3",
    "topic": "From White Australia to multiculturalism",
    "title": "From White Australia to multiculturalism",
    "source": "ABC Education",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=White+Australia+policy+multiculturalism+explained+ABC+Education"
  },
  {
    "country": "Australia",
    "code": "au",
    "file": "colle-atlas-au.html",
    "key": "t4",
    "topic": "Asylum seekers & border policy",
    "title": "Australia’s asylum-seeker and border policy",
    "source": "ABC News / Behind the News",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=Australia+asylum+seekers+border+policy+explained+ABC+News"
  },
  {
    "country": "Australia",
    "code": "au",
    "file": "colle-atlas-au.html",
    "key": "t5",
    "topic": "The monarchy, the republic & the Dismissal",
    "title": "The monarchy, the republic and the 1975 Dismissal",
    "source": "ABC News / Museum of Australian Democracy",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=Australia+1975+Dismissal+monarchy+republic+explained+ABC"
  },
  {
    "country": "Australia",
    "code": "au",
    "file": "colle-atlas-au.html",
    "key": "t6",
    "topic": "Climate, bushfires & the Great Barrier Reef",
    "title": "Bushfires, climate change and the Great Barrier Reef",
    "source": "ABC News Australia",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=Australia+bushfires+climate+change+Great+Barrier+Reef+explained+ABC+News"
  },
  {
    "country": "Australia",
    "code": "au",
    "file": "colle-atlas-au.html",
    "key": "t7",
    "topic": "The resource economy & China",
    "title": "Australia’s resource economy and China",
    "source": "ABC News / Lowy Institute",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=Australia+resource+economy+China+relationship+explained+Lowy+Institute"
  },
  {
    "country": "Australia",
    "code": "au",
    "file": "colle-atlas-au.html",
    "key": "t8",
    "topic": "Australia, the US and Asia",
    "title": "Australia between the United States and Asia",
    "source": "Lowy Institute",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=Australia+United+States+Asia+foreign+policy+explained+Lowy+Institute"
  },
  {
    "country": "Australia",
    "code": "au",
    "file": "colle-atlas-au.html",
    "key": "t9",
    "topic": "“The lucky country“: egalitarianism, mateship & sport",
    "title": "The “lucky country”: egalitarianism, mateship and sport",
    "source": "ABC Education",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=lucky+country+egalitarianism+mateship+sport+Australia+explained+ABC"
  },
  {
    "country": "New Zealand",
    "code": "nz",
    "file": "colle-atlas-nz.html",
    "key": "t1",
    "topic": "The Treaty of Waitangi & biculturalism",
    "title": "Te Tiriti o Waitangi explained",
    "source": "RNZ – Treaty Talks",
    "id": "5EOKhJUaZDE",
    "url": "https://www.youtube.com/watch?v=5EOKhJUaZDE"
  },
  {
    "country": "New Zealand",
    "code": "nz",
    "file": "colle-atlas-nz.html",
    "key": "t2",
    "topic": "Māori culture, te reo & the renaissance",
    "title": "Māori culture, te reo and the Māori renaissance",
    "source": "RNZ / Te Papa",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=Maori+culture+te+reo+renaissance+explained+RNZ+Te+Papa"
  },
  {
    "country": "New Zealand",
    "code": "nz",
    "file": "colle-atlas-nz.html",
    "key": "t3",
    "topic": "MMP & the unitary state",
    "title": "How MMP works in New Zealand",
    "source": "New Zealand Electoral Commission",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=MMP+electoral+system+New+Zealand+explained+Electoral+Commission"
  },
  {
    "country": "New Zealand",
    "code": "nz",
    "file": "colle-atlas-nz.html",
    "key": "t4",
    "topic": "Nuclear-free & independent foreign policy",
    "title": "New Zealand’s nuclear-free foreign policy",
    "source": "RNZ / New Zealand Parliament",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=New+Zealand+nuclear+free+policy+explained+RNZ"
  },
  {
    "country": "New Zealand",
    "code": "nz",
    "file": "colle-atlas-nz.html",
    "key": "t5",
    "topic": "A nation of “firsts“",
    "title": "A nation of political “firsts”",
    "source": "NZ History / RNZ",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=New+Zealand+first+women+vote+social+reform+explained+NZ+History"
  },
  {
    "country": "New Zealand",
    "code": "nz",
    "file": "colle-atlas-nz.html",
    "key": "t6",
    "topic": "Immigration, the Pacific & multiculturalism",
    "title": "Immigration, the Pacific and multicultural New Zealand",
    "source": "RNZ",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=New+Zealand+immigration+Pacific+multiculturalism+explained+RNZ"
  },
  {
    "country": "New Zealand",
    "code": "nz",
    "file": "colle-atlas-nz.html",
    "key": "t7",
    "topic": "“Clean green“ vs farming & climate",
    "title": "“Clean green” New Zealand, farming and climate",
    "source": "RNZ / Climate Commission",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=New+Zealand+clean+green+farming+climate+explained+RNZ"
  },
  {
    "country": "New Zealand",
    "code": "nz",
    "file": "colle-atlas-nz.html",
    "key": "t8",
    "topic": "The housing crisis & inequality",
    "title": "New Zealand’s housing crisis and inequality",
    "source": "RNZ",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=New+Zealand+housing+crisis+inequality+explained+RNZ"
  },
  {
    "country": "New Zealand",
    "code": "nz",
    "file": "colle-atlas-nz.html",
    "key": "t9",
    "topic": "The monarchy & the republic question",
    "title": "The monarchy and the republic debate in New Zealand",
    "source": "RNZ / New Zealand Parliament",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=New+Zealand+monarchy+republic+debate+explained+RNZ"
  },
  {
    "country": "India",
    "code": "in",
    "file": "colle-atlas-in.html",
    "key": "t1",
    "topic": "Independence, Gandhi & non-violence",
    "title": "Gandhi, independence and non-violence",
    "source": "TED-Ed / BBC",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=Gandhi+Indian+independence+nonviolence+explained+TED+Ed+BBC"
  },
  {
    "country": "India",
    "code": "in",
    "file": "colle-atlas-in.html",
    "key": "t2",
    "topic": "Partition & the Kashmir question",
    "title": "Why was India split into two countries?",
    "source": "TED-Ed",
    "id": "DrcCTgwbsjc",
    "url": "https://www.youtube.com/watch?v=DrcCTgwbsjc"
  },
  {
    "country": "India",
    "code": "in",
    "file": "colle-atlas-in.html",
    "key": "t3",
    "topic": "Secularism vs Hindu nationalism",
    "title": "Secularism and Hindu nationalism in India",
    "source": "BBC News / DW",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=India+secularism+Hindu+nationalism+explained+BBC+DW"
  },
  {
    "country": "India",
    "code": "in",
    "file": "colle-atlas-in.html",
    "key": "t4",
    "topic": "The caste system & affirmative action",
    "title": "The caste system and affirmative action",
    "source": "BBC / TED-Ed",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=India+caste+system+affirmative+action+reservations+explained+BBC+TED+Ed"
  },
  {
    "country": "India",
    "code": "in",
    "file": "colle-atlas-in.html",
    "key": "t5",
    "topic": "The world's largest democracy",
    "title": "How the world’s largest democracy works",
    "source": "BBC / Election Commission of India",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=world+largest+democracy+India+elections+explained+BBC"
  },
  {
    "country": "India",
    "code": "in",
    "file": "colle-atlas-in.html",
    "key": "t6",
    "topic": "“Unity in diversity“: religion & language",
    "title": "India’s unity in diversity: religions and languages",
    "source": "BBC / National Geographic",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=India+unity+in+diversity+religions+languages+explained+BBC"
  },
  {
    "country": "India",
    "code": "in",
    "file": "colle-atlas-in.html",
    "key": "t7",
    "topic": "Economic rise, IT & inequality",
    "title": "India’s economic rise, technology and inequality",
    "source": "DW Documentary / World Bank",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=India+economic+rise+IT+inequality+explained+DW+Documentary"
  },
  {
    "country": "India",
    "code": "in",
    "file": "colle-atlas-in.html",
    "key": "t8",
    "topic": "Gender & women's rights",
    "title": "Women’s rights and gender inequality in India",
    "source": "BBC / UN Women",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=India+women+rights+gender+inequality+explained+BBC+UN+Women"
  },
  {
    "country": "India",
    "code": "in",
    "file": "colle-atlas-in.html",
    "key": "t9",
    "topic": "India as a rising global power",
    "title": "India as a rising global power",
    "source": "CFR / DW",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=India+rising+global+power+explained+CFR+DW"
  },
  {
    "country": "South Africa",
    "code": "za",
    "file": "colle-atlas-za.html",
    "key": "t1",
    "topic": "Apartheid: the system",
    "title": "Apartheid explained",
    "source": "AJ+",
    "id": "S7yvnUz2PLE",
    "url": "https://www.youtube.com/watch?v=S7yvnUz2PLE"
  },
  {
    "country": "South Africa",
    "code": "za",
    "file": "colle-atlas-za.html",
    "key": "t2",
    "topic": "The anti-apartheid struggle & Mandela",
    "title": "Nelson Mandela and the anti-apartheid struggle",
    "source": "BBC / TED-Ed",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=Nelson+Mandela+anti+apartheid+struggle+explained+BBC+TED+Ed"
  },
  {
    "country": "South Africa",
    "code": "za",
    "file": "colle-atlas-za.html",
    "key": "t3",
    "topic": "The Truth and Reconciliation Commission",
    "title": "The Truth and Reconciliation Commission",
    "source": "SABC / Al Jazeera English",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=South+Africa+Truth+and+Reconciliation+Commission+explained+SABC"
  },
  {
    "country": "South Africa",
    "code": "za",
    "file": "colle-atlas-za.html",
    "key": "t4",
    "topic": "The “Rainbow Nation“ 30 years on",
    "title": "The Rainbow Nation thirty years on",
    "source": "BBC News Africa / DW",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=South+Africa+rainbow+nation+30+years+democracy+explained+BBC+DW"
  },
  {
    "country": "South Africa",
    "code": "za",
    "file": "colle-atlas-za.html",
    "key": "t5",
    "topic": "Inequality & land reform",
    "title": "Inequality and land reform in South Africa",
    "source": "DW Documentary",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=South+Africa+inequality+land+reform+explained+DW+Documentary"
  },
  {
    "country": "South Africa",
    "code": "za",
    "file": "colle-atlas-za.html",
    "key": "t6",
    "topic": "The Constitution & democracy",
    "title": "South Africa’s Constitution and democracy",
    "source": "Constitution Hill / SABC",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=South+Africa+Constitution+democracy+explained+Constitution+Hill"
  },
  {
    "country": "South Africa",
    "code": "za",
    "file": "colle-atlas-za.html",
    "key": "t7",
    "topic": "Diversity, languages & xenophobia",
    "title": "Languages, diversity and xenophobia in South Africa",
    "source": "BBC News Africa",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=South+Africa+languages+diversity+xenophobia+explained+BBC"
  },
  {
    "country": "South Africa",
    "code": "za",
    "file": "colle-atlas-za.html",
    "key": "t8",
    "topic": "The economy, unemployment & the energy crisis",
    "title": "Unemployment, the economy and the energy crisis",
    "source": "DW / BBC News Africa",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=South+Africa+unemployment+energy+crisis+load+shedding+explained+DW+BBC"
  },
  {
    "country": "South Africa",
    "code": "za",
    "file": "colle-atlas-za.html",
    "key": "t9",
    "topic": "South Africa in Africa and the world",
    "title": "South Africa in Africa and the world",
    "source": "CFR / Al Jazeera English",
    "id": "",
    "url": "https://www.youtube.com/results?search_query=South+Africa+foreign+policy+BRICS+Africa+explained+CFR+Al+Jazeera"
  }
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


  ATLAS_TOPIC_VIDEOS.forEach(video => {
    addEntry({
      title: video.title,
      type: 'Video and guided practice',
      country: video.country,
      description: `${video.topic} · Suggested source: ${video.source}`,
      href: `${video.file}?topic=${encodeURIComponent(video.key)}#topic`,
      code: video.code,
      keywords: `${video.country} ${video.topic} ${video.title} ${video.source}`
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
