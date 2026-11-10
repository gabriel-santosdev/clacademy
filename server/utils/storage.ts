/*
 * Supabase Storage (REST, sem SDK) para as mídias dos exercícios.
 * O servidor só gera links de envio assinados; o arquivo vai direto do navegador
 * para o Storage (sem passar pela Vercel, que limita requisições a 4,5 MB).
 */

export const MEDIA_BUCKET = 'exercise-media'
const MAX_BYTES = 50 * 1024 * 1024

function cfg() {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl.replace(/\/$/, '')
  const key = config.supabase.serviceKey
  if (!url || !key) {
    throw createError({
      statusCode: 503,
      message: 'Envio de vídeo não configurado: defina NUXT_PUBLIC_SUPABASE_URL e NUXT_SUPABASE_SERVICE_KEY.',
    })
  }
  // chaves novas (sb_secret_) vão só no apikey; as antigas (JWT) também como Bearer
  const headers: Record<string, string> = { apikey: key }
  if (!key.startsWith('sb_secret_')) headers.Authorization = `Bearer ${key}`
  return { url, headers }
}

export function storageEnabled() {
  const config = useRuntimeConfig()
  return !!(config.public.supabaseUrl && config.supabase.serviceKey && config.public.supabaseKey)
}

async function storage(path: string, init: { method: string; body?: unknown }): Promise<Response> {
  const { url, headers } = cfg()
  return fetch(`${url}/storage/v1${path}`, {
    method: init.method,
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  })
}

let bucketReady = false
/** Cria o bucket público na primeira vez (idempotente). */
async function ensureBucket() {
  if (bucketReady) return
  const res = await storage('/bucket', {
    method: 'POST',
    body: {
      id: MEDIA_BUCKET,
      name: MEDIA_BUCKET,
      public: true,
      file_size_limit: MAX_BYTES,
      allowed_mime_types: ['video/mp4', 'video/webm', 'image/jpeg', 'image/webp'],
    },
  })
  // 409/400 "already exists" também serve
  if (!res.ok && res.status !== 409 && !(await res.text()).includes('already exists')) {
    throw createError({ statusCode: 502, message: 'Não foi possível preparar o armazenamento de vídeos.' })
  }
  bucketReady = true
}

export function publicMediaUrl(path: string) {
  return `${cfg().url}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`
}

/** Link de envio assinado (vale 2 h) para um caminho do bucket. */
export async function signedUploadUrl(path: string) {
  await ensureBucket()
  const res = await storage(`/object/upload/sign/${MEDIA_BUCKET}/${path}`, { method: 'POST', body: {} })
  if (!res.ok) throw createError({ statusCode: 502, message: 'Não foi possível gerar o link de envio.' })
  const { url } = (await res.json()) as { url: string }
  return { uploadUrl: `${cfg().url}/storage/v1${url}`, publicUrl: publicMediaUrl(path) }
}

/** Apaga arquivos nossos (ignora URLs de fora do bucket). */
export async function removeMedia(urls: (string | null | undefined)[]) {
  if (!storageEnabled()) return
  const prefix = `${cfg().url}/storage/v1/object/public/${MEDIA_BUCKET}/`
  const paths = urls.filter((u): u is string => !!u && u.startsWith(prefix)).map((u) => u.slice(prefix.length))
  if (!paths.length) return
  await storage(`/object/${MEDIA_BUCKET}`, { method: 'DELETE', body: { prefixes: paths } }).catch(() => null)
}
