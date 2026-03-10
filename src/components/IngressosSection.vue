<template>
  <section id="ingressos" class="ingressos">
    <div class="container">
      <h2 class="section-title">Próximas Atividades e Ingressos</h2>
      <p class="section-subtitle">
        Garanta sua vaga para nossas próximas sessões e eventos especiais.
      </p>

      <div class="ingressos__grid">
        <div
          v-for="item in ingressos"
          :key="item.titulo"
          class="ingresso-card"
          :class="{ destaque: item.destaque }"
        >
          <div v-if="item.destaque" class="ingresso-card__badge">ESPECIAL</div>

          <div class="ingresso-card__header">
            <span class="ingresso-card__icon">{{ item.icon }}</span>
            <h3 class="ingresso-card__titulo">{{ item.titulo }}</h3>
          </div>

          <div class="ingresso-card__data">
            <span>{{ item.dataIcon }}</span>
            {{ item.data }}
          </div>

          <div class="ingresso-card__preco">
            {{ item.preco }}
            <span class="ingresso-card__periodo">{{ item.periodo }}</span>
          </div>

          <a href="#" class="ingresso-card__btn" :class="{ 'btn-outline': item.outline }">
            {{ item.btnLabel }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const ingressos = [
  {
    icon: '🌿',
    titulo: 'Aula de Jump – Outubro',
    dataIcon: '📅',
    data: '15 de Outubro, Sábado',
    preco: 'R$ 60',
    periodo: '/sessão',
    btnLabel: 'Comprar Ingresso',
    destaque: false,
    outline: false,
  },
  {
    icon: '🎉',
    titulo: 'Workshop de Dança',
    dataIcon: '📅',
    data: '22 e 23 de Outubro',
    preco: 'R$ 120',
    periodo: '/fim de semana',
    btnLabel: 'Comprar Ingresso',
    destaque: true,
    outline: false,
  },
  {
    icon: '♾️',
    titulo: 'Aulas Mensais',
    dataIcon: '🔁',
    data: 'Acesso Contínuo',
    preco: 'R$ 200',
    periodo: '/mês',
    btnLabel: 'Assinar Plano',
    destaque: false,
    outline: true,
  },
]
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
  background: var(--green);
  border-color: var(--green);
  color: #fff;
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(46, 204, 113, 0.35);
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
  font-size: 1rem;
  font-weight: 700;
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

@media (max-width: 768px) {
  .ingressos__grid {
    grid-template-columns: 1fr;
  }

  .ingresso-card.destaque {
    transform: none;
  }
}
</style>
