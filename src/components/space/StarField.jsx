import {useRef,useMemo} from 'react'
import {useFrame} from '@react-three/fiber'
import {pointer} from '../../lib/pointer'
const mk=(n,w,z0,z1)=>{const p=new Float32Array(n*3),c=new Float32Array(n*3);for(let i=0;i<n;i++){p.set([(Math.random()-.5)*w,(Math.random()-.5)*w*.6,-z0-Math.random()*(z1-z0)],i*3);const k=Math.random(),b=.35+Math.random()*.65;c.set([b,b*(.93-k*.2),b*(.8-k*.45)],i*3)}return[p,c]}
const Pts=({p,c,size,op,refp})=>(<points ref={refp}><bufferGeometry><bufferAttribute attach="attributes-position" args={[p,3]}/><bufferAttribute attach="attributes-color" args={[c,3]}/></bufferGeometry><pointsMaterial size={size} vertexColors transparent opacity={op} sizeAttenuation depthWrite={false}/></points>)
function Layer({n,w,z0,z1,size,par,spin}){const ref=useRef(),[p,c]=useMemo(()=>mk(n,w,z0,z1),[n])
  useFrame((s,dt)=>{const g=ref.current;g.position.x+=(-pointer.x*par-g.position.x)*.05;g.position.y+=(pointer.y*par*.6+scrollY*.0006*par-g.position.y)*.05;g.rotation.z+=dt*spin})
  return <Pts p={p} c={c} size={size} op={.9} refp={ref}/>}
function Dust({n}){const ref=useRef(),[p,c]=useMemo(()=>mk(n,26,1,12),[n])
  useFrame((s,dt)=>{const a=ref.current.geometry.attributes.position;for(let i=0;i<n;i++){let y=a.getY(i)+dt*.07;if(y>8)y=-8;a.setY(i,y)}a.needsUpdate=true;ref.current.position.x+=(-pointer.x*2.4-ref.current.position.x)*.05})
  return <Pts p={p} c={c} size={.06} op={.5} refp={ref}/>}
export default function StarField({q=1}){return<><Layer n={Math.round(1500*q)} w={150} z0={60} z1={95} size={.17} par={.3} spin={.002}/><Layer n={Math.round(450*q)} w={80} z0={25} z1={50} size={.12} par={.9} spin={-.003}/><Dust n={Math.round(120*q)}/></>}
