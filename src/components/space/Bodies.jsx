import {useRef,useMemo} from 'react'
import {useFrame} from '@react-three/fiber'
import * as THREE from 'three'
import {pointer} from '../../lib/pointer'
import {glow,surface} from '../../lib/tex'
export function Planet({base,hues,seed,r,pos,speed}){const g=useRef(),m=useRef(),tex=useMemo(()=>surface(base,hues,seed),[])
  useFrame((s,dt)=>{const t=s.clock.elapsedTime,k=r*.12;g.current.position.set(pos[0]-pointer.x*k*2+Math.sin(t*speed)*.4,pos[1]+pointer.y*k+scrollY*.002*r,pos[2]);m.current.rotation.y+=dt*.02})
  return<group ref={g}><mesh ref={m}><sphereGeometry args={[r,48,48]}/><meshLambertMaterial map={tex}/></mesh>
    <mesh scale={1.07}><sphereGeometry args={[r,32,32]}/><meshBasicMaterial color="#f59e0b" transparent opacity={.13} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh></group>}
export function Sun(){const g=useRef(),sf=useRef(),h=useRef([]),fl=useRef(),tex=useMemo(()=>surface('#ffb347',['#fff2c4','#e8590c','#b45309'],7),[]),gl=useMemo(()=>glow(),[])
  const fp=useMemo(()=>{const a=new Float32Array(180);for(let i=0;i<60;i++){const r=2.4+Math.random()*1.2,t=Math.random()*6.28;a.set([Math.cos(t)*r,Math.sin(t)*r,(Math.random()-.5)*.6],i*3)}return a},[])
  useFrame((s,dt)=>{const t=s.clock.elapsedTime;sf.current.rotation.y+=dt*.03;fl.current.rotation.z-=dt*.06
    g.current.position.set(-17-pointer.x*1.5,9-pointer.y*.8+scrollY*.003,-38)
    h.current.forEach((m,i)=>m&&m.scale.setScalar([16,10,6][i]*(1+.05*Math.sin(t*.6+i*2)+(i===2&&Math.sin(t*.23)>.92?.15:0))))})
  return<group ref={g}><mesh ref={sf}><sphereGeometry args={[2.2,32,32]}/><meshBasicMaterial map={tex}/></mesh>
    {[0,1,2].map(i=><sprite key={i} ref={e=>h.current[i]=e}><spriteMaterial map={gl} transparent opacity={[.3,.45,.8][i]} blending={THREE.AdditiveBlending} depthWrite={false}/></sprite>)}
    <points ref={fl}><bufferGeometry><bufferAttribute attach="attributes-position" args={[fp,3]}/></bufferGeometry><pointsMaterial color="#ffd27a" size={.12} transparent opacity={.7} blending={THREE.AdditiveBlending} depthWrite={false}/></points></group>}
