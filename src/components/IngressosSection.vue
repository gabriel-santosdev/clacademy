<template>
  <section id="ingressos" class="ingressos">
    <div class="container">
      <h2 class="section-title">Próximas Atividades e Ingressos</h2>
      <p class="section-subtitle">
        Garanta sua vaga para nossas próximas sessões e eventos especiais.
      </p>

      <div class="ingressos__grid">

        <!-- Card Em Breve – Esquerdo -->
        <div class="ingresso-card em-breve">
          <div class="em-breve__content">
            <span class="em-breve__icon">🗓️</span>
            <h3 class="em-breve__titulo">Em Breve</h3>
            <p class="em-breve__desc">Mais informações sobre novos eventos em breve. Fique ligado!</p>
          </div>
        </div>

        <!-- Card Destaque – Evento Real -->
        <div class="ingresso-card destaque">
          <div class="ingresso-card__badge">EVENTO ESPECIAL</div>

          <div class="ingresso-card__logo">
            <img src="../assets/cl_academy_logo.png" alt="CL Academy" />
          </div>

          <h3 class="ingresso-card__titulo">CL Academy</h3>
          <p class="ingresso-card__subtitulo">Onde o movimento vira experiência</p>

          <div class="ingresso-card__infos">
            <div class="ingresso-card__info-row">
              <span class="info-icon">📅</span>
              <span>Sábado, 28 de Março</span>
            </div>
            <div class="ingresso-card__info-row">
              <span class="info-icon">⏰</span>
              <span>Das 08:00 às 10:00hrs</span>
            </div>
            <div class="ingresso-card__info-row">
              <span class="info-icon">📍</span>
              <span>Arpoador Beach Arena</span>
            </div>
          </div>

          <div class="ingresso-card__atividades">
            <span>Funcional</span>
            <span>HIT</span>
            <span>Dança</span>
          </div>

          <a href="https://www.sympla.com.br/evento/cl-academy-1/3340142" target="_blank" rel="noopener"
            class="ingresso-card__btn">
            Comprar Ingresso
          </a>

          <p class="ingresso-card__credenciamento">
            Credenciamento às 07:30hrs
          </p>
        </div>

        <!-- Card Em Breve – Direito -->
        <div class="ingresso-card em-breve">
          <div class="em-breve__content">
            <span class="em-breve__icon">✨</span>
            <h3 class="em-breve__titulo">Em Breve</h3>
            <p class="em-breve__desc">Novidades e conteúdos exclusivos chegando. Acompanhe nossas redes!</p>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Dados movidos para o template para maior clareza visual
</script>

<style scoped>
.ingressos {
  padding: 80px 0;
  background: var(--bg-light);
}

.ingressos__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  align-items: center;
}

/* ── Cards Em Breve ──────────────────────────────── */
.ingresso-card {
  background: var(--white);
  border-radius: 14px;
  padding: 28px 24px;
  position: relative;
  border: 1px solid var(--border);
  transition: box-shadow 0.2s;
}

.ingresso-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.em-breve {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  border-style: dashed;
}

.em-breve__content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.em-breve__icon {
  font-size: 2rem;
  opacity: 0.4;
}

.em-breve__titulo {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.em-breve__desc {
  font-family: var(--font-body);
  font-size: 0.82rem;
  color: var(--sand);
  line-height: 1.6;
  max-width: 180px;
}

/* ── Card Destaque ───────────────────────────────── */
.ingresso-card.destaque {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(160, 133, 110, 0.4);
  padding: 36px 28px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0;
}

.ingresso-card__badge {
  position: absolute;
  top: -13px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--dark);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  padding: 4px 14px;
  border-radius: 50px;
  white-space: nowrap;
}

.ingresso-card__logo {
  width: 100px;
  margin-bottom: 16px;
  filter: brightness(0) invert(1);
  opacity: 0.9;
}

.ingresso-card__logo img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.ingresso-card__titulo {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
  color: #fff;
}

.ingresso-card__subtitulo {
  font-family: var(--font-script);
  font-size: 1rem;
  opacity: 0.85;
  margin-bottom: 24px;
}

.ingresso-card__infos {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.ingresso-card__info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  opacity: 0.92;
  justify-content: center;
}

.info-icon {
  font-size: 0.9rem;
}

.ingresso-card__atividades {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 24px;
}

.ingresso-card__atividades span {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 50px;
  padding: 4px 14px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.ingresso-card__btn {
  display: block;
  width: 100%;
  text-align: center;
  padding: 13px 0;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 700;
  background: var(--dark);
  color: #fff;
  letter-spacing: 0.03em;
  transition: background 0.2s;
  margin-bottom: 14px;
}

.ingresso-card__btn:hover {
  background: #111;
}

.ingresso-card__credenciamento {
  font-size: 0.78rem;
  opacity: 0.7;
  letter-spacing: 0.02em;
}

/* ── Responsive ─────────────────────────────────── */
@media (max-width: 900px) {
  .ingressos__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .ingresso-card.destaque {
    grid-column: span 2;
    transform: none;
  }
}

@media (max-width: 600px) {
  .ingressos {
    padding: 56px 0;
  }

  .ingressos__grid {
    grid-template-columns: 1fr;
  }

  .ingresso-card.destaque {
    grid-column: span 1;
    transform: none;
    box-shadow: 0 8px 24px rgba(160, 133, 110, 0.3);
  }

  .em-breve {
    min-height: 120px;
  }
}
</style>


<style scoped>
.ingressos {
  padding: 80px 0;
  background: var(--bg-light);
}

.ingressos__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  align-items: start;
}

.ingresso-card {
  background: var(--white);
  border-radius: 14px;
  padding: 28px 24px;
  position: relative;
  border: 1px solid var(--border);
  transition: box-shadow 0.2s;
}

.ingresso-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.ingresso-card.destaque {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(160, 133, 110, 0.35);
}

.ingresso-card__badge {
  position: absolute;
  top: -13px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--dark);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1.2px;
  padding: 4px 12px;
  border-radius: 50px;
}

.ingresso-card__header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.ingresso-card__icon {
  font-size: 1.2rem;
}

.ingresso-card__titulo {
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.ingresso-card__data {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  margin-bottom: 20px;
  opacity: 0.75;
}

.ingresso-card.destaque .ingresso-card__data {
  opacity: 0.9;
}

.ingresso-card__preco {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 20px;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.ingresso-card__periodo {
  font-size: 0.85rem;
  font-weight: 400;
  opacity: 0.8;
}

.ingresso-card__btn {
  display: block;
  width: 100%;
  text-align: center;
  padding: 13px 0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  background: var(--dark);
  color: #fff;
  transition: background 0.2s, color 0.2s;
}

.ingresso-card__btn:hover {
  background: #333;
}

.ingresso-card.destaque .ingresso-card__btn {
  background: var(--dark);
  color: #fff;
}

.ingresso-card.destaque .ingresso-card__btn:hover {
  background: #222;
}

.ingresso-card__btn.btn-outline {
  background: transparent;
  border: 2px solid var(--dark);
  color: var(--dark);
}

.ingresso-card__btn.btn-outline:hover {
  background: var(--dark);
  color: #fff;
}

@media (max-width: 900px) {
  .ingressos__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .ingresso-card.destaque {
    grid-column: span 2;
    transform: none;
  }
}

@media (max-width: 600px) {
  .ingressos {
    padding: 56px 0;
  }

  .ingressos__grid {
    grid-template-columns: 1fr;
  }

  .ingresso-card.destaque {
    grid-column: span 1;
    transform: none;
    box-shadow: 0 8px 24px rgba(46, 204, 113, 0.3);
  }

  .ingresso-card__preco {
    font-size: 1.5rem;
  }
}
</style>
