import {useEffect,useRef} from 'react'
export default function BackgroundFX({active}){
  const ref=useRef(null),act=useRef(active);act.current=active
  useEffect(()=>{
    const c=ref.current,g=c.getContext('2d'),rm=matchMedia('(prefers-reduced-motion: reduce)').matches
    const N=rm?0:innerWidth<700?25:70;let W,H,raf,mx=0,my=0,t=0
    const ps=Array.from({length:N},()=>({x:Math.random(),y:Math.random(),z:Math.random()*.8+.2,s:Math.random()*.0003+.0001}))
    const size=()=>{const d=Math.min(devicePixelRatio,1.5);W=c.width=innerWidth*d;H=c.height=innerHeight*d}
    const move=e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5}
    const draw=()=>{t+=act.current?3:1;g.clearRect(0,0,W,H)
      const r=g.createRadialGradient(W*(.7+mx*.05+Math.sin(t*.004)*.1),H*.1,0,W*.7,H*.1,W*.7);r.addColorStop(0,'rgba(217,119,6,.10)');r.addColorStop(1,'transparent');g.fillStyle=r;g.fillRect(0,0,W,H)
      g.strokeStyle='rgba(240,230,210,.035)';const gs=64,ox=mx*-14+t*.08,oy=my*-14-scrollY*.15+t*.04
      for(let x=ox%gs;x<W;x+=gs){g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke()}
      for(let y=oy%gs;y<H;y+=gs){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke()}
      if(!rm){const sy=(t*(act.current?4:1.2))%(H*1.4)-H*.2;const sg=g.createLinearGradient(0,sy-60,0,sy);sg.addColorStop(0,'transparent');sg.addColorStop(1,'rgba(245,158,11,.07)');g.fillStyle=sg;g.fillRect(0,sy-60,W,60)}
      g.fillStyle='rgba(245,158,11,.5)'
      for(const p of ps){p.y-=p.s*(act.current?4:1);if(p.y<0)p.y=1;g.fillRect(p.x*W+mx*40*p.z,p.y*H+my*40*p.z,1.5*p.z,1.5*p.z)}
      if(!rm)raf=requestAnimationFrame(draw)}
    size();draw();addEventListener('resize',size);addEventListener('pointermove',move)
    return()=>{cancelAnimationFrame(raf);removeEventListener('resize',size);removeEventListener('pointermove',move)}
  },[])
  return <canvas ref={ref} className="bg" aria-hidden="true"/>
}
