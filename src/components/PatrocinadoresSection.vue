<template>
  <section id="patrocinadores" class="patrocinadores" ref="sectionRef">
    <div class="container">
      <p class="patrocinadores__label" :class="{ visible: inView }">NOSSOS PATROCINADORES</p>

      <div class="patrocinadores__logo-wrap" :class="{ visible: inView }">
        <img :src="logoPatrocinadores" alt="Patrocinadores" class="patrocinadores__logo" />
      </div>

      <div class="patrocinadores__handles">
        <a
          v-for="(sponsor, i) in sponsors"
          :key="sponsor.handle"
          :href="`https://instagram.com/${sponsor.handle}`"
          target="_blank"
          rel="noopener noreferrer"
          class="pat-handle"
          :class="{ visible: inView }"
          :style="{ transitionDelay: inView ? `${0.4 + i * 0.07}s` : '0s' }"
        >@{{ sponsor.handle }}</a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import logoPatrocinadores from '../assets/logo_patrocinadores.png'

const sponsors = [
  { handle: 'alohaacai.oficial',    name: 'Aloha Açaí'      },
  { handle: 'aasmodas.store',       name: 'A&S Boutique'    },
  { handle: 'bela_bronzee',         name: 'Bela Bronze'     },
  { handle: 'cspratass_',           name: 'CS Pratas'       },
  { handle: 'gabrielsantos.tec',    name: 'Gabriel Santos'  },
  { handle: 'nutri.kayannemorais',  name: 'Nutri Kayanne'   },
  { handle: 'yassminsantoslash',    name: 'Yassmin Lash'    },
  { handle: 'cocosaudaveis',        name: 'Digão Coco'      },
  { handle: 'dra.isadoramsa',       name: 'Dra. Isadora'    },
  { handle: 'adegadogustaa',        name: 'Adega do Gusta'  },
  { handle: 'emme.sgrafica',        name: 'Emme.s Gráfica'  },
  { handle: 'karmin_oculoskarmin',  name: 'Karmin Óculos'   },
]

const sectionRef = ref<HTMLElement | null>(null)
const inView = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => { if (entries[0]?.isIntersecting) { inView.value = true; observer?.disconnect() } },
    { threshold: 0.15 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
/* ── Seção ───────────────────────────────────────── */
.patrocinadores {
  padding: 80px 0 72px;
  border-top: 1px solid var(--border);
  background: var(--white);
}

.patrocinadores__label {
  text-align: center;
  font-size: 0.68rem;
  letter-spacing: 3px;
  color: var(--text-muted);
  font-weight: 700;
  margin-bottom: 52px;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.patrocinadores__label.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Imagem ──────────────────────────────────────── */
.patrocinadores__logo-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 52px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s;
}

.patrocinadores__logo-wrap.visible {
  opacity: 1;
  transform: translateY(0);
}

.patrocinadores__logo {
  width: 100%;
  max-width: 780px;
  height: auto;
  display: block;
  filter: invert(1) brightness(0.15);
  opacity: 0.82;
}

/* ── Handles ─────────────────────────────────────── */
.patrocinadores__handles {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 20px;
}

.pat-handle {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.4px;
  color: var(--text-muted);
  text-decoration: none;
  padding: 5px 2px;
  border-bottom: 1px solid transparent;
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease,
    color 0.25s,
    border-color 0.25s;
}

.pat-handle.visible {
  opacity: 1;
  transform: translateY(0);
}

.pat-handle:hover {
  color: var(--dark);
  border-color: var(--dark);
}

/* ── Responsivo ──────────────────────────────────── */
@media (max-width: 900px) {
  .patrocinadores {
    padding: 72px 0 60px;
  }

  .patrocinadores__logo {
    max-width: 640px;
  }
}

@media (max-width: 768px) {
  .patrocinadores {
    padding: 60px 0 52px;
  }

  .patrocinadores__label {
    margin-bottom: 40px;
  }

  .patrocinadores__logo-wrap {
    margin-bottom: 40px;
  }

  .patrocinadores__logo {
    max-width: 100%;
  }

  .patrocinadores__handles {
    gap: 9px 18px;
  }
}

@media (max-width: 480px) {
  .patrocinadores {
    padding: 48px 0 40px;
  }

  .patrocinadores__label {
    font-size: 0.6rem;
    letter-spacing: 2.5px;
    margin-bottom: 32px;
  }

  .patrocinadores__logo-wrap {
    margin-bottom: 32px;
  }

  .patrocinadores__handles {
    gap: 8px 14px;
  }

  .pat-handle {
    font-size: 0.65rem;
  }
}

@media (max-width: 360px) {
  .patrocinadores__handles {
    gap: 6px 10px;
  }

  .pat-handle {
    font-size: 0.6rem;
    letter-spacing: 0;
  }
}
</style>
