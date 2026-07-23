(function(){
'use strict';
const CURRENT_KEY='ecl_colle_mission_current_v2';
const HISTORY_KEY='ecl_colle_mission_history_v2';
const LAST_KEY='ecl_colle_mission_last_v2';
const DAY=86400000;
const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
const safeJSON=(raw,fallback)=>{try{return JSON.parse(raw)}catch(_){return fallback}};
const nowISO=()=>new Date().toISOString();
const slug=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80);
const normalise=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
const tokenise=value=>new Set(normalise(value).split(' ').filter(word=>word.length>2&&!STOP.has(word)));
const fmt=seconds=>`${String(Math.floor(Math.max(0,seconds)/60)).padStart(2,'0')}:${String(Math.max(0,seconds)%60).padStart(2,'0')}`;
const uid=()=>`mission-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
const STOP=new Set('the a an and or to of in on for with from by is are was were be been being this that these those as at it its into about over under after before new latest today report says say how why what who where when which their our your more most less than has have had will would could should can may might'.split(' '));

const COUNTRIES={
  gb:{name:'United Kingdom',feed:'United Kingdom',atlas:'colle-atlas-gb.html',issues:['the Union and devolution','public services and the NHS','migration and post-Brexit identity'],questions:['Is the United Kingdom becoming less united?','Can public services be protected without changing the British economic model?','How has Brexit reshaped British identity and power?']},
  us:{name:'United States',feed:'United States',atlas:'colle-atlas-us.html',issues:['federalism and polarisation','rights and the Supreme Court','race and democratic participation'],questions:['Are checks and balances still strong enough?','Why do rights vary so sharply between American states?','Can the United States overcome political polarisation?']},
  ie:{name:'Ireland',feed:'Ireland',atlas:'colle-atlas-ie.html',issues:['housing and inequality','economic dependence on multinationals','secularisation and constitutional change'],questions:['Has prosperity made Ireland more equal?','Is Ireland’s economic model sustainable?','How did Ireland secularise so rapidly?']},
  ca:{name:'Canada',feed:'Canada',atlas:'colle-atlas-ca.html',issues:['Indigenous reconciliation','federalism and Quebec','immigration and national identity'],questions:['Can reconciliation move beyond symbolic recognition?','How flexible is Canadian federalism?','Can high immigration remain politically sustainable?']},
  au:{name:'Australia',feed:'Australia',atlas:'colle-atlas-au.html',issues:['Indigenous recognition','climate policy and mining','migration and offshore detention'],questions:['What should meaningful Indigenous recognition involve?','Can Australia reconcile climate commitments with fossil-fuel exports?','How should democracies balance border control and human rights?']},
  nz:{name:'New Zealand',feed:'New Zealand',atlas:'colle-atlas-nz.html',issues:['the Treaty of Waitangi','housing and inequality','agriculture and climate policy'],questions:['How should the Treaty shape modern government?','Why has housing become a major source of inequality?','Can New Zealand reduce agricultural emissions fairly?']},
  in:{name:'India',feed:'India',atlas:'colle-atlas-in.html',issues:['democracy and majoritarianism','development and inequality','digital government and privacy'],questions:['How resilient is Indian democracy?','Can rapid development reduce inequality?','Does digital government empower citizens or expand surveillance?']},
  za:{name:'South Africa',feed:'South Africa',atlas:'colle-atlas-za.html',issues:['inequality after apartheid','coalition government and accountability','energy, jobs and a just transition'],questions:['Why has political freedom not produced economic equality?','Can coalition government renew democratic accountability?','What would a just energy transition require?']}
};
const FORMAT_LABELS={article:'Article',audio:'Podcast / audio',video:'Video',data:'Data / official report',brief:'Practice issue brief'};
const MODE_INFO={
  guided:{label:'Guided Mission',prep:25,speak:8,reminder:'Prompts and sentence starters remain visible. Use them to organise thought, not to write a script.'},
  standard:{label:'Standard Colle',prep:20,speak:8,reminder:'Method help is available on demand. Keep your notes selective and speak from ideas.'},
  challenge:{label:'Challenge Mode',prep:15,speak:8,reminder:'Only essential prompts are shown. Work quickly and expect more unpredictable follow-up questions.'}
};
const TENSIONS=['Freedom vs control','Equality vs merit','Individual vs society','Tradition vs change','National vs global','Rights vs responsibilities','Progress vs danger','Efficiency vs justice','Unity vs diversity','Security vs liberty'];
const TOPIC_VOCAB={
  Politics:['democracy','accountability','checks and balances','political polarisation','public policy','electoral reform','the rule of law','public trust'],
  Society:['social cohesion','inequality','discrimination','public opinion','social mobility','community','minority rights','living standards'],
  Economy:['economic growth','inflation','productivity','public spending','cost of living','labour market','wealth gap','fiscal policy'],
  Environment:['climate change','carbon emissions','renewable energy','fossil fuels','sustainability','green transition','environmental justice','biodiversity'],
  Technology:['artificial intelligence','data privacy','digital divide','automation','regulation','innovation','surveillance','algorithmic bias'],
  Education:['educational inequality','tuition fees','social mobility','curriculum','academic achievement','public funding','skills gap','access to education'],
  Health:['public health','healthcare system','waiting lists','health inequality','preventive care','mental health','public funding','medical workforce'],
  'International affairs':['foreign policy','multilateralism','national sovereignty','international cooperation','geopolitical tensions','diplomacy','soft power','security alliance'],
  Culture:['cultural identity','representation','heritage','collective memory','freedom of expression','cultural diversity','media coverage','national narrative']
};
const GRAMMAR_HINTS={
  Politics:['Modal verbs','Passive Voice','Reporting Verbs','Concession'],Society:['Comparatives','Quantifiers','Relative Clauses','Concession'],Economy:['Quantifiers','Figures','Comparatives','Cause and Effect'],Environment:['First Conditional','Future Forms','Modals','Cause and Effect'],Technology:['Future Forms','Modals of Deduction','Passive Voice','Conditionals'],Education:['Comparatives','Modals','Purpose and Result','Relative Clauses'],Health:['Passive Voice','Quantifiers','Modals','Cause and Effect'],'International affairs':['Modals of Deduction','Reported Speech','Concession','Conditionals'],Culture:['Relative Clauses','Concession','Comparatives','Reporting Verbs']
};
const PRONUNCIATION_TARGETS=[
  {id:'thought-groups',title:'Thought groups and pauses',desc:'Pause between ideas, not after every few words. Make the movement of your argument audible.',find:'thought groups'},
  {id:'sentence-stress',title:'Sentence stress',desc:'Stress the content words that carry your claim and weaken less important grammar words.',find:'sentence stress'},
  {id:'contrastive-stress',title:'Contrastive stress',desc:'Make contrasts such as freedom versus security or national versus global easy to hear.',find:'contrastive stress'},
  {id:'linking',title:'Linking and connected speech',desc:'Connect words smoothly without swallowing final consonants or losing intelligibility.',find:'connected speech'},
  {id:'intonation',title:'Intonation for argument',desc:'Use falling tones for firm claims and non-final tones to show that an idea continues.',find:'intonation'},
  {id:'figures',title:'Stress in figures and statistics',desc:'Slow down around numbers, stress the comparison and make percentages unambiguous.',find:'figures'}
];
const GENERAL_FOLLOWUPS=[
  'What is the strongest argument against your position?',
  'Which group is most affected by this issue, and why?',
  'What has the document left out?',
  'Is this mainly a national issue or part of a wider international trend?',
  'Which historical turning point best explains the present situation?',
  'What would a realistic policy response look like?',
  'Does the source provide enough evidence for its conclusion?',
  'How would the debate change if we looked at another English-speaking country?',
  'Which value should take priority here, and what would be the cost?',
  'What development would make you change your analysis?'
];
const PRACTICE_SEEDS={};
Object.entries(COUNTRIES).forEach(([code,country])=>{
  PRACTICE_SEEDS[code]=country.issues.map((issue,index)=>({
    id:`seed-${code}-${index+1}`,country:code,title:`Issue brief: ${issue}`,source:'English Colles in Lyon · practice brief',format:'brief',topic:index===0?'Politics':index===1?'Society':'International affairs',url:country.atlas,summary:`Use this neutral issue prompt when no current feed is available. Open the country atlas, identify one precise fact and connect it to a current debate about ${issue}.`,publishedAt:null,seedQuestion:country.questions[index]
  }));
});

let selectedMode='standard';
let sourceItems=[];
let selectedSource=null;
let mission=null;
let prepTimer=null,speakTimer=null,mediaRecorder=null,mediaStream=null,mediaChunks=[],audioUrl='';
let saveTimer=null,sourceRequest=0;
let searchIndexPromise=null,vocabIndexPromise=null,grammarIndexPromise=null;

function readLocal(key,fallback){try{return safeJSON(localStorage.getItem(key)||'',fallback)}catch(_){return fallback}}
function writeLocal(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch(_){return false}}
function country(){return COUNTRIES[mission?.config?.country||$('#missionCountry').value]||COUNTRIES.gb}
function dateLabel(value){if(!value)return'';const date=new Date(value);return Number.isNaN(date.getTime())?'':date.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
function stagePercent(stage){return Math.round(((Math.max(0,Math.min(4,stage))+1)/5)*100)}
function sourceText(doc){return `${doc.title||''} ${doc.source||''} ${doc.topic||''} ${doc.summary||''}`}
function currentMode(){return MODE_INFO[mission?.config?.mode||selectedMode]||MODE_INFO.standard}
function formatFromItem(item){
  const raw=normalise(`${item.format||''} ${item.kind||''} ${item.title||''}`);
  if(/podcast|audio|radio/.test(raw))return'audio';if(/video|youtube|film/.test(raw))return'video';if(/data|statistics|report|official|survey|release/.test(raw))return'data';return'article';
}
function inferTopic(item){
  if(item.topic)return item.topic;
  const text=normalise(sourceText(item));
  const patterns={Environment:/climate|carbon|environment|energy|pollution|biodiversity/,Economy:/econom|inflation|price|growth|jobs|employment|budget|tax|trade/,Technology:/technology|digital|data|artificial intelligence| ai |online|platform|automation/,Health:/health|hospital|nhs|medical|mental/,Education:/education|school|student|university|curriculum/,Culture:/culture|media|film|art|heritage|identity/,Society:/housing|inequality|migration|race|gender|poverty|community|rights/,'International affairs':/war|foreign|international|diplom|security|defence|global/};
  for(const [topic,re] of Object.entries(patterns))if(re.test(` ${text} `))return topic;return'Politics';
}
function sourceCard(item,index){
  const selected=selectedSource?.id===item.id;
  const href=item.url?`<a class="btn btn-ghost btn-small" href="${esc(item.url)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Open source ↗</a>`:'';
  return `<article class="source-card${selected?' selected':''}" data-source-index="${index}" data-format="${esc(item.format)}" tabindex="0" role="button" aria-pressed="${selected}"><div class="source-top"><span class="source-kind">${esc(FORMAT_LABELS[item.format]||item.format)}</span><span class="source-date">${esc(dateLabel(item.publishedAt))}</span></div><h3>${esc(item.title)}</h3><p class="source-meta">${esc(item.source)} · ${esc(item.topic||'Current affairs')}</p><p class="source-summary">${esc(item.summary||'Open the source, identify the central claim and decide what requires verification or context.')}</p><div class="source-pick">${selected?'✓ Selected':'Select this document'}</div>${href?`<div style="margin-top:9px">${href}</div>`:''}</article>`;
}
function setMode(mode){
  selectedMode=MODE_INFO[mode]?mode:'standard';
  $$('.mode-card').forEach(card=>{const on=card.dataset.mode===selectedMode;card.classList.toggle('selected',on);card.setAttribute('aria-checked',String(on))});
  $('#missionPrep').value=String(MODE_INFO[selectedMode].prep);
}
function configureEvents(){
  $$('.mode-card').forEach(card=>card.addEventListener('click',()=>setMode(card.dataset.mode)));
  $('#findSources').addEventListener('click',()=>loadSources(false));
  $('#refreshSources').addEventListener('click',()=>loadSources(true));
  $('#showCustom').addEventListener('click',()=>{$('#customCard').hidden=false;$('#customTitle').focus()});
  $('#cancelCustom').addEventListener('click',()=>{$('#customCard').hidden=true});
  $('#customForm').addEventListener('submit',event=>{event.preventDefault();selectSource({id:`custom-${Date.now()}`,country:$('#missionCountry').value,title:$('#customTitle').value.trim(),source:$('#customSource').value.trim(),format:$('#customFormat').value,topic:$('#customTopic').value,url:$('#customUrl').value.trim(),summary:$('#customSummary').value.trim()||'Document supplied by the learner.',publishedAt:null,custom:true});$('#customCard').hidden=true});
  $('#buildMission').addEventListener('click',buildMission);
  $('#heroResume').addEventListener('click',resumeSavedMission);$('#resumeMission').addEventListener('click',resumeSavedMission);$('#discardMission').addEventListener('click',discardSavedMission);
  $('#prepToggle').addEventListener('click',togglePrep);$('#prepReset').addEventListener('click',resetPrep);$('#saveAndExit').addEventListener('click',()=>{saveMission(true);location.href='learning-path.html'});
  $('#previousStage').addEventListener('click',()=>moveStage(-1));$('#nextStage').addEventListener('click',()=>moveStage(1));
  $('#stageNav').addEventListener('click',event=>{const button=event.target.closest('[data-stage]');if(!button||!mission)return;captureStage();mission.stage=+button.dataset.stage;saveMission();renderWorkspace()});
  $('#stagePanel').addEventListener('input',event=>{const el=event.target;if(!el.matches('[data-note],[data-config],[data-eval]'))return;captureField(el);queueSave()});
  $('#stagePanel').addEventListener('change',event=>{const el=event.target;if(el.matches('[data-note],[data-config],[data-eval]')){captureField(el);queueSave()}});
  window.addEventListener('beforeunload',()=>{if(mission&&!mission.completedAt)saveMission(false)});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&mission&&!mission.completedAt)saveMission(false)});
}

async function fetchJSON(url){const response=await fetch(url,{cache:'no-cache'});if(!response.ok)throw new Error(`${url} unavailable`);return response.json()}
function fallbackSources(code){return PRACTICE_SEEDS[code].map(item=>({...item}))}
async function loadSources(force){
  const request=++sourceRequest,code=$('#missionCountry').value,format=$('#missionFormat').value;
  $('#sources').hidden=false;$('#sources').scrollIntoView({behavior:'smooth',block:'start'});$('#sourceGrid').innerHTML='<div class="source-empty">Loading current and stable sources…</div>';$('#sourceStatus').textContent='';selectedSource=null;updateBuildBar();
  const results=[];let feedNotes=[];
  try{
    const [daily,resources]=await Promise.all([fetchJSON(`daily-news.json${force?'?t='+Date.now():''}`).catch(()=>null),fetchJSON(`resources-feed.json${force?'?t='+Date.now():''}`).catch(()=>null)]);
    const news=daily?.countries?.[code];
    if(news&&news.url&&!/first automatic|pending/i.test(news.title||''))results.push({id:`daily-${code}-${slug(news.title)}`,country:code,title:news.title,source:news.source||'Current news',format:'article',topic:inferTopic(news),url:news.url,summary:news.summary||'',publishedAt:news.publishedAt||news.fetchedAt,live:true});
    const wanted=COUNTRIES[code].feed;
    const feed=(resources?.items||[]).filter(item=>normalise(item.country)===normalise(wanted));
    const seen=new Set(results.map(x=>normalise(x.url||x.title)));
    for(const item of feed){const key=normalise(item.url||item.title);if(!key||seen.has(key))continue;seen.add(key);results.push({id:`resource-${slug(item.title)}-${results.length}`,country:code,title:item.title,source:item.source||item.kind||'Resource',format:formatFromItem(item),topic:item.topic||inferTopic(item),url:item.url,summary:`${item.kind||'Source'} selected from the site’s resource feed. Open it and identify the central claim, evidence and limitations.`,publishedAt:item.date,live:true});if(results.length>=9)break}
    if(!daily)feedNotes.push('daily brief unavailable');if(!resources)feedNotes.push('resource feed unavailable');
  }catch(_){feedNotes.push('automatic feeds unavailable')}
  if(request!==sourceRequest)return;
  sourceItems=[...results,...fallbackSources(code)].filter(item=>format==='any'||item.format===format||item.format==='brief').slice(0,12);
  if(!sourceItems.length)sourceItems=fallbackSources(code);
  renderSources();
  const live=sourceItems.filter(x=>x.live).length;
  $('#sourceStatus').textContent=live?`${live} current or stable source${live===1?'':'s'} loaded. Practice briefs remain available as a fallback.`:`No live feed could be loaded. Practice briefs are available, or use your own document.${feedNotes.length?' '+feedNotes.join(', ')+'.':''}`;
}
function renderSources(){
  $('#sourceGrid').innerHTML=sourceItems.length?sourceItems.map(sourceCard).join(''):'<div class="source-empty">No matching source is available. Use your own document or choose another format.</div>';
  $$('#sourceGrid .source-card').forEach(card=>{const choose=()=>selectSource(sourceItems[+card.dataset.sourceIndex]);card.addEventListener('click',choose);card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();choose()}})});
}
function selectSource(item){selectedSource={...item,topic:item.topic||inferTopic(item)};if(!sourceItems.some(x=>x.id===item.id))sourceItems.unshift(selectedSource);renderSources();updateBuildBar()}
function updateBuildBar(){const bar=$('#buildBar');bar.hidden=!selectedSource;if(selectedSource)$('#selectedSource').textContent=`${selectedSource.title} · ${selectedSource.source}`}

function emptyNotes(){return {gist:'',sourceVoice:'',evidence:'',tension:'',limits:'',context:'',keyQuestion:'',plan1:'',plan2:'',plan3:'',languageSentence:'',pronunciationPhrase:'',conclusion:'',nextPriority:''}}
function createMission(){
  const mode=selectedMode,prep=+$('#missionPrep').value||MODE_INFO[mode].prep;
  const doc={...selectedSource};
  return {version:2,id:uid(),createdAt:nowISO(),updatedAt:nowISO(),completedAt:null,stage:0,config:{mode,country:$('#missionCountry').value,format:$('#missionFormat').value,focus:$('#missionFocus').value,prep,speak:MODE_INFO[mode].speak},document:doc,notes:emptyNotes(),selected:{vocabulary:[],grammar:null,pronunciation:null},evaluation:{},timers:{prepRemaining:prep*60,speakRemaining:MODE_INFO[mode].speak*60},followups:[],followupIndex:-1,contextSuggestions:[],grammarSuggestions:[],vocabSuggestions:[]};
}
function buildMission(){if(!selectedSource)return;stopTimers();revokeAudio();mission=createMission();writeLocal(CURRENT_KEY,mission);$('#setup').hidden=true;$('#sources').hidden=true;$('#workspace').classList.add('on');renderWorkspace();loadMissionSupport();$('#workspace').scrollIntoView({behavior:'smooth',block:'start'})}
function loadCurrent(){const data=readLocal(CURRENT_KEY,null);return data&&data.version===2&&!data.completedAt?data:null}
function saveMission(show=true){if(!mission||mission.completedAt)return;captureStage();mission.updatedAt=nowISO();writeLocal(CURRENT_KEY,mission);if(show){$('#autosaveStatus').textContent='Saved locally just now.';setTimeout(()=>{if($('#autosaveStatus'))$('#autosaveStatus').textContent='Autosave is on.'},1500)}}
function queueSave(){clearTimeout(saveTimer);$('#autosaveStatus').textContent='Saving…';saveTimer=setTimeout(()=>saveMission(true),450)}
function resumeSavedMission(){const saved=loadCurrent();if(!saved)return;stopTimers();revokeAudio();mission=saved;selectedMode=mission.config.mode;$('#setup').hidden=true;$('#sources').hidden=true;$('#workspace').classList.add('on');renderWorkspace();loadMissionSupport();$('#workspace').scrollIntoView({behavior:'smooth',block:'start'})}
function discardSavedMission(){if(!confirm('Discard the saved mission and its notes?'))return;localStorage.removeItem(CURRENT_KEY);mission=null;renderResume();$('#resumeBand').hidden=true;$('#heroResume').hidden=true}
function renderResume(){
  const saved=loadCurrent(),band=$('#resumeBand'),hero=$('#heroResume');band.hidden=!saved;hero.hidden=!saved;if(!saved)return;
  $('#resumeTitle').textContent=saved.document?.title||'Saved mission';$('#resumeMeta').textContent=`${MODE_INFO[saved.config.mode]?.label||'Mission'} · ${COUNTRIES[saved.config.country]?.name||''} · saved ${new Date(saved.updatedAt).toLocaleString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}`;$('#resumeMeter').style.width=`${stagePercent(saved.stage)}%`;$('#resumeStage').textContent=`Stage ${saved.stage+1} of 5`;
}

function captureField(el){
  if(!mission)return;const key=el.dataset.note||el.dataset.config||el.dataset.eval;if(!key)return;
  if(el.dataset.note)mission.notes[key]=el.value;
  else if(el.dataset.config){mission.config[key]=el.type==='number'?+el.value:el.value;if(key==='speak')mission.timers.speakRemaining=+el.value*60}
  else mission.evaluation[key]=el.checked;
}
function captureStage(){if(!mission)return;$$('#stagePanel [data-note],#stagePanel [data-config],#stagePanel [data-eval]').forEach(captureField)}
function moveStage(delta){if(!mission)return;captureStage();if(delta>0&&mission.stage===4){completeMission();return}mission.stage=Math.max(0,Math.min(4,mission.stage+delta));saveMission();renderWorkspace();window.scrollTo({top:$('#workspace').offsetTop-70,behavior:'smooth'})}
function renderWorkspace(){
  if(!mission)return;const mode=currentMode();$('#ribbonTitle').textContent=mission.document.title;$('#ribbonMeta').textContent=`${mode.label} · ${country().name} · priority: ${mission.config.focus}`;paintPrep();
  $$('.stage-tab').forEach(button=>{const n=+button.dataset.stage;button.classList.toggle('active',n===mission.stage);button.classList.toggle('done',n<mission.stage)});
  $('#previousStage').disabled=mission.stage===0;$('#nextStage').textContent=mission.stage===4?'Complete and save mission':'Next stage →';
  const renderers=[renderUnderstand,renderContext,renderLanguage,renderSpeak,renderReview];$('#stagePanel').innerHTML=renderers[mission.stage]();bindStageEvents();$('#autosaveStatus').textContent='Autosave is on.';
}
function modeReminder(){const mode=currentMode();return `<div class="mode-reminder"><strong>${esc(mode.label)}</strong>${esc(mode.reminder)}</div>`}
function stageHead(eyebrow,title,copy){return `<header class="stage-head"><div><div class="eyebrow">${esc(eyebrow)}</div><h2>${esc(title)}</h2><p>${esc(copy)}</p></div>${modeReminder()}</header>`}
function promptBox(title,items,open){return `<details class="prompt-box" ${open?'open':''}><summary>${esc(title)}</summary><div class="prompt-content"><ul>${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></div></details>`}
function renderUnderstand(){
  const guided=mission.config.mode==='guided',challenge=mission.config.mode==='challenge',doc=mission.document;
  const sourceLink=doc.url?`<a href="${esc(doc.url)}" target="_blank" rel="noopener">Open the document in a new tab ↗</a>`:'Use the document supplied to you.';
  const help=guided?promptBox('Guided reading route',['First pass: identify the topic and the author’s main purpose.','Second pass: select only the evidence that changes or supports the argument.','Separate what the source proves from what it merely claims or assumes.','Do not begin detailed analysis before you can summarise the document in one sentence.'],true):promptBox('Analysis prompts',['Who speaks, to whom, and with what interest or authority?','Which evidence carries the argument?','What is assumed, omitted or strategically framed?','What central conflict of values or interests emerges?'],false);
  return `${stageHead('Stage 1 · Understand','Decode the document before building an opinion.','Map the source, claim, evidence and tension. Select what you could genuinely reuse aloud.')}
  <div class="callout ${challenge?'challenge':''}"><strong>${esc(FORMAT_LABELS[doc.format]||doc.format)} · ${esc(doc.source)}</strong><br>${esc(doc.title)} · ${sourceLink}</div>${help}
  <div class="form-grid"><div class="form-block wide"><label for="gist">One-sentence summary</label><textarea class="notes small" id="gist" data-note="gist" placeholder="The document examines… and argues / reveals that…">${esc(mission.notes.gist)}</textarea><small>Describe the central claim or development, not every detail.</small></div>
  <div class="form-block"><label for="sourceVoice">Source, voice and audience</label><textarea class="notes" id="sourceVoice" data-note="sourceVoice" placeholder="Who produced it? For whom? With what authority, purpose or possible bias?">${esc(mission.notes.sourceVoice)}</textarea></div>
  <div class="form-block"><label for="evidence">Essential evidence</label><textarea class="notes" id="evidence" data-note="evidence" placeholder="Keep two or three facts, examples, quotations or figures only.">${esc(mission.notes.evidence)}</textarea></div>
  <div class="form-block"><label for="tension">Central tension</label><textarea class="notes small" id="tension" data-note="tension" placeholder="Which values, interests or realities come into conflict?">${esc(mission.notes.tension)}</textarea></div>
  <div class="form-block"><label for="limits">Limits, assumptions and missing voices</label><textarea class="notes small" id="limits" data-note="limits" placeholder="What should be qualified, questioned or cross-checked?">${esc(mission.notes.limits)}</textarea></div></div>`;
}
function renderSupportCards(){
  if(!mission.contextSuggestions?.length)return '<div class="support-loading">Context suggestions are being prepared from the timelines and country atlas…</div>';
  return mission.contextSuggestions.map((item,index)=>`<article class="support-card"><span class="tag">${esc(item.category)}</span><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><div class="support-card-actions"><a href="${esc(item.url)}${item.target?`&eclFind=${encodeURIComponent(item.target)}`:''}" target="_blank" rel="noopener">Open ↗</a><button type="button" data-use-context="${index}">Use this idea</button></div></article>`).join('');
}
function renderContext(){
  const guided=mission.config.mode==='guided';
  return `${stageHead('Stage 2 · Contextualise','Move from the document to the wider debate.','Add only the background that helps the listener understand why this document matters now.')}
  <div class="callout gold"><strong>Context is not a history lecture.</strong> Use one or two precise facts, then explain their connection to the document. Open the <a href="${esc(country().atlas)}" target="_blank" rel="noopener">${esc(country().name)} atlas ↗</a> or the <a href="timelines.html?country=${esc(mission.config.country)}" target="_blank" rel="noopener">timeline ↗</a>.</div>
  <div class="support-grid" id="supportGrid">${renderSupportCards()}</div>
  <div class="form-block"><label for="contextNote">My contextualisation</label><textarea class="notes" id="contextNote" data-note="context" placeholder="Place the document in its political, social, economic or historical context, then explain the connection.">${esc(mission.notes.context)}</textarea></div>
  <h3 style="margin-top:21px">Build a key question around a tension</h3><div class="tension-bank">${TENSIONS.map(item=>`<button class="tension-chip" type="button" data-tension="${esc(item)}">${esc(item)}</button>`).join('')}</div>
  ${guided?promptBox('Useful question families',['What factors explain…?','What is at stake in…?','How does… reveal the tension between X and Y?','What are the limits of the claim that…?','Can… be explained by… alone?','How does this case compare with another English-speaking country?'],true):promptBox('Question check',['Does the question expose a genuine problem rather than repeat the topic?','Can the document and your contextual knowledge both help answer it?','Does it avoid a flat yes/no or “to what extent” formula?'],false)}
  <div class="form-grid"><div class="form-block wide"><label for="keyQuestion">My key question</label><textarea class="notes small" id="keyQuestion" data-note="keyQuestion" placeholder="A clear question built around the central tension — no ‘To what extent…’.">${esc(mission.notes.keyQuestion)}</textarea></div>
  <div class="form-block"><label for="plan1">I — Establish the issue or claim</label><textarea class="notes" id="plan1" data-note="plan1" placeholder="Governing idea + evidence + interpretation">${esc(mission.notes.plan1)}</textarea></div>
  <div class="form-block"><label for="plan2">II — Complicate or expose limits</label><textarea class="notes" id="plan2" data-note="plan2" placeholder="Governing idea + evidence + transition">${esc(mission.notes.plan2)}</textarea></div>
  <div class="form-block wide"><label for="plan3">III — Reframe or widen the debate (optional)</label><textarea class="notes small" id="plan3" data-note="plan3" placeholder="Comparison, deeper cause, wider consequence or unresolved paradox">${esc(mission.notes.plan3)}</textarea></div></div>`;
}
function renderVocabBank(){
  if(!mission.vocabSuggestions?.length)return '<span class="empty-bank">Relevant vocabulary is being selected from the site index…</span>';
  const selectedIds=new Set((mission.selected.vocabulary||[]).map(x=>x.id));
  return mission.vocabSuggestions.map((item,index)=>`<button class="vocab-chip${selectedIds.has(item.id)?' selected-chip':''}" type="button" data-vocab="${index}">${esc(item.term)} <small>${esc(item.fr)}</small></button>`).join('');
}
function renderSelectedVocab(){const items=mission.selected.vocabulary||[];return items.length?items.map((item,index)=>`<span class="selected-chip">${esc(item.term)} <button type="button" data-remove-vocab="${index}" aria-label="Remove ${esc(item.term)}">×</button></span>`).join(''):'<span class="empty-bank">Choose four to six expressions you can use naturally.</span>'}
function renderGrammarList(){
  if(!mission.grammarSuggestions?.length)return '<p class="empty-bank">Grammar suggestions are being prepared…</p>';
  return mission.grammarSuggestions.map((item,index)=>`<label class="grammar-option${mission.selected.grammar?.n===item.n?' selected':''}"><input type="radio" name="grammarTarget" value="${item.n}" data-grammar="${index}" ${mission.selected.grammar?.n===item.n?'checked':''}><span class="grammar-main"><strong>${esc(item.title)}</strong><span>${esc(item.desc)}</span><a href="${esc(item.file)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Open chapter ↗</a></span></label>`).join('');
}
function renderLanguage(){
  const target=mission.selected.pronunciation||choosePronunciation();mission.selected.pronunciation=target;
  return `${stageHead('Stage 3 · Prepare language','Choose language you can actually retrieve under pressure.','The aim is not to decorate the response. Select a few precise expressions, one grammar structure and one delivery target.')}
  <div class="language-grid"><article class="tool-card"><h3>Relevant vocabulary</h3><p>Click useful expressions, then write your own sentence rather than memorising the example.</p><div class="vocab-bank" id="vocabBank">${renderVocabBank()}</div><h4>My active selection</h4><div class="selected-bank" id="selectedVocab">${renderSelectedVocab()}</div></article>
  <article class="tool-card"><h3>One grammar target</h3><p>Choose a structure that helps your analysis. Accuracy matters more than complexity.</p><div class="grammar-list" id="grammarList">${renderGrammarList()}</div></article>
  <article class="tool-card wide"><h3>Put the language into one analytical sentence</h3><p>Use at least one selected expression and the grammar target. The sentence must make a claim about the document or wider debate.</p><textarea class="notes small" data-note="languageSentence" placeholder="Although…, the document suggests that… because…">${esc(mission.notes.languageSentence)}</textarea>
  <div class="pronunciation-target"><strong>${esc(target.title)}</strong><span>${esc(target.desc)} <a href="pronunciation.html?eclFind=${encodeURIComponent(target.find)}" target="_blank" rel="noopener">Open the related pronunciation work ↗</a></span></div>
  <label style="display:block;margin-top:13px;font-size:.8rem;font-weight:700;color:var(--navy)">Sentence or phrase to rehearse aloud</label><textarea class="notes small" data-note="pronunciationPhrase" placeholder="Use a sentence from your own argument and mark the words that need stress.">${esc(mission.notes.pronunciationPhrase||mission.notes.languageSentence)}</textarea></article></div>`;
}
function speakingOutline(){return [['Context',mission.notes.context],['Key question',mission.notes.keyQuestion],['Part I',mission.notes.plan1],['Part II',mission.notes.plan2],['Part III',mission.notes.plan3],['Language target',mission.notes.languageSentence]].filter(x=>x[1])}
function renderSpeak(){
  const outline=speakingOutline();
  const question=mission.followupIndex>=0?mission.followups[mission.followupIndex]:null;
  return `${stageHead('Stage 4 · Speak','Deliver the response, then face follow-up questions.','Speak from a compact outline. The recording stays in this tab and is never uploaded.')}
  <div class="speaking-layout"><article class="studio-card"><h3>Timed oral response</h3><div class="field" style="max-width:190px;margin:13px auto 0"><label for="speakMinutes">Speaking time</label><select id="speakMinutes" data-config="speak"><option value="5" ${mission.config.speak===5?'selected':''}>5 minutes</option><option value="8" ${mission.config.speak===8?'selected':''}>8 minutes</option><option value="10" ${mission.config.speak===10?'selected':''}>10 minutes</option></select></div><div class="timer" id="speakClock">${fmt(mission.timers.speakRemaining)}</div><div class="timer-controls"><button class="btn btn-primary" type="button" id="speakToggle">Start</button><button class="btn btn-ghost" type="button" id="speakReset">Reset</button></div>
  <div class="outline">${outline.length?outline.map(([label,text])=>`<div><strong>${esc(label)}:</strong> ${esc(text)}</div>`).join(''):'<div>Your outline is still empty. Return to the previous stages or speak from the document without a script.</div>'}</div>
  <div class="recording"><h3>Private recording</h3><p>Listen back once for structure and once for your chosen priority: <strong>${esc(mission.config.focus)}</strong>.</p><div class="record-controls" style="margin-top:11px"><button class="btn btn-navy" type="button" id="recordStart">● Record</button><button class="btn btn-ghost" type="button" id="recordStop" disabled>Stop</button></div><div class="record-status" id="recordStatus">No recording yet.</div><audio class="record-playback" id="recordPlayback" controls hidden></audio><p class="privacy-note">The recording disappears when the page is closed or reloaded.</p></div></article>
  <article class="follow-card"><h3>Follow-up questions</h3><p style="color:var(--muted);font-size:.8rem;margin-top:6px">Answer without restarting your presentation. A strong answer acknowledges complexity, takes a position and supports it.</p><div class="question-display" id="questionDisplay">${question?`<div><strong>${esc(question)}</strong><span>Take a few seconds, then answer directly.</span></div>`:'<div><strong>Ready for an examiner question?</strong><span>Reveal the first question after your presentation.</span></div>'}</div><div class="follow-actions" style="margin-top:13px"><button class="btn btn-primary" type="button" id="nextQuestion">${question?'Next question':'Reveal a question'}</button><button class="btn btn-ghost" type="button" id="resetQuestions">Reset</button></div><div class="question-count" id="questionCount">${question?`Question ${mission.followupIndex+1} of ${mission.followups.length}`:`${mission.followups.length} questions prepared`}</div></article></div>`;
}
function weakPointCandidates(){
  const checks=mission.evaluation||{},items=[];
  if(!checks.context)items.push({id:'context',title:'Contextualisation',prompt:'Contextualise one current document in two precise sentences.',answer:'Name the country, date, relevant turning point or institutional background, then explain the connection to the document.',type:'methodology',url:'methodology.html',target:'Contextualise Before You Analyse'});
  if(!checks.question)items.push({id:'question',title:'Key question',prompt:'Turn a topic into a genuine key question built around a tension.',answer:'Avoid “To what extent”. Ask what explains the tension, what is at stake, or what the limits of a claim are.',type:'methodology',url:'methodology.html',target:'Build a Strong Key Question'});
  if(!checks.plan)items.push({id:'plan',title:'Analytical plan',prompt:'Build a plan that moves from claim to complication and, if useful, reframing.',answer:'Do not use a flat for/against structure. Each part needs a governing idea and evidence.',type:'methodology',url:'methodology.html',target:'Build an Analytical Plan'});
  if(!checks.evidence)items.push({id:'evidence',title:'Evidence and examples',prompt:'Select one precise piece of evidence and explain what it proves.',answer:'A fact becomes useful only when it is contextualised and interpreted.',type:'methodology',url:'methodology.html',target:'Use Evidence Precisely'});
  if(!checks.language&&mission.selected.grammar)items.push({id:`grammar-${mission.selected.grammar.n}`,title:mission.selected.grammar.title,prompt:`Use ${mission.selected.grammar.title} accurately in one analytical sentence.`,answer:mission.selected.grammar.desc,type:'grammar',url:mission.selected.grammar.file,target:mission.selected.grammar.title});
  if(!checks.delivery){const target=mission.selected.pronunciation||choosePronunciation();items.push({id:`pron-${target.id}`,title:target.title,prompt:`Say your prepared phrase using ${target.title.toLowerCase()}.`,answer:target.desc,type:'pronunciation',url:'pronunciation.html',target:target.find})}
  return items;
}
function renderReview(){
  const weak=weakPointCandidates();
  return `${stageHead('Stage 5 · Review','Evaluate the performance, not your personality.','Tick only what was genuinely audible in the response. Unticked skills can be sent to Review Studio.')}
  <div class="review-layout"><article class="review-box"><h3>Quick performance check</h3><div class="check-list">${[
    ['context','I contextualised the document before analysing it.'],['question','My key question exposed a genuine tension.'],['plan','My plan answered the question through a movement of thought.'],['evidence','I used precise evidence and explained what it showed.'],['language','I reused accurate vocabulary and the grammar target.'],['delivery','My stress, pauses and intonation helped the listener follow.']
  ].map(([key,label])=>`<label class="review-check"><input type="checkbox" data-eval="${key}" ${mission.evaluation[key]?'checked':''}><span>${esc(label)}</span></label>`).join('')}</div><div class="priority-select"><label for="nextPriority" style="display:block;font-size:.8rem;font-weight:700;color:var(--navy);margin-bottom:6px">One priority for the next practice mission</label><select id="nextPriority" data-note="nextPriority"><option value="">Choose one priority</option>${['Contextualisation','Key question','Plan and transitions','Examples and evidence','Grammar and vocabulary','Pronunciation and intonation','Follow-up interaction'].map(item=>`<option ${mission.notes.nextPriority===item?'selected':''}>${item}</option>`).join('')}</select></div></article>
  <article class="review-box"><h3>Send weak points to Review Studio</h3><p style="color:var(--muted);font-size:.8rem;margin-top:6px">The list updates when you tick or untick the performance check. Choose only skills worth revisiting.</p><div class="weak-list" id="weakList">${weak.length?weak.map((item,index)=>`<label class="weak-item"><input type="checkbox" data-weak="${index}" checked><span><strong>${esc(item.title)}</strong><br>${esc(item.prompt)}</span></label>`).join(''):'<div class="callout"><strong>No weak point selected.</strong> You can still save the mission and start a harder one later.</div>'}</div></article></div>
  <div class="completion"><h3>Save this completed mission</h3><p>The mission history stores the document title, mode, country, selected priority and completion date. It does not store an audio recording.</p><div class="completion-actions"><button class="btn btn-primary" type="button" id="completeMission">Complete and save</button><button class="btn btn-ghost" type="button" id="copyNotes">Copy my mission outline</button><button class="btn btn-ghost" type="button" id="newMission">Start another mission</button></div><div class="completion-status" id="completionStatus" aria-live="polite"></div></div>`;
}
function bindStageEvents(){
  if(mission.stage===1){
    $$('[data-use-context]').forEach(button=>button.addEventListener('click',()=>{const item=mission.contextSuggestions[+button.dataset.useContext];const line=`${item.title}: ${item.description}`;mission.notes.context=[mission.notes.context,line].filter(Boolean).join('\n');const area=$('#contextNote');if(area)area.value=mission.notes.context;queueSave()}));
    $$('[data-tension]').forEach(button=>button.addEventListener('click',()=>{const value=button.dataset.tension;mission.notes.tension=value;const tensionArea=$('#tension');if(tensionArea)tensionArea.value=value;const key=$('#keyQuestion');if(key&&!key.value)key.value=`How does this issue reveal the tension between ${value.toLowerCase()}?`;mission.notes.keyQuestion=key?.value||mission.notes.keyQuestion;queueSave()}));
  }
  if(mission.stage===2){
    $$('[data-vocab]').forEach(button=>button.addEventListener('click',()=>toggleVocabulary(+button.dataset.vocab)));
    $$('[data-remove-vocab]').forEach(button=>button.addEventListener('click',()=>{mission.selected.vocabulary.splice(+button.dataset.removeVocab,1);queueSave();renderWorkspace()}));
    $$('[data-grammar]').forEach(input=>input.addEventListener('change',()=>{mission.selected.grammar=mission.grammarSuggestions[+input.dataset.grammar];queueSave();renderWorkspace()}));
  }
  if(mission.stage===3){
    $('#speakToggle')?.addEventListener('click',toggleSpeak);$('#speakReset')?.addEventListener('click',resetSpeak);$('#nextQuestion')?.addEventListener('click',nextQuestion);$('#resetQuestions')?.addEventListener('click',()=>{mission.followupIndex=-1;queueSave();renderWorkspace()});setupRecorder();
  }
  if(mission.stage===4){
    $$('[data-eval]').forEach(input=>input.addEventListener('change',()=>{captureField(input);queueSave();setTimeout(()=>renderWorkspace(),50)}));
    $('#completeMission')?.addEventListener('click',completeMission);$('#copyNotes')?.addEventListener('click',copyMissionNotes);$('#newMission')?.addEventListener('click',startAnotherMission);
  }
  $$('.starter').forEach(button=>button.addEventListener('click',()=>{}));
}
function toggleVocabulary(index){const item=mission.vocabSuggestions[index];if(!item)return;const existing=mission.selected.vocabulary.findIndex(x=>x.id===item.id);if(existing>=0)mission.selected.vocabulary.splice(existing,1);else if(mission.selected.vocabulary.length<8)mission.selected.vocabulary.push(item);queueSave();renderWorkspace()}
function choosePronunciation(){
  if(mission.selected.pronunciation)return mission.selected.pronunciation;
  const text=normalise(`${mission.config.focus} ${mission.document.format} ${mission.document.topic}`);let index=0;if(/pronunciation|intonation/.test(text))index=4;else if(/data|figure|econom/.test(text))index=5;else if(/plan|transition/.test(text))index=0;else if(/evidence|contrast/.test(text))index=2;else if(/audio|video/.test(text))index=3;else index=1;return PRONUNCIATION_TARGETS[index];
}

function paintPrep(){if(!mission)return;$('#prepClock').textContent=fmt(mission.timers.prepRemaining);$('#prepClock').classList.toggle('warn',mission.timers.prepRemaining<=120);$('#prepToggle').textContent=prepTimer?'Pause':'Start'}
function togglePrep(){if(!mission)return;if(prepTimer){clearInterval(prepTimer);prepTimer=null;saveMission();paintPrep();return}prepTimer=setInterval(()=>{mission.timers.prepRemaining=Math.max(0,mission.timers.prepRemaining-1);paintPrep();if(mission.timers.prepRemaining%10===0)writeLocal(CURRENT_KEY,{...mission,updatedAt:nowISO()});if(mission.timers.prepRemaining===0){clearInterval(prepTimer);prepTimer=null;saveMission();paintPrep()}},1000);paintPrep()}
function resetPrep(){if(!mission)return;if(prepTimer)clearInterval(prepTimer);prepTimer=null;mission.timers.prepRemaining=mission.config.prep*60;saveMission();paintPrep()}
function paintSpeak(){const el=$('#speakClock');if(!el||!mission)return;el.textContent=fmt(mission.timers.speakRemaining);el.classList.toggle('warn',mission.timers.speakRemaining<=60);if($('#speakToggle'))$('#speakToggle').textContent=speakTimer?'Pause':'Start'}
function toggleSpeak(){if(!mission)return;if(speakTimer){clearInterval(speakTimer);speakTimer=null;saveMission();paintSpeak();return}speakTimer=setInterval(()=>{mission.timers.speakRemaining=Math.max(0,mission.timers.speakRemaining-1);paintSpeak();if(mission.timers.speakRemaining===0){clearInterval(speakTimer);speakTimer=null;saveMission();paintSpeak()}},1000);paintSpeak()}
function resetSpeak(){if(!mission)return;if(speakTimer)clearInterval(speakTimer);speakTimer=null;mission.timers.speakRemaining=mission.config.speak*60;saveMission();paintSpeak()}
function stopTimers(){if(prepTimer)clearInterval(prepTimer);if(speakTimer)clearInterval(speakTimer);prepTimer=speakTimer=null}
function setupRecorder(){
  const start=$('#recordStart'),stop=$('#recordStop'),status=$('#recordStatus'),playback=$('#recordPlayback');if(!start||!stop)return;
  if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){start.disabled=true;status.textContent='Audio recording is not supported by this browser.';return}
  start.addEventListener('click',async()=>{try{revokeAudio();mediaStream=await navigator.mediaDevices.getUserMedia({audio:true});mediaChunks=[];mediaRecorder=new MediaRecorder(mediaStream);mediaRecorder.ondataavailable=event=>{if(event.data.size)mediaChunks.push(event.data)};mediaRecorder.onstop=()=>{const blob=new Blob(mediaChunks,{type:mediaRecorder.mimeType||'audio/webm'});audioUrl=URL.createObjectURL(blob);playback.src=audioUrl;playback.hidden=false;status.textContent='Recording ready. Listen once for structure and once for delivery.';mediaStream?.getTracks().forEach(track=>track.stop());mediaStream=null};mediaRecorder.start();start.disabled=true;stop.disabled=false;status.textContent='Recording… Speak from ideas, not a full script.'}catch(_){status.textContent='Microphone access was blocked. You can still speak aloud with the timer.'}});
  stop.addEventListener('click',()=>{if(mediaRecorder&&mediaRecorder.state!=='inactive')mediaRecorder.stop();start.disabled=false;stop.disabled=true});
}
function revokeAudio(){if(audioUrl){URL.revokeObjectURL(audioUrl);audioUrl=''}if(mediaStream){mediaStream.getTracks().forEach(track=>track.stop());mediaStream=null}}
function nextQuestion(){if(!mission.followups.length)mission.followups=buildFollowups();mission.followupIndex=(mission.followupIndex+1)%mission.followups.length;queueSave();renderWorkspace()}
function buildFollowups(){
  const doc=mission.document,c=country(),questions=[
    `What is the most important consequence of the issue raised by “${doc.title}”?`,
    `How convincing or reliable is ${doc.source}?`,
    `How does this debate reflect a deeper tension in ${c.name}?`,
    ...c.questions,...GENERAL_FOLLOWUPS
  ];
  if(mission.notes.tension)questions.unshift(`You identified “${mission.notes.tension}”. Which side should take priority, and why?`);
  if(mission.notes.keyQuestion)questions.unshift(`Your key question was “${mission.notes.keyQuestion}” What is your clearest answer in two sentences?`);
  const unique=[...new Set(questions.filter(Boolean))];let seed=[...mission.id].reduce((n,ch)=>n+ch.charCodeAt(0),0);for(let i=unique.length-1;i>0;i--){seed=(seed*9301+49297)%233280;const j=Math.floor(seed/233280*(i+1));[unique[i],unique[j]]=[unique[j],unique[i]]}
  return unique.slice(0,mission.config.mode==='challenge'?8:mission.config.mode==='guided'?5:6);
}

async function loadMissionSupport(){
  if(!mission)return;mission.followups=mission.followups?.length?mission.followups:buildFollowups();
  const [search,vocab,grammar]=await Promise.all([loadSearchIndex(),loadVocabIndex(),loadGrammarIndex()]);if(!mission)return;
  mission.contextSuggestions=chooseContext(search);mission.vocabSuggestions=chooseVocabulary(vocab);mission.grammarSuggestions=chooseGrammar(grammar);mission.selected.pronunciation=mission.selected.pronunciation||choosePronunciation();saveMission(false);if(mission.stage===1||mission.stage===2)renderWorkspace();
}
function loadSearchIndex(){return searchIndexPromise||(searchIndexPromise=fetchJSON('search-index.json').then(data=>data.entries||[]).catch(()=>[]))}
function loadVocabIndex(){return vocabIndexPromise||(vocabIndexPromise=fetchJSON('review-vocabulary-index.json').then(data=>data.entries||[]).catch(()=>[]))}
function loadGrammarIndex(){return grammarIndexPromise||(grammarIndexPromise=fetchJSON('review-grammar-index.json').then(data=>data.chapters||[]).catch(()=>[]))}
function scoreText(text,tokens){const norm=normalise(text);let score=0;tokens.forEach(token=>{if(norm.includes(token))score+=token.length>7?4:2});return score}
function chooseContext(entries){
  const code=mission.config.country,tokens=tokenise(`${sourceText(mission.document)} ${mission.notes.tension}`);const candidates=entries.filter(item=>(item.category==='Timeline'&&item.url.includes(`country=${code}`))||(item.category==='Civilisation'&&normalise(item.title)===normalise(country().name)));
  const scored=candidates.map(item=>({...item,_score:scoreText(`${item.title} ${item.description} ${item.keywords}`,tokens)+(item.category==='Civilisation'?3:0)})).sort((a,b)=>b._score-a._score||b.priority-a.priority);
  const atlas=scored.find(x=>x.category==='Civilisation'),timeline=scored.filter(x=>x.category==='Timeline');return [atlas,...timeline.slice(0,3)].filter(Boolean).slice(0,4);
}
function chooseVocabulary(rows){
  const topic=mission.document.topic||inferTopic(mission.document),tokens=tokenise(`${sourceText(mission.document)} ${(TOPIC_VOCAB[topic]||[]).join(' ')}`);const preferred=new Set((TOPIC_VOCAB[topic]||[]).map(normalise));
  const scored=rows.map(row=>{const [id,term,fr,def,example,file,chapter]=row;let score=scoreText(`${term} ${fr} ${def} ${chapter}`,tokens);if(preferred.has(normalise(term)))score+=15;return {id,term,fr,def,example,file,chapter,_score:score}}).filter(x=>x._score>0).sort((a,b)=>b._score-a._score||a.term.length-b.term.length);
  const unique=[],seen=new Set();for(const item of scored){const key=normalise(item.term);if(seen.has(key))continue;seen.add(key);unique.push(item);if(unique.length===12)break}return unique;
}
function chooseGrammar(chapters){
  const topic=mission.document.topic||inferTopic(mission.document),hints=GRAMMAR_HINTS[topic]||[],tokens=tokenise(`${sourceText(mission.document)} ${hints.join(' ')} ${mission.config.focus}`);
  return chapters.map(item=>{let score=scoreText(`${item.title} ${item.desc} ${item.track}`,tokens);for(const hint of hints)if(normalise(item.title).includes(normalise(hint)))score+=12;if(/grammar and vocabulary/.test(mission.config.focus)&&item.track!=='foundation')score+=2;return {...item,_score:score}}).sort((a,b)=>b._score-a._score||a.n-b.n).slice(0,3);
}

function addWeakPointsToReview(){
  if(!window.ECLReview)return 0;const candidates=weakPointCandidates(),checked=$$('[data-weak]:checked').map(input=>candidates[+input.dataset.weak]).filter(Boolean);for(const item of checked){window.ECLReview.add({id:`colle-mission:${mission.id}:${item.id}`,type:item.type,title:item.title,prompt:item.prompt,answer:item.answer,context:`Colle Mission · ${country().name}`,url:item.url,target:item.target,source:'Colle Mission Builder',origin:'self-evaluation'},{dueNow:true})}return checked.length;
}
function completeMission(){
  if(!mission)return;captureStage();const reviewCount=addWeakPointsToReview();mission.completedAt=nowISO();mission.updatedAt=mission.completedAt;const history=readLocal(HISTORY_KEY,[]);history.unshift({id:mission.id,title:mission.document.title,source:mission.document.source,country:mission.config.country,mode:mission.config.mode,focus:mission.config.focus,priority:mission.notes.nextPriority,completedAt:mission.completedAt,url:mission.document.url||''});writeLocal(HISTORY_KEY,history.slice(0,20));writeLocal(LAST_KEY,mission);localStorage.removeItem(CURRENT_KEY);stopTimers();revokeAudio();const status=$('#completionStatus');if(status)status.textContent=`Mission saved.${reviewCount?` ${reviewCount} weak point${reviewCount===1?'':'s'} added to Review Studio.`:''}`;renderHistory();renderResume();$('#nextStage').disabled=true;
}
function missionOutlineText(){
  const vocab=(mission.selected.vocabulary||[]).map(x=>x.term).join(', '),grammar=mission.selected.grammar?.title||'';return [
    `COLLE MISSION — ${mission.document.title}`,`${country().name} · ${MODE_INFO[mission.config.mode].label} · ${mission.document.source}`,
    mission.document.url?`Source: ${mission.document.url}`:'',`Priority: ${mission.config.focus}`,'',
    `SUMMARY\n${mission.notes.gist}`,`CONTEXT\n${mission.notes.context}`,`KEY QUESTION\n${mission.notes.keyQuestion}`,`PLAN I\n${mission.notes.plan1}`,`PLAN II\n${mission.notes.plan2}`,mission.notes.plan3?`PLAN III\n${mission.notes.plan3}`:'',vocab?`ACTIVE VOCABULARY\n${vocab}`:'',grammar?`GRAMMAR TARGET\n${grammar}`:'',mission.notes.languageSentence?`ANALYTICAL SENTENCE\n${mission.notes.languageSentence}`:'',mission.notes.nextPriority?`NEXT PRIORITY\n${mission.notes.nextPriority}`:''
  ].filter(Boolean).join('\n\n')
}
async function copyMissionNotes(){const status=$('#completionStatus');try{await navigator.clipboard.writeText(missionOutlineText());if(status)status.textContent='Mission outline copied.'}catch(_){if(status)status.textContent='Copying was blocked. Select and copy your notes manually.'}}
function startAnotherMission(){stopTimers();revokeAudio();localStorage.removeItem(CURRENT_KEY);mission=null;selectedSource=null;$('#workspace').classList.remove('on');$('#setup').hidden=false;$('#sources').hidden=true;updateBuildBar();renderResume();window.scrollTo({top:$('#setup').offsetTop-70,behavior:'smooth'})}
function renderHistory(){const history=readLocal(HISTORY_KEY,[]),section=$('#historySection');section.hidden=!history.length;if(!history.length)return;$('#historyGrid').innerHTML=history.slice(0,6).map(item=>`<article class="history-card"><strong>${esc(item.title)}</strong><span>${esc(COUNTRIES[item.country]?.name||'')} · ${esc(MODE_INFO[item.mode]?.label||'Mission')}<br>${esc(dateLabel(item.completedAt))}${item.priority?` · next: ${esc(item.priority)}`:''}</span>${item.url?`<a href="${esc(item.url)}" target="_blank" rel="noopener">Reopen source ↗</a>`:'<a href="colle-trainer.html">Build another mission →</a>'}</article>`).join('')}

function initialise(){
  configureEvents();setMode(new URLSearchParams(location.search).get('mode')||'standard');renderResume();renderHistory();
  const saved=loadCurrent();if(saved&&new URLSearchParams(location.search).get('resume')==='1')resumeSavedMission();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialise,{once:true});else initialise();
})();
