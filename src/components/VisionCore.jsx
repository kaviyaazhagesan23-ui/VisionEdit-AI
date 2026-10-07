import {useRef,useMemo} from 'react'
import {Canvas,useFrame} from '@react-three/fiber'
import * as THREE from 'three'
import {pointer,fx} from '../lib/pointer'
import {glow} from '../lib/tex'
function Shell({n,r0,r1,spd,size,color}){const g=useRef(),p=useMemo(()=>{const a=new Float32Array(n*3);for(let i=0;i<n;i++){const r=r0+Math.random()*(r1-r0),t=Math.random()*6.283,ph=Math.acos(2*Math.random()-1);a.set([r*Math.sin(ph)*Math.cos(t),r*Math.sin(ph)*Math.sin(t),r*Math.cos(ph)],i*3)}return a},[n])
  g.cur=spd;return<points ref={g} userData={{spd}}><bufferGeometry><bufferAttribute attach="attributes-position" args={[p,3]}/></bufferGeometry><pointsMaterial color={color} size={size} transparent opacity={.8} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false}/></points>}
function Core({lite}){
  const root=useRef(),wire=useRef(),ico=useRef(),rings=useRef([]),arc=useRef(),pulse=useRef(),halo=useRef(),nodes=useRef(),sp=useRef(.25),T=useRef(0),ph=useRef(.5),gl=useMemo(()=>glow(),[])
  useFrame((s,dt)=>{
    sp.current+=((fx.busy?1.7:.25)-sp.current)*Math.min(1,dt*2);T.current+=dt*sp.current
    if(fx.kick){fx.kick=false;ph.current=0;fx.pulse=1}fx.pulse=Math.max(0,fx.pulse-dt*1.1)
    const t=T.current,b=(sp.current-.25)/1.45+fx.pulse*.6
    root.current.rotation.y=pointer.x*.6+Math.sin(t*.1)*.2;root.current.rotation.x=pointer.y*.4
    wire.current.rotation.y=t*.12;ico.current.rotation.set(t*.3,-t*.4,0)
    rings.current.forEach((r,i)=>r&&(r.rotation[['x','y','z','y'][i]]+=dt*sp.current*[.9,-.6,.45,-1.3][i]))
    arc.current.rotation.z=t*2.2;arc.current.material.opacity=.2+.4*(.5+.5*Math.sin(t*.7))+b*.5
    nodes.current.rotation.y=-t*.5;nodes.current.rotation.x=t*.2
    ph.current+=dt*(ph.current<1&&fx.pulse>0?1.3:.22);if(ph.current>1.2)ph.current=0
    const q=Math.min(ph.current,1);pulse.current.scale.setScalar(1+q*1.8);pulse.current.material.opacity=(1-q)*.7
    halo.current.scale.setScalar(2.3+b*1.2+Math.sin(t*1.3)*.15)
    root.current.children.forEach(c=>c.isPoints&&(c.rotation.y+=dt*sp.current*c.userData.spd))
    s.camera.position.x+=(pointer.x*.5-s.camera.position.x)*.05;s.camera.position.y+=(-pointer.y*.35-s.camera.position.y)*.05;s.camera.lookAt(0,0,0)})
  const Ring=({i,r,rot,op=.6,col='#f59e0b',arcLen})=><group rotation={rot}><mesh ref={e=>rings.current[i]=e}><torusGeometry args={[r,.008,8,96,arcLen]}/><meshBasicMaterial color={col} transparent opacity={op}/></mesh></group>
  return<group ref={root}>
    <mesh scale={.2}><sphereGeometry args={[1,24,24]}/><meshBasicMaterial color="#fff2c4"/></mesh>
    <sprite ref={halo}><spriteMaterial map={gl} transparent blending={THREE.AdditiveBlending} depthWrite={false}/></sprite>
    <mesh ref={wire}><icosahedronGeometry args={[.85,2]}/><meshBasicMaterial color="#f59e0b" wireframe transparent opacity={.28}/></mesh>
    <mesh ref={ico} scale={.5}><icosahedronGeometry args={[1,0]}/><meshBasicMaterial color="#b45309" wireframe/></mesh>
    <Ring i={0} r={1.3} rot={[.4,0,0]}/><Ring i={1} r={1.55} rot={[1.1,0,.3]} col="#b45309" arcLen={4.2}/><Ring i={2} r={1.8} rot={[0,1,0]} col="#8f887a" op={.5}/><Ring i={3} r={1.2} rot={[.2,.5,1]} col="#a3b52e" op={.7} arcLen={1.6}/>
    <mesh ref={arc}><torusGeometry args={[1.45,.022,8,64,1]}/><meshBasicMaterial color="#a3b52e" transparent/></mesh>
    <mesh ref={pulse}><torusGeometry args={[.9,.01,8,64]}/><meshBasicMaterial color="#fde68a" transparent/></mesh>
    <group ref={nodes}>{[0,1,2,3,4,5].map(i=><mesh key={i} position={[Math.cos(i*1.047)*1.7,Math.sin(i*2.1)*.6,Math.sin(i*1.047)*1.7]}><sphereGeometry args={[.04,8,8]}/><meshBasicMaterial color="#fde68a"/></mesh>)}</group>
    <Shell n={lite?50:150} r0={1} r1={1.5} spd={.5} size={.03} color="#fbbf24"/><Shell n={lite?60:200} r0={1.6} r1={2.4} spd={-.18} size={.022} color="#f59e0b"/><Shell n={lite?20:60} r0={.6} r1={.95} spd={1.1} size={.02} color="#fff2c4"/>
  </group>}
export default function VisionCore({lite}){return<Canvas dpr={[1,1.5]} camera={{position:[0,0,5.4],fov:42}} gl={{alpha:true,powerPreference:'low-power'}}><Core lite={lite}/></Canvas>}
