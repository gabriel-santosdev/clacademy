<template>
  <section id="aulas" class="aulas">
    <div class="container">
      <h2 class="section-title">Nossas Aulas</h2>
      <p class="section-subtitle">
        Descubra nossas sessões especializadas de fitness em grupo projetadas
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
    nome: 'Ginástica Localizada',
    descricao:
      'Melhore a flexibilidade, força e equilíbrio com nossas aulas de ginástica ministradas por especialistas, adaptadas para todos os níveis.',
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
    img: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=600&q=80&auto=format&fit=crop',
  },
]
</script>

<style scoped>
.aulas {
  padding: 80px 0;
}

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
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-dark);
}

.aula-card__body p {
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

  .aulas__grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .aula-card__img-wrap {
    aspect-ratio: 16/9;
  }
}
</style>
