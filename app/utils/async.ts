const PROMISE_KEYS = new Set(['then', 'catch', 'finally'])

/**
 * Junta um useFetch/useAsyncData com campos extras do caso de uso,
 * mantendo o padrão do Nuxt: dá para usar com ou sem `await`.
 *
 *   const { data, form, save } = await useProfile()
 */
export function withAsync<Q extends PromiseLike<unknown>, E extends object>(
  query: Q,
  extras: E,
): Promise<Awaited<Q> & E> & Awaited<Q> & E {
  // O Nuxt 4 expõe then/catch/finally como props próprias da promise do useFetch;
  // copiá-las sobrescreveria a nossa promise (o await devolveria o objeto sem os extras).
  const fields = Object.fromEntries(Object.entries(query).filter(([k]) => !PROMISE_KEYS.has(k)))
  const result = Object.assign(fields, extras) as unknown as Awaited<Q> & E
  const promise = Promise.resolve(query).then(() => result)
  return Object.assign(promise, result)
}
