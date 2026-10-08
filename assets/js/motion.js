(()=>{
  'use strict';
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('motion-ready');
  window.addEventListener('load',()=>document.body.classList.add('page-loaded'),{once:true});

  if(!reduce){
    let raf=0,mx=innerWidth*.5,my=innerHeight*.2;
    window.addEventListener('pointermove',e=>{
      mx=e.clientX;my=e.clientY;
      if(raf)return;
      raf=requestAnimationFrame(()=>{
        document.documentElement.style.setProperty('--mx',mx+'px');
        document.documentElement.style.setProperty('--my',my+'px');
        raf=0;
      });
    },{passive:true});
  }

  const revealTargets=[
    '.hero-copy','.hero-showcase','.feature-grid article','.analytics-card','.order-panel','.summary-panel','.history-panel','.about-project','.site-footer'
  ];
  const els=[...document.querySelectorAll(revealTargets.join(','))];
  els.forEach((el,i)=>{el.classList.add('reveal-motion');el.style.transitionDelay=Math.min(i*45,240)+'ms'});
  if(reduce){els.forEach(el=>el.classList.add('is-visible'))}
  else{
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target)}
    }),{threshold:.08,rootMargin:'0px 0px -40px'});
    els.forEach(el=>io.observe(el));
  }

  document.addEventListener('pointerdown',e=>{
    const b=e.target.closest('.btn,.icon-btn');
    if(!b||reduce)return;
    const r=b.getBoundingClientRect(),s=Math.max(r.width,r.height),wave=document.createElement('span');
    wave.className='ripple-wave';wave.style.width=wave.style.height=s+'px';wave.style.left=(e.clientX-r.left-s/2)+'px';wave.style.top=(e.clientY-r.top-s/2)+'px';
    b.appendChild(wave);setTimeout(()=>wave.remove(),650);
  });

  const rows=document.getElementById('rows');
  if(rows){
    const mo=new MutationObserver(()=>{
      [...rows.children].forEach((tr,i)=>{tr.classList.remove('row-enter');void tr.offsetWidth;tr.style.animationDelay=Math.min(i*35,180)+'ms';tr.classList.add('row-enter')});
    });
    mo.observe(rows,{childList:true});
  }

  const summary=document.querySelector('.summary-panel');
  if(summary){
    const onScroll=()=>summary.classList.toggle('motion-sticky',scrollY>520);
    addEventListener('scroll',onScroll,{passive:true});onScroll();
  }
})();


const DKDashboardMotion=(()=>{
  const money=v=>'Rp'+Math.round(Number(v)||0).toLocaleString('id-ID');
  const numberFromText=v=>Number(String(v||'').replace(/[^\d-]/g,''))||0;

  function history(){
    try{
      const x=JSON.parse(localStorage.getItem('dkShopHistoryFinal'));
      return Array.isArray(x)?x:[];
    }catch{return[]}
  }

  function animateValue(el){
    if(!el||el.dataset.dkCountRunning==='1')return;
    const text=el.textContent.trim();
    const isMoney=text.startsWith('Rp');
    const target=numberFromText(text);
    if(!target)return;
    el.dataset.dkCountRunning='1';
    const duration=760;
    const start=performance.now();
    const ease=t=>1-Math.pow(1-t,3);
    function frame(now){
      const p=Math.min(1,(now-start)/duration);
      const val=Math.round(target*ease(p));
      el.textContent=isMoney?money(val):val.toLocaleString('id-ID');
      if(p<1)requestAnimationFrame(frame);
      else{
        el.textContent=text;
        el.dataset.dkCountRunning='0';
      }
    }
    requestAnimationFrame(frame);
  }

  function renderRecent(){
    const box=document.getElementById('dashboardRecentList');
    if(!box)return;
    const rows=history()
      .filter(x=>(x.status||'draft')!=='cancelled')
      .sort((a,b)=>new Date(b.updatedAt||b.savedAt||`${b.date||''}T${b.time||'00:00'}`)-new Date(a.updatedAt||a.savedAt||`${a.date||''}T${a.time||'00:00'}`))
      .slice(0,5);

    if(!rows.length){
      box.innerHTML='<div class="dashboard-recent-empty">Belum ada aktivitas transaksi.</div>';
      return;
    }

    box.innerHTML=rows.map(x=>{
      const count=(x.data||[]).length;
      const names=[...new Set((x.data||[]).map(r=>String(r.name||'').trim()).filter(Boolean))];
      const customer=names.slice(0,2).join(', ')+(names.length>2?` +${names.length-2}`:'');
      return `<article class="dashboard-recent-item">
        <div>
          <strong>${x.orderNo||'Transaksi'}</strong>
          <span>${customer||'Tanpa customer'} • ${count} item</span>
        </div>
        <div class="dashboard-recent-value">${money(x.total)}</div>
      </article>`;
    }).join('');
  }

  function play(){
    const page=document.querySelector('[data-page="dashboard"]');
    if(!page||page.hidden)return;
    renderRecent();
    page.classList.remove('motion-ready');
    void page.offsetWidth;
    page.classList.add('motion-ready');
    page.querySelectorAll('.analytics-card strong,.analytics-trend-summary strong').forEach(animateValue);
  }

  window.addEventListener('hashchange',()=>{if((location.hash||'#dashboard')==='#dashboard')setTimeout(play,40)});
  window.addEventListener('dk-dashboard-refresh',play);

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>setTimeout(play,80),{once:true});
  }else setTimeout(play,80);

  return{play,renderRecent};
})();
window.DKDashboardMotion=DKDashboardMotion;
