import {useEffect,useRef} from 'react'
import {pointer} from '../lib/pointer'
export default function CursorFX(){
  const ring=useRef(),dot=useRef()
  useEffect(()=>{
    const fine=matchMedia('(pointer:fine)').matches,rm=matchMedia('(prefers-reduced-motion: reduce)').matches,root=document.documentElement
    let tx=-50,ty=-50,rx=-50,ry=-50,hot=false,mag=null,raf
    const mv=e=>{tx=e.clientX;ty=e.clientY;if(rm)return;pointer.tx=tx/innerWidth-.5;pointer.ty=ty/innerHeight-.5
      const t=e.target.closest?e.target:document.body;hot=!!t.closest('button,a,input,textarea,[role=slider]')
      const b=t.closest('.btn');if(mag&&mag!==b)mag.style.transform='';mag=b
      if(b&&!b.disabled&&fine){const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.1}px,${(e.clientY-r.top-r.height/2)*.18-1}px)`}}
    const loop=()=>{pointer.x+=(pointer.tx-pointer.x)*.06;pointer.y+=(pointer.ty-pointer.y)*.06
      root.style.setProperty('--mx',pointer.x.toFixed(3));root.style.setProperty('--my',pointer.y.toFixed(3));root.style.setProperty('--sy',scrollY)
      if(fine&&ring.current){rx+=(tx-rx)*.22;ry+=(ty-ry)*.22
        ring.current.style.transform=`translate(${rx}px,${ry}px) scale(${hot?1.7:1})`;dot.current.style.transform=`translate(${tx}px,${ty}px)`}
      raf=requestAnimationFrame(loop)}
    const dn=e=>{const b=e.target.closest&&e.target.closest('.btn');if(!b||b.disabled||rm)return;const r=b.getBoundingClientRect(),s=document.createElement('span');s.className='rip';s.style.left=e.clientX-r.left+'px';s.style.top=e.clientY-r.top+'px';b.appendChild(s);setTimeout(()=>s.remove(),650)}
    addEventListener('pointerdown',dn);addEventListener('pointermove',mv);loop();if(rm)cancelAnimationFrame(raf)
    return()=>{cancelAnimationFrame(raf);removeEventListener('pointermove',mv);removeEventListener('pointerdown',dn)}
  },[])
  return <><div ref={ring} className="cur ring" aria-hidden="true"/><div ref={dot} className="cur dot" aria-hidden="true"/></>
}
