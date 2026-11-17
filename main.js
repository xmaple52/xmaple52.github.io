(() => {
 document.getElementById('year').textContent=new Date().getFullYear();
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.06});
 document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));
 const canvas=document.getElementById('particles'),ctx=canvas.getContext('2d'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let w,h,dots=[],frame;
 function resize(){w=innerWidth;h=innerHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(d,0,0,d,0,0);dots=Array.from({length:w<640?22:45},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.3+.4,v:Math.random()*.15+.04}));draw()}
 function draw(){ctx.clearRect(0,0,w,h);dots.forEach(p=>{ctx.fillStyle='rgba(153,233,122,.22)';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()})}
 function tick(){dots.forEach(p=>{p.y-=p.v;if(p.y<0)p.y=h});draw();frame=requestAnimationFrame(tick)}
 function sync(){cancelAnimationFrame(frame);if(!document.hidden&&!reduce.matches)tick();else draw()}
 addEventListener('resize',resize);document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',sync);resize();sync();
})();
