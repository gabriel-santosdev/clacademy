<script setup lang="ts">
import ComingSoonScreen from './components/ComingSoonScreen.vue'

// ── Tela de marketing ativa ──
// Para desativar e voltar ao site completo, mude para: const showComingSoon = false
const showComingSoon = false

// ── Imports do site completo (mantidos para quando voltar) ──
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import AulasSection from './components/AulasSection.vue'
import IngressosSection from './components/IngressosSection.vue'
import SobreSection from './components/SobreSection.vue'
import PatrocinadoresSection from './components/PatrocinadoresSection.vue'
import FooterSection from './components/FooterSection.vue'
</script>

<template>
  <!-- Tela de marketing "VEM AÍ" -->
  <ComingSoonScreen v-if="showComingSoon" />

  <!-- Site completo (exibido quando showComingSoon = false) -->
  <template v-else>
    <NavBar />
    <main class="main-wrap">
      <HeroSection />
      <AulasSection />
      <IngressosSection />
      <SobreSection />
      <PatrocinadoresSection />
    </main>
    <FooterSection />
  </template>
</template>

<style>
.main-wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

@media (max-width: 480px) {
  .main-wrap {
    padding: 0 16px;
  }
}
</style>
