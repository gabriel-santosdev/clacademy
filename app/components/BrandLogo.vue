<script setup lang="ts">
/**
 * Logo vetorial da CL Academy (public/brand/*.svg), pintado com currentColor via mask.
 * - full: "CL academy."   - mark: só o monograma CL
 * - bold: corte óptico mais encorpado, para tamanhos pequenos (navbar, rodapé)
 */
withDefaults(defineProps<{ variant?: 'full' | 'mark'; bold?: boolean }>(), { variant: 'full', bold: false })
</script>

<template>
  <span class="brand-logo" :class="[`brand-logo--${variant}`, { 'brand-logo--bold': bold }]" role="img" aria-label="CL Academy" />
</template>

<style scoped>
.brand-logo {
  --src: url('/brand/cl-academy.svg');
  display: inline-block;
  height: 1em;
  aspect-ratio: 2768 / 1504;
  background: currentColor;
  -webkit-mask: var(--src) center / contain no-repeat;
  mask: var(--src) center / contain no-repeat;
}
.brand-logo--bold { --src: url('/brand/cl-academy-bold.svg'); }
.brand-logo--mark { --src: url('/brand/cl-monogram.svg'); aspect-ratio: 1800 / 1564; }
</style>
