import fs from 'node:fs/promises';
import { XMLParser } from 'fast-xml-parser';

const OUTPUT = 'daily-news.json';
const NOW = new Date();
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  removeNSPrefix: true,
  trimValues: true,
});

const COUNTRIES = {
  gb: { name: 'the United Kingdom', feeds: [
    { source: 'BBC UK', url: 'https://feeds.bbci.co.uk/news/uk/rss.xml' },
    { source: 'BBC Politics', url: 'https://feeds.bbci.co.uk/news/politics/rss.xml' },
  ]},
  us: { name: 'the United States', feeds: [
    { source: 'NPR News', url: 'https://feeds.npr.org/1001/rss.xml' },
  ]},
  ie: { name: 'Ireland', feeds: [
    { source: 'RTÉ News', url: 'https://www.rte.ie/feeds/rss/?index=/news/' },
  ]},
  ca: { name: 'Canada', feeds: [
    { source: 'CBC News', url: 'https://www.cbc.ca/cmlink/rss-topstories' },
  ]},
  au: { name: 'Australia', feeds: [
    { source: 'ABC News Australia', url: 'https://www.abc.net.au/news/feed/51120/rss.xml' },
  ]},
  nz: { name: 'New Zealand', feeds: [
    { source: 'RNZ News', url: 'https://www.rnz.co.nz/rss/national.xml' },
  ]},
  in: { name: 'India', feeds: [
    { source: 'The Hindu', url: 'https://www.thehindu.com/news/national/feeder/default.rss' },
  ]},
  za: { name: 'South Africa', feeds: [
    { source: 'SABC News', url: 'https://www.sabcnews.com/sabcnews/category/south-africa/feed/' },
    { source: 'Mail & Guardian', url: 'https://mg.co.za/feed/' },
  ]},
};

const GOOD = [
  'government','minister','parliament','election','vote','court','law','rights','economy','economic',
  'inflation','housing','education','school','university','health','hospital','climate','energy','environment',
  'immigration','indigenous','māori','maori','trade','tariff','technology','artificial intelligence',' ai ',
  'employment','jobs','inequality','poverty','budget','constitution','democracy','protest','policy','reform',
  'security','foreign','diplomatic','social','public','welfare','justice','media','data','internet'
];
const BAD = [
  'football','rugby','cricket','tennis','world cup','match','fixture','celebrity','actor','singer','reality tv',
  'lottery','horoscope','recipe','restaurant','fashion','murder','killed','shooting','arrested','charged','crash',
  'traffic','fire at','house fire','weather forecast'
];

const arr = value => value == null ? [] : Array.isArray(value) ? value : [value];
const text = value => {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return text(value[0]);
  if (typeof value === 'object') return String(value['#text'] ?? value._ ?? '');
  return '';
};
const clean = value => text(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const safeUrl = value => /^https?:\/\//i.test(value || '') ? value : '';

function linkOf(item) {
  const link = item.link;
  if (typeof link === 'string') return safeUrl(link);
  if (Array.isArray(link)) {
    const alternate = link.find(x => x?.['@_rel'] === 'alternate') || link[0];
    return safeUrl(alternate?.['@_href'] || alternate?.['#text'] || '');
  }
  return safeUrl(link?.['@_href'] || link?.['#text'] || item.guid?.['#text'] || text(item.guid));
}

function dateOf(item) {
  const raw = text(item.pubDate || item.published || item.updated || item.date || item.created);
  const parsed = raw ? new Date(raw) : null;
  return parsed && !Number.isNaN(parsed.valueOf()) ? parsed.toISOString() : null;
}

function descriptionOf(item) {
  const value = clean(item.description || item.summary || item.content || item.encoded);
  if (!value) return '';
  return value.length > 260 ? `${value.slice(0, 257).trim()}…` : value;
}

function discussionQuestion(title, country) {
  const t = ` ${title.toLowerCase()} `;
  if (/school|education|university|student/.test(t)) return `How should ${country} balance educational opportunity, quality and cost?`;
  if (/climate|energy|emission|environment|wildfire|flood/.test(t)) return `Can ${country} reconcile economic priorities with its environmental responsibilities?`;
  if (/health|hospital|care|doctor|medicine/.test(t)) return `What should governments do when public healthcare comes under pressure?`;
  if (/housing|rent|mortgage|homeless/.test(t)) return `Why has housing become such a difficult political issue in ${country}?`;
  if (/inflation|econom|budget|tax|trade|tariff|jobs|employment/.test(t)) return `Who should bear the cost of the economic choices described in this story?`;
  if (/court|law|rights|justice|constitution/.test(t)) return `How does this story test the balance between rights, law and political power?`;
  if (/election|vote|party|minister|parliament|government|president|prime minister/.test(t)) return `What does this development reveal about trust and political change in ${country}?`;
  if (/technology|artificial intelligence|\bai\b|data|internet|online/.test(t)) return `How should ${country} balance innovation, regulation and the public interest?`;
  return `What does this story reveal about a current challenge facing ${country}?`;
}

function score(item) {
  const title = ` ${item.title.toLowerCase()} `;
  const ageHours = item.publishedAt ? Math.max(0, (NOW - new Date(item.publishedAt)) / 36e5) : 72;
  let points = Math.max(0, 42 - Math.min(42, ageHours / 2));
  GOOD.forEach(word => { if (title.includes(word)) points += 7; });
  BAD.forEach(word => { if (title.includes(word)) points -= 18; });
  if (item.summary) points += 2;
  return points;
}

async function fetchFeed(countryCode, countryName, feed) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(feed.url, {
      headers: {
        'user-agent': 'EnglishCollesInLyon-daily-news/2.0',
        accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
      },
      redirect: 'follow',
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const xml = await response.text();
    const doc = parser.parse(xml);
    const channel = doc.rss?.channel || doc.RDF || doc.feed || doc;
    const entries = arr(channel.item || channel.entry).slice(0, 25);
    const items = entries.map(entry => ({
      countryCode,
      country: countryName,
      title: clean(entry.title),
      source: feed.source,
      url: linkOf(entry),
      publishedAt: dateOf(entry),
      summary: descriptionOf(entry),
    })).filter(item => item.title && item.url);
    if (!items.length) throw new Error('No usable entries');
    return items;
  } finally {
    clearTimeout(timer);
  }
}

let previous = { version: 2, countries: {} };
try { previous = JSON.parse(await fs.readFile(OUTPUT, 'utf8')); } catch {}
const previousCountries = previous.countries || {};
const countries = {};
const failures = [];
let freshCount = 0;

for (const [code, config] of Object.entries(COUNTRIES)) {
  const settled = await Promise.allSettled(config.feeds.map(feed => fetchFeed(code, config.name, feed)));
  const candidates = [];
  settled.forEach((result, index) => {
    if (result.status === 'fulfilled') candidates.push(...result.value);
    else failures.push({ country: code, source: config.feeds[index].source, error: String(result.reason?.message || result.reason) });
  });

  const unique = [...new Map(candidates.map(item => [item.url.replace(/\?.*$/, ''), item])).values()];
  unique.sort((a, b) => score(b) - score(a) || (b.publishedAt || '').localeCompare(a.publishedAt || ''));
  const selected = unique[0];
  if (selected) {
    countries[code] = {
      ...selected,
      question: discussionQuestion(selected.title, config.name),
      fetchedAt: NOW.toISOString(),
      cached: false,
    };
    freshCount += 1;
  } else if (previousCountries[code]?.title && previousCountries[code]?.url) {
    countries[code] = {
      ...previousCountries[code],
      countryCode: code,
      country: config.name,
      cached: true,
      cacheReason: 'No source for this country could be refreshed during the latest run.',
    };
  }
}

const checkedAt = NOW.toISOString();
const oldComparable = JSON.stringify(previousCountries);
const newComparable = JSON.stringify(countries);
const contentChanged = oldComparable !== newComparable;
const enoughFresh = freshCount >= 5;
const output = {
  version: 2,
  checkedAt,
  generatedAt: contentChanged ? checkedAt : (previous.generatedAt || checkedAt),
  lastSuccessfulAt: enoughFresh ? checkedAt : (previous.lastSuccessfulAt || null),
  status: freshCount === Object.keys(COUNTRIES).length ? 'ok' : freshCount ? 'partial' : 'degraded',
  freshCountries: freshCount,
  countries,
  sources: {
    attempted: Object.values(COUNTRIES).reduce((sum, country) => sum + country.feeds.length, 0),
    failed: failures.length,
    failures,
  },
};

if (!Object.keys(countries).length) {
  console.error('No daily-news item could be fetched or preserved; leaving the existing file untouched.');
  process.exitCode = 1;
} else {
  await fs.writeFile(OUTPUT, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Updated ${OUTPUT}: ${freshCount} fresh countr${freshCount === 1 ? 'y' : 'ies'}, ${failures.length} feed failure(s).`);
}
