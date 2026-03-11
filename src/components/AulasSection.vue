<template>
  <section id="aulas" class="aulas">
    <div class="container">

      <!-- Apresentação CL Academy -->
      <div class="aulas__intro">
        <img src="../assets/cl_academy_logo.png" alt="CL Academy" class="aulas__intro-logo" />

        <div class="aulas__intro-tagline-wrap">
          <span class="tagline-line"></span>
          <p class="aulas__intro-tagline">onde o movimento vira experiência</p>
          <span class="tagline-line"></span>
        </div>

        <ul class="aulas__intro-lista">
          <li>
            <span class="intro-dot"></span>
            O CL Academy é um projeto de aulas fitness coletivas, treinamento esportivo
            e dança, feito para você vivenciar!
          </li>
          <li>
            <span class="intro-dot"></span>
            Estaremos realizando eventos e trazendo conteúdos nas mídias sociais.
          </li>
        </ul>
      </div>

      <div class="aulas__divider"></div>

      <!-- Nossas Aulas -->
      <h2 class="section-title">Nossas Aulas</h2>
      <p class="section-subtitle">
        Sessões especializadas de fitness em grupo projetadas
        para desafiar e inspirar você.
      </p>

      <div class="aulas__grid">
        <div v-for="aula in aulas" :key="aula.nome" class="aula-card">
          <div class="aula-card__img-wrap">
            <img :src="aula.img" :alt="aula.nome" :class="aula.imgPosition" />
          </div>
          <div class="aula-card__body">
            <h3>{{ aula.nome }}</h3>
            <p>{{ aula.descricao }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const aulas = [
  {
    nome: 'Fitness Coletiva',
    descricao:
      'Aulas de funcional, HIT, Gap, Alongamento e Jump para melhorar seu condicionamento, flexibilidade, força, equilíbrio e saúde vascular.',
    img: new URL('../assets/aulas_coletivas.png', import.meta.url).href,
    imgPosition: 'img-pos-top',
  },
  {
    nome: 'Dança',
    descricao:
      'Expresse-se, vivencie e experimente diferentes modalidades de dança!',
    img: new URL('../assets/danca.png', import.meta.url).href,
    imgPosition: 'img-pos-center',
  },
]
</script>

<style scoped>
.aulas {
  padding: 80px 0;
  background: var(--white);
}

/* ── Intro ───────────────────────────────────────── */
.aulas__intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 72px 0 48px;
}

.aulas__intro-logo {
  height: 180px;
  width: auto;
  object-fit: contain;
  margin-bottom: 36px;
  opacity: 0.9;
  filter: drop-shadow(0 2px 8px rgba(160, 133, 110, 0.15));
}

.aulas__intro-tagline-wrap {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
  width: 100%;
  max-width: 700px;
  justify-content: center;
}

.tagline-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--sand));
  max-width: 120px;
}

.tagline-line:last-child {
  background: linear-gradient(to left, transparent, var(--sand));
}

.aulas__intro-tagline {
  font-family: 'BillaMount', cursive;
  font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  color: var(--terracota);
  letter-spacing: 0.04em;
  line-height: 1.1;
  white-space: nowrap;
}

.aulas__intro-lista {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 480px;
}

.aulas__intro-lista li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.8;
  text-align: left;
}

.intro-dot {
  flex-shrink: 0;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--terracota);
  opacity: 0.5;
  margin-top: 10px;
}

.aulas__divider {
  width: 60px;
  height: 1px;
  background: var(--sand);
  margin: 40px auto 56px;
}

/* ── Grid ────────────────────────────────────────── */
.aulas__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  max-width: 860px;
  margin: 0 auto;
}

.aula-card {
  border-radius: 14px;
  overflow: hidden;
  background: var(--white);
}

.aula-card__img-wrap {
  aspect-ratio: 3/2;
  overflow: hidden;
  border-radius: 14px;
}

.aula-card__img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.img-pos-top {
  object-position: top;
}

.img-pos-center {
  object-position: center;
}

.aula-card:hover .aula-card__img-wrap img {
  transform: scale(1.04);
}

.aula-card__body {
  padding: 20px 6px 0;
}

.aula-card__body h3 {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 400;
  margin-bottom: 10px;
  color: var(--text-dark);
  letter-spacing: 0.02em;
}

.aula-card__body p {
  font-family: var(--font-body);
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.7;
}

@media (max-width: 600px) {
  .aulas {
    padding: 56px 0;
  }

  .aulas__intro {
    padding: 40px 0 28px;
  }

  .aulas__intro-logo {
    height: 130px;
    margin-bottom: 24px;
  }

  .aulas__intro-tagline {
    font-size: clamp(1.3rem, 6vw, 1.6rem);
    white-space: normal;
    text-align: center;
  }

  .tagline-line {
    display: none;
  }

  .aulas__intro-lista {
    max-width: 100%;
  }

  .aulas__grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .aula-card__img-wrap {
    aspect-ratio: 16/9;
  }
}
</style>
