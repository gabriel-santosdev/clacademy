<template>
  <header class="navbar">
    <div class="container navbar__inner">
      <a href="#" class="navbar__logo">
        <img src="../assets/cl_academy_logo.png" alt="CL Academy" class="navbar__logo-img" />
      </a>

      <nav class="navbar__nav">
        <a href="#inicio">Início</a>
        <a href="#aulas">Aulas</a>
        <a href="#ingressos">Ingressos</a>
        <a href="#sobre">Sobre Mim</a>
        <a href="#patrocinadores">Patrocinadores</a>
      </nav>

      <a href="https://www.sympla.com.br/evento/cl-academy-1/3340142" target="_blank" rel="noopener"
        class="btn-cta">Comprar Ingresso</a>

      <button class="navbar__hamburger" @click="menuOpen = !menuOpen" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>

    <div class="navbar__mobile" :class="{ open: menuOpen }">
      <a href="#inicio" @click="menuOpen = false">Início</a>
      <a href="#aulas" @click="menuOpen = false">Aulas</a>
      <a href="#ingressos" @click="menuOpen = false">Ingressos</a>
      <a href="#sobre" @click="menuOpen = false">Sobre Mim</a>
      <a href="#patrocinadores" @click="menuOpen = false">Patrocinadores</a>
      <a href="https://www.sympla.com.br/evento/cl-academy-1/3340142" target="_blank" rel="noopener" class="btn-cta"
        @click="menuOpen = false">Comprar Ingresso</a>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const menuOpen = ref(false)
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--white);
  border-bottom: 1px solid var(--border);
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  gap: 32px;
}

.navbar__logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.navbar__logo-img {
  height: 140px;
  width: 200px;
  object-fit: contain;
  display: block;
}

.navbar__logo-icon {
  color: var(--accent);
  font-size: 1.3rem;
}

.navbar__nav {
  display: flex;
  gap: 28px;
  flex: 1;
  justify-content: center;
}

.navbar__nav a {
  font-family: var(--font-body);
  font-size: 0.88rem;
  color: var(--text-dark);
  transition: color 0.2s;
  font-weight: 500;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.navbar__nav a:hover {
  color: var(--accent-dark);
}

.btn-cta {
  background: var(--accent);
  color: #fff;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.82rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 10px 20px;
  border-radius: 50px;
  white-space: nowrap;
  transition: background 0.2s;
}

.btn-cta:hover {
  background: var(--accent-dark);
}

.navbar__hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  padding: 4px;
}

.navbar__hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text-dark);
  border-radius: 2px;
}

.navbar__mobile {
  display: none;
  flex-direction: column;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
  background: #fff;
}

.navbar__mobile a {
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 0;
  color: var(--text-dark);
  border-bottom: 1px solid var(--border);
}

.navbar__mobile a:last-child {
  border-bottom: none;
}

.navbar__mobile .btn-cta {
  text-align: center;
  margin-top: 8px;
  border-bottom: none;
}

@media (max-width: 1024px) {
  .navbar__nav {
    gap: 18px;
  }
}

@media (max-width: 768px) {
  .navbar__nav {
    display: none;
  }

  .navbar__hamburger {
    display: flex;
  }

  .navbar__inner .btn-cta {
    display: none;
  }

  .navbar__mobile.open {
    display: flex;
  }
}

@media (max-width: 480px) {
  .navbar__inner {
    height: 56px;
    gap: 16px;
  }

  .navbar__logo-text {
    font-size: 1rem;
  }
}
</style>
