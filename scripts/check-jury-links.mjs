import fs from "node:fs/promises";
const DATA_FILE="jury-reports-data.json",DETECTED_FILE="jury-reports-detected.json",OUT="jury-links-status.json";
const data=JSON.parse(await fs.readFile(DATA_FILE,"utf8"));
let detected={documents:[]};try{detected=JSON.parse(await fs.readFile(DETECTED_FILE,"utf8"))}catch{}
const urls=new Set();
for(const c of data.competitions){urls.add(c.officialPage);for(const r of c.reports)urls.add(r.url)}
for(const d of detected.documents||[])urls.add(d.url);
async function check(url){
  const ctrl=new AbortController(),t=setTimeout(()=>ctrl.abort(),20000);
  try{
    let r=await fetch(url,{method:"HEAD",redirect:"follow",headers:{"user-agent":"EnglishCollesInLyon-LinkChecker/1.0"},signal:ctrl.signal});
    if(r.status===405||r.status===403)r=await fetch(url,{method:"GET",redirect:"follow",headers:{"user-agent":"EnglishCollesInLyon-LinkChecker/1.0","range":"bytes=0-1024"},signal:ctrl.signal});
    return {url,status:r.status,ok:r.ok,finalUrl:r.url};
  }catch(e){return {url,status:0,ok:false,error:String(e.message||e)}}finally{clearTimeout(t)}
}
const list=[...urls],results=[];
for(let i=0;i<list.length;i+=5)results.push(...await Promise.all(list.slice(i,i+5).map(check)));
const summary={checkedAt:new Date().toISOString(),total:results.length,working:results.filter(x=>x.ok).length,warnings:results.filter(x=>!x.ok&&[401,403,405,429].includes(x.status)).length,failed:results.filter(x=>!x.ok&&![401,403,405,429].includes(x.status)).length};
await fs.writeFile(OUT,JSON.stringify({summary,results},null,2)+"\n");
console.log(summary);
