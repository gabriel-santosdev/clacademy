import type { StoryData, StoryStat, StoryStyle } from '../domain/story'

/*
 * Compartilhar treino no Stories: desenha o card (1080×1920) em canvas com a
 * identidade da CL Academy e entrega ao menu de compartilhamento do celular.
 */

/** Estado do diálogo de compartilhamento. */
export function useStoryShare() {
  const visible = ref(false)
  const story = ref<StoryData | null>(null)
  function open(data: StoryData) {
    story.value = data
    visible.value = true
  }
  return { visible, story, open }
}

const W = 1080
const H = 1920
const PAD = 88
const LOGO_H = 112
const DISPLAY = '"Barlow Condensed", "Arial Narrow", sans-serif'
const BODY = 'Manrope, system-ui, sans-serif'

interface Palette {
  bg: string
  fg: string
  muted: string
  line: string
  accent: string
  accentInk: string
}

function palette(style: StoryStyle, accent: string): Palette {
  if (style === 'light') {
    return { bg: '#f0f0f0', fg: '#1f1f1f', muted: '#5e5e5e', line: '#d9d9d9', accent, accentInk: '#1f1f1f' }
  }
  if (style === 'dark') {
    return { bg: '#1f1f1f', fg: '#f0f0f0', muted: '#a6a6a6', line: '#3a3a3a', accent, accentInk: '#1f1f1f' }
  }
  // foto e figurinha: texto claro por cima de imagem
  return { bg: 'transparent', fg: '#ffffff', muted: 'rgba(255,255,255,0.78)', line: 'rgba(255,255,255,0.35)', accent, accentInk: '#1f1f1f' }
}

/* ── recursos ─────────────────────────────────────────── */

let fontsReady: Promise<unknown> | null = null
function ensureFonts() {
  fontsReady ??= Promise.all(
    [`800 100px ${DISPLAY}`, `700 100px ${DISPLAY}`, `600 40px ${BODY}`, `700 40px ${BODY}`, `800 40px ${BODY}`, `italic 500 40px ${BODY}`].map(
      (f) => document.fonts.load(f),
    ),
  ).catch(() => null)
  return fontsReady
}

const logoCache = new Map<string, Promise<HTMLImageElement>>()
/** Logo vetorial pintada na cor pedida (o SVG original é grafite). */
function loadLogo(color: string) {
  let p = logoCache.get(color)
  if (!p) {
    p = fetch('/brand/cl-academy-bold.svg')
      .then((r) => r.text())
      .then((svg) => {
        const colored = svg
          .replace(/fill="#[0-9a-fA-F]{3,6}"/, `fill="${color}"`)
          .replace('<svg ', svg.includes('width=') ? '<svg ' : '<svg width="2768" height="1504" ')
        return loadImage(URL.createObjectURL(new Blob([colored], { type: 'image/svg+xml' })))
      })
    logoCache.set(color, p)
  }
  return p
}

export function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/* ── texto ────────────────────────────────────────────── */

function font(ctx: CanvasRenderingContext2D, spec: string) {
  ctx.font = spec
}

/** Texto com espaçamento entre letras (letterSpacing do canvas ainda não é universal). */
function spaced(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number, align: 'left' | 'right' | 'center' = 'left') {
  const chars = [...text]
  const width = chars.reduce((s, c) => s + ctx.measureText(c).width, 0) + spacing * (chars.length - 1)
  let cx = align === 'left' ? x : align === 'right' ? x - width : x - width / 2
  const prev = ctx.textAlign
  ctx.textAlign = 'left'
  for (const c of chars) {
    ctx.fillText(c, cx, y)
    cx += ctx.measureText(c).width + spacing
  }
  ctx.textAlign = prev
  return width
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width <= maxWidth || !line) line = test
    else {
      lines.push(line)
      line = w
    }
  }
  if (line) lines.push(line)
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines)
    let last = kept[maxLines - 1]!
    while (last.length > 1 && ctx.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1)
    kept[maxLines - 1] = `${last.trimEnd()}…`
    return kept
  }
  return lines
}

/** Maior tamanho de fonte em que o título cabe no número de linhas. */
function fitTitle(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number, max: number, min: number) {
  for (let size = max; size >= min; size -= 6) {
    font(ctx, `800 ${size}px ${DISPLAY}`)
    const lines = wrap(ctx, text, maxWidth, 99)
    if (lines.length <= maxLines) return { size, lines }
  }
  font(ctx, `800 ${min}px ${DISPLAY}`)
  return { size: min, lines: wrap(ctx, text, maxWidth, maxLines) }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

/* ── blocos ───────────────────────────────────────────── */

/** Pílula "TREINO CONCLUÍDO". Devolve a altura. */
function kicker(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, bg: string, fg: string, align: 'left' | 'center' = 'left') {
  font(ctx, `800 36px ${DISPLAY}`)
  const label = text.toUpperCase()
  const chars = [...label]
  const tw = chars.reduce((s, c) => s + ctx.measureText(c).width, 0) + 5 * (chars.length - 1)
  const w = tw + 56
  const left = align === 'center' ? x - w / 2 : x
  ctx.fillStyle = bg
  roundRect(ctx, left, y, w, 64, 32)
  ctx.fill()
  ctx.fillStyle = fg
  ctx.textBaseline = 'middle'
  spaced(ctx, label, left + 28, y + 34, 5)
  ctx.textBaseline = 'alphabetic'
  return 64
}

/** Número principal enorme com unidade e rótulo. Devolve a altura usada. */
function heroStat(
  ctx: CanvasRenderingContext2D,
  stat: StoryStat,
  x: number,
  top: number,
  p: Palette,
  opts: { color: string; size?: number; align?: 'left' | 'center'; highlight?: boolean },
) {
  const size = opts.size ?? 300
  font(ctx, `700 30px ${BODY}`)
  ctx.fillStyle = p.muted
  const align = opts.align ?? 'left'
  spaced(ctx, stat.label.toUpperCase(), x, top + 30, 6, align)

  font(ctx, `800 ${size}px ${DISPLAY}`)
  const vw = ctx.measureText(stat.value).width
  font(ctx, `700 ${size * 0.3}px ${DISPLAY}`)
  const uw = stat.unit ? ctx.measureText(stat.unit).width + 18 : 0
  const left = align === 'center' ? x - (vw + uw) / 2 : x
  const base = top + 30 + size * 0.86

  if (opts.highlight) {
    // marca-texto atrás da parte de baixo do número
    ctx.fillStyle = p.accent
    ctx.fillRect(left - 12, base - size * 0.32, vw + 24, size * 0.3)
  }
  font(ctx, `800 ${size}px ${DISPLAY}`)
  ctx.fillStyle = opts.color
  ctx.textAlign = 'left'
  ctx.fillText(stat.value, left, base)
  if (stat.unit) {
    font(ctx, `700 ${size * 0.3}px ${DISPLAY}`)
    ctx.fillStyle = p.muted
    ctx.fillText(stat.unit, left + vw + 18, base)
  }
  return 30 + size * 0.9
}

/** Linha de até 3 números secundários. Devolve a altura. */
function statRow(ctx: CanvasRenderingContext2D, stats: StoryStat[], x: number, top: number, width: number, p: Palette, align: 'left' | 'center' = 'left') {
  if (!stats.length) return 0
  const cols = stats.slice(0, 3)
  const colW = width / cols.length
  cols.forEach((s, i) => {
    const cx = align === 'center' ? x + colW * i + colW / 2 : x + colW * i
    font(ctx, `700 26px ${BODY}`)
    ctx.fillStyle = p.muted
    spaced(ctx, s.label.toUpperCase(), cx, top + 26, 5, align)

    font(ctx, `800 104px ${DISPLAY}`)
    const vw = ctx.measureText(s.value).width
    font(ctx, `700 44px ${DISPLAY}`)
    const uw = s.unit ? ctx.measureText(s.unit).width + 8 : 0
    const left = align === 'center' ? cx - (vw + uw) / 2 : cx
    font(ctx, `800 104px ${DISPLAY}`)
    ctx.fillStyle = p.fg
    ctx.textAlign = 'left'
    ctx.fillText(s.value, left, top + 128)
    if (s.unit) {
      font(ctx, `700 44px ${DISPLAY}`)
      ctx.fillStyle = p.muted
      ctx.fillText(s.unit, left + vw + 8, top + 128)
    }
  })
  return 140
}

/** Lista de exercícios com check, até onde couber. */
function exerciseList(ctx: CanvasRenderingContext2D, data: StoryData, x: number, top: number, bottom: number, p: Palette) {
  const list = data.exercises ?? []
  const rowH = 66
  const max = Math.max(0, Math.floor((bottom - top) / rowH))
  if (!list.length || max < 2) return
  const rows = list.length > max ? list.slice(0, max - 1) : list
  let y = top
  for (const ex of rows) {
    const cy = y + rowH / 2
    if (ex.done) {
      ctx.fillStyle = p.accent
      ctx.beginPath()
      ctx.arc(x + 20, cy, 20, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = p.accentInk
      ctx.lineWidth = 5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(x + 11, cy + 1)
      ctx.lineTo(x + 18, cy + 8)
      ctx.lineTo(x + 30, cy - 7)
      ctx.stroke()
    } else {
      ctx.strokeStyle = p.line
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(x + 20, cy, 18, 0, Math.PI * 2)
      ctx.stroke()
    }
    font(ctx, `${ex.done ? 700 : 600} 38px ${BODY}`)
    ctx.fillStyle = ex.done ? p.fg : p.muted
    ctx.textBaseline = 'middle'
    const name = wrap(ctx, ex.name, W - x - PAD - 220, 1)[0] ?? ''
    ctx.fillText(name, x + 66, cy + 2)
    if (ex.sets) {
      font(ctx, `800 38px ${DISPLAY}`)
      ctx.fillStyle = p.muted
      ctx.textAlign = 'right'
      ctx.fillText(`${ex.setsDone}/${ex.sets} séries`, W - PAD, cy + 2)
      ctx.textAlign = 'left'
    }
    ctx.textBaseline = 'alphabetic'
    y += rowH
  }
  if (rows.length < list.length) {
    font(ctx, `700 32px ${BODY}`)
    ctx.fillStyle = p.muted
    ctx.fillText(`+ ${list.length - rows.length} exercícios`, x + 66, y + 42)
  }
}

function quote(ctx: CanvasRenderingContext2D, text: string, x: number, top: number, maxLines: number, p: Palette) {
  font(ctx, `italic 500 42px ${BODY}`)
  ctx.fillStyle = p.muted
  const lines = wrap(ctx, `“${text}”`, W - PAD * 2, maxLines)
  lines.forEach((l, i) => ctx.fillText(l, x, top + 42 + i * 58))
}

function lanes(ctx: CanvasRenderingContext2D, color: string, alpha: number) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  for (let l = 1; l <= 7; l++) {
    ctx.beginPath()
    ctx.moveTo(380 + l * 86, H + 40)
    ctx.bezierCurveTo(480 + l * 86, 1200, 760 + l * 52, 640, W + 60, l * 90 - 160)
    ctx.stroke()
  }
  ctx.restore()
}

function footer(ctx: CanvasRenderingContext2D, data: StoryData, p: Palette, y: number) {
  ctx.fillStyle = p.line
  ctx.fillRect(PAD, y, W - PAD * 2, 2)
  font(ctx, `800 58px ${DISPLAY}`)
  ctx.fillStyle = p.fg
  ctx.fillText((data.athlete || 'Atleta CL').toUpperCase(), PAD, y + 92)
  font(ctx, `600 28px ${BODY}`)
  ctx.fillStyle = p.muted
  ctx.fillText('treinou com a CL Academy', PAD, y + 136)
  font(ctx, `700 28px ${BODY}`)
  ctx.textAlign = 'right'
  ctx.fillText('clacademy.com.br', W - PAD, y + 136)
  ctx.textAlign = 'left'
}

/* ── layouts ──────────────────────────────────────────── */

async function drawCard(ctx: CanvasRenderingContext2D, data: StoryData, style: 'dark' | 'light', accent: string) {
  const p = palette(style, accent)
  ctx.fillStyle = p.bg
  ctx.fillRect(0, 0, W, H)
  if (style === 'dark') {
    const glow = ctx.createRadialGradient(W, 0, 0, W, 0, 1100)
    glow.addColorStop(0, 'rgba(255,255,255,0.07)')
    glow.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, W, H)
  }
  lanes(ctx, style === 'dark' ? accent : '#5e5e5e', style === 'dark' ? 0.16 : 0.14)

  const logo = await loadLogo(p.fg)
  ctx.drawImage(logo, PAD, 78, LOGO_H * (2768 / 1504), LOGO_H)
  font(ctx, `700 38px ${DISPLAY}`)
  ctx.fillStyle = p.muted
  spaced(ctx, storyDate(data.date), W - PAD, 150, 3, 'right')

  let y = 300
  y += kicker(ctx, storyKicker(data.kind), PAD, y, style === 'dark' ? p.accent : p.fg, style === 'dark' ? p.accentInk : p.accent) + 44

  const t = fitTitle(ctx, data.title.toUpperCase(), W - PAD * 2, 3, 150, 90)
  ctx.fillStyle = p.fg
  t.lines.forEach((l, i) => ctx.fillText(l, PAD, y + t.size * 0.82 + i * t.size * 0.92))
  y += t.size * 0.92 * t.lines.length + 64

  const { hero, stats } = storyStats(data)
  if (hero) {
    const size = data.exercises?.length ? 250 : 300
    y += heroStat(ctx, hero, PAD, y, p, { color: style === 'dark' ? p.accent : p.fg, highlight: style === 'light', size }) + 40
  }
  if (stats.length) {
    ctx.fillStyle = p.line
    ctx.fillRect(PAD, y, W - PAD * 2, 2)
    y += 40
    y += statRow(ctx, stats, PAD, y, W - PAD * 2, p) + 40
  }

  const footerY = H - 250
  if (data.exercises?.length) exerciseList(ctx, data, PAD, y + 10, footerY - 30, p)
  else if (data.notes && footerY - y > 160) quote(ctx, data.notes, PAD, y + 10, Math.min(4, Math.floor((footerY - y - 40) / 58)), p)

  footer(ctx, data, p, footerY)
}

function cover(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
  const s = Math.max(W / img.naturalWidth, H / img.naturalHeight)
  const w = img.naturalWidth * s
  const h = img.naturalHeight * s
  ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h)
}

async function drawPhoto(ctx: CanvasRenderingContext2D, data: StoryData, accent: string, photo: HTMLImageElement | null) {
  const p = palette('photo', accent)
  if (photo) cover(ctx, photo)
  else {
    ctx.fillStyle = '#2a2a2a'
    ctx.fillRect(0, 0, W, H)
  }
  const top = ctx.createLinearGradient(0, 0, 0, 420)
  top.addColorStop(0, 'rgba(0,0,0,0.55)')
  top.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = top
  ctx.fillRect(0, 0, W, 420)
  const bottom = ctx.createLinearGradient(0, H * 0.38, 0, H)
  bottom.addColorStop(0, 'rgba(0,0,0,0)')
  bottom.addColorStop(0.45, 'rgba(0,0,0,0.55)')
  bottom.addColorStop(1, 'rgba(0,0,0,0.9)')
  ctx.fillStyle = bottom
  ctx.fillRect(0, H * 0.38, W, H * 0.62)

  const logo = await loadLogo('#ffffff')
  ctx.drawImage(logo, PAD, 78, LOGO_H * (2768 / 1504), LOGO_H)
  font(ctx, `700 38px ${DISPLAY}`)
  ctx.fillStyle = p.muted
  spaced(ctx, storyDate(data.date), W - PAD, 150, 3, 'right')

  // conteúdo ancorado embaixo, montado de baixo para cima
  const footerY = H - 250
  footer(ctx, data, p, footerY)
  const { hero, stats } = storyStats(data)
  let y = footerY - 40
  if (stats.length) {
    y -= 140
    statRow(ctx, stats, PAD, y, W - PAD * 2, p)
    y -= 40
  }
  if (hero) {
    const size = 260
    y -= 30 + size * 0.9
    heroStat(ctx, hero, PAD, y, p, { color: p.accent, size })
    y -= 36
  }
  const t = fitTitle(ctx, data.title.toUpperCase(), W - PAD * 2, 2, 132, 84)
  const titleH = t.size * 0.92 * t.lines.length
  y -= titleH
  ctx.fillStyle = p.fg
  t.lines.forEach((l, i) => ctx.fillText(l, PAD, y + t.size * 0.82 + i * t.size * 0.92))
  y -= 36 + 64
  kicker(ctx, storyKicker(data.kind), PAD, y, p.accent, p.accentInk)
}

/** Figurinha: só números, fundo transparente, recortada no conteúdo. */
async function drawSticker(data: StoryData, accent: string) {
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')!
  const p = palette('sticker', accent)
  ctx.shadowColor = 'rgba(0,0,0,0.45)'
  ctx.shadowBlur = 22
  ctx.shadowOffsetY = 3
  ctx.textAlign = 'left'
  const cx = W / 2
  let y = 40

  const logo = await loadLogo('#ffffff')
  const lw = 120 * (2768 / 1504)
  ctx.drawImage(logo, cx - lw / 2, y, lw, 120)
  y += 120 + 36

  const t = fitTitle(ctx, data.title.toUpperCase(), W - PAD * 2, 2, 110, 72)
  ctx.fillStyle = p.fg
  ctx.textAlign = 'center'
  t.lines.forEach((l, i) => ctx.fillText(l, cx, y + t.size * 0.82 + i * t.size * 0.92))
  ctx.textAlign = 'left'
  y += t.size * 0.92 * t.lines.length + 40

  const { hero, stats } = storyStats(data)
  if (hero) y += heroStat(ctx, hero, cx, y, p, { color: p.fg, size: 280, align: 'center' }) + 30
  if (stats.length) y += statRow(ctx, stats, PAD, y, W - PAD * 2, p, 'center') + 20

  font(ctx, `700 32px ${DISPLAY}`)
  ctx.fillStyle = p.muted
  spaced(ctx, `${storyDate(data.date)} · CL ACADEMY`, cx, y + 40, 4, 'center')
  y += 80

  const out = document.createElement('canvas')
  out.width = W
  out.height = Math.min(H, Math.ceil(y))
  out.getContext('2d')!.drawImage(c, 0, 0)
  return out
}

/** Desenha o card no estilo pedido. A cor de destaque vem do tema (volt ou canarinho). */
export async function renderStory(data: StoryData, style: StoryStyle, opts: { accent: string; photo?: HTMLImageElement | null }) {
  await ensureFonts()
  if (style === 'sticker') return drawSticker(data, opts.accent)
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')!
  if (style === 'photo') await drawPhoto(ctx, data, opts.accent, opts.photo ?? null)
  else await drawCard(ctx, data, style, opts.accent)
  return c
}

export function canvasToBlob(c: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error('Falha ao gerar a imagem'))), 'image/png'))
}

export function downloadBlob(blob: Blob, name: string) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 5000)
}

/**
 * Abre o menu de compartilhamento do celular (Instagram, WhatsApp…) com a imagem.
 * Sem suporte (computador), baixa o arquivo. Chame direto no clique: o navegador
 * exige que o compartilhamento venha de um toque do usuário.
 */
export async function shareStoryBlob(blob: Blob, name: string): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const file = new File([blob], name, { type: 'image/png' })
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] })
      return 'shared'
    } catch (err) {
      if ((err as Error).name === 'AbortError') return 'cancelled'
    }
  }
  downloadBlob(blob, name)
  return 'downloaded'
}

export const canCopyImage = () => typeof ClipboardItem !== 'undefined' && !!navigator.clipboard?.write

export async function copyStoryBlob(blob: Blob) {
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
}
