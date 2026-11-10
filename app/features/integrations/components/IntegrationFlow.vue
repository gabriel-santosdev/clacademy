<script setup lang="ts">
/** Diagrama animado: relógio → Strava → CL Academy (o treino "viaja" até o app). */
defineProps<{ live?: boolean }>()
</script>

<template>
  <div class="flow" :class="{ 'flow--live': live }" aria-hidden="true">
    <span class="flow__node"><span class="flow__box"><i class="pi pi-stopwatch" /></span><small>Relógio</small></span>
    <span class="flow__wire"><i /><i /></span>
    <span class="flow__node"><span class="flow__box flow__box--strava">S</span><small>Strava</small></span>
    <span class="flow__wire"><i /><i /></span>
    <span class="flow__node"><span class="flow__box flow__box--cl"><BrandLogo variant="mark" bold /></span><small>CL Academy</small></span>
  </div>
</template>

<style scoped>
.flow { display: flex; align-items: flex-start; gap: 6px; }
.flow__node { display: flex; flex-direction: column; align-items: center; gap: 6px; flex-shrink: 0; }
.flow__box {
  width: 48px; height: 48px; border-radius: 16px; display: grid; place-items: center;
  background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.12); color: var(--cl-bone);
}
.flow__box .pi { font-size: 1.15rem; }
.flow__box--strava { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; background: #fc4c02; border-color: #fc4c02; color: #fff; }
.flow__box--cl { background: var(--cl-hi); border-color: var(--cl-hi); color: var(--cl-hi-ink); }
.flow__box--cl .brand-logo { font-size: 26px; }
.flow__node small { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.04em; color: #a6a6a6; white-space: nowrap; }

/* fio com dois pulsos que viajam da esquerda para a direita */
.flow__wire { position: relative; flex: 1; min-width: 24px; height: 6px; margin-top: 21px; background: repeating-linear-gradient(90deg, #4a4a4a 0 4px, transparent 4px 8px) center / 100% 2px no-repeat; overflow: hidden; }
.flow__wire i { position: absolute; top: 0; left: 0; width: 6px; height: 6px; border-radius: 50%; background: var(--cl-hi); opacity: 0; animation: travel 2.4s var(--ease-out) infinite; }
.flow__wire i:last-child { animation-delay: 1.2s; }
.flow__wire + .flow__node + .flow__wire i { animation-delay: 0.6s; }
.flow__wire + .flow__node + .flow__wire i:last-child { animation-delay: 1.8s; }
.flow--live .flow__box--cl { animation: glow 2.4s ease-out infinite 1.4s; }
@keyframes travel {
  0% { transform: translateX(0); opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { transform: translateX(100cqw); opacity: 0; }
}
.flow__wire { container-type: inline-size; }
@keyframes glow { 0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.5); } 100% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); } }
@media (prefers-reduced-motion: reduce) { .flow__wire i { display: none; } }
</style>
