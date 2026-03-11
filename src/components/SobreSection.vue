<template>
  <section id="sobre" class="sobre">
    <div class="container">
      <div class="sobre__inner">

        <div class="sobre__img-wrap">
          <img src="../assets/carla_perfil.jpg" alt="Carla Lívian – Fundadora CL Academy" />
        </div>

        <div class="sobre__text">
          <span class="sobre__label">Fundadora</span>
          <h2>Carla Lívian</h2>
          <p>
            Formada em Educação Física, atua na área do fitness com aulas coletivas,
            individuais e virtual, especializada em treinamento físico e dança,
            atuando também como dançarina na área comercial.
          </p>
          <a href="https://instagram.com/clacademyyy" target="_blank" class="sobre__btn">
            @clacademyyy
          </a>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.sobre {
  padding: 80px 0;
  background: var(--bg-light);
}

.sobre__inner {
  display: flex;
  align-items: center;
  gap: 52px;
  background: var(--white);
  border-radius: 16px;
  padding: 48px 52px;
  border: 1px solid var(--border);
}

/* ── Foto ───────────────────────────────────────── */
.sobre__img-wrap {
  flex-shrink: 0;
  width: 180px;
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-warm);
}

.sobre__img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 42%;
  transform: scale(1.1);
  transform-origin: center 100%;
}

/* ── Texto ──────────────────────────────────────── */
.sobre__label {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--terracota);
  margin-bottom: 10px;
}

.sobre__text h2 {
  font-family: var(--font-heading);
  font-size: clamp(1.6rem, 3vw, 2rem);
  font-weight: 400;
  margin-bottom: 16px;
  color: var(--text-dark);
  letter-spacing: 0.02em;
}

.sobre__text p {
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.85;
  margin-bottom: 24px;
  max-width: 480px;
}

.sobre__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 22px;
  border: 1.5px solid var(--sand);
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--terracota);
  letter-spacing: 0.03em;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.sobre__btn:hover {
  background: var(--terracota);
  border-color: var(--terracota);
  color: #fff;
}

/* ── Responsive ─────────────────────────────────── */
@media (max-width: 768px) {
  .sobre {
    padding: 56px 0;
  }

  .sobre__inner {
    gap: 36px;
    padding: 36px 32px;
  }

  .sobre__img-wrap {
    width: 160px;
    height: 192px;
  }
}

@media (max-width: 600px) {
  .sobre__inner {
    flex-direction: column;
    align-items: center;
    padding: 32px 20px;
    text-align: center;
  }

  .sobre__img-wrap {
    width: 140px;
    height: 168px;
  }

  .sobre__text p {
    max-width: 100%;
  }
}
</style>


<style scoped>
.sobre {
  padding: 80px 0;
}

.sobre__inner {
  display: flex;
  align-items: center;
  gap: 48px;
  background: var(--bg-light);
  border-radius: 16px;
  padding: 40px 48px;
}

.sobre__img-wrap {
  flex-shrink: 0;
  width: 140px;
  height: 140px;
  border-radius: 12px;
  overflow: hidden;
  background: #f0f0e8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sobre__img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sobre__text h2 {
  font-family: var(--font-heading);
  font-size: clamp(1.4rem, 3vw, 1.8rem);
  font-weight: 400;
  margin-bottom: 14px;
  color: var(--text-dark);
  letter-spacing: 0.02em;
}

.sobre__text p {
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: 20px;
}

.sobre__btn {
  display: inline-block;
  padding: 10px 24px;
  border: 2px solid var(--dark);
  border-radius: 50px;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--dark);
  transition: background 0.2s, color 0.2s;
}

.sobre__btn:hover {
  background: var(--dark);
  color: #fff;
}

@media (max-width: 768px) {
  .sobre {
    padding: 56px 0;
  }

  .sobre__inner {
    gap: 32px;
    padding: 32px 32px;
  }
}

@media (max-width: 600px) {
  .sobre__inner {
    flex-direction: column;
    align-items: center;
    padding: 28px 20px;
    text-align: center;
  }

  .sobre__img-wrap {
    width: 120px;
    height: 120px;
  }

  .sobre__text h2 {
    font-size: 1.3rem;
  }
}
</style>
