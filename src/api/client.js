// API layer. MOCK=true simulates in-browser; set VITE_MOCK=false to call FastAPI (/api/*).
export const MOCK = import.meta.env.VITE_MOCK !== 'false'


export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')





console.log("VISIONEDIT CONFIG:", {
  MOCK,
  API_BASE_URL
});





const wait = ms => new Promise(r => setTimeout(r, ms))
const hash = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
const load = url => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('Image failed to load')); i.src = url })
async function post(path, f) {
  const url = `${API_BASE_URL}/api/${path}`

  console.log("POSTING TO BACKEND:", url)

  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'ngrok-skip-browser-warning': 'true'
    },
    body: f
  })

  console.log("BACKEND RESPONSE:", r.status, r.statusText)

  if (!r.ok) {
    const errorText = await r.text()
    console.error("BACKEND ERROR:", errorText)
    throw new Error(`Backend error ${r.status}: ${errorText}`)
  }

  const data = await r.json()

  console.log("BACKEND DATA:", data)
  

  return data
}

const form = (o) => { const f = new FormData(); Object.entries(o).forEach(([k, v]) => f.append(k, typeof v === 'object' && !(v instanceof Blob) ? JSON.stringify(v) : v)); return f }
async function edit(url, box, fx) {
  const img = await load(url), c = document.createElement('canvas')
  c.width = img.width; c.height = img.height
  const g = c.getContext('2d'); g.drawImage(img, 0, 0)
  const [x, y, w, h] = box.box.map((v, i) => v * (i % 2 ? c.height : c.width))
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.filter = 'blur(28px)'; g.drawImage(img, 0, 0); g.restore()
  if (fx) { g.fillStyle = `hsla(${hash(fx) % 360},70%,50%,.75)`; g.fillRect(x, y, w, h); g.fillStyle = '#fff'; g.font = `${Math.max(12, w / 10)}px sans-serif`; g.fillText(fx.slice(0, 24), x + 8, y + h / 2) }
  return c.toDataURL('image/png')
}
export const api = {
  async detect(file, url, prompt, threshold) {
    console.log("DETECT API FUNCTION CALLED", {
  file,
  url,
  prompt,
  threshold,
  MOCK
});
    if (!MOCK) return (await post('detect', form({ image: file, prompt, threshold }))).boxes
    await wait(1400)
    return prompt.split(',').map(s => s.trim()).filter(Boolean).map((label, i) => {
      const h = hash(label + i)
      return { id: `object-${i + 1}`, label, score: .6 + (h % 38) / 100, box: [(h % 60) / 100, ((h >> 3) % 55) / 100, .18 + (h % 15) / 100, .2 + (h % 20) / 100] }
    }).filter(b => b.score >= threshold)
  },
async remove(file, url, prompt, targetIndex) {
  if (!MOCK) {
    return (
      await post(
        'remove',
        form({
          image: file,
          prompt,
          target_index: targetIndex
        })
      )
    ).image
  }

  await wait(2200)
  return url
},

async replace(file, url, prompt, replacementPrompt, targetIndex) {
  if (!MOCK) {
    return (
      await post(
        'replace',
        form({
          image: file,
          prompt,
          replacement_prompt: replacementPrompt,
          target_index: targetIndex
        })
      )
    ).image
  }

  await wait(2600)
  return url
},

async generate(p) {
  if (!MOCK) {
    return (
      await post(
        'generate',
        form({
          prompt: p.prompt,
          negative_prompt: p.neg
        })
      )
    ).image
  }

  await wait(2400)

  const c = document.createElement('canvas')
  c.width = c.height = p.size

  const g = c.getContext('2d')
  const h = hash(p.prompt)

  const gr = g.createLinearGradient(
    0, 0, p.size, p.size
  )

  gr.addColorStop(
    0,
    `hsl(${h % 60 + 10},80%,45%)`
  )

  gr.addColorStop(
    1,
    '#0c0c0b'
  )

  g.fillStyle = gr
  g.fillRect(0, 0, p.size, p.size)

  for (let i = 0; i < 14; i++) {
    g.beginPath()

    g.arc(
      ((h >> i) % 100) / 100 * p.size,
      ((h * (i + 3)) % 100) / 100 * p.size,
      20 + (h * i) % 90,
      0,
      7
    )

    g.fillStyle =
      `hsla(${(h + i * 20) % 70 + 10},80%,60%,.18)`

    g.fill()
  }

  return c.toDataURL('image/png')
}}