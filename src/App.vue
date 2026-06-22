<script setup lang="ts">
import ComingSoonScreen from './components/ComingSoonScreen.vue'

// ── Tela de marketing ativa ──
// Para desativar e voltar ao site completo, mude para: const showComingSoon = false
const showComingSoon = false

// ── Tema ativo ──
// 'default' = tema padrão | 'brasil' = tema Jornal + Copa do Brasil
// Para ativar o tema Brasil, mude para: const activeTheme = 'brasil'
const activeTheme: 'default' | 'brasil' = 'brasil'

// ── Imports do site completo (mantidos para quando voltar) ──
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import AulasSection from './components/AulasSection.vue'
import IngressosSection from './components/IngressosSection.vue'
import SobreSection from './components/SobreSection.vue'
import PatrocinadoresSection from './components/PatrocinadoresSection.vue'
import FooterSection from './components/FooterSection.vue'
import { useTheme } from './composables/useTheme'
import { onMounted } from 'vue'

useTheme(activeTheme)

onMounted(() => {
  const targets = document.querySelectorAll<HTMLElement>(
    '.section-title, .section-subtitle, .aula-card, .em-breve-card, .sobre__inner'
  )

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          el.classList.add('visible')
          observer.unobserve(el)
        }
      })
    },
    { threshold: 0.12 }
  )

  targets.forEach((el) => {
    el.classList.add('reveal')
    // Escalonamento progressivo para cards no mesmo container
    const isCard = el.classList.contains('aula-card') || el.classList.contains('em-breve-card')
    if (isCard) {
      const siblings = Array.from(
        el.parentElement?.querySelectorAll<HTMLElement>('.aula-card, .em-breve-card') ?? []
      )
      const idx = siblings.indexOf(el)
      if (idx > 0) el.style.transitionDelay = `${idx * 0.1}s`
    }
    observer.observe(el)
  })
})
</script>

<template>
  <!-- Tela de marketing "VEM AÍ" -->
  <ComingSoonScreen v-if="showComingSoon" />

  <!-- Site completo (exibido quando showComingSoon = false) -->
  <template v-else>
    <!-- Masthead Copa Brasil — visível apenas no tema Copa Brasil -->
    <div class="brasil-masthead">
      <div class="brasil-masthead__tricolor">
        <span></span><span></span><span></span>
      </div>
      <div class="brasil-masthead__body">
        <span class="brasil-masthead__stars">★ ★ ★ ★ ★</span>
        <span class="brasil-masthead__copa">Copa do Mundo FIFA · 2026</span>
        <span class="brasil-masthead__title">BRASIL</span>
        <span class="brasil-masthead__club">CL Academy</span>
      </div>
    </div>

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

/* ── Masthead Copa Brasil ─────────────────────────────── */
.brasil-masthead {
  display: none;
  flex-direction: column;
  background: #002776;
}

/* Faixa tricolor topo — fina, elegante */
.brasil-masthead__tricolor {
  display: flex;
  height: 4px;
  width: 100%;
}

.brasil-masthead__tricolor span {
  flex: 1;
}

.brasil-masthead__tricolor span:nth-child(1) { background: #009C3B; }
.brasil-masthead__tricolor span:nth-child(2) { background: #FFDF00; }
.brasil-masthead__tricolor span:nth-child(3) { background: #002776; border-top: 4px solid #fff; }

.brasil-masthead__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px 36px;
  gap: 6px;
}

.brasil-masthead__stars {
  font-size: 0.85rem;
  letter-spacing: 12px;
  color: rgba(255, 223, 0, 0.7);
  line-height: 1;
}

.brasil-masthead__copa {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.58rem;
  font-weight: 500;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 4px;
}

.brasil-masthead__title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(3rem, 11vw, 6.5rem);
  font-weight: 900;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #ffffff;
  line-height: 1;
  margin-top: 2px;
}

.brasil-masthead__club {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.68rem;
  font-weight: 400;
  letter-spacing: 0.55em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 2px;
}

/* Quando tema brasil está ativo */
[data-theme="brasil"] .brasil-masthead {
  display: flex;
}
</style>
