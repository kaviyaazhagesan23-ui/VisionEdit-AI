import {useRef,useState} from 'react'
export default function BeforeAfter({before,after,ratio}){
  const [dr,setDr]=useState(false),[pos,setPos]=useState(50),box=useRef(null)
  const upd=e=>{const r=box.current.getBoundingClientRect();setPos(Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)))}
  const key=e=>{if(e.key==='ArrowLeft')setPos(p=>Math.max(0,p-5));if(e.key==='ArrowRight')setPos(p=>Math.min(100,p+5));if(e.key==='Home')setPos(0);if(e.key==='End')setPos(100)}
  return(<div ref={box} className={'ba reveal'+(dr?' dr':'')} style={{width:`min(100%, calc(64vh * ${ratio}))`,aspectRatio:ratio}}
    onPointerUp={()=>setDr(false)} onPointerCancel={()=>setDr(false)} onPointerDown={e=>{setDr(true);e.currentTarget.setPointerCapture(e.pointerId);upd(e)}} onPointerMove={e=>{if(e.buttons)upd(e)}}>
    <img src={after} alt="Edited result" draggable="false"/>
    <img src={before} alt="Original source" draggable="false" style={{clipPath:`inset(0 ${100-pos}% 0 0)`}}/>
    <span className="tag l">SOURCE</span><span className="tag r">RESULT</span>
    <div className="handle" style={{left:`${pos}%`}} role="slider" tabIndex={0} aria-label="Before and after comparison" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)} onKeyDown={key}><i/></div>
  </div>)
}
