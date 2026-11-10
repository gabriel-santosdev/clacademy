/** Recorte de vídeo do exercício (regras puras). */

/** Clipe ideal: curto, para tocar em loop. */
export const CLIP_MAX_SECONDS = 10
export const CLIP_DEFAULT_SECONDS = 6

/** Trecho inicial sugerido: os primeiros segundos, até o limite. */
export function defaultRange(duration: number): [number, number] {
  return [0, round1(Math.min(duration, CLIP_DEFAULT_SECONDS))]
}

/** Mantém o trecho dentro do vídeo, com 1 s a CLIP_MAX_SECONDS (ajusta o lado que não foi mexido). */
export function clampRange([a, b]: [number, number], duration: number, moved: 'start' | 'end'): [number, number] {
  let start = Math.max(0, Math.min(a, duration))
  let end = Math.max(0, Math.min(b, duration))
  if (end - start < 1) {
    if (moved === 'start') end = Math.min(duration, start + 1)
    else start = Math.max(0, end - 1)
  }
  if (end - start > CLIP_MAX_SECONDS) {
    if (moved === 'start') end = start + CLIP_MAX_SECONDS
    else start = end - CLIP_MAX_SECONDS
  }
  return [round1(start), round1(end)]
}

function round1(n: number) {
  return Math.round(n * 10) / 10
}

/** 7.4 → "0:07" */
export function clipTime(sec: number) {
  const s = Math.max(0, Math.round(sec))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** Dimensões finais: lado maior até 1280px (≈720p), mantendo a proporção e com números pares (exigência dos codificadores). */
export function targetSize(w: number, h: number, maxLong = 1280) {
  const scale = Math.min(1, maxLong / Math.max(w, h))
  const even = (n: number) => Math.max(2, Math.round((n * scale) / 2) * 2)
  return { width: even(w), height: even(h) }
}

export function formatBytes(n: number) {
  return n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1).replace('.', ',')} MB` : `${Math.ceil(n / 1024)} KB`
}
