export async function downloadImage(src,base='visionedit-result'){
  let href=src,ext='png',rev=null
  try{const b=await(await fetch(src)).blob();rev=href=URL.createObjectURL(b);ext=(b.type.split('/')[1]||'png').replace('jpeg','jpg')}catch{}
  const a=document.createElement('a');a.href=href;a.download=`${base}.${ext}`;a.rel='noopener';document.body.appendChild(a);a.click();a.remove()
  if(rev)setTimeout(()=>URL.revokeObjectURL(rev),2000)
}
