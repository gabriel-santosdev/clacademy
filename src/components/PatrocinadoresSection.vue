<template>
  <section id="patrocinadores" class="patrocinadores" ref="sectionRef">
    <div class="container">
      <p class="patrocinadores__label" :class="{ visible: inView }">NOSSOS PATROCINADORES</p>

      <div class="patrocinadores__logo-wrap" :class="{ visible: inView }">
        <img :src="logoPatrocinadores" alt="Patrocinadores CL Run" class="patrocinadores__logo" />
      </div>

      <div class="patrocinadores__groups">
        <div
          v-for="(group, gi) in groups"
          :key="group.title"
          class="pat-group"
          :class="{ visible: inView }"
          :style="{ transitionDelay: inView ? `${0.3 + gi * 0.1}s` : '0s' }"
        >
          <p class="pat-group__title">{{ group.title }}</p>
          <div class="pat-group__items">
            <a
              v-for="(sponsor, i) in group.items"
              :key="sponsor.handle"
              :href="`https://instagram.com/${sponsor.handle}`"
              target="_blank"
              rel="noopener noreferrer"
              class="pat-handle"
              :class="{ visible: inView }"
              :style="{ transitionDelay: inView ? `${0.4 + gi * 0.1 + i * 0.05}s` : '0s' }"
            >
              <span class="pat-handle__name">{{ sponsor.name }}</span>
              <span class="pat-handle__ig">@{{ sponsor.handle }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import logoPatrocinadores from '../assets/patrocinadores_cl_run.png'

const groups = [
  {
    title: 'Patrocinadores',
    items: [
      { name: 'Gabriel Tecnologia',  handle: 'gabrielsantos.tec'    },
      { name: 'EMMES Gráfica',       handle: 'emme.sgrafica'        },
      { name: 'Guarino Grill',       handle: 'guarino.grill'        },
      { name: 'IS Clinic',          handle: 'is.cliniic'           },
      { name: 'IS Clinic',          handle: 'dra.isadoramsa'       },
      { name: 'Queiroz Lash',        handle: 'queirozlash'          },
      { name: 'Emagrecentro',        handle: 'emagrecentro_cajamar' },
      { name: 'Maria Flor Fitness',  handle: 'mariafl.r'            },
      { name: 'As Modas',            handle: 'aasmodas.store'       },
      { name: 'Casa da Ka',          handle: 'casadakaaa'           },
      { name: 'Bigode Suspensão',    handle: 'bigode.suspensao'     },
      { name: 'Villa Portal',        handle: 'villa_portal_bar'     },
      { name: 'Patrício Luxe Store', handle: 'patricioluxestore'     },
    ],
  },
  {
    title: 'Apoiadores',
    items: [
      { name: 'Vila Criativa',  handle: 'vila_criativasp'       },
      { name: 'Emily Nails',    handle: 'emilyfreitasnailss'    },
      { name: 'Eldrim',         handle: 'eldrim.br'             },
    ],
  },
  {
    title: 'Expositores Coffee Break',
    items: [
      { name: 'Coco Saudáveis',       handle: 'cocosaudaveis'      },
      { name: 'Canibal Suplementos',  handle: 'canibal.inc'        },
      { name: 'Aloha Açaí',           handle: 'alohaacai.oficial'  },
    ],
  },
  {
    title: 'Convidado Aulão',
    items: [
      { name: 'Emerson', handle: 'emr_soares' },
    ],
  },
  {
    title: 'Espaço',
    items: [
      { name: 'Free Ball Soccer', handle: 'freeballsoccercajamar' },
    ],
  },
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
.patrocinadores__groups {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.pat-group {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.pat-group.visible {
  opacity: 1;
  transform: translateY(0);
}

.pat-group__title {
  text-align: center;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 14px;
}

.pat-group__items {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 20px;
}

.pat-handle {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  padding: 4px 6px;
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
  border-color: var(--dark);
}

.pat-handle:hover .pat-handle__name,
.pat-handle:hover .pat-handle__ig {
  color: var(--dark);
}

.pat-handle__name {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-dark);
  transition: color 0.25s;
}

.pat-handle__ig {
  font-size: 0.68rem;
  font-weight: 500;
  color: var(--text-muted);
  transition: color 0.25s;
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

  .pat-group__items {
    gap: 8px 16px;
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

  .pat-group__items {
    gap: 6px 12px;
  }
}

@media (max-width: 360px) {
  .pat-group__items {
    gap: 6px 10px;
  }
}
</style>
