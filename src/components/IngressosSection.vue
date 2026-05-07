<template>
  <section id="ingressos" class="ingressos">
    <div class="container">
      <h2 class="section-title">Próximas Atividades e Ingressos</h2>
      <p class="section-subtitle">
        Garanta sua vaga para nossas próximas sessões e eventos especiais.
      </p>

      <div class="ingressos__center">
        <div class="ingresso-card destaque">
          <!-- Imagem da edição -->
          <div class="card__image">
            <img src="../assets/sessao_ingressos.jpeg" alt="Edição Maio CL Academy" />
          </div>

          <!-- Próxima edição -->
          <div class="card__proxima">
            <a href="https://www.sympla.com.br/evento/cl-academy-2-0/3393733?share_id=copiarlink" target="_blank"
              rel="noopener noreferrer" class="proxima__btn">
              Garantir minha vaga
            </a>
          </div>
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

/* ── Centralização do card único ─────────────────── */
.ingressos__center {
  display: flex;
  justify-content: center;
  margin-top: 48px;
  padding: 0 16px;
}

/* ── Card ────────────────────────────────────────── */
.ingresso-card.destaque {
  width: 100%;
  max-width: 360px;
  background: var(--accent);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(124, 1, 22, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: #fff;
}

/* ── Imagem ──────────────────────────────────────── */
.card__image {
  width: 100%;
  line-height: 0;
}

.card__image img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 20px 20px 0 0;
  object-fit: cover;
}

/* ── Bloco badge ─────────────────────────────────── */
.card__proxima {
  width: 100%;
  padding: 18px 24px 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.proxima__badge {
  display: inline-block;
  background: var(--dark);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 2px;
  padding: 6px 20px;
  border-radius: 50px;
}

.proxima__btn {
  display: inline-block;
  background: var(--dark);
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 10px 28px;
  border-radius: 50px;
  text-decoration: none;
  transition: background 0.2s, color 0.2s, transform 0.2s;
}

.proxima__btn:hover {
  background: #000;
  color: #fff;
  transform: translateY(-2px);
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

  .ingresso-card.destaque {
    max-width: 100%;
    border-radius: 16px;
  }

  .card__image img {
    border-radius: 16px 16px 0 0;
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

  .ingresso-card.destaque {
    border-radius: 12px;
    box-shadow: 0 10px 32px rgba(124, 1, 22, 0.18);
  }

  .card__image img {
    border-radius: 12px 12px 0 0;
  }

  .card__proxima {
    padding: 14px 16px 18px;
  }

  .proxima__badge {
    font-size: 0.6rem;
    padding: 5px 16px;
  }
}
</style>