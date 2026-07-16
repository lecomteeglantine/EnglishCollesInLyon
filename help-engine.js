(() => {
  'use strict';
  const DATA=window.HELP_DATA;
  const KEY='eclyon_help_state_v1';
  const $=s=>document.querySelector(s);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const byId=Object.fromEntries(DATA.skills.map(s=>[s.id,s]));
  const domains=Object.keys(DATA.domains);
  const defaultState=()=>({cycle:1,view:'welcome',statuses:{},attempts:{},diagnostic:[],diagIndex:0,diagAnswers:{},plan:[],mission:null,missionWork:{},history:[]});
  let state=load();
  function load(){try{return {...defaultState(),...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){return defaultState()}}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
  function status(id){return state.statuses[id]||'not_checked'}
  function setStatus(id,v){state.statuses[id]=v;save()}
  function prereqReady(s){return (s.prereq||[]).every(id=>['ready','consolidated'].includes(status(id)))}
  function orderedSkills(domain){return DATA.skills.filter(s=>s.domain===domain).sort((a,b)=>a.stage-b.stage||a.order-b.order)}
  function nextAvailable(domain,limit=2,includeBlocked=false){
    const pool=orderedSkills(domain).filter(s=>!['ready','consolidated'].includes(status(s.id)));
    const ready=pool.filter(s=>includeBlocked||prereqReady(s));
    return ready.slice(0,limit);
  }
  function buildDiagnostic(progress=false){
    const queue=[];
    if(progress){
      const review=state.plan.filter(id=>status(id)!=='consolidated').map(id=>byId[id]).filter(Boolean);
      review.forEach(s=>queue.push(s.id));
      domains.forEach(d=>nextAvailable(d,2).forEach(s=>{if(!queue.includes(s.id))queue.push(s.id)}));
    }else{
      domains.forEach(d=>orderedSkills(d).filter(s=>s.stage===1).slice(0,2).forEach(s=>queue.push(s.id)));
    }
    state.diagnostic=queue.slice(0,14); state.diagIndex=0; state.diagAnswers={}; state.view='diagnostic'; state.mission=null; save(); render();
  }
  function answerDiagnostic(choice){
    const id=state.diagnostic[state.diagIndex], s=byId[id];
    const ok=choice===s.diagnostic.answer;
    state.diagAnswers[id]=ok;
    if(ok){
      const prev=status(id);
      setStatus(id,prev==='ready'?'consolidated':'ready');
    }else setStatus(id,'needs_attention');
    state.diagIndex++;
    if(state.diagIndex>=state.diagnostic.length){generatePlan();}
    else {save();render();}
  }
  function generatePlan(){
    let candidates=DATA.skills.filter(s=>['needs_attention','in_progress'].includes(status(s.id)) && (prereqReady(s)||s.stage===1));
    candidates.sort((a,b)=>a.stage-b.stage||a.order-b.order);
    const plan=[];
    const add=s=>{if(s&&!plan.includes(s.id)&&plan.length<7){plan.push(s.id)}};
    // One priority per domain first.
    domains.forEach(d=>add(candidates.find(s=>s.domain===d)));
    candidates.forEach(add);
    // Ensure civilisation and integrated practice when available.
    if(!plan.some(id=>byId[id].domain==='civilisation')) add(nextAvailable('civilisation',1)[0]);
    if(!plan.some(id=>byId[id].domain==='integrated')) add(nextAvailable('integrated',1)[0]);
    domains.forEach(d=>nextAvailable(d,2).forEach(add));
    state.plan=plan;
    plan.forEach(id=>{if(!['ready','consolidated'].includes(status(id)))state.statuses[id]='in_progress'});
    state.view='plan'; state.diagIndex=0; save(); render();
  }
  function openMission(id){state.mission=id;state.view='mission';state.missionWork[id]=state.missionWork[id]||{practice:{},say:false,use:false,check:null,complete:false};save();render();window.scrollTo({top:0,behavior:'smooth'})}
  function answerPractice(skillId,idx,choice){
    const w=state.missionWork[skillId]||(state.missionWork[skillId]={practice:{},say:false,use:false,check:null,complete:false});
    w.practice[idx]=choice;evaluateMission(skillId);save();render();
  }
  function evaluateMission(skillId){
    const s=byId[skillId],w=state.missionWork[skillId];
    const practiceOK=s.mission.practice.every((item,i)=>w.practice[i]===item.answer);
    const checkOK=w.check===s.mission.check.answer;
    w.complete=Boolean(practiceOK && checkOK && w.say && w.use);
    if(w.complete) state.statuses[skillId]='ready';
  }
  function answerCheck(skillId,choice){
    const w=state.missionWork[skillId];
    w.check=choice; evaluateMission(skillId); save();render();
  }
  function toggleWork(skillId,key){const w=state.missionWork[skillId];w[key]=!w[key];evaluateMission(skillId);save();render()}
  function completePlanReady(){return state.plan.length>0 && state.plan.every(id=>state.missionWork[id]?.complete)}
  function startNextCheck(){
    const completed=state.plan.map(id=>({id,status:status(id)}));
    state.history.push({cycle:state.cycle,skills:completed,completedAt:new Date().toISOString()});
    state.cycle++; state.plan=[]; state.mission=null; state.view='welcome'; save(); buildDiagnostic(true);
  }
  function resetAll(){if(confirm('Reset the complete guided-plan history on this device?')){state=defaultState();save();render()}}
  function speak(text){if(!('speechSynthesis'in window))return; speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-GB';speechSynthesis.speak(u)}
  function domainBadge(s){const d=DATA.domains[s.domain];return `<span class="domain-badge" style="--dc:${d.colour}"><b>${d.letter}</b>${esc(d.label)}</span>`}
  function render(){
    $('#cycleLabel').textContent=`Learning cycle ${state.cycle}`;
    $('#app').innerHTML=state.view==='welcome'?welcomeView():state.view==='diagnostic'?diagnosticView():state.view==='plan'?planView():missionView();
    bind();
  }
  function welcomeView(){
    const hasProgress=Object.keys(state.statuses).length>0;
    return `<section class="panel welcome-panel"><div class="eyebrow">Guided support</div>
      <p class="lead">Start with a simple diagnostic. The site will identify useful priorities and create a progressive sequence of missions across grammar, vocabulary, pronunciation, methodology, civilisation and colle skills.</p>
      <div class="notice"><strong>This is not an exam.</strong> There is no pass or fail. A correct answer may allow you to skip a mission; a difficult answer simply helps the site choose a useful starting point.</div>
      <div class="domain-strip">${domains.map(d=>{const x=DATA.domains[d];return `<span style="--dc:${x.colour}">${x.letter} · ${esc(x.label)}</span>`}).join('')}</div>
      <div class="actions"><button class="btn primary" data-action="startDiag">${hasProgress?'Continue with a progress check':'Start my diagnostic'} <span>→</span></button>${hasProgress?'<button class="btn secondary" data-action="showPlan">Return to my plan</button>':''}</div></section>
      ${roadmapSummary()}`
  }
  function diagnosticView(){
    const id=state.diagnostic[state.diagIndex],s=byId[id];
    const pct=Math.round((state.diagIndex/state.diagnostic.length)*100);
    return `<section class="panel"><div class="topline">${domainBadge(s)}<span>Question ${state.diagIndex+1} of ${state.diagnostic.length}</span></div>
      <div class="progress"><span style="width:${pct}%"></span></div><h1>${esc(s.title)}</h1><p class="question">${esc(s.diagnostic.q)}</p>
      <div class="options">${s.diagnostic.opts.map((o,i)=>`<button class="option" data-diag="${i}">${esc(o)}</button>`).join('')}</div>
      <p class="quiet">Choose the answer that seems most accurate. The result is used only to build the next learning plan.</p></section>`
  }
  function planView(){
    const done=state.plan.filter(id=>state.missionWork[id]?.complete).length;
    return `<section class="panel"><div class="eyebrow">Your current plan</div><h1>Learning cycle ${state.cycle}</h1>
      <p class="lead">${done} of ${state.plan.length} missions completed. Work through the recommended order, or open another available mission when you need it.</p>
      <div class="plan-progress"><span style="width:${state.plan.length?done/state.plan.length*100:0}%"></span></div>
      <div class="mission-list">${state.plan.map((id,i)=>missionCard(byId[id],i)).join('')}</div>
      ${completePlanReady()?`<div class="cycle-complete"><h2>You have completed this learning cycle.</h2><p>The next progress check will use different questions, revisit these skills and explore the next available elements.</p><button class="btn primary" data-action="nextCheck">Start my new progress check →</button></div>`:''}
      <div class="plan-actions"><button class="btn secondary" data-action="roadmap">View the complete roadmap</button><button class="text-btn" data-action="reset">Reset all progress</button></div></section>
      <div id="roadmapMount">${roadmapSummary(true)}</div>`
  }
  function missionCard(s,i){const w=state.missionWork[s.id],done=w?.complete;return `<article class="mission-card ${done?'done':''}"><div class="mission-num">${done?'✓':i+1}</div><div class="mission-main">${domainBadge(s)}<h2>${esc(s.title)}</h2><p>${esc(s.short)}</p></div><button class="btn small ${done?'secondary':'primary'}" data-open="${s.id}">${done?'Review mission':'Open mission'} →</button></article>`}
  function missionView(){
    const s=byId[state.mission],w=state.missionWork[s.id];
    const allPractice=s.mission.practice.every((p,i)=>w.practice[i]===p.answer);
    const checkAnswered=w.check!==null, checkOK=w.check===s.mission.check.answer;
    const feedback=w.complete?s.mission.feedback.success:(checkAnswered&&!checkOK?s.mission.feedback.retry:(checkOK&&(!w.say||!w.use)?s.mission.feedback.partial:''));
    return `<button class="back" data-action="showPlan">← Back to my learning plan</button><section class="panel mission-panel"><div class="topline">${domainBadge(s)}<span>Stage ${s.stage} · ${esc(DATA.stages[s.stage])}</span></div><h1>${esc(s.title)}</h1><p class="lead">${esc(s.short)}</p>
      <div class="mission-step"><span class="step-no">1</span><div><h2>Learn</h2>${s.mission.learn.map(x=>`<p>${esc(x)}</p>`).join('')}<div class="model"><b>Model</b><p>${esc(s.mission.model)}</p></div><div class="warning"><b>Watch out</b><p>${esc(s.mission.commonError)}</p></div></div></div>
      <div class="mission-step"><span class="step-no">2</span><div><h2>Practise</h2>${s.mission.practice.map((p,idx)=>questionBlock(p,`data-practice="${idx}"`,w.practice[idx])).join('')}${allPractice?'<p class="micro-feedback">The guided practice is complete. Move to spoken use rather than repeating the same item.</p>':''}</div></div>
      <div class="mission-step"><span class="step-no">3</span><div><h2>Say it aloud</h2><p>${esc(s.mission.say)}</p><button class="speak" data-speak="${esc(s.mission.model)}">🔊 Hear the model</button><label class="checkline"><input type="checkbox" data-toggle="say" ${w.say?'checked':''}> I said the target aloud rather than only reading it silently.</label></div></div>
      <div class="mission-step"><span class="step-no">4</span><div><h2>Use it</h2><p>${esc(s.mission.useIt)}</p><label class="checkline"><input type="checkbox" data-toggle="use" ${w.use?'checked':''}> I used it, or I wrote down the exact class/colle situation where I will use it.</label></div></div>
      <div class="mission-step"><span class="step-no">5</span><div><h2>Check what you can do</h2>${questionBlock(s.mission.check,'data-check',w.check)}${checkOK&&!w.say||checkOK&&!w.use?'<p class="micro-feedback">The answer is correct. Complete the spoken and real-use steps before the mission is marked complete.</p>':''}</div></div>
      ${feedback?`<div class="grounded-feedback ${w.complete?'success':'neutral'}"><h2>${w.complete?'Mission completed':'What the result shows'}</h2><p>${esc(feedback)}</p></div>`:''}
      <div class="actions"><button class="btn secondary" data-action="showPlan">Return to my plan</button>${w.complete?'<button class="btn primary" data-action="nextMission">Open my next mission →</button>':''}</div></section>`
  }
  function questionBlock(item,attr,current){
    return `<div class="practice-q"><p class="question">${esc(item.q)}</p><div class="options compact">${item.opts.map((o,i)=>{const answered=current!==undefined&&current!==null;let cls='option';if(answered&&i===item.answer)cls+=' correct';else if(answered&&i===current)cls+=' wrong';return `<button class="${cls}" ${attr}${attr.includes('=')?'':'="'+i+'"'} ${attr.includes('=')?`data-choice="${i}"`:''}>${esc(o)}</button>`}).join('')}</div>${current!==undefined&&current!==null?`<p class="item-fb">${esc(current===item.answer?(item.feedback||'This answer matches the skill.'): 'Review the model and compare the function of each option.')}</p>`:''}</div>`
  }
  function roadmapSummary(full=false){
    const counts={};domains.forEach(d=>counts[d]=orderedSkills(d).filter(s=>['ready','consolidated'].includes(status(s.id))).length);
    return `<section class="panel roadmap"><div class="eyebrow">Complete roadmap</div><h2>${full?'All skills in this first build':'A progressive system, not a one-off test'}</h2><p>${full?'Every listed element can be diagnosed, assigned as a mission, checked and revisited in a later cycle.':'Each completed plan leads to a new diagnostic and a new plan. Skills return in different forms until they become reliable.'}</p>
      <div class="roadmap-grid">${domains.map(d=>{const info=DATA.domains[d],list=orderedSkills(d);return `<details ${full?'':'open'}><summary><span style="--dc:${info.colour}">${info.letter}</span>${esc(info.label)} <small>${counts[d]}/${list.length} ready</small></summary>${full?`<div class="skill-map">${list.map(s=>`<div class="map-row"><span class="status-dot ${status(s.id)}"></span><div><b>${esc(s.title)}</b><small>Stage ${s.stage} · ${esc(DATA.stages[s.stage])}</small></div></div>`).join('')}</div>`:`<p>${list.length} progressive skills are currently mapped in this build.</p>`}</details>`}).join('')}</div></section>`
  }
  function nextIncomplete(){return state.plan.find(id=>!state.missionWork[id]?.complete)}
  function bind(){
    document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>{
      const a=b.dataset.action;
      if(a==='startDiag')buildDiagnostic(Object.keys(state.statuses).length>0);
      if(a==='showPlan'){state.view=state.plan.length?'plan':'welcome';state.mission=null;save();render()}
      if(a==='nextCheck')startNextCheck();
      if(a==='reset')resetAll();
      if(a==='roadmap')$('#roadmapMount')?.scrollIntoView({behavior:'smooth'});
      if(a==='nextMission'){const id=nextIncomplete();if(id)openMission(id);else{state.view='plan';save();render()}}
    }));
    document.querySelectorAll('[data-diag]').forEach(b=>b.addEventListener('click',()=>answerDiagnostic(Number(b.dataset.diag))));
    document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openMission(b.dataset.open)));
    document.querySelectorAll('[data-practice]').forEach(b=>b.addEventListener('click',()=>answerPractice(state.mission,Number(b.dataset.practice),Number(b.dataset.choice))));
    document.querySelectorAll('[data-check]').forEach(b=>b.addEventListener('click',()=>answerCheck(state.mission,Number(b.dataset.check))));
    document.querySelectorAll('[data-toggle]').forEach(x=>x.addEventListener('change',()=>toggleWork(state.mission,x.dataset.toggle)));
    document.querySelectorAll('[data-speak]').forEach(b=>b.addEventListener('click',()=>speak(b.dataset.speak)));
  }
  render();
})();
