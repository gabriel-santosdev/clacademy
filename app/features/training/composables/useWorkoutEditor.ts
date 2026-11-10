import type { ExerciseLike } from '~/features/exercises/domain/exercise'
import type { ExerciseForm } from '../domain/workout'

/** Criar/editar ficha de treino. `param` é o id da rota ou 'novo'. */
export function useWorkoutEditor(param: string) {
  const isNew = param === 'novo'
  const id = isNew ? 0 : Number(param)
  const route = useRoute()
  const form = reactive(emptyWorkoutForm())
  const saved = ref(workoutSnapshot(form))
  const dirty = computed(() => workoutSnapshot(form) !== saved.value)

  async function load() {
    if (isNew) return
    const w = await trainingApi.getWorkout(id).catch(() => null)
    if (!w) throw createError({ statusCode: 404, statusMessage: 'Treino não encontrado' })
    Object.assign(form, workoutToForm(w))
    saved.value = workoutSnapshot(form)
  }

  /** `assign`: depois de salvar, abrir a atribuição (ficha nova volta com ?enviar=1). */
  const save = useAction(async (opts: { assign?: boolean } = {}) => {
    if (!form.title.trim()) throw new Error('Dê um nome ao treino antes de salvar.')
    if (!form.items.some((i) => i.name.trim())) throw new Error('Adicione pelo menos um exercício.')
    const body = workoutFormToPayload(form)
    if (isNew) {
      const w = await trainingApi.createWorkout(body)
      saved.value = workoutSnapshot(form)
      const query = { ...route.query, ...(opts.assign ? { enviar: '1' } : {}) }
      await navigateTo({ path: `/app/professor/treinos/${w!.id}`, query }, { replace: true })
    } else {
      await trainingApi.updateWorkout(id, body)
      saved.value = workoutSnapshot(form)
    }
    return true
  }, 'Treino salvo')

  const remove = useAction(async () => {
    await trainingApi.deleteWorkout(id)
    saved.value = workoutSnapshot(form)
    await navigateTo('/app/professor/treinos')
  }, 'Treino excluído')

  const summary = computed(() => ({
    count: form.items.length,
    minutes: estimateMinutes(form.items),
    groups: groupsWorked(form.items),
  }))
  const inWorkout = computed(() => new Set(form.items.map((i) => i.exerciseId).filter(Boolean)))

  return {
    isNew,
    id,
    form,
    dirty,
    summary,
    inWorkout,
    load,
    save,
    remove,
    addExercise: () => form.items.push(blankExercise()),
    addFromLibrary: (list: ExerciseLike[]) => form.items.push(...list.map(exerciseFromLibrary)),
    removeExercise: (i: number) => form.items.splice(i, 1),
    moveExercise: (i: number, d: -1 | 1) => moveItem(form.items, i, d),
    reorderExercise: (from: number, to: number) => reorder(form.items, from, to),
    duplicateExercise: (i: number) => duplicateItem(form.items, i),
    applyAll: (patch: Partial<Pick<ExerciseForm, 'sets' | 'reps' | 'restSeconds'>>) => applyToAll(form.items, patch),
  }
}
