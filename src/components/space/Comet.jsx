import {useRef,useMemo} from 'react'
import {useFrame} from '@react-three/fiber'
import * as THREE from 'three'
import {glow} from '../../lib/tex'
export default function Comet({trail=46,speed=9,gap=[7,13],size=1.2,first=3}){
  const head=useRef(),tr=useRef(),st=useRef({on:false,t:0,next:first,p:new THREE.Vector3(),v:new THREE.Vector3()}),gl=useMemo(()=>glow(),[])
  const [hist,col]=useMemo(()=>{const c=new Float32Array(trail*3);for(let i=0;i<trail;i++){const b=Math.pow(1-i/trail,2);c.set([b,b*.68,b*.2],i*3)}return[new Float32Array(trail*3),c]},[trail])
  useFrame((_,dt)=>{const s=st.current;s.t+=dt
    if(!s.on&&s.t>s.next){s.on=true;s.p.set(-32+Math.random()*10,6+Math.random()*9,-18-Math.random()*14);s.v.set(speed,-speed*.3*(.5+Math.random()),0);for(let i=0;i<trail;i++)s.p.toArray(hist,i*3)}
    head.current.visible=tr.current.visible=s.on;if(!s.on)return
    s.p.addScaledVector(s.v,dt);hist.copyWithin(3,0,(trail-1)*3);s.p.toArray(hist,0);tr.current.geometry.attributes.position.needsUpdate=true;head.current.position.copy(s.p)
    if(s.p.x>46||s.p.y<-22){s.on=false;s.t=0;s.next=gap[0]+Math.random()*(gap[1]-gap[0])}})
  return<><sprite ref={head} visible={false} scale={[size*2,size*2,1]}><spriteMaterial map={gl} transparent blending={THREE.AdditiveBlending} depthWrite={false}/></sprite>
    <points ref={tr} visible={false} frustumCulled={false}><bufferGeometry><bufferAttribute attach="attributes-position" args={[hist,3]}/><bufferAttribute attach="attributes-color" args={[col,3]}/></bufferGeometry><pointsMaterial size={size*.28} vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false}/></points></>}
