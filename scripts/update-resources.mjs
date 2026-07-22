import fs from 'node:fs/promises';
import { XMLParser } from 'fast-xml-parser';

const OUTPUT = 'resources-feed.json';
const NOW = new Date();
const feeds = [
  {source:'BBC World',url:'https://feeds.bbci.co.uk/news/world/rss.xml',country:'International',format:'News',topic:'International relations',kind:'News'},
  {source:'BBC UK',url:'https://feeds.bbci.co.uk/news/uk/rss.xml',country:'United Kingdom',format:'News',topic:'Society',kind:'News'},
  {source:'BBC Politics',url:'https://feeds.bbci.co.uk/news/politics/rss.xml',country:'United Kingdom',format:'News',topic:'Politics',kind:'News'},
  {source:'BBC Science & Environment',url:'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',country:'International',format:'News',topic:'Science & technology',kind:'News'},
  {source:'NPR News',url:'https://feeds.npr.org/1001/rss.xml',country:'United States',format:'News',topic:'Politics',kind:'News'},
  {source:'CBC News',url:'https://www.cbc.ca/cmlink/rss-topstories',country:'Canada',format:'News',topic:'Society',kind:'News'},
  {source:'ABC News Australia',url:'https://www.abc.net.au/news/feed/51120/rss.xml',country:'Australia',format:'News',topic:'Politics',kind:'News'},
  {source:'RNZ News',url:'https://www.rnz.co.nz/rss/national.xml',country:'New Zealand',format:'News',topic:'Society',kind:'News'},
  {source:'RTÉ News',url:'https://www.rte.ie/feeds/rss/?index=/news/',country:'Ireland',format:'News',topic:'Politics',kind:'News'},
  {source:'The Hindu',url:'https://www.thehindu.com/news/national/feeder/default.rss',country:'India',format:'News',topic:'Politics',kind:'News'},
  {source:'SABC News',url:'https://www.sabcnews.com/sabcnews/category/south-africa/feed/',country:'South Africa',format:'News',topic:'Society',kind:'News'},
  {source:'Mail & Guardian',url:'https://mg.co.za/feed/',country:'South Africa',format:'News',topic:'Politics',kind:'News'},
  {source:'UN News',url:'https://news.un.org/feed/subscribe/en/news/all/rss.xml',country:'International',format:'News',topic:'International relations',kind:'Official'},
  {source:'UK Parliament Bills',url:'https://bills.parliament.uk/rss/allbills.rss',country:'United Kingdom',format:'Primary source',topic:'Politics',kind:'Official'},
  {source:'House of Lords Library',url:'https://researchbriefings.parliament.uk/rssfeed/Lords%20Library%20notes',country:'United Kingdom',format:'Explainer',topic:'Politics',kind:'Official'},
  {source:'Office for National Statistics',url:'https://www.ons.gov.uk/releasecalendar?highlight=true&limit=10&page=1&release-type=type-published&rss=&sort=date-newest',country:'United Kingdom',format:'Data',topic:'Economy',kind:'Official'},
  {source:'NASA',url:'https://www.nasa.gov/news-release/feed/',country:'United States',format:'News',topic:'Science & technology',kind:'Official'},
  {source:'BBC Global News Podcast',url:'https://podcasts.files.bbci.co.uk/p02nq0gn.rss',country:'International',format:'Podcast',topic:'International relations',kind:'Podcast'}
];

const parser = new XMLParser({ignoreAttributes:false,attributeNamePrefix:'@_',removeNSPrefix:true,trimValues:true});
const arr = value => value == null ? [] : Array.isArray(value) ? value : [value];
const text = value => {
  if(value == null) return '';
  if(typeof value === 'string' || typeof value === 'number') return String(value);
  if(Array.isArray(value)) return text(value[0]);
  if(typeof value === 'object') return String(value['#text'] ?? value._ ?? '');
  return '';
};
const clean = value => text(value).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
function linkOf(item){
  const link=item.link;
  if(typeof link==='string') return /^https?:\/\//i.test(link) ? link : '';
  if(Array.isArray(link)){
    const alt=link.find(x=>x?.['@_rel']==='alternate')||link[0];
    return alt?.['@_href']||alt?.['#text']||'';
  }
  const candidate=link?.['@_href']||link?.['#text']||item.guid?.['#text']||text(item.guid);
  return /^https?:\/\//i.test(candidate) ? candidate : '';
}
function dateOf(item){
  const raw=text(item.pubDate||item.published||item.updated||item.date);
  const d=raw?new Date(raw):null;
  return d&&!Number.isNaN(d.valueOf())?d.toISOString():null;
}
async function fetchFeed(feed){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),20000);
  try{
    const res=await fetch(feed.url,{headers:{'user-agent':'EnglishCollesInLyon-resource-updater/2.0','accept':'application/rss+xml, application/atom+xml, application/xml, text/xml, */*'},redirect:'follow',signal:controller.signal});
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml=await res.text();
    const doc=parser.parse(xml);
    const channel=doc.rss?.channel||doc.RDF||doc.feed||doc;
    const entries=arr(channel.item||channel.entry).slice(0,8);
    const usable=entries.map(item=>({
      title:clean(item.title),source:feed.source,url:linkOf(item),date:dateOf(item),country:feed.country,
      format:feed.format,topic:feed.topic,kind:feed.kind
    })).filter(item=>item.title&&item.url);
    if(!usable.length) throw new Error('No usable entries');
    return usable;
  } finally { clearTimeout(timer); }
}

let old={version:2,items:[]};
try{old=JSON.parse(await fs.readFile(OUTPUT,'utf8'));}catch{}
const settled=await Promise.allSettled(feeds.map(fetchFeed));
let items=[];
const failures=[];
settled.forEach((result,index)=>{
  if(result.status==='fulfilled') items.push(...result.value);
  else failures.push({source:feeds[index].source,error:String(result.reason?.message||result.reason)});
});
const seen=new Set();
items=items.filter(item=>{
  const key=(item.url||item.title).replace(/\?.*$/,'');
  if(seen.has(key)) return false;
  seen.add(key);
  return true;
}).sort((a,b)=>(b.date||'').localeCompare(a.date||''));

const chosen=[];
const add=item=>{ if(item && !chosen.some(existing=>existing.url===item.url)) chosen.push(item); };
const countryOrder=['United Kingdom','United States','Ireland','Canada','Australia','New Zealand','India','South Africa','International'];
countryOrder.forEach(country=>add(items.find(item=>item.country===country)));
['Official','Podcast'].forEach(kind=>add(items.find(item=>item.kind===kind)));
for(const item of items){ if(chosen.length>=20) break; add(item); }

const checkedAt=NOW.toISOString();
if(chosen.length<5){
  const output={
    ...old,
    version:2,
    checkedAt,
    status:'degraded',
    lastAttemptStatus:'failed',
    lastAttemptMessage:`Only ${chosen.length} usable feed items were retrieved; the previous feed was preserved.`,
    sources:{attempted:feeds.length,successful:feeds.length-failures.length,failed:failures.length,failures}
  };
  if((old.items||[]).length){
    await fs.writeFile(OUTPUT,JSON.stringify(output,null,2)+'\n');
    console.warn(output.lastAttemptMessage);
  } else {
    console.error('Too few successful feed items and no previous feed exists.');
    process.exitCode=1;
  }
} else {
  const comparable=value=>JSON.stringify((value.items||[]).map(({title,source,url,date,country,format,topic,kind})=>({title,source,url,date,country,format,topic,kind})));
  const contentChanged=comparable(old)!==comparable({items:chosen});
  const output={
    version:2,
    checkedAt,
    generatedAt:contentChanged?checkedAt:(old.generatedAt||checkedAt),
    lastSuccessfulAt:checkedAt,
    status:failures.length?'partial':'ok',
    items:chosen,
    sources:{attempted:feeds.length,successful:feeds.length-failures.length,failed:failures.length,failures}
  };
  await fs.writeFile(OUTPUT,JSON.stringify(output,null,2)+'\n');
  console.log(`Checked ${feeds.length} feeds: ${chosen.length} published items, ${failures.length} failed source(s).`);
}
