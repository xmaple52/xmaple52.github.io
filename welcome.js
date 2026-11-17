(() => {
 const overlay=document.getElementById('welcome'),root=document.documentElement;
 document.addEventListener('DOMContentLoaded',()=>document.getElementById('welcome-replay')?.addEventListener('click',()=>{try{sessionStorage.removeItem('xmaple-welcome-v3')}catch{}location.reload()}),{once:true});
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let seen=false;try{seen=sessionStorage.getItem('xmaple-welcome-v3')==='1'}catch{}
 if(seen||reduced.matches)return;
 overlay.hidden=false;root.classList.add('welcome-active');
 let closing=false,timer,fallback,flight,greetingTimer,greetingAnimation;
 const greeting=document.getElementById('welcome-greeting');
 const words=['Привет','Hello','Салам','Hola','Bonjour','こんにちは','Здравствуй'];
 let wordIndex=0;
 function nextGreeting(){if(closing||!greeting)return;greetingAnimation=greeting.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-7px)'}],{duration:110,fill:'forwards'});greetingAnimation.finished.then(()=>{if(closing)return;greeting.textContent=words[++wordIndex];greetingAnimation=greeting.animate([{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:160,fill:'forwards'});if(wordIndex<words.length-1)greetingTimer=setTimeout(nextGreeting,380)},()=>{});}
 greetingTimer=setTimeout(nextGreeting,500);
 const remember=()=>{try{sessionStorage.setItem('xmaple-welcome-v3','1')}catch{}};
 function finish(){clearTimeout(timer);clearTimeout(fallback);clearTimeout(greetingTimer);greetingAnimation?.cancel();flight?.remove();overlay.hidden=true;root.classList.remove('welcome-active','welcome-opening');document.querySelector('.workspace')?.removeAttribute('inert');document.removeEventListener('keydown',onKey);reduced.removeEventListener('change',onMotion);remember();document.dispatchEvent(new Event('xmaple:entered'));}
 function close(skip=false){
  if(closing)return;closing=true;clearTimeout(timer);clearTimeout(greetingTimer);greetingAnimation?.cancel();
  const source=document.getElementById('welcome-avatar'),target=document.querySelector('.avatar-wrap img');
  if(skip||reduced.matches||!target||!source.complete){finish();return;}
  const from=source.getBoundingClientRect(),to=target.getBoundingClientRect();
  flight=source.cloneNode();flight.removeAttribute('id');flight.className='welcome-flight';flight.style.animation='none';Object.assign(flight.style,{left:from.left+'px',top:from.top+'px',width:from.width+'px',height:from.height+'px'});document.body.append(flight);source.style.visibility='hidden';
  root.classList.add('welcome-opening');
  flight.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${to.left-from.left}px,${to.top-from.top}px) scale(${to.width/from.width})`}],{duration:850,easing:'cubic-bezier(.76,0,.24,1)',fill:'forwards'}).finished.then(finish,finish);
  flight.style.transformOrigin='top left';fallback=setTimeout(finish,1200);
 }
 function onKey(event){if(event.key==='Enter'||event.key==='Escape'){event.preventDefault();close(true)}}
 function onMotion(){if(reduced.matches)close(true)}
 document.addEventListener('keydown',onKey);reduced.addEventListener('change',onMotion);
 document.getElementById('welcome-skip').addEventListener('click',()=>close(true));
 document.addEventListener('DOMContentLoaded',()=>{document.querySelector('.workspace').setAttribute('inert','');timer=setTimeout(()=>close(),3650)},{once:true});
 setTimeout(()=>{if(!overlay.hidden)finish()},6000);
})();
