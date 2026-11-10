/** Regras da ficha de treino (montagem e conversão para a API). Puro. */

export interface ExerciseForm {
  name: string
  sets: number | null
  reps: string
  load: string
  restSeconds: number | null
  notes: string
  videoUrl: string
}

export interface WorkoutForm {
  title: string
  description: string
  tag: string
  items: ExerciseForm[]
}

interface WorkoutLike {
  title: string
  description: string | null
  tag: string | null
  items: {
    name: string
    sets: number | null
    reps: string | null
    load: string | null
    restSeconds: number | null
    notes: string | null
    videoUrl: string | null
  }[]
}

export const blankExercise = (): ExerciseForm => ({ name: '', sets: 3, reps: '12', load: '', restSeconds: 60, notes: '', videoUrl: '' })

export const emptyWorkoutForm = (): WorkoutForm => ({ title: '', description: '', tag: '', items: [blankExercise()] })

export function workoutToForm(w: WorkoutLike): WorkoutForm {
  return {
    title: w.title,
    description: w.description ?? '',
    tag: w.tag ?? '',
    items: w.items.map((i) => ({
      name: i.name,
      sets: i.sets,
      reps: i.reps ?? '',
      load: i.load ?? '',
      restSeconds: i.restSeconds,
      notes: i.notes ?? '',
      videoUrl: i.videoUrl ?? '',
    })),
  }
}

/** Remove exercícios sem nome e converte vazios em null. */
export function workoutFormToPayload(form: WorkoutForm) {
  return {
    title: form.title,
    description: form.description || null,
    tag: form.tag || null,
    items: form.items
      .filter((i) => i.name.trim())
      .map((i) => ({ ...i, reps: i.reps || null, load: i.load || null, notes: i.notes || null, videoUrl: i.videoUrl || null })),
  }
}

/** Move um item da lista uma posição para cima (-1) ou para baixo (+1). */
export function moveItem<T>(list: T[], index: number, delta: -1 | 1) {
  const j = index + delta
  if (j < 0 || j >= list.length) return
  const [it] = list.splice(index, 1)
  list.splice(j, 0, it!)
}
