(()=>{'use strict';
const VALID=new Set(['dashboard','app','catalog','customer','history','settings']);
const views=()=>[...document.querySelectorAll('[data-page]')];
const menuLinks=()=>[...document.querySelectorAll('[data-menu]')];
function current(){const raw=(location.hash||'#dashboard').slice(1).split('?')[0];return VALID.has(raw)?raw:'dashboard'}
function show(name,{scroll=true}={}){
  const target=VALID.has(name)?name:'dashboard';
  views().forEach(view=>{view.hidden=view.dataset.page!==target});
  menuLinks().forEach(link=>{const active=link.dataset.menu===target;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current')});
  document.body.dataset.activePage=target;
  if(location.hash!==`#${target}`) history.replaceState(null,'',`#${target}`);
  if(scroll) window.scrollTo({top:0,behavior:'smooth'});
}
document.addEventListener('click',event=>{
  const link=event.target.closest('[data-menu]');
  if(link){const target=link.dataset.menu;if(VALID.has(target)){event.preventDefault();if(location.hash===`#${target}`)show(target);else location.hash=target;}return;}
  const demo=event.target.closest('[data-action="load-demo"]');
  if(demo && current()!=='app') setTimeout(()=>{location.hash='app'},0);
});
window.addEventListener('hashchange',()=>show(current()));
document.addEventListener('DOMContentLoaded',()=>show(current(),{scroll:false}));
})();



(function initHardSearchCap(){
  const DEFAULT_MAX=30;
  const getMax=input=>input?.classList?.contains('order-autocomplete-input')?50:DEFAULT_MAX;
  const isTarget=input=>{
    if(!(input instanceof HTMLInputElement))return false;
    const id=String(input.id||'').toLowerCase();
    const cls=String(input.className||'').toLowerCase();
    return input.type==='search'
      || id.includes('search')
      || cls.includes('search')
      || cls.includes('customer-autocomplete-input')
      || cls.includes('order-autocomplete-input');
  };
  const trim=input=>{
    if(!isTarget(input))return;
    const MAX=getMax(input);
    input.maxLength=MAX;
    if(String(input.value||'').length>MAX){
      const start=Math.min(input.selectionStart??MAX,MAX);
      input.value=String(input.value||'').slice(0,MAX);
      try{input.setSelectionRange(start,start)}catch{}
      input.dispatchEvent(new CustomEvent('dk-search-capped',{bubbles:true}));
    }
  };

  document.querySelectorAll('input').forEach(trim);

  document.addEventListener('beforeinput',ev=>{
    const input=ev.target;
    if(!isTarget(input))return;
    const MAX=getMax(input);
    const current=String(input.value||'');
    const start=input.selectionStart??current.length;
    const end=input.selectionEnd??start;
    const selected=Math.max(0,end-start);
    const incoming=typeof ev.data==='string'?ev.data:'';
    if(incoming && current.length-selected+incoming.length>MAX){
      ev.preventDefault();
      const room=Math.max(0,MAX-(current.length-selected));
      const next=current.slice(0,start)+incoming.slice(0,room)+current.slice(end);
      input.value=next.slice(0,MAX);
      const pos=Math.min(start+Math.min(room,incoming.length),MAX);
      try{input.setSelectionRange(pos,pos)}catch{}
      input.dispatchEvent(new Event('input',{bubbles:true}));
    }
  },true);

  document.addEventListener('paste',ev=>{
    const input=ev.target;
    if(!isTarget(input))return;
    const MAX=getMax(input);
    ev.preventDefault();
    const text=(ev.clipboardData?.getData('text')||'');
    const current=String(input.value||'');
    const start=input.selectionStart??current.length;
    const end=input.selectionEnd??start;
    const room=Math.max(0,MAX-(current.length-(end-start)));
    const insert=text.slice(0,room);
    input.value=(current.slice(0,start)+insert+current.slice(end)).slice(0,MAX);
    const pos=Math.min(start+insert.length,MAX);
    try{input.setSelectionRange(pos,pos)}catch{}
    input.dispatchEvent(new Event('input',{bubbles:true}));
  },true);

  document.addEventListener('input',ev=>trim(ev.target),true);

  const observer=new MutationObserver(records=>{
    for(const record of records){
      record.addedNodes.forEach(node=>{
        if(node.nodeType!==1)return;
        if(node.matches?.('input'))trim(node);
        node.querySelectorAll?.('input').forEach(trim);
      });
    }
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});

  window.DK_SEARCH_MAX_LENGTH=DEFAULT_MAX;
  window.DK_ORDER_SEARCH_MAX_LENGTH=50;
})();



