<template>
  <section id="patrocinadores" class="patrocinadores">
    <div class="container">
      <p class="patrocinadores__label">NOSSOS PATROCINADORES</p>

      <div class="patrocinadores__grid">
        <a v-for="sponsor in sponsors" :key="sponsor.handle" :href="`https://instagram.com/${sponsor.handle}`"
          target="_blank" rel="noopener noreferrer" class="pat-card">
          <div class="pat-card__img-wrap">
            <img :src="sponsor.img" :alt="sponsor.name" class="pat-card__img" />
          </div>
          <span class="pat-card__handle">@{{ sponsor.handle }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import aloha from '../assets/aloha_acai.jpeg'
import boutique from '../assets/as_boutique.jpeg'
import bela from '../assets/bela_bronze.jpeg'
import csPratas from '../assets/cs_pratas.jpeg'
import gabriel from '../assets/LOGO GABRIEL.jpg'
import kayanne from '../assets/kayanne.jpeg'
import yasmin from '../assets/yasmin_lash.jpeg'

const sponsors = [
  { handle: 'alohaacai.oficial', name: 'Aloha Açaí', img: aloha },
  { handle: 'aasmodas.store', name: 'A&S Boutique', img: boutique },
  { handle: 'bela_bronzee', name: 'Bela Bronze', img: bela },
  { handle: 'cspratass_', name: 'CS Pratas', img: csPratas },
  { handle: 'gabrielsantos.tec', name: 'Gabriel Santos', img: gabriel },
  { handle: 'nutri.kayannemorais', name: 'Nutri Kayanne', img: kayanne },
  { handle: 'yassminsantoslash', name: 'Yassmin Lash', img: yasmin },
]
</script>

<style scoped>
/* ── Seção ───────────────────────────────────────── */
.patrocinadores {
  padding: 72px 0 64px;
  border-top: 1px solid var(--border);
  background: var(--white);
}

.patrocinadores__label {
  text-align: center;
  font-size: 0.68rem;
  letter-spacing: 3px;
  color: var(--text-muted);
  font-weight: 700;
  margin-bottom: 48px;
}

/* ── Grid ────────────────────────────────────────── */
.patrocinadores__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

/* ── Card ────────────────────────────────────────── */
.pat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.pat-card__img-wrap {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  overflow: hidden;
  background: var(--bg-light);
  border: 1px solid var(--border);
  transition: box-shadow 0.25s, transform 0.25s;
}

.pat-card:hover .pat-card__img-wrap {
  box-shadow: 0 12px 36px rgba(124, 1, 22, 0.14);
  transform: translateY(-4px);
}

.pat-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s;
  filter: grayscale(20%);
}

.pat-card:hover .pat-card__img {
  transform: scale(1.04);
  filter: grayscale(0%);
}

.pat-card__handle {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.3px;
  transition: color 0.2s;
}

.pat-card:hover .pat-card__handle {
  color: var(--dark);
}

/* ── Responsivo ──────────────────────────────────── */
@media (max-width: 900px) {
  .patrocinadores__grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

@media (max-width: 600px) {
  .patrocinadores {
    padding: 56px 0 48px;
  }

  .patrocinadores__label {
    margin-bottom: 36px;
  }

  .patrocinadores__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .pat-card__img-wrap {
    border-radius: 12px;
  }

  .pat-card__handle {
    font-size: 0.65rem;
  }
}

@media (max-width: 360px) {
  .patrocinadores__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
</style>
