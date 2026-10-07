import {Canvas,useFrame} from '@react-three/fiber'
import {pointer} from '../../lib/pointer'
import StarField from './StarField'
import {Planet,Sun} from './Bodies'
import Comet from './Comet'
import Atoms from './Atoms'
import Astronaut from './Astronaut'
function Rig(){useFrame(s=>{const c=s.camera;c.position.x+=(pointer.x*1.1-c.position.x)*.04;c.position.y+=(-pointer.y*.7-scrollY*.0015-c.position.y)*.04;c.lookAt(0,0,0)})}
export default function SpaceScene(){
  const w=innerWidth,q=w<700?.25:w<1000?.55:1,rm=matchMedia('(prefers-reduced-motion: reduce)').matches,full=w>=700&&!rm
  return<div className="space" aria-hidden="true"><Canvas frameloop={rm?'demand':'always'} dpr={[1,w<700?1:1.5]} camera={{position:[0,0,8],fov:50}} gl={{alpha:true,powerPreference:'low-power'}}>
    <ambientLight intensity={.3}/><directionalLight position={[-6,3,2]} intensity={2.2} color="#ffd9a0"/>
    {!rm&&<Rig/>}<StarField q={q}/><Sun/>
    <Planet base="#7a3a12" hues={['#d97706','#3b1a08','#f2c078']} seed={11} r={4.5} pos={[14,-2,-16]} speed={.05}/>
    <Planet base="#8a8577" hues={['#cfc6b2','#4a463d']} seed={5} r={1.4} pos={[-13,-5,-10]} speed={.08}/>
    {full&&<><Atoms n={w<1000?2:4}/>{w>=1000&&<Astronaut/>}<Comet/><Comet trail={16} speed={32} gap={[4,9]} size={.5} first={6}/></>}
  </Canvas></div>}
