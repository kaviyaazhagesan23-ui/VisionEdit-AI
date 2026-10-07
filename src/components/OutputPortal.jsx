import {useState} from 'react'
import {motion,AnimatePresence} from 'framer-motion'
import {Eye,Download} from 'lucide-react'
import Chamber from './Chamber'
import ImageViewerModal from './ImageViewerModal'
import {downloadImage} from '../lib/download'
function OutputControls({onView,onDownload}){
  return<motion.div className="octl" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{delay:.55,duration:.4}}>
    <button className="tb" type="button" title="Open result viewer" onClick={onView}><Eye/>VIEW</button><button className="tb" type="button" title="Download result image" onClick={onDownload}><Download/>DOWNLOAD</button></motion.div>}
export default function OutputPortal({result,mode,busy,pk}){
  const [dim,setDim]=useState(null),[open,setOpen]=useState(false)
  const st=busy?'PROCESSING':result?'RESULT READY':'AWAITING OUTPUT'
  const fmt=result?(result.match(/^data:image\/(\w+)/)?.[1]||result.split('.').pop().split('?')[0]).toUpperCase().slice(0,4):'—'
  const rk=result?result.slice(-24):'x'
  return<><Chamber variant="portal" cls="pt" title="OUTPUT PORTAL" tags={[st]} dot={result?'ok':busy?'bz':''} busy={busy} hot={!!result} pulseKey={result?pk:0}>
    <div className="pv">
      {result?<button className="pvb" onClick={()=>setOpen(true)} aria-label="View result in full viewer"><motion.img
  key={rk}
  layoutId="result-img"
  src={result}

  alt="Output preview" onLoad={e=>setDim(`${e.target.naturalWidth}×${e.target.naturalHeight}`)}
          initial={{opacity:0,scale:.85,filter:'blur(14px)',clipPath:'circle(0% at 50% 50%)'}} animate={{opacity:1,scale:1,filter:'blur(0px)',clipPath:'circle(80% at 50% 50%)'}} transition={{duration:.9,ease:[.2,.8,.2,1]}}/><span className="vh">VIEW ↗</span></button>
        :<svg className="pe" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="44"/><circle cx="60" cy="60" r="28"/><circle cx="60" cy="60" r="3"/></svg>}
      {result&&<motion.i key={'s'+rk} className="pscan" aria-hidden="true" initial={{top:'0%',opacity:1}} animate={{top:'100%',opacity:0}} transition={{duration:1,delay:.1}}/>}
    </div>
    <AnimatePresence>{result&&<OutputControls key="c" onView={()=>setOpen(true)} onDownload={()=>downloadImage(result)}/>}</AnimatePresence>
    <dl className="pr"><dt>Mode</dt><dd>{mode}</dd><dt>Size</dt><dd>{result&&dim?dim:'—'}</dd><dt>Format</dt><dd>{fmt}</dd></dl></Chamber>
    <ImageViewerModal src={result} open={open} onClose={()=>setOpen(false)}/></>}
