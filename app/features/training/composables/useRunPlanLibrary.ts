/** Biblioteca de planilhas de corrida. Use com await. */
export function useRunPlanLibrary() {
  return useFetch('/api/coach/run-plans', { key: 'coach-run-plans', default: () => [] })
}
