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