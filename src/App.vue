<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import AulasSection from './components/AulasSection.vue'
import IngressosSection from './components/IngressosSection.vue'
import SobreSection from './components/SobreSection.vue'
import PatrocinadoresSection from './components/PatrocinadoresSection.vue'
import FooterSection from './components/FooterSection.vue'
</script>

<template>
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
