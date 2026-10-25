const $=s=>document.querySelector(s);const wait=ms=>new Promise(r=>setTimeout(r,ms));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
for(let i=0;i<55;i++){const s=document.createElement('i');s.className='star';s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:-${Math.random()*8}s`;$('#stars').append(s)}

// Warm, quiet stars fill the empty sky and fade into the illustration.
const skyStars=$('.journey-sky');
for(let i=0;i<65;i++){
 const star=document.createElement('i');star.className='warm-star';
 const size=i%9===0?2.5:1.5;
 star.style.cssText=`left:${3+Math.random()*94}%;top:${Math.random()*100}%;width:${size}px;height:${size}px;animation-delay:-${Math.random()*12}s;animation-duration:${6+Math.random()*6}s`;
 skyStars.append(star);
}
function positionSkyStars(){
 const scene=$('.scene-art');
 if(!scene.offsetWidth)return;
 skyStars.style.height=Math.max(0,scene.offsetTop+Math.min(180,scene.offsetHeight*.12))+'px';
}

async function line(el,text,pause=2200){el.classList.add('faded');await wait(reduce?80:700);el.textContent=text;el.classList.remove('faded');await wait(pause)}
function show(id){document.querySelectorAll('.screen').forEach(e=>e.hidden=true);$(id).hidden=false;window.scrollTo({top:0,left:0,behavior:"instant"})}
(async()=>{await wait(1000);await line($('#greeting'),'Hola.',2000);await line($('#greeting'),'Espero que te guste lo que preparé para ti…',3000);await line($('#greeting'),'Con mucho cariño, Jorge… ♡',300);$('#continue').hidden=false})();
$('#continue').onclick=()=>{show('#question');$('#question h1').tabIndex=-1;$('#question h1').focus()};
document.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{$('#answer').textContent=b.dataset.answer==='yes'?'Entonces probablemente también recuerdes las pequeñas letras que venían con ellas.':'No pasa nada. Tal vez sea momento de recordarlas. Si aún no tienes las dedicatorias, mándame un mensajito… Pero acuérdate, que no son muchas. 😌';show('#code');$('#letters').focus()});
let unlocked=false,ctx,musicGain,muted=false,musicStarted=false,primed=false;
const piano=$('#piano');
function updateSound(){
 const playing=musicStarted&&!muted&&!piano.paused;
 $('#sound').setAttribute('aria-pressed',String(playing));
 $('#sound').setAttribute('aria-label',playing?'Silenciar música':'Activar música');
 $('#sound').innerHTML=playing?'♫ <span>Sonido</span>':'♫ <span>Activar sonido</span>';
}
function initSound(){
 if(primed)return;
 primed=true;
 try{
  ctx=new(window.AudioContext||window.webkitAudioContext)();
  musicGain=ctx.createGain();musicGain.gain.value=0;
  ctx.createMediaElementSource(piano).connect(musicGain);musicGain.connect(ctx.destination);
  ctx.resume().catch(()=>{});
 }catch(e){piano.volume=0;}
 // Begin silently inside the code-entry gesture to allow the later reveal on mobile.
 piano.play().catch(()=>{if(musicStarted)updateSound()});
}
function fadeMusic(){
 if(musicGain){const t=ctx.currentTime;musicGain.gain.cancelScheduledValues(t);musicGain.gain.setValueAtTime(0,t);musicGain.gain.linearRampToValueAtTime(1,t+2.5)}
 else piano.volume=1;
}
function music(){
 musicStarted=true;$('#sound').hidden=false;
 piano.currentTime=0;piano.muted=muted;fadeMusic();
 if(ctx)ctx.resume().catch(()=>{});
 piano.play().then(updateSound).catch(updateSound);
 updateSound();
}
$('#sound').onclick=async()=>{
 if(!musicStarted)return;
 if(!piano.paused&&!muted){muted=true;piano.muted=true;updateSound();return}
 muted=false;piano.muted=false;
 try{if(ctx)await ctx.resume();await piano.play();fadeMusic()}catch(e){}
 updateSound();
};
piano.addEventListener('playing',()=>{if(musicStarted)updateSound()});
piano.addEventListener('pause',()=>{if(musicStarted)updateSound()});
piano.addEventListener('error',()=>{if(musicStarted){updateSound();$('#sound span').textContent='Reintentar audio'}});
$('#letters').addEventListener('input',async e=>{const val=e.target.value.toUpperCase().replace(/[^A-Z]/g,'');e.target.value=val;$('#code-error').textContent='';if(val.length!==3||unlocked)return;if(val!=='TQM'){$('#code-error').textContent='Casi… recuerda el orden de las dedicatorias.';e.target.setAttribute('aria-invalid','true');return}e.target.removeAttribute('aria-invalid');unlocked=true;e.target.blur();initSound();show('#reveal');await wait(2000);await line($('#reveal-text'),'Qué bueno que las recordabas.',2600);$('#reveal-text').classList.add('faded');await wait(1100);$('#reveal').hidden=true;$('#journey').hidden=false;positionSkyStars();music();window.scrollTo({top:0,left:0,behavior:"instant"})});
const messages=["Que este nuevo año, venga con una nueva etapa lleno de muchos recuerdos bonitos.", "Hay personas que hacen los días un poquito más bonitos. Es claro que tú eres una de ellas.", "Le pido a Dios que este nuevo año te encuentre rodeada de cosas que te hagan feliz.", "Me hace muy feliz tenerte en mi vida. Espero este año poder formar mas recuerdos junto a ti.", "Ojála Dios me conceda verte cumplir todos tus sueños y metas.", "Quería darte algo que te hiciera sonreír y recordarte lo mucho que aprecio tu amistad. Espero que te guste tanto como a mí me gustó prepararlo para ti.", "Gracias por tu amistad y por todos los ratitos bonitos que hemos compartido. 🤍"];
const secrets={star:'Hallaste algo que seguramente nadie mas encontrara.',lamp:'Esta no era parte del camino… A veces, lo más bonito aparece cuando te tomas el tiempo de mirar.',flower:'Algunas cosas pequeñas pueden guardar grandes cosas.',pascal:'¿Cómo encontraste a Pascal?'};
const totalLanterns=document.querySelectorAll('[data-message]').length;
const opened=new Set();let activeButton,inlineMessage;
function positionMessage(){
 if(!activeButton||!inlineMessage)return;
 const scene=$('.landscape'),width=scene.clientWidth;
 if(!width)return;
 const margin=24,messageWidth=Math.min(350,width-margin*2);
 const center=activeButton.offsetLeft+(activeButton.classList.contains('lantern')?0:activeButton.offsetWidth/2);
 inlineMessage.style.width=messageWidth+'px';
 const left=Math.max(margin,Math.min(center-messageWidth/2,width-messageWidth-margin));
 inlineMessage.style.left=left+'px';
 const gap=20,height=inlineMessage.offsetHeight;
 const below=activeButton.offsetTop+activeButton.offsetHeight+gap;
 const above=activeButton.offsetTop-height-gap;
 const gate=$('.ending-gate');
 const obstacles=[...scene.querySelectorAll('button')].filter(el=>el!==activeButton&&!el.hidden&&el.offsetParent!==null);
 function free(top){
  if(top<0||top+height>gate.offsetTop-gap)return false;
  return !obstacles.some(el=>{
   const x=el.offsetLeft-(el.classList.contains('lantern')?el.offsetWidth/2:0);
   return left<x+el.offsetWidth+gap&&left+messageWidth>x-gap&&top<el.offsetTop+el.offsetHeight+gap&&top+height>el.offsetTop-gap;
  });
 }
 let top=free(below)?below:free(above)?above:Math.max(24,Math.min(below,gate.offsetTop-height-gap));
 // On wider screens, use the space beside a lantern if both vertical positions collide.
 if(!free(top)&&width>=700){
  const right=activeButton.offsetLeft+activeButton.offsetWidth/2+gap;
  const sideLeft=activeButton.offsetLeft-activeButton.offsetWidth/2-gap-messageWidth;
  if(right+messageWidth<=width-margin){inlineMessage.style.left=right+'px';top=activeButton.offsetTop}
  else if(sideLeft>=margin){inlineMessage.style.left=sideLeft+'px';top=activeButton.offsetTop}
 }
 inlineMessage.style.top=top+'px';
}
function openMessage(text,button){
 if(activeButton){activeButton.setAttribute('aria-expanded','false');activeButton.removeAttribute('aria-describedby')}
 inlineMessage?.remove();
 activeButton=button;
 inlineMessage=document.createElement('p');
 inlineMessage.id='lantern-message';inlineMessage.className='inline-message';
 inlineMessage.setAttribute('role','status');inlineMessage.setAttribute('aria-live','polite');
 $('.landscape').append(inlineMessage);inlineMessage.textContent=text;
 button.setAttribute('aria-expanded','true');button.setAttribute('aria-describedby','lantern-message');
 positionMessage();
}
window.addEventListener('resize',()=>{positionMessage();positionSkyStars()});
if('ResizeObserver' in window){const observer=new ResizeObserver(()=>{positionMessage();positionSkyStars()});observer.observe($('.landscape'))}
document.fonts?.ready.then(()=>{positionMessage();positionSkyStars()});
$('.scene-art img').addEventListener('load',positionSkyStars);
document.querySelectorAll('[data-message]').forEach(b=>{b.setAttribute('aria-expanded','false');b.onclick=()=>{const i=+b.dataset.message;opened.add(i);b.classList.add('opened');openMessage(messages[i],b);$('#progress').textContent=opened.size===totalLanterns?'Todavía queda algo para ti.':`${opened.size} de ${totalLanterns} linternas descubiertas`;if(opened.size===totalLanterns)$('#gift').hidden=false;positionMessage()}});
const spotifyModal=$('#spotify-modal');
const spotifyCodes={star:{src:'assets/spotify-star.jpeg',height:201,alt:'Código de Spotify blanco sobre fondo coral'},flower:{src:'assets/spotify-flower.jpeg',height:198,alt:'Código de Spotify negro sobre fondo amarillo'}};
let spotifyTrigger=null,spotifyScrollY=0;
function openSpotify(button){
 const code=spotifyCodes[button.dataset.secret];
 spotifyTrigger=button;spotifyScrollY=window.scrollY;
 $('#spotify-note').textContent=secrets[button.dataset.secret];
 const img=$('#spotify-code');img.src=code.src;img.alt=code.alt;img.height=code.height;
 document.body.style.top=`-${spotifyScrollY}px`;
 document.body.classList.add('spotify-modal-open');
 button.setAttribute('aria-expanded','true');spotifyModal.showModal();
}
$('.spotify-close').onclick=()=>spotifyModal.close();
spotifyModal.addEventListener('click',e=>{
 const box=spotifyModal.getBoundingClientRect();
 if(e.target===spotifyModal&&(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom))spotifyModal.close();
});
spotifyModal.addEventListener('close',()=>{
 document.body.classList.remove('spotify-modal-open');document.body.style.top='';
 window.scrollTo({top:spotifyScrollY,behavior:'instant'});
 spotifyTrigger?.setAttribute('aria-expanded','false');spotifyTrigger?.focus({preventScroll:true});
});
document.querySelectorAll('[data-secret]').forEach(b=>{
 b.setAttribute('aria-expanded','false');
 if(spotifyCodes[b.dataset.secret]){b.setAttribute('aria-haspopup','dialog');b.setAttribute('aria-controls','spotify-modal')}
 b.onclick=()=>{
  if(spotifyCodes[b.dataset.secret]){openSpotify(b);return}
  openMessage(secrets[b.dataset.secret],b);if(b.dataset.secret==='pascal')b.style.visibility='hidden';
 };
});
const textObserver=new IntersectionObserver(entries=>{entries.forEach(({target,isIntersecting})=>{if(isIntersecting){target.classList.add('text-visible');textObserver.unobserve(target)}})},{threshold:0.2});
document.querySelectorAll('h1,h2,.small-poetry,.explain,.closing,.journey-heading p,.photos figcaption').forEach(el=>{el.classList.add('blur-reveal');textObserver.observe(el)});
$('#gift').onclick=()=>{$('#finale').hidden=false;$('#gift').hidden=true;$('#finale').scrollIntoView({behavior:reduce?'instant':'smooth'});if(reduce)return;for(let i=0;i<65;i++){const c=document.createElement('i');c.className='confetti';c.style.left=Math.random()*100+'vw';c.style.animationDelay=Math.random()*2+'s';document.body.append(c);setTimeout(()=>c.remove(),8000)}for(let i=0;i<7;i++){const b=document.createElement('span');b.className='balloon';b.textContent='🎈';b.style.left=(i*16)+'vw';b.style.animationDelay=Math.random()*1.5+'s';document.body.append(b);setTimeout(()=>b.remove(),10000)}};
