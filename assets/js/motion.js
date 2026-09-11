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
