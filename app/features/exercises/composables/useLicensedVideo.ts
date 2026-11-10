import { pickVideo, type LicensedVideo, type VideoAngle, type VideoGender } from '../domain/exercise'
import { exercisesApi } from '../api/exercisesApi'

const PREF_KEY = 'clacademy:video-pref'

function readPref(): { gender: VideoGender; angle: VideoAngle } {
  try {
    const p = JSON.parse(localStorage.getItem(PREF_KEY) ?? '{}')
    return { gender: p.gender === 'male' ? 'male' : 'female', angle: p.angle === 'side' ? 'side' : 'front' }
  } catch {
    return { gender: 'female', angle: 'front' }
  }
}

/** Vídeos licenciados de um exercício + preferência do aluno (gênero/ângulo), lembrada no aparelho. */
export function useLicensedVideo() {
  const videos = ref<LicensedVideo[]>([])
  const loading = ref(false)
  const failed = ref(false)
  const pref = reactive(import.meta.client ? readPref() : { gender: 'female' as VideoGender, angle: 'front' as VideoAngle })
  watch(pref, (p) => {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(p))
    } catch {
      /* sem armazenamento: só não lembra */
    }
  })

  const current = computed(() => pickVideo(videos.value, pref.gender, pref.angle))

  async function load(id: number) {
    loading.value = true
    failed.value = false
    videos.value = []
    try {
      videos.value = (await exercisesApi.videos(id)).videos
    } catch {
      failed.value = true
    } finally {
      loading.value = false
    }
  }

  return { videos, loading, failed, pref, current, load }
}
