/** Demonstração de exercício a partir de um link colado pelo professor. Puro. */

export type DemoMedia =
  | { kind: 'iframe'; src: string; vertical: boolean; provider: string }
  | { kind: 'video'; src: string }
  | { kind: 'image'; src: string }
  | { kind: 'link'; src: string }

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?|#|$)/i
const IMAGE_EXT = /\.(gif|webp|png|jpe?g|avif)(\?|#|$)/i

function youtubeId(u: URL) {
  const host = u.hostname.replace(/^www\.|^m\./, '')
  if (host === 'youtu.be') return { id: u.pathname.slice(1), short: false }
  if (host !== 'youtube.com' && host !== 'youtube-nocookie.com') return null
  if (u.pathname === '/watch') return { id: u.searchParams.get('v') ?? '', short: false }
  const m = u.pathname.match(/^\/(shorts|embed|live)\/([\w-]+)/)
  return m ? { id: m[2]!, short: m[1] === 'shorts' } : null
}

/**
 * Converte o link em algo que dá para mostrar dentro do app:
 * YouTube (inclusive Shorts), Vimeo, Google Drive, Instagram, arquivo de vídeo
 * (.mp4/.webm) ou imagem/GIF. Qualquer outro link abre em nova aba.
 */
export function parseDemoUrl(raw: string | null | undefined): DemoMedia | null {
  const value = raw?.trim()
  if (!value) return null
  let u: URL
  try {
    u = new URL(value)
  } catch {
    return null
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null
  const host = u.hostname.replace(/^www\./, '')

  const yt = youtubeId(u)
  if (yt?.id && /^[\w-]{6,}$/.test(yt.id)) {
    return {
      kind: 'iframe',
      provider: 'YouTube',
      vertical: yt.short,
      src: `https://www.youtube-nocookie.com/embed/${yt.id}?rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${yt.id}`,
    }
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const id = u.pathname.match(/(\d{6,})/)?.[1]
    if (id) return { kind: 'iframe', provider: 'Vimeo', vertical: false, src: `https://player.vimeo.com/video/${id}?loop=1` }
  }

  if (host === 'drive.google.com') {
    const id = u.pathname.match(/\/file\/d\/([\w-]+)/)?.[1] ?? u.searchParams.get('id')
    if (id) return { kind: 'iframe', provider: 'Google Drive', vertical: false, src: `https://drive.google.com/file/d/${id}/preview` }
  }

  if (host === 'instagram.com') {
    const m = u.pathname.match(/^\/(p|reel|reels)\/([\w-]+)/)
    if (m) return { kind: 'iframe', provider: 'Instagram', vertical: true, src: `https://www.instagram.com/${m[1] === 'p' ? 'p' : 'reel'}/${m[2]}/embed` }
  }

  if (VIDEO_EXT.test(u.pathname)) return { kind: 'video', src: u.toString() }
  if (IMAGE_EXT.test(u.pathname)) return { kind: 'image', src: u.toString() }
  return { kind: 'link', src: u.toString() }
}

