import {useRef} from 'react'
import {useFrame} from '@react-three/fiber'
function Atom({pos,s,sp}){const g=useRef(),rs=useRef([])
  useFrame((st,dt)=>{g.current.rotation.y+=dt*.15*sp;g.current.rotation.x+=dt*.08;g.current.position.y=pos[1]+Math.sin(st.clock.elapsedTime*.4*sp+pos[0])*.25;rs.current.forEach((r,i)=>r&&(r.rotation.z+=dt*(1.1+i*.5)*sp))})
  return<group ref={g} position={pos} scale={s}><mesh><sphereGeometry args={[.14,16,16]}/><meshBasicMaterial color="#fde68a"/></mesh>
    {[[0,0],[1.05,0],[0,1.05]].map((o,i)=>(<group key={i} rotation={[o[0],o[1],0]}><mesh><torusGeometry args={[.8+i*.12,.004,6,64]}/><meshBasicMaterial color="#b45309" transparent opacity={.6}/></mesh><group ref={e=>rs.current[i]=e}><mesh position={[.8+i*.12,0,0]}><sphereGeometry args={[.045,8,8]}/><meshBasicMaterial color="#a3b52e"/></mesh></group></group>))}</group>}
export default function Atoms({n=4}){return[[-6.5,2.8,-5,.7,1],[6.8,-2.2,-3,.5,1.4],[-3.2,-3.4,-1,.35,.8],[4.5,3.6,-9,1,.6]].slice(0,n).map((a,i)=><Atom key={i} pos={a.slice(0,3)} s={a[3]} sp={a[4]}/>)}
