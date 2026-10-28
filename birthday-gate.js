(()=> {
 const opensAt=Date.parse('2026-11-07T00:00:00-06:00');
 const preview=new URLSearchParams(location.hash.slice(1)).get('preview')==='jorge-7n-a84c29';
 const gate=document.getElementById('birthday-gate');
 let started=false,timer;
 function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.body.append(s)})}
 async function start(){
  if(started)return;started=true;clearInterval(timer);
  try{
   await load('app.js?v=lantern-texts-20261025');
   await load('game-modal.js?v=1');
   gate.hidden=true;document.body.classList.remove('birthday-locked');
  }catch(e){document.getElementById('gate-message').textContent='No se pudo cargar la sorpresa. Recarga la página para intentarlo de nuevo.';}
 }
 function tick(){
  const remaining=opensAt-Date.now();
  if(preview||remaining<=0){start();return}
  let seconds=Math.ceil(remaining/1000);
  const values=[Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60];
  ['days','hours','minutes','seconds'].forEach((name,i)=>document.getElementById('gate-'+name).textContent=String(values[i]).padStart(2,'0'));
 }
 timer=setInterval(tick,1000);tick();
 document.addEventListener('visibilitychange',tick);window.addEventListener('pageshow',tick);
})();