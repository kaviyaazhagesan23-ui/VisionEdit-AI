import {useEffect,useRef,useState} from 'react'
import {createPortal} from 'react-dom'
import {motion,AnimatePresence} from 'framer-motion'
import {ZoomIn,ZoomOut,RotateCcw,Maximize2,Minimize2,Download,X} from 'lucide-react'
import {downloadImage} from '../lib/download'
export default function ImageViewerModal({src,open,onClose}){
  const [z,setZ]=useState(1),[fs,setFs]=useState(false),ref=useRef()
  const zoom=d=>setZ(v=>Math.min(6,Math.max(1,+(v+d).toFixed(2))))
  useEffect(()=>{if(!open)return;setZ(1);setTimeout(()=>ref.current?.focus(),50)
    const key=e=>{if(e.key==='Escape'&&!document.fullscreenElement)onClose();if(e.key==='+'||e.key==='=')zoom(.5);if(e.key==='-')zoom(-.5);if(e.key==='0')setZ(1)}
    const fsc=()=>setFs(!!document.fullscreenElement),ov=document.body.style.overflow
    addEventListener('keydown',key);document.addEventListener('fullscreenchange',fsc);document.body.style.overflow='hidden'
    return()=>{removeEventListener('keydown',key);document.removeEventListener('fullscreenchange',fsc);document.body.style.overflow=ov;if(document.fullscreenElement)document.exitFullscreen()}},[open])
  const toggleFs=()=>document.fullscreenElement?document.exitFullscreen():ref.current?.requestFullscreen?.()
  return createPortal(<AnimatePresence>{open&&src&&<motion.div ref={ref} className="viewer" role="dialog" aria-modal="true" aria-label="Result viewer" tabIndex={-1} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.25}} onWheel={e=>zoom(e.deltaY<0?.25:-.25)}>
    <div className="vbar"><div className="vg"><button className="tb" aria-label="Zoom out" onClick={()=>zoom(-.5)}><ZoomOut/></button><button className="tb" onClick={()=>setZ(1)}><RotateCcw/>RESET <em>{Math.round(z*100)}%</em></button><button className="tb" aria-label="Zoom in" onClick={()=>zoom(.5)}><ZoomIn/></button></div>
      <div className="vg"><button className="tb" onClick={toggleFs}>{fs?<Minimize2/>:<Maximize2/>}FULLSCREEN</button><button className="tb" onClick={()=>downloadImage(src)}><Download/>DOWNLOAD</button><button className="tb" aria-label="Close viewer" onClick={onClose}><X/></button></div></div>
    <div className="vstage" onClick={e=>e.target===e.currentTarget&&onClose()}><motion.div drag={z>1} dragMomentum={false} animate={{scale:z,...(z===1?{x:0,y:0}:{})}} transition={{type:'spring',stiffness:260,damping:30}}><motion.img layoutId="result-img" src={src} alt="Result" draggable="false"/></motion.div></div>
  </motion.div>}</AnimatePresence>,document.body)}
