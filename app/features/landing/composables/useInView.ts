import type { Ref } from 'vue'

/**
 * Diz se o elemento está na tela. Com `once`, vira true na primeira vez e para de observar.
 * No servidor (e sem IntersectionObserver) fica false, então animações só começam no cliente.
 */
export function useInView(target: Ref<HTMLElement | null | undefined>, { once = false, threshold = 0.25 } = {}) {
  const inView = ref(false)
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    if (!target.value || !('IntersectionObserver' in window)) {
      inView.value = true
      return
    }
    observer = new IntersectionObserver(
      ([entry]) => {
        inView.value = !!entry?.isIntersecting
        if (inView.value && once) observer?.disconnect()
      },
      { threshold },
    )
    observer.observe(target.value)
  })
  onBeforeUnmount(() => observer?.disconnect())

  return inView
}

export function prefersReducedMotion() {
  return import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
