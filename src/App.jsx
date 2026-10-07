import {useState,useRef,lazy,Suspense} from 'react'
import BackgroundFX from './components/BackgroundFX'
import BeforeAfter from './components/BeforeAfter'
import {api,MOCK,API_BASE_URL} from './api/client'
import CursorFX from './components/CursorFX'
import Chamber from './components/Chamber'
import OutputPortal from './components/OutputPortal'
import {motion} from 'framer-motion'
import {fx} from './lib/pointer'
import ProcessingScene from './components/ProcessingScene'
import SpaceHUD from './components/SpaceHUD'
const SpaceScene=lazy(()=>import('./components/space/SpaceScene'))
function ray(el){fx.kick=true;const a=el.getBoundingClientRect(),t=document.querySelector('.core')?.getBoundingClientRect()||{left:innerWidth-120,top:60,width:0,height:0},x1=a.left+a.width/2,y1=a.top+a.height/2,x2=t.left+t.width/2,y2=t.top+t.height/2,r=document.createElement('i');r.className='ray';r.style.cssText=`left:${x1}px;top:${y1}px;width:${Math.hypot(x2-x1,y2-y1)}px;rotate:${Math.atan2(y2-y1,x2-x1)}rad`;document.body.appendChild(r);setTimeout(()=>r.remove(),1000)}
const VisionCore=lazy(()=>import('./components/VisionCore'))
const CORE=typeof window!=='undefined'&&innerWidth>=700&&!matchMedia('(prefers-reduced-motion: reduce)').matches
const LITE=typeof window!=='undefined'&&innerWidth<1000
const MODES=[['detect','◎','Detect','Locate anything with language'],['remove','⌫','Remove','Erase selected objects'],['replace','⇄','Replace','Transform what you select'],['generate','✦','Generate','Create from imagination']]
const Slider=({label,min,max,step=1,value,onChange})=>(<label className="fld"><span>{label}<b>{value}</b></span><input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)}/></label>)
export default function App(){
  const [mode,setMode]=useState('detect'),[img,setImg]=useState(null),[boxes,setBoxes]=useState([]),[sel,setSel]=useState(null)
  const [result,setResult]=useState(null),[busy,setBusy]=useState(false),[task,setTask]=useState(null),[pk,setPk]=useState(0),[err,setErr]=useState(''),[drag,setDrag]=useState(false),[ran,setRan]=useState(false)
  const [p,setP]=useState({q:'person, car, dog',th:.35,rep:'modern red sports car',prompt:'',neg:'',size:512,steps:30,cfg:7.5})
  const file=useRef(null),set=(k,v)=>setP(s=>({...s,[k]:v}))
  const chosen=boxes.find(b=>b.id===sel);fx.busy=busy
  const load=f=>{if(!f||!/^image\/(png|jpeg|webp)$/.test(f.type)){setErr('Unsupported file. Import a PNG, JPG or WEBP image.');return}
    const url=URL.createObjectURL(f),i=new Image();i.onload=()=>{setImg({f,url,w:i.width,h:i.height});setBoxes([]);setSel(null);setResult(null);setErr('');setRan(false)};i.src=url}
  const run=async(fn,kind='edit')=>{setBusy(true);setTask(kind);setErr('');try{await fn();fx.kick=true;setPk(k=>k+1)}catch(e){setErr(e.message||'Request failed. Check the backend and try again.')}finally{setBusy(false)}}
const detect=()=>run(async()=>{
  console.log("APP DETECT BUTTON CALLED");
  setResult(null);
  const b=await api.detect(img.f,img.url,p.q,p.th);
  setBoxes(b);
  setSel(null);
  setRan(true);
},'detect')
  const chosenIndex = chosen
  ? boxes.findIndex(b => b.id === chosen.id)
  : 0;

const remove = () =>
  run(async () =>
    setResult(
      await api.remove(
        img.f,
        img.url,
        p.q,
        chosenIndex
      )
    )
  );

const replace = () =>
  run(async () =>
    setResult(
      await api.replace(
        img.f,
        img.url,
        p.q,
        p.rep,
        chosenIndex
      )
    )
  );
  const gen=()=>run(async()=>setResult(await api.generate({prompt:p.prompt,negative:p.neg,size:p.size,steps:p.steps,cfg:p.cfg})))
  const reset=()=>{setImg(null);setBoxes([]);setSel(null);setResult(null);setErr('');setRan(false)}
  const ratio=img?img.w/img.h:1
  const needSel=(mode==='remove'||mode==='replace')
  const dnd=mode==='generate'?{}:{onDragOver:e=>{e.preventDefault();setDrag(true)},onDragLeave:()=>setDrag(false),onDrop:e=>{e.preventDefault();setDrag(false);load(e.dataTransfer.files[0])}}
  const tr=mode==='generate'?'SYNTH FIELD':img?`INPUT 01 · W ${img.w} H ${img.h}`:'AWAITING INPUT'
  const bl=busy?(task==='detect'?'SCANNING':'PROCESSING'):mode==='generate'?(result?'RESULT READY':'STANDBY'):!img?'STANDBY':boxes.length?`OBJ TRACK ${boxes.length}`:'SCAN READY'
  const view=()=>{
    if(mode==='generate')return result?<img key={result.slice(-30)} className="gen reveal" src={result} alt={`Generated: ${p.prompt}`}/>:<div className="empty">Write a prompt, then generate.<small>Output appears here.</small></div>
    if(!img)return(<button className={'drop2'+(drag?' on':'')} onClick={()=>file.current.click()}><svg className="ret" viewBox="0 0 120 120" aria-hidden="true"><circle className="r1" cx="60" cy="60" r="44"/><circle className="r2" cx="60" cy="60" r="30"/><path d="M60 6v20M60 94v20M6 60h20M94 60h20"/><circle className="cd" cx="60" cy="60" r="2.5"/><g className="orbp"><circle cx="60" cy="16" r="2"/></g><g className="orbp2"><circle cx="60" cy="104" r="1.6"/></g></svg><small>VISION CHAMBER</small><strong>DROP IMAGE<br/>TO INITIALIZE</strong><span>PNG · JPG · WEBP</span></button>)
    if(result&&needSel)return <BeforeAfter before={img.url} after={result} ratio={ratio}/>
    return(<div key={img.url} className={'stage enter'+(busy&&task==='detect'?' scanning':'')} style={{width:`min(100%, calc(64vh * ${ratio}))`,aspectRatio:ratio}}>
      <img src={img.url} alt="Uploaded source"/><span className="mat" aria-hidden="true"><i className="cv"/><i className="sw"/><svg className="mr" viewBox="0 0 100 100"><circle cx="50" cy="50" r="30"/><path d="M50 8v16M50 76v16M8 50h16M76 50h16"/></svg></span>{busy&&task==='detect'&&<i className="sbeam"/>}
      {boxes.map((b,i)=>(<button key={b.id} className={'box'+(b.id===sel?' sel':'')} aria-pressed={b.id===sel} aria-label={`${b.label}, ${(b.score*100).toFixed(1)} percent confidence`} onClick={e=>{const n=b.id===sel?null:b.id;setSel(n);if(n)ray(e.currentTarget)}}
        style={{'--d':i*160+'ms',left:b.box[0]*100+'%',top:b.box[1]*100+'%',width:b.box[2]*100+'%',height:b.box[3]*100+'%'}}><s/><em>{b.label} {(b.score*100).toFixed(1)}%</em><u style={{width:b.score*100+'%'}}/>{b.id===sel&&<i className="ln"/>}</button>))}
      <span className="hud">{img.w} × {img.h}px</span></div>)}
  return(<>
    <BackgroundFX active={busy}/><div className="neb" aria-hidden="true"/><Suspense fallback={null}><SpaceScene/></Suspense><SpaceHUD/><CursorFX/>
    <motion.header className="top" initial={{opacity:0,y:-18}} animate={{opacity:1,y:0}} transition={{delay:.3,duration:.8}}><div className="brand"><span className={'mark'+(busy?' hot':'')}/><div><b>VisionEdit</b><small>AI Vision Studio</small></div></div>
      <span className="sys"><i/>Interface online</span><span className="mode-note">{MOCK?'Mock mode · simulated results':`Live API · ${API_BASE_URL || 'same-origin'}`}</span><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a><span className="ver">v0.1</span></motion.header>
    <section className="hero"><motion.div initial={{opacity:0,x:-36}} animate={{opacity:1,x:0}} transition={{delay:1,duration:1,ease:[.2,.8,.2,1]}}><h1>See it. Select it. Transform it.</h1><p>Zero-shot vision meets generative image editing.</p></motion.div>{CORE&&<motion.div className="core" aria-hidden="true" initial={{opacity:0,scale:.6}} animate={{opacity:1,scale:1}} transition={{delay:.7,duration:1.6,ease:[.2,.8,.2,1]}}><Suspense fallback={null}><VisionCore busy={busy} lite={LITE}/></Suspense></motion.div>}</section>
    <motion.nav initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.3,duration:.8}} className="dock" aria-label="Tools"><span className="ind" style={{transform:`translateX(${MODES.findIndex(m=>m[0]===mode)*100}%)`}}/>{MODES.map(([k,ic,t,d])=>(<button key={k} aria-current={mode===k} className={mode===k?'on':''} onClick={()=>{fx.kick=true;setPk(0);setMode(k);setResult(null);setErr('')}}><span aria-hidden>{ic}</span><b>{t}</b><small>{d}</small></button>))}</motion.nav>
    <motion.main className="work" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:1.5,duration:.9}}>
      <Chamber mode={mode} data-mode={mode} title="VISION CHAMBER" tags={[tr,bl]} busy={busy} hot={drag} fast={drag} lockKey={img?.url} pulseKey={pk} aria-label="Image viewport" {...dnd}>{view()}
        {pk>0&&!busy&&<span key={pk} className={'fxl '+mode} aria-hidden="true"><i className="wave"/><i className="dots"/></span>}
        {busy&&<span className={'fxl busy '+mode} aria-hidden="true"><i className="dots"/></span>}
        {busy&&task!=='detect'&&<div className="proc" role="status"><i className="beam"/><ProcessingScene/></div>}
        {result&&(mode==='generate'||needSel)&&<div className="acts"><a className="btn" href={result} download="visionedit-result.png">Download result</a><button className="btn ghost" onClick={()=>setResult(null)}>Discard</button></div>}
      </Chamber>
      <div className="rcol"><OutputPortal result={result} mode={mode} busy={busy} count={boxes.length} ran={ran} pk={pk}/>
      <aside key={mode} className="console" aria-label="Controls">
        {mode!=='generate'&&img&&<button className="btn ghost sm" onClick={reset}>Clear image</button>}
        {mode==='detect'&&<><label className="fld"><span>What do you want to find?</span><input value={p.q} onChange={e=>set('q',e.target.value)} placeholder="person, car, bicycle"/></label>
          <Slider label="Confidence threshold" min={.05} max={.95} step={.05} value={p.th} onChange={v=>set('th',v)}/>
          <button className="btn" disabled={!img||busy||!p.q.trim()} onClick={detect}>Run detection</button>
          <p className="hint">{!img?'Import an image first.':ran&&!boxes.length?'No objects above the threshold. Lower it or change the prompt.':'Separate several objects with commas. Click a box to select it.'}</p></>}
        {mode==='remove'&&<><p className="hint">1. Run detection in Detect mode, 2. select a box, 3. remove it.</p>
          <label className="fld"><span>Find objects</span><input value={p.q} onChange={e=>set('q',e.target.value)}/></label>
          <button className="btn ghost" disabled={!img||busy} onClick={detect}>Detect objects</button>
          <p className="sel-info">{chosen?`Selected: ${chosen.label}`:'Nothing selected'}</p>
          <button className="btn" disabled={!chosen||busy} onClick={remove}>Remove selected</button>
          <p className="hint">Generative inpainting reconstructs the selected region.</p></>}
        {mode==='replace'&&<><label className="fld"><span>Find objects</span><input value={p.q} onChange={e=>set('q',e.target.value)}/></label>
          <button className="btn ghost" disabled={!img||busy} onClick={detect}>Detect objects</button>
          <p className="sel-info">{chosen?`Selected: ${chosen.label}`:'Nothing selected'}</p>
          <label className="fld"><span>Replacement prompt</span><input value={p.rep} onChange={e=>set('rep',e.target.value)}/></label>
          <button className="btn" disabled={!chosen||busy||!p.rep.trim()} onClick={replace}>Transform selection</button></>}
        {mode==='generate'&&<><label className="fld"><span>Prompt</span><textarea rows={3} value={p.prompt} onChange={e=>set('prompt',e.target.value)} placeholder="A lighthouse at dusk, film still"/></label>
          <label className="fld"><span>Negative prompt</span><textarea rows={2} value={p.neg} onChange={e=>set('neg',e.target.value)}/></label>
          <div className="seg" role="radiogroup" aria-label="Image size">{[512,768,1024].map(s=><button key={s} role="radio" aria-checked={p.size===s} className={p.size===s?'on':''} onClick={()=>set('size',s)}>{s}²</button>)}</div>
          <Slider label="Steps" min={10} max={60} value={p.steps} onChange={v=>set('steps',v)}/>
          <Slider label="Guidance scale" min={1} max={15} step={.5} value={p.cfg} onChange={v=>set('cfg',v)}/>
          <button className="btn" disabled={!p.prompt.trim()||busy} onClick={gen}>Generate image</button></>}
        {err&&<p className="err" role="alert">{err}</p>}
      </aside></div>
    </motion.main>
    <input ref={file} type="file" hidden accept="image/png,image/jpeg,image/webp" onChange={e=>load(e.target.files[0])}/>
  </>)
}
