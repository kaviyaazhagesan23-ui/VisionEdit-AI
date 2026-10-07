import {useRef} from 'react'
import {useFrame} from '@react-three/fiber'
const Cap=({p,r=[0,0,0],a,l})=><mesh position={p} rotation={r}><capsuleGeometry args={[a,l,4,10]}/><meshStandardMaterial color="#cfc6b2" roughness={.6}/></mesh>
export default function Astronaut(){const g=useRef(),led=useRef()
  useFrame(s=>{const t=s.clock.elapsedTime;g.current.position.set(-4.8+Math.sin(t*.12)*.8,-1.7+Math.sin(t*.35)*.25,-3+Math.cos(t*.12)*.6);g.current.rotation.set(Math.sin(t*.2)*.3,t*.08,Math.cos(t*.17)*.25);led.current.material.emissiveIntensity=1.2+Math.sin(t*3)*.6})
  return<group ref={g} scale={.55}><Cap p={[0,0,0]} a={.28} l={.4}/>
    <mesh position={[0,.62,0]}><sphereGeometry args={[.27,24,24]}/><meshStandardMaterial color="#d9d1be" roughness={.5}/></mesh>
    <mesh position={[0,.62,.1]} scale={[1,.8,.8]}><sphereGeometry args={[.22,24,24]}/><meshStandardMaterial color="#14110c" metalness={.95} roughness={.08} emissive="#3a2406"/></mesh>
    <mesh position={[0,.05,-.3]}><boxGeometry args={[.42,.55,.2]}/><meshStandardMaterial color="#8f887a" roughness={.7}/></mesh>
    <Cap p={[-.42,.05,.08]} r={[0,0,.5]} a={.09} l={.42}/><Cap p={[.42,.05,.08]} r={[0,0,-.5]} a={.09} l={.42}/>
    <Cap p={[-.14,-.62,0]} r={[.2,0,.05]} a={.1} l={.4}/><Cap p={[.14,-.62,0]} r={[-.15,0,-.05]} a={.1} l={.4}/>
    <mesh ref={led} position={[.12,.12,.29]}><sphereGeometry args={[.04,8,8]}/><meshStandardMaterial color="#f59e0b" emissive="#f59e0b"/></mesh></group>}
