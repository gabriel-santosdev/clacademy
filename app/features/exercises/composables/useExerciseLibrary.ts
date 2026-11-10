import type { ExerciseLike } from '../domain/exercise'

/**
 * Banco de exercícios com busca e filtros. Compartilhado entre a página do
 * banco e o seletor do editor de fichas (mesma chave = uma busca só).
 */
export function useExerciseLibrary(opts: { lazy?: boolean } = {}) {
  const query = useFetch<ExerciseLike[]>('/api/coach/exercises', {
    key: 'coach-exercises',
    default: () => [],
    immediate: !opts.lazy,
  })
  const filters = reactive(emptyExerciseFilters())
  const list = computed(() => filterExercises(query.data.value, filters))
  const counts = computed(() => countByGroup(query.data.value))
  const clearFilters = () => Object.assign(filters, emptyExerciseFilters())
  /** Carrega só se ainda não carregou (seletor abre sob demanda). */
  const ensure = () => (query.data.value.length ? Promise.resolve() : query.refresh())
  return withAsync(query, { filters, list, counts, clearFilters, ensure })
}

/** Criar / editar / arquivar exercício (diálogo). */
export function useExerciseEditor(onSaved: () => unknown) {
  const visible = ref(false)
  const editingId = ref<number | null>(null)
  const form = reactive(emptyExerciseForm())

  function open(ex?: ExerciseLike) {
    editingId.value = ex?.id ?? null
    Object.assign(form, ex ? exerciseToForm(ex) : emptyExerciseForm())
    visible.value = true
  }

  const notify = useNotify()
  const save = useAction(async () => {
    const body = exerciseFormToPayload(form)
    if (editingId.value) {
      await exercisesApi.update(editingId.value, body)
      visible.value = false
      notify.success('Exercício salvo')
    } else {
      // continua aberto, já em modo edição, para enviar o vídeo na sequência
      const ex = await exercisesApi.create(body)
      if (!ex) throw new Error('Não foi possível criar o exercício.')
      editingId.value = ex.id
      notify.success('Exercício criado!', 'Agora envie o vídeo da execução.')
    }
    await onSaved()
  })

  /** Depois de enviar/vincular vídeo: o formulário passa a refletir o que ficou salvo. */
  function syncMedia(ex: Pick<ExerciseLike, 'videoUrl' | 'images'> | undefined) {
    if (!ex) return
    form.videoUrl = ex.videoUrl ?? ''
    form.images = ex.images.join(String.fromCharCode(10))
  }

  const archive = useAction(async () => {
    if (!editingId.value) return
    await exercisesApi.archive(editingId.value)
    visible.value = false
    onSaved()
  }, 'Exercício removido do banco')

  return { visible, editingId, form, open, save, archive, syncMedia }
}
