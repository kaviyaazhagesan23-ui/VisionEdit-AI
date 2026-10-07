import {useRef,useState,useLayoutEffect} from 'react'
const poly=(w,h,c,i)=>{const[a,b,d,e]=c,x1=w-i,y1=h-i;return[[i+a,i],[x1-b,i],[x1,i+b],[x1,y1-d],[x1-d,y1],[i+e,y1],[i,y1-e],[i,i+a]]}
const D=p=>'M'+p.map(q=>q.join(' ')).join('L')+'Z'
const tw=(p,q,L)=>{const dx=q[0]-p[0],dy=q[1]-p[1],m=Math.hypot(dx,dy)||1;return[p[0]+dx/m*L,p[1]+dy/m*L]}
const brk=(p,i,L)=>`M${tw(p[i],p[(i+7)%8],L)}L${p[i]}L${p[(i+1)%8]}L${tw(p[(i+1)%8],p[(i+2)%8],L)}`
export function Frame({cut,busy,hot,lockKey,pulseKey}){
  const r=useRef(),[[w,h],setS]=useState([0,0])
  useLayoutEffect(()=>{const ro=new ResizeObserver(([e])=>setS([e.contentRect.width,e.contentRect.height]));ro.observe(r.current);return()=>ro.disconnect()},[])
  const o=poly(w,h,cut,.5),n=poly(w,h,cut.map(c=>c*.7),12),b1=poly(w,h,cut,6),b2=poly(w,h,cut,10)
  return<svg ref={r} className={'fr'+(busy?' busy':'')+(hot?' hot':'')} aria-hidden="true">{w>0&&<>
    <path d={D(o)} className="o"/><g key={lockKey} className="lock"><path d={D(n)} className="n"/></g>
    <path d={D(o)} className="seg" pathLength="100"/>
    {[7,1,3,5].map(i=><g key={i}><path d={brk(b2,i,28)} className="br2"/><path d={brk(b1,i,20)} className="br1"/><circle className="dt" r="2.5" cx={(b1[i][0]+b1[(i+1)%8][0])/2} cy={(b1[i][1]+b1[(i+1)%8][1])/2}/></g>)}
    {pulseKey>0&&<path key={pulseKey} d={D(o)} className="ok"/>}</>}</svg>}
export function Orbits({fast,k}){
  const rm=matchMedia('(prefers-reduced-motion: reduce)').matches
  const A='M10 300a490 250 0 1 0 980 0a490 250 0 1 0 -980 0',B='M45 300a455 215 0 1 0 910 0a455 215 0 1 0 -910 0'
  return<svg className={'orbits'+(fast?' fast':'')} viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
    <g transform="rotate(-8 500 300)"><path id={'oa'+k} d={A} className="a" pathLength="100" vectorEffect="non-scaling-stroke"/>{!rm&&<circle r="3" className="pa"><animateMotion dur={fast?'16s':'70s'} repeatCount="indefinite"><mpath href={'#oa'+k}/></animateMotion></circle>}</g>
    <g transform="rotate(6 500 300)"><path id={'ob'+k} d={B} className="a b" pathLength="100" vectorEffect="non-scaling-stroke"/>{!rm&&<circle r="2.4" className="pb"><animateMotion dur="150s" repeatCount="indefinite"><mpath href={'#ob'+k}/></animateMotion></circle>}</g></svg>}
export default function Chamber({variant='main',cls='vp',title,tags,dot,busy,hot,fast,lockKey,pulseKey,mode,children,...rest}){
  const co=useRef(),cut=variant==='main'?[30,10,42,18]:[12,34,14,28]
  const mv=e=>{const r=e.currentTarget.getBoundingClientRect();if(co.current)co.current.textContent=`X ${String(Math.round(e.clientX-r.left)).padStart(3,'0')}  Y ${String(Math.round(e.clientY-r.top)).padStart(3,'0')}`}
  return<div className={'chwrap '+variant}><Orbits fast={fast||busy} k={variant}/>
    <section key={mode} className={cls+' ch '+variant+(hot?' hot':'')} onPointerMove={mv} {...rest}><header className="chh"><b>{title}</b><span className="meta">{dot!==undefined&&<i className={'mk '+dot}/>}{tags[0]}</span></header><div className="chbody">{children}</div>{variant==='main'&&<footer className="chf"><span>{tags[1]}</span><span ref={co}>X 000  Y 000</span></footer>}
      <Frame cut={cut} busy={busy} hot={hot} lockKey={lockKey} pulseKey={pulseKey}/></section></div>}
