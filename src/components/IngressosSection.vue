<template>
  <section id="ingressos" class="ingressos">
    <div class="container">
      <h2 class="section-title">Próximas Atividades e Ingressos</h2>
      <p class="section-subtitle">
        Garanta sua vaga para nossas próximas sessões e eventos especiais.
      </p>

      <div class="ingressos__center">
        <a
          href="https://www.sympla.com.br/evento/cl-run-3-edicao/3454831?share_id=copiarlink"
          target="_blank"
          rel="noopener noreferrer"
          class="clrun-card"
        >
          <img :src="clrunLogo" alt="CL Run 3ª Edição" class="clrun-card__logo" />
          <span class="clrun-card__cta">Comprar Ingresso →</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import clrunLogo from '../assets/clrun_logo.png'
</script>

<style scoped>
/* ── Seção ───────────────────────────────────────── */
.ingressos {
  padding: 96px 0;
  background: var(--bg-light);
}

/* ── Centralização ───────────────────────────────── */
.ingressos__center {
  display: flex;
  justify-content: center;
  margin-top: 48px;
  padding: 0 16px;
}

/* ── Card CL Run ─────────────────────────────────── */
.clrun-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-decoration: none;
  background: var(--white);
  border: 2px solid var(--border);
  border-radius: 20px;
  padding: 40px 48px;
  max-width: 480px;
  width: 100%;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
}

.clrun-card:hover {
  border-color: var(--dark);
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
  transform: translateY(-4px);
}

.clrun-card__logo {
  width: 100%;
  max-width: 320px;
  height: auto;
  display: block;
}

.clrun-card__cta {
  display: inline-block;
  background: var(--dark);
  color: var(--white);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 12px 32px;
  border-radius: 50px;
  transition: opacity 0.2s;
}

.clrun-card:hover .clrun-card__cta {
  opacity: 0.85;
}

/* ── Responsivo ──────────────────────────────────── */
@media (max-width: 768px) {
  .ingressos {
    padding: 72px 0;
  }

  .ingressos__center {
    margin-top: 36px;
    padding: 0 12px;
  }

  .clrun-card {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .ingressos {
    padding: 56px 0;
  }

  .ingressos__center {
    margin-top: 28px;
    padding: 0;
  }

  .clrun-card {
    border-radius: 12px;
    padding: 28px 20px;
  }
}
</style>