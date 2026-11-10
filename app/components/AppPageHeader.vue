<script setup lang="ts">
/** Cabeçalho padrão das páginas do app: eyebrow, título condensado, subtítulo, voltar e ações. */
const props = defineProps<{ title: string; subtitle?: string; back?: string; eyebrow?: string }>()

/* sem eyebrow explícito, usa a área atual do app (o aluno não tem rótulo de área) */
const route = useRoute()
const label = computed(() => {
  if (props.eyebrow) return props.eyebrow
  if (route.path.startsWith('/app/admin')) return 'Gestão'
  if (route.path.startsWith('/app/professor')) return 'Professor'
  return null
})
</script>

<template>
  <header class="page-header rise">
    <NuxtLink v-if="back" :to="back" class="page-header__back">
      <i class="pi pi-arrow-left" /> Voltar
    </NuxtLink>
    <div class="page-header__row">
      <div class="grow">
        <p v-if="label" class="eyebrow page-header__eyebrow"><span />{{ label }}</p>
        <h1 class="h1">{{ title }}</h1>
        <p v-if="subtitle" class="muted page-header__sub">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.default" class="page-header__actions"><slot /></div>
    </div>
  </header>
</template>

<style scoped>
.page-header { display: flex; flex-direction: column; gap: 10px; margin-bottom: 26px; }
.page-header__back {
  display: inline-flex; align-items: center; gap: 8px; width: fit-content; padding: 6px 12px 6px 10px; border-radius: 999px;
  border: 1px solid var(--app-border); background: var(--app-tile); font-size: 0.82rem; font-weight: 700; color: var(--app-text);
}
.page-header__back:hover { border-color: var(--app-muted); }
.page-header__back .pi { font-size: 0.72rem; }
.page-header__row { display: flex; align-items: flex-end; gap: 12px; flex-wrap: wrap; }
.page-header__eyebrow { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.page-header__eyebrow span { width: 10px; height: 10px; border-radius: 3px; background: var(--cl-volt); box-shadow: 0 0 0 2px var(--app-text); }
.page-header__sub { margin-top: 8px; font-size: 0.98rem; max-width: 620px; }
.page-header__actions { display: flex; gap: 8px; flex-wrap: wrap; }
</style>
