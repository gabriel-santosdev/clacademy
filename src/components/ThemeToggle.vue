<template>
  <button
    class="theme-toggle"
    :class="{ 'theme-toggle--brasil': theme === 'brasil' }"
    @click="toggle"
    :title="theme === 'brasil' ? 'Voltar ao tema padrão' : 'Ativar tema Copa Brasil'"
    aria-label="Alternar tema"
  >
    <span v-if="theme !== 'brasil'" class="theme-toggle__inner">
      <span class="theme-toggle__flag">🇧🇷</span>
      <span class="theme-toggle__label">Copa Brasil</span>
    </span>
    <span v-else class="theme-toggle__inner">
      <span class="theme-toggle__icon">←</span>
      <span class="theme-toggle__label">Tema Padrão</span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
const { theme, toggle } = useTheme()
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  bottom: 28px;
  right: 24px;
  z-index: 9999;
  display: flex;
  align-items: center;
  background: #002776;
  color: #fff;
  border: 2px solid #FFDF00;
  border-radius: 50px;
  padding: 10px 18px;
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(0, 39, 118, 0.35);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.theme-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 39, 118, 0.45);
}

.theme-toggle--brasil {
  background: #111;
  border-color: #888;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.theme-toggle--brasil:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
}

.theme-toggle__inner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-toggle__flag {
  font-size: 1.1rem;
  line-height: 1;
}

.theme-toggle__icon {
  font-size: 1rem;
  line-height: 1;
}

.theme-toggle__label {
  white-space: nowrap;
}

@media (max-width: 480px) {
  .theme-toggle {
    bottom: 16px;
    right: 16px;
    padding: 8px 14px;
    font-size: 0.72rem;
  }
}
</style>
