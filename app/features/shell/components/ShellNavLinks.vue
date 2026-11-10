<script setup lang="ts">
import type { NavSection } from '../domain/navigation'

const props = defineProps<{ sections: NavSection[]; path: string }>()
const active = computed(() => activeNavTarget(props.sections, props.path))
</script>

<template>
  <nav class="nav">
    <div v-for="(section, i) in sections" :key="i" class="nav__section">
      <span v-if="section.title" class="nav__title">{{ section.title }}</span>
      <NuxtLink
        v-for="item in section.items"
        :key="item.to"
        :to="item.to"
        class="nav__link"
        :class="{ active: item.to === active }"
        :aria-current="item.to === active ? 'page' : undefined"
      >
        <i :class="['pi', item.icon]" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
/* Herda a cor do container: na sidebar escura fica claro, no drawer segue o tema */
.nav { flex: 1; overflow-y: auto; padding: 4px 12px 12px; display: flex; flex-direction: column; gap: 22px; }
.nav__section { display: flex; flex-direction: column; gap: 2px; }
.nav__title { font-family: var(--font-display); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.55; padding: 0 14px 6px; }
.nav__link {
  position: relative; display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 999px;
  color: inherit; opacity: 0.72; font-weight: 600; font-size: 0.93rem; transition: background 0.25s, opacity 0.2s, color 0.25s, transform 0.15s var(--ease-out); -webkit-tap-highlight-color: transparent;
}
.nav__link .pi { font-size: 1rem; width: 18px; text-align: center; }
@media (hover: hover) { .nav__link:hover { opacity: 1; background: color-mix(in srgb, currentColor 8%, transparent); } }
.nav__link:active { transform: scale(0.98); }
.nav__link.active { opacity: 1; background: var(--nav-active-bg, var(--accent)); color: var(--nav-active-fg, var(--accent-ink)); font-weight: 800; }
</style>
