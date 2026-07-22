import fs from 'node:fs/promises';

const INPUT='resources-data.json';
const OUTPUT='resources-link-status.json';
const CONCURRENCY=8;
const TIMEOUT_MS=12000;
const data=JSON.parse(await fs.readFile(INPUT,'utf8'));
const resources=data.resources||[];
let previous={};
try{previous=JSON.parse(await fs.readFile(OUTPUT,'utf8'));}catch{}

async function request(url,method){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),TIMEOUT_MS);
  try{
    return await fetch(url,{
      method,
      redirect:'follow',
      headers:{
        'user-agent':'EnglishCollesInLyon-link-checker/2.0',
        ...(method==='GET'?{range:'bytes=0-2048'}:{})
      },
      signal:controller.signal
    });
  } finally { clearTimeout(timer); }
}

async function check(resource){
  try{
    let response=await request(resource.url,'HEAD');
    if([401,403,405,429].includes(response.status)){
      try{response=await request(resource.url,'GET');}catch{}
    }
    const status=response.status;
    return {
      id:resource.id,title:resource.title,url:resource.url,status,
      responded:true,
      ok:status>=200&&status<400,
      warning:[401,403,429].includes(status)||status>=500
    };
  }catch(error){
    return {
      id:resource.id,title:resource.title,url:resource.url,status:0,
      responded:false,ok:false,warning:true,error:String(error?.message||error)
    };
  }
}

const results=[];
for(let i=0;i<resources.length;i+=CONCURRENCY){
  results.push(...await Promise.all(resources.slice(i,i+CONCURRENCY).map(check)));
}

const checkedAt=new Date().toISOString();
const responses=results.filter(item=>item.responded).length;
const responseRate=resources.length?responses/resources.length:1;

if(resources.length && responseRate<0.45 && previous.checkedAt){
  const output={
    ...previous,
    version:2,
    checkedAt,
    status:'degraded',
    lastAttemptStatus:'network-failure',
    lastAttemptMessage:`Only ${responses} of ${resources.length} sites returned an HTTP response. The previous reliable link report was preserved.`,
    attempted:resources.length,
    responded:responses
  };
  await fs.writeFile(OUTPUT,JSON.stringify(output,null,2)+'\n');
  console.warn(output.lastAttemptMessage);
}else{
  const output={
    version:2,
    checkedAt,
    lastSuccessfulAt:checkedAt,
    status:'ok',
    total:results.length,
    responded:responses,
    ok:results.filter(item=>item.ok).length,
    warnings:results.filter(item=>item.warning).length,
    failed:results.filter(item=>!item.ok&&!item.warning).length,
    items:results.filter(item=>!item.ok)
  };
  await fs.writeFile(OUTPUT,JSON.stringify(output,null,2)+'\n');
  console.log(output);
}
