// Kept on the same origin; load the adventure only when discovered.
(()=>{
 const modal=document.querySelector('#game-modal'),frame=document.querySelector('#game-frame');
 const trigger=document.querySelector('[data-secret="lamp"]'),close=document.querySelector('#game-close');
 let scrollY=0,resumeMusic=false;
 trigger.setAttribute('aria-haspopup','dialog');trigger.setAttribute('aria-controls','game-modal');
 const notify=()=>frame.contentWindow?.postMessage({type:'azul:visibility',active:modal.open&&!document.hidden},location.origin);
 frame.addEventListener('load',notify);
 trigger.onclick=()=>{
  if(modal.open)return;
  scrollY=window.scrollY;resumeMusic=musicStarted&&!muted&&!piano.paused;
  piano.pause();document.body.style.top=`-${scrollY}px`;
  document.body.classList.add('game-modal-open');trigger.setAttribute('aria-expanded','true');
  modal.showModal();
  if(!frame.hasAttribute('src'))frame.src=frame.dataset.src;
  else notify();
  close.focus({preventScroll:true});
 };
 close.onclick=()=>modal.close();
 modal.addEventListener('close',()=>{
  notify();document.body.classList.remove('game-modal-open');document.body.style.top='';
  window.scrollTo({top:scrollY,behavior:'instant'});
  trigger.setAttribute('aria-expanded','false');trigger.focus({preventScroll:true});
  if(resumeMusic&&!muted){if(ctx)ctx.resume().catch(()=>{});piano.play().then(updateSound).catch(updateSound)}
  resumeMusic=false;
 });
 window.addEventListener('message',e=>{
  if(e.origin===location.origin&&e.source===frame.contentWindow&&e.data?.type==='azul:close'&&modal.open)modal.close();
 });
 document.addEventListener('visibilitychange',notify);
})();
