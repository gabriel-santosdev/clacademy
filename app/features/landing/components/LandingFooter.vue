<script setup lang="ts">
const props = defineProps<{ instagram: string; whatsapp?: string | null }>()
const wa = computed(() => whatsappUrl(props.whatsapp))
const year = new Date().getFullYear()
</script>

<template>
  <footer class="foot">
    <div class="lp-container foot__grid">
      <div class="foot__brand">
        <BrandLogo bold class="foot__logo" />
        <p>Personal trainer e assessoria de corrida. E um app que acompanha cada treino.</p>
        <div class="foot__social">
          <a :href="`https://instagram.com/${instagram}`" target="_blank" rel="noopener" aria-label="Instagram"><i class="pi pi-instagram" /></a>
          <a v-if="wa" :href="wa" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="pi pi-whatsapp" /></a>
        </div>
      </div>
      <nav class="foot__col" aria-label="Site">
        <strong>Site</strong>
        <a v-for="l in LANDING.nav" :key="l.href" :href="l.href">{{ l.label }}</a>
      </nav>
      <nav class="foot__col" aria-label="App">
        <strong>App</strong>
        <NuxtLink to="/login">Entrar</NuxtLink>
        <NuxtLink to="/cadastro">Criar conta</NuxtLink>
        <a href="#instalar">Instalar o app</a>
      </nav>
    </div>
    <div class="lp-container foot__bottom">
      <span>© {{ year }} CL Academy. Todos os direitos reservados.</span>
      <a href="https://www.instagram.com/gabrielsantos.tec/" target="_blank" rel="noopener" class="foot__dev">
        Desenvolvido por <img src="~/assets/gabriel.png" alt="Gabriel Santos" />
      </a>
    </div>
  </footer>
</template>

<style scoped>
.foot { background: #171717; color: #a8a7a4; padding-top: 72px; }
.foot__grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; padding-bottom: 48px; }
.foot__logo { font-size: 64px; color: var(--bone); margin: -6px 0 14px -4px; }
.foot__brand p { max-width: 340px; font-size: 0.92rem; line-height: 1.6; }
.foot__social { display: flex; gap: 10px; margin-top: 20px; }
.foot__social a {
  width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center;
  border: 1px solid var(--ink-line); color: var(--bone); transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.foot__social a:hover { background: var(--volt); color: var(--volt-ink); border-color: var(--volt); }
.foot__col { display: flex; flex-direction: column; gap: 10px; font-size: 0.92rem; }
.foot__col strong { color: var(--bone); font-family: var(--f-display); font-size: 1rem; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 4px; }
.foot__col a { width: fit-content; transition: color 0.2s; }
.foot__col a:hover { color: var(--volt); }
.foot__bottom {
  display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;
  padding-top: 22px; padding-bottom: calc(22px + env(safe-area-inset-bottom)); border-top: 1px solid var(--ink-line); font-size: 0.8rem;
}
.foot__dev { display: inline-flex; align-items: center; gap: 10px; opacity: 0.75; transition: opacity 0.2s; }
.foot__dev:hover { opacity: 1; }
.foot__dev img { height: 22px; width: auto; }
@media (max-width: 760px) {
  .foot__grid { grid-template-columns: 1fr 1fr; }
  .foot__brand { grid-column: 1 / -1; }
  .foot { padding-bottom: 72px; }
}
</style>
