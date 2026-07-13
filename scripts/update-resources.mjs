import fs from 'node:fs/promises';
import { XMLParser } from 'fast-xml-parser';

const feeds = [
  {source:'BBC World',url:'https://feeds.bbci.co.uk/news/world/rss.xml',country:'International',format:'News',topic:'International relations',kind:'News'},
  {source:'BBC UK',url:'https://feeds.bbci.co.uk/news/uk/rss.xml',country:'United Kingdom',format:'News',topic:'Society',kind:'News'},
  {source:'BBC Politics',url:'https://feeds.bbci.co.uk/news/politics/rss.xml',country:'United Kingdom',format:'News',topic:'Politics',kind:'News'},
  {source:'BBC Science & Environment',url:'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',country:'International',format:'News',topic:'Science & technology',kind:'News'},
  {source:'NPR News',url:'https://feeds.npr.org/1001/rss.xml',country:'United States',format:'News',topic:'Politics',kind:'News'},
  {source:'NPR News Now',url:'https://feeds.npr.org/500005/podcast.xml',country:'United States',format:'Podcast',topic:'Politics',kind:'Podcast'},
  {source:'CBC News',url:'https://www.cbc.ca/cmlink/rss-topstories',country:'Canada',format:'News',topic:'Society',kind:'News'},
  {source:'ABC News Australia',url:'https://www.abc.net.au/news/feed/51120/rss.xml',country:'Australia',format:'News',topic:'Politics',kind:'News'},
  {source:'RNZ News',url:'https://www.rnz.co.nz/rss/national.xml',country:'New Zealand',format:'News',topic:'Society',kind:'News'},
  {source:'RTÉ News',url:'https://www.rte.ie/feeds/rss/?index=/news/',country:'Ireland',format:'News',topic:'Politics',kind:'News'},
  {source:'UN News',url:'https://news.un.org/feed/subscribe/en/news/all/rss.xml',country:'International',format:'News',topic:'International relations',kind:'Official'},
  {source:'UK Parliament Bills',url:'https://bills.parliament.uk/rss/allbills.rss',country:'United Kingdom',format:'Primary source',topic:'Politics',kind:'Official'},
  {source:'House of Lords Library',url:'https://researchbriefings.parliament.uk/rssfeed/Lords%20Library%20notes',country:'United Kingdom',format:'Explainer',topic:'Politics',kind:'Official'},
  {source:'Office for National Statistics',url:'https://www.ons.gov.uk/releasecalendar?highlight=true&limit=10&page=1&release-type=type-published&rss=&sort=date-newest',country:'United Kingdom',format:'Data',topic:'Economy',kind:'Official'},
  {source:'NASA',url:'https://www.nasa.gov/news-release/feed/',country:'United States',format:'News',topic:'Science & technology',kind:'Official'},
  {source:'BBC Global News Podcast',url:'https://podcasts.files.bbci.co.uk/p02nq0gn.rss',country:'International',format:'Podcast',topic:'International relations',kind:'Podcast'}
];
const parser = new XMLParser({ignoreAttributes:false,attributeNamePrefix:'@_',removeNSPrefix:true,trimValues:true});
const arr=v=>v==null?[]:Array.isArray(v)?v:[v];
const text=v=>{if(v==null)return'';if(typeof v==='string'||typeof v==='number')return String(v);if(typeof v==='object'&&v['#text'])return String(v['#text']);return String(v['#text']||v._||'')};
const clean=s=>text(s).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
function linkOf(item){const l=item.link;if(typeof l==='string')return l;if(Array.isArray(l)){const alt=l.find(x=>x?.['@_rel']==='alternate')||l[0];return alt?.['@_href']||alt?.['#text']||''}return l?.['@_href']||l?.['#text']||item.guid?.['#text']||text(item.guid)}
function dateOf(item){const raw=text(item.pubDate||item.published||item.updated||item.date);const d=raw?new Date(raw):null;return d&&!Number.isNaN(d.valueOf())?d.toISOString():null}
async function fetchFeed(feed){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);try{const res=await fetch(feed.url,{headers:{'user-agent':'EnglishCollesInLyon-resource-updater/1.0','accept':'application/rss+xml, application/atom+xml, application/xml, text/xml, */*'},redirect:'follow',signal:controller.signal});if(!res.ok)throw new Error(`HTTP ${res.status}`);const xml=await res.text();const doc=parser.parse(xml);const channel=doc.rss?.channel||doc.RDF||doc.feed||doc;const entries=arr(channel.item||channel.entry).slice(0,4);if(!entries.length)throw new Error('No entries');return entries.map(i=>({title:clean(i.title)||'Untitled publication',source:feed.source,url:linkOf(i)||feed.url,date:dateOf(i),country:feed.country,format:feed.format,topic:feed.topic,kind:feed.kind})).filter(i=>i.url)}finally{clearTimeout(timer)}}
const settled=await Promise.allSettled(feeds.map(fetchFeed));let items=[];const failures=[];settled.forEach((r,i)=>{if(r.status==='fulfilled')items.push(...r.value);else failures.push({source:feeds[i].source,error:String(r.reason?.message||r.reason)})});
const seen=new Set();items=items.filter(i=>{const k=(i.url||i.title).replace(/\?.*$/,'');if(seen.has(k))return false;seen.add(k);return true}).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
const quotas={Official:3,Podcast:2};const chosen=[];for(const [kind,n] of Object.entries(quotas)){chosen.push(...items.filter(i=>i.kind===kind).slice(0,n))}for(const item of items){if(chosen.length>=18)break;if(!chosen.some(x=>x.url===item.url))chosen.push(item)}
if(chosen.length<4){console.error('Too few successful feed items; keeping the existing JSON.');console.error(failures);process.exit(0)}
const output={version:1,generatedAt:new Date().toISOString(),status:failures.length?'partial':'ok',items:chosen,sources:{successful:feeds.length-failures.length,failed:failures.length,failures}};
const path='resources-feed.json';let old={};try{old=JSON.parse(await fs.readFile(path,'utf8'))}catch{}
const comparable=o=>JSON.stringify((o.items||[]).map(({title,source,url,date,country,format,topic,kind})=>({title,source,url,date,country,format,topic,kind})));
if(comparable(old)!==comparable(output)){await fs.writeFile(path,JSON.stringify(output,null,2)+'\n');console.log(`Updated ${path}: ${chosen.length} items, ${failures.length} failed feeds.`)}else console.log('No feed content change; JSON left untouched.');
