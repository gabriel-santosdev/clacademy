<template>
  <section id="ingressos" class="ingressos">
    <div class="container">
      <h2 class="section-title">Próximas Atividades e Ingressos</h2>
      <p class="section-subtitle">
        Garanta sua vaga para nossas próximas sessões e eventos especiais.
      </p>

      <div class="ingressos__center">
        <div class="em-breve-card">
          <span class="em-breve__eyebrow">em breve</span>
          <p class="em-breve__title">Nosso próximo evento está a caminho</p>
          <p class="em-breve__text">Estamos preparando algo incrível para você. Fique de olho nas nossas redes sociais e aguarde o anúncio em breve!</p>
          <span class="em-breve__badge">Aguarde ✨</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
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

/* ── Card em breve ───────────────────────────────── */
.em-breve-card {
  width: 100%;
  max-width: 480px;
  background: var(--white);
  border: 2px dashed var(--border);
  border-radius: 20px;
  padding: 52px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 14px;
}

.em-breve__eyebrow {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--text-muted);
}

.em-breve__title {
  font-family: var(--font-heading);
  font-size: clamp(1.3rem, 3vw, 1.7rem);
  color: var(--text-dark);
  line-height: 1.25;
  margin: 0;
}

.em-breve__text {
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.65;
  max-width: 340px;
  margin: 0;
}

.em-breve__badge {
  display: inline-block;
  background: var(--bg-warm);
  color: var(--dark);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 8px 24px;
  border-radius: 50px;
  margin-top: 4px;
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

  .em-breve-card {
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

  .em-breve-card {
    border-radius: 12px;
    padding: 36px 20px;
  }
}
</style>