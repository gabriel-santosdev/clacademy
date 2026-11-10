import type { Ref } from 'vue'

/** Cópia de um ref que só atualiza após `ms` sem mudanças (busca enquanto digita). */
export function useDebouncedRef<T>(source: Ref<T>, ms = 300) {
  const out = ref(source.value) as Ref<T>
  let t: ReturnType<typeof setTimeout> | undefined
  watch(source, (v) => {
    clearTimeout(t)
    t = setTimeout(() => (out.value = v), ms)
  })
  onScopeDispose(() => clearTimeout(t))
  return out
}
