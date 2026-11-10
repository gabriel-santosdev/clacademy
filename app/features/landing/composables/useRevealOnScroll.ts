/**
 * Animação de entrada ao rolar: elementos com [data-reveal] aparecem suavemente.
 * data-reveal="2" atrasa a entrada (passos de 90ms); data-reveal-from="left|right|scale" muda a direção.
 * Sem JS (SSR) o conteúdo fica visível: a classe só é aplicada no cliente.
 */
export function useRevealOnScroll(selector = '[data-reveal]') {
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) return
    const targets = document.querySelectorAll<HTMLElement>(selector)
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    targets.forEach((el) => {
      // o que já está na tela ao carregar não pisca
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) return
      el.classList.add('reveal')
      if (el.dataset.revealFrom) el.classList.add(`reveal--${el.dataset.revealFrom}`)
      const delay = el.dataset.reveal
      if (delay) el.style.transitionDelay = `${Number(delay) * 90}ms`
      observer!.observe(el)
    })
  })

  onBeforeUnmount(() => observer?.disconnect())
}
