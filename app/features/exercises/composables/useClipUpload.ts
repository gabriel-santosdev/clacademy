import { CLIP_MAX_SECONDS, targetSize } from '../domain/clip'
import { exercisesApi } from '../api/exercisesApi'

/*
 * Vídeo do exercício: otimiza no próprio navegador (recorte, 720p, sem som, capa)
 * e envia direto ao Storage por link assinado, com progresso.
 */

const MIME_CANDIDATES = [
  'video/mp4;codecs=avc1.42E01E',
  'video/mp4;codecs=avc1',
  'video/mp4',
  'video/webm;codecs=vp9',
  'video/webm;codecs=vp8',
  'video/webm',
]

function pickMime() {
  if (typeof MediaRecorder === 'undefined') return null
  return MIME_CANDIDATES.find((m) => MediaRecorder.isTypeSupported(m)) ?? null
}

function once(el: EventTarget, name: string) {
  return new Promise<void>((resolve, reject) => {
    el.addEventListener(name, () => resolve(), { once: true })
    el.addEventListener('error', () => reject(new Error('Não foi possível ler este vídeo. Se for do iPhone, tente o formato "Mais compatível" da câmera.')), {
      once: true,
    })
  })
}

function canvasBlob(c: HTMLCanvasElement, type: string, q?: number) {
  return new Promise<Blob>((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error('Falha ao gerar a capa.'))), type, q))
}

/** Regrava o trecho [start, end] em 720p, sem som (leva o tempo do próprio trecho). */
export async function processClip(src: string, start: number, end: number, onProgress: (p: number) => void) {
  const mime = pickMime()
  if (!mime) throw new Error('Este navegador não consegue otimizar vídeos. Use o Chrome ou o Safari atualizados.')

  const v = document.createElement('video')
  v.muted = true
  v.playsInline = true
  v.preload = 'auto'
  const loaded = once(v, 'loadedmetadata')
  v.src = src
  await loaded

  const { width, height } = targetSize(v.videoWidth, v.videoHeight)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  const seeked = once(v, 'seeked')
  v.currentTime = start
  await seeked
  ctx.drawImage(v, 0, 0, width, height)
  const poster = await canvasBlob(canvas, 'image/jpeg', 0.82)

  const stream = canvas.captureStream(30)
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 2_500_000 })
  const chunks: Blob[] = []
  rec.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data)
  }
  const stopped = new Promise<void>((resolve) => rec.addEventListener('stop', () => resolve(), { once: true }))

  const limit = Math.min(end, start + CLIP_MAX_SECONDS)
  rec.start(250)
  await v.play()
  await new Promise<void>((resolve) => {
    const tick = () => {
      ctx.drawImage(v, 0, 0, width, height)
      onProgress(Math.min(1, (v.currentTime - start) / Math.max(0.1, limit - start)))
      if (v.currentTime >= limit || v.ended) return resolve()
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
  v.pause()
  rec.stop()
  await stopped
  stream.getTracks().forEach((t) => t.stop())
  v.removeAttribute('src')

  const type = mime.split(';')[0]!
  return { video: new Blob(chunks, { type }), ext: (type === 'video/mp4' ? 'mp4' : 'webm') as 'mp4' | 'webm', poster }
}

/** Envia ao link assinado do Storage medindo o progresso (XHR mede o upload; fetch não). */
function putSigned(url: string, file: Blob, apikey: string, onProgress: (p: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const body = new FormData()
    body.append('cacheControl', '31536000')
    body.append('', file)
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url)
    if (apikey) xhr.setRequestHeader('apikey', apikey)
    xhr.setRequestHeader('x-upsert', 'true')
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total)
    }
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`O armazenamento recusou o envio (${xhr.status}).`)))
    xhr.onerror = () => reject(new Error('Falha de conexão ao enviar o vídeo.'))
    xhr.send(body)
  })
}

export type ClipStage = 'idle' | 'editing' | 'processing' | 'uploading' | 'done'

/** Fluxo completo: escolher → recortar → otimizar → enviar → salvar no exercício. */
export function useClipUpload(exerciseId: () => number | null) {
  const { public: pub } = useRuntimeConfig()
  const stage = ref<ClipStage>('idle')
  const progress = ref(0)
  const error = ref('')
  const source = ref<{ url: string; name: string; size: number } | null>(null)
  const result = ref<{ size: number } | null>(null)

  function choose(file: File) {
    error.value = ''
    if (!file.type.startsWith('video/')) {
      error.value = 'Escolha um arquivo de vídeo.'
      return
    }
    if (source.value) URL.revokeObjectURL(source.value.url)
    source.value = { url: URL.createObjectURL(file), name: file.name, size: file.size }
    stage.value = 'editing'
  }

  function reset() {
    if (source.value) URL.revokeObjectURL(source.value.url)
    source.value = null
    stage.value = 'idle'
    progress.value = 0
    error.value = ''
  }

  /** Otimiza e envia; devolve o exercício atualizado (ou null se falhar). */
  async function upload(start: number, end: number) {
    const id = exerciseId()
    if (!id || !source.value) return null
    error.value = ''
    try {
      stage.value = 'processing'
      progress.value = 0
      const clip = await processClip(source.value.url, start, end, (p) => (progress.value = p))

      stage.value = 'uploading'
      progress.value = 0
      const links = await exercisesApi.mediaUploadLinks(id, clip.ext)
      const total = clip.video.size + clip.poster.size
      await putSigned(links.poster.uploadUrl, clip.poster, pub.supabaseKey, (p) => (progress.value = (p * clip.poster.size) / total))
      await putSigned(links.video.uploadUrl, clip.video, pub.supabaseKey, (p) => (progress.value = (clip.poster.size + p * clip.video.size) / total))

      const ex = await exercisesApi.saveMedia(id, { videoUrl: links.video.publicUrl, posterUrl: links.poster.publicUrl })
      result.value = { size: clip.video.size }
      stage.value = 'done'
      return ex
    } catch (err) {
      error.value = err instanceof Error && !('data' in err) ? err.message : errorMessage(err)
      stage.value = 'editing'
      return null
    }
  }

  onScopeDispose(() => {
    if (source.value) URL.revokeObjectURL(source.value.url)
  })
  return { stage, progress, error, source, result, choose, reset, upload }
}
