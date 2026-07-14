import fs from "node:fs/promises";
import { existsSync } from "node:fs";

const SOURCES_FILE = "jury-sources.json";
const OUTPUT_FILE = "jury-reports-detected.json";
const STATUS_FILE = "jury-reports-status.json";
const TIMEOUT = 30000;

const decode = s => s
  .replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'")
  .replace(/&lt;/g,"<").replace(/&gt;/g,">");

function stripTags(s){return decode(s.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim())}
function absolute(href,base){try{return new URL(decode(href),base).href}catch{return null}}
function inferYear(s){
  const years=[...String(s).matchAll(/\b(20\d{2})\b/g)].map(x=>+x[1]).filter(y=>y>=2016&&y<=new Date().getFullYear()+1);
  return years.length?Math.max(...years):null;
}
function classify(label,url,reportWords){
  const s=(label+" "+url).toLowerCase();
  if(reportWords.some(w=>s.includes(w.toLowerCase()))) return "report";
  if(/notice|règlement|reglement/.test(s)) return "notice";
  if(/sujet|annale|video|vidéo/.test(s)) return "subject";
  if(/method|méthod|conseil/.test(s)) return "guidance";
  return "official-document";
}
async function fetchText(url){
  const ctrl=new AbortController();const t=setTimeout(()=>ctrl.abort(),TIMEOUT);
  try{
    const r=await fetch(url,{headers:{"user-agent":"EnglishCollesInLyon-JuryMonitor/1.0"},signal:ctrl.signal,redirect:"follow"});
    if(!r.ok)throw new Error(`HTTP ${r.status}`);
    return await r.text();
  } finally {clearTimeout(t)}
}
function extractLinks(html,source){
  const out=[],re=/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while((m=re.exec(html))){
    const url=absolute(m[1],source.url);if(!url)continue;
    const label=stripTags(m[2])||decode(m[1]);
    const hay=(label+" "+url).toLowerCase();
    const relevant=source.allEnglish||source.keywords.some(k=>hay.includes(k.toLowerCase()));
    const docLike=/\.pdf(?:$|\?)/i.test(url)||/rapport|report|annale|sujet|notice|anglais|english|langue|lva|lvb/i.test(hay);
    if(!relevant||!docLike)continue;
    out.push({
      sourceId:source.id,sourceName:source.name,year:inferYear(hay),
      label:label.slice(0,220),type:classify(label,url,source.reportWords||["rapport","report"]),url
    });
  }
  const unique=new Map();out.forEach(x=>unique.set(x.url,x));return [...unique.values()];
}
const now=new Date(),today=now.toISOString().slice(0,10);
const cfg=JSON.parse(await fs.readFile(SOURCES_FILE,"utf8"));
let previous={documents:[]};
if(existsSync(OUTPUT_FILE)){try{previous=JSON.parse(await fs.readFile(OUTPUT_FILE,"utf8"))}catch{}}
const old=new Map((previous.documents||[]).map(d=>[d.url,d]));
const documents=[],errors=[];
for(const source of cfg.sources){
  try{
    const html=await fetchText(source.url);
    for(const d of extractLinks(html,source)){
      const p=old.get(d.url);
      documents.push({...d,firstSeen:p?.firstSeen||today,isNew:!p});
    }
  }catch(e){errors.push({sourceId:source.id,name:source.name,error:String(e.message||e)})}
}
for(const p of previous.documents||[]){
  if(!documents.some(d=>d.url===p.url))documents.push({...p,isNew:false,notSeenThisRun:true});
}
documents.sort((a,b)=>(b.year||0)-(a.year||0)||a.sourceName.localeCompare(b.sourceName)||a.label.localeCompare(b.label));
await fs.writeFile(OUTPUT_FILE,JSON.stringify({generatedAt:now.toISOString(),documents},null,2)+"\n");
const reportCount=documents.filter(d=>d.type==="report").length;
const newCount=documents.filter(d=>d.isNew).length;
const status={
  lastRun:now.toISOString(),lastSuccessfulRun:documents.length?now.toISOString():null,
  sourcesChecked:cfg.sources.length-errors.length,documentsFound:documents.length,
  reportsFound:reportCount,newDocuments:newCount,errors,
  message:newCount?`${newCount} nouveau(x) document(s) officiel(s) détecté(s). Les synthèses doivent être validées.`:
    errors.length?"Le contrôle est terminé, mais certaines sources n’ont pas répondu.":"Aucun nouveau document officiel détecté."
};
await fs.writeFile(STATUS_FILE,JSON.stringify(status,null,2)+"\n");
console.log(status.message);
if(errors.length)console.warn(errors);
