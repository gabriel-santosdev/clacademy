/** Criar/editar ficha de treino. `param` é o id da rota ou 'novo'. */
export function useWorkoutEditor(param: string) {
  const isNew = param === 'novo'
  const id = isNew ? 0 : Number(param)
  const form = reactive(emptyWorkoutForm())

  async function load() {
    if (isNew) return
    const w = await trainingApi.getWorkout(id).catch(() => null)
    if (!w) throw createError({ statusCode: 404, statusMessage: 'Treino não encontrado' })
    Object.assign(form, workoutToForm(w))
  }

  const save = useAction(async () => {
    const body = workoutFormToPayload(form)
    if (isNew) {
      const w = await trainingApi.createWorkout(body)
      await navigateTo(`/app/professor/treinos/${w!.id}`, { replace: true })
    } else {
      await trainingApi.updateWorkout(id, body)
    }
  }, 'Treino salvo')

  const remove = useAction(async () => {
    await trainingApi.deleteWorkout(id)
    await navigateTo('/app/professor/treinos')
  }, 'Treino excluído')

  return {
    isNew,
    id,
    form,
    load,
    save,
    remove,
    addExercise: () => form.items.push(blankExercise()),
    removeExercise: (i: number) => form.items.splice(i, 1),
    moveExercise: (i: number, d: -1 | 1) => moveItem(form.items, i, d),
  }
}
