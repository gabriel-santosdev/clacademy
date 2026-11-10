<script setup lang="ts">
/** Moldura de celular para os mockups do app (HTML/CSS). Medidas em em: escala com --phone-w. */
withDefaults(defineProps<{ label: string; tab?: 'home' | 'run' | 'chart' | 'user' }>(), { tab: 'home' })
</script>

<template>
  <div class="phone" role="img" :aria-label="label">
    <div class="phone__island" />
    <div class="phone__screen">
      <div class="phone__status" aria-hidden="true">
        <span>6:42</span>
        <span class="phone__icons"><i class="pi pi-wifi" /><span class="phone__bat"><span /></span></span>
      </div>
      <div class="phone__body"><slot /></div>
      <nav class="phone__tabbar" aria-hidden="true">
        <i class="pi pi-home" :class="{ on: tab === 'home' }" />
        <i class="pi pi-map" :class="{ on: tab === 'run' }" />
        <i class="pi pi-chart-line" :class="{ on: tab === 'chart' }" />
        <i class="pi pi-user" :class="{ on: tab === 'user' }" />
      </nav>
    </div>
  </div>
</template>

<style scoped>
.phone {
  --w: var(--phone-w, min(290px, 74vw));
  position: relative; width: var(--w); aspect-ratio: 9 / 19.2; padding: 0.95em;
  font-size: calc(var(--w) * 0.0385); border-radius: 4.2em;
  background: linear-gradient(150deg, #3b3b3b, #121212 55%, #2b2b2b);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06) inset,
    0 0 0 0.18em #0b0b0b,
    0 3.5em 6em -1.6em rgba(20, 20, 20, 0.45),
    0 1.2em 2em -1em rgba(20, 20, 20, 0.3);
  user-select: none; -webkit-user-select: none;
}
.phone__island { position: absolute; z-index: 3; top: 1.75em; left: 50%; width: 7.4em; height: 2.1em; transform: translateX(-50%); border-radius: 2em; background: #000; }
.phone__screen {
  position: relative; height: 100%; overflow: hidden; border-radius: 3.3em;
  background: #f4f3f1; color: #1f1f1f; font-family: var(--f-body); line-height: 1.35;
}
.phone__status {
  position: absolute; z-index: 2; top: 1.15em; left: 2.3em; right: 2em;
  display: flex; justify-content: space-between; align-items: center; font-size: 0.95em; font-weight: 800;
}
.phone__icons { display: flex; align-items: center; gap: 0.4em; }
.phone__icons .pi { font-size: 0.8em; }
.phone__bat { width: 1.9em; height: 0.95em; border-radius: 0.3em; border: 0.12em solid currentColor; padding: 0.1em; }
.phone__bat span { display: block; width: 70%; height: 100%; border-radius: 0.12em; background: currentColor; }
.phone__body { position: absolute; inset: 3.8em 0 5em; overflow: hidden; padding: 0 1.25em; }
.phone__tabbar {
  position: absolute; left: 0; right: 0; bottom: 0; height: 5em; padding: 0 2.2em 0.9em;
  display: flex; justify-content: space-between; align-items: center; background: #fff; border-top: 1px solid #e6e4e0;
}
.phone__tabbar .pi { font-size: 1.3em; color: #b3b1ac; transition: color 0.3s; }
.phone__tabbar .pi.on { color: #1f1f1f; position: relative; }
.phone__tabbar .pi.on::after { content: ''; position: absolute; left: 50%; bottom: -0.55em; width: 0.35em; height: 0.35em; border-radius: 50%; background: var(--volt); transform: translateX(-50%); box-shadow: 0 0 0 0.12em #1f1f1f; }
</style>
