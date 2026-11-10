import type { Equipment, MuscleGroup, TrainingLevel } from '#shared/utils/constants'

/** Banco de exercícios: busca, filtros e formulário. Puro. */

export interface ExerciseLike {
  id: number
  name: string
  muscleGroup: MuscleGroup
  equipment: Equipment
  level: TrainingLevel
  instructions: string | null
  images: string[]
  videoUrl: string | null
  source: 'catalogo' | 'equipe'
  /** vídeo licenciado vinculado (MuscleWiki) */
  externalId?: number | null
}

/** O que a tela "Como fazer" mostra (vem do banco e/ou da ficha). */
export interface ExerciseDetail {
  /** id no banco (para buscar os vídeos licenciados) */
  id?: number | null
  hasLicensedVideo?: boolean
  name: string
  images?: string[] | null
  instructions?: string | null
  videoUrl?: string | null
  muscleGroup?: MuscleGroup | null
  equipment?: Equipment | null
  level?: TrainingLevel | null
  /** prescrição da ficha, ex.: "4 × 10 · 20kg · 60s" */
  prescription?: string | null
  /** observação do professor para este aluno */
  notes?: string | null
}

/** Item da ficha (com o exercício do banco, se houver) → tela "Como fazer". */
export function itemToDetail(it: {
  name: string
  sets: number | null
  reps: string | null
  load: string | null
  restSeconds: number | null
  notes: string | null
  videoUrl: string | null
  exercise?: Pick<ExerciseLike, 'images' | 'instructions' | 'videoUrl' | 'muscleGroup' | 'equipment' | 'level'> &
    Partial<Pick<ExerciseLike, 'id' | 'externalId'>> | null
}): ExerciseDetail {
  const parts = [
    it.sets || it.reps ? [it.sets, it.reps].filter(Boolean).join(' × ') : null,
    it.load,
    it.restSeconds ? `${it.restSeconds}s descanso` : null,
  ].filter(Boolean)
  return {
    id: it.exercise?.id ?? null,
    hasLicensedVideo: !!it.exercise?.externalId,
    name: it.name,
    images: it.exercise?.images ?? null,
    instructions: it.exercise?.instructions ?? null,
    // vídeo colocado na ficha tem prioridade sobre o do banco
    videoUrl: it.videoUrl || it.exercise?.videoUrl || null,
    muscleGroup: it.exercise?.muscleGroup ?? null,
    equipment: it.exercise?.equipment ?? null,
    level: it.exercise?.level ?? null,
    prescription: parts.join(' · ') || null,
    notes: it.notes,
  }
}

/* ── vídeos licenciados ─────────────────────────────── */

export type VideoGender = 'female' | 'male'
export type VideoAngle = 'front' | 'side'

export interface LicensedVideo {
  angle: string
  gender: string
  src: string
}

/** Vídeo para a preferência (gênero/ângulo), caindo para o que existir. */
export function pickVideo(list: LicensedVideo[], gender: VideoGender, angle: VideoAngle) {
  return (
    list.find((v) => v.gender === gender && v.angle === angle) ??
    list.find((v) => v.gender === gender) ??
    list.find((v) => v.angle === angle) ??
    list[0] ??
    null
  )
}

export const hasVideoOption = (list: LicensedVideo[], key: 'gender' | 'angle', value: string) => list.some((v) => v[key] === value)

export interface ExerciseFilters {
  q: string
  group: MuscleGroup | null
  equipment: Equipment | null
}

export const emptyExerciseFilters = (): ExerciseFilters => ({ q: '', group: null, equipment: null })

/** "Supino Inclinado" → "supino inclinado" (sem acento, para a busca achar "glúteo" digitando "gluteo"). */
export function normalizeText(s: string) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

export function filterExercises<T extends ExerciseLike>(list: T[], f: ExerciseFilters) {
  const terms = normalizeText(f.q).split(/\s+/).filter(Boolean)
  return list.filter((e) => {
    if (f.group && e.muscleGroup !== f.group) return false
    if (f.equipment && e.equipment !== f.equipment) return false
    if (!terms.length) return true
    const hay = normalizeText(`${e.name} ${LABELS.muscleGroup[e.muscleGroup]} ${LABELS.equipment[e.equipment]}`)
    return terms.every((t) => hay.includes(t))
  })
}

/** Quantos exercícios por grupo muscular (para os chips de filtro). */
export function countByGroup(list: ExerciseLike[]) {
  const out = {} as Partial<Record<MuscleGroup, number>>
  for (const e of list) out[e.muscleGroup] = (out[e.muscleGroup] ?? 0) + 1
  return out
}

/* ── formulário ─────────────────────────────────────── */

export interface ExerciseForm {
  name: string
  muscleGroup: MuscleGroup
  equipment: Equipment
  level: TrainingLevel
  instructions: string
  /** uma URL de imagem/GIF por linha */
  images: string
  videoUrl: string
}

export const emptyExerciseForm = (): ExerciseForm => ({
  name: '',
  muscleGroup: 'peito',
  equipment: 'halteres',
  level: 'iniciante',
  instructions: '',
  images: '',
  videoUrl: '',
})

export function exerciseToForm(e: ExerciseLike): ExerciseForm {
  return {
    name: e.name,
    muscleGroup: e.muscleGroup,
    equipment: e.equipment,
    level: e.level,
    instructions: e.instructions ?? '',
    images: e.images.join('\n'),
    videoUrl: e.videoUrl ?? '',
  }
}

export function exerciseFormToPayload(f: ExerciseForm) {
  return {
    name: f.name.trim(),
    muscleGroup: f.muscleGroup,
    equipment: f.equipment,
    level: f.level,
    instructions: f.instructions.trim() || null,
    images: f.images
      .split(/\s*\n\s*/)
      .map((s) => s.trim())
      .filter(Boolean),
    videoUrl: f.videoUrl.trim() || null,
  }
}

export const MUSCLE_GROUP_OPTIONS = MUSCLE_GROUPS.map((value) => ({ value, label: LABELS.muscleGroup[value] }))
export const EQUIPMENT_OPTIONS = EQUIPMENTS.map((value) => ({ value, label: LABELS.equipment[value] }))
export const LEVEL_OPTIONS = TRAINING_LEVELS.map((value) => ({ value, label: LABELS.trainingLevel[value] }))
export const GOAL_OPTIONS = TRAINING_GOALS.map((value) => ({ value, label: LABELS.trainingGoal[value] }))
