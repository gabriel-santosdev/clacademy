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
            <img :src="aula.img" :alt="aula.nome" />
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
      'Melhore a flexibilidade, força e equilíbrio com nossas aulas coletivas ministradas por especialistas, adaptadas para todos os níveis.',
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80&auto=format&fit=crop',
  },
  {
    nome: 'Dança',
    descricao:
      'Expresse-se e queime calorias com nossas rotinas dinâmicas e de alta energia de dança que parecem mais uma festa.',
    img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80&auto=format&fit=crop',
  },
  {
    nome: 'Jump',
    descricao:
      'Aumente sua saúde cardiovascular e divirta-se com nossas intensas sessões de jump baseadas em ritmo.',
    img: 'https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg?auto=compress&cs=tinysrgb&w=600&fit=crop',
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
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.aula-card {
  border-radius: 12px;
  overflow: hidden;
  background: var(--white);
}

.aula-card__img-wrap {
  aspect-ratio: 4/3;
  overflow: hidden;
  border-radius: 12px;
}

.aula-card__img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.aula-card:hover .aula-card__img-wrap img {
  transform: scale(1.04);
}

.aula-card__body {
  padding: 16px 4px 0;
}

.aula-card__body h3 {
  font-family: var(--font-heading);
  font-size: 1.15rem;
  font-weight: 400;
  margin-bottom: 8px;
  color: var(--text-dark);
  letter-spacing: 0.02em;
}

.aula-card__body p {
  font-family: var(--font-body);
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.65;
}

@media (max-width: 900px) {
  .aulas__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
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
