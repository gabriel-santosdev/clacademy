<template>
  <section id="inicio" class="hero">
    <img src="../assets/hero.jpeg" class="hero__bg" alt="" aria-hidden="true" />
    <div class="hero__overlay"></div>
    <div class="hero__content container">
      <h1 class="hero__title">Onde o movimento vira experiência</h1>
      <p class="hero__subtitle">
        Experimente aulas fitness coletivas & dança de uma forma diferente!
      </p>
      <a href="#aulas" class="hero__btn">Ver Aulas</a>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0;
  border-radius: 16px;
  overflow: hidden;
}

.hero__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top top;
  display: block;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.52);
}

.hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #fff;
  padding: 80px 32px;
  width: 100%;
}

.hero__title {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 400;
  line-height: 1.15;
  margin-bottom: 20px;
  letter-spacing: 0.01em;
}

.hero__subtitle {
  font-size: clamp(0.9rem, 2vw, 1rem);
  line-height: 1.7;
  opacity: 0.92;
  margin-bottom: 36px;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

.hero__btn {
  display: inline-block;
  background: var(--accent);
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 13px 32px;
  border-radius: 50px;
  transition: background 0.2s;
}

.hero__btn:hover {
  background: var(--accent-dark);
}

@media (max-width: 768px) {
  .hero {
    min-height: 460px;
    margin: 16px 0;
    border-radius: 12px;
  }

  .hero__content {
    padding: 60px 24px;
  }
}

@media (max-width: 480px) {
  .hero {
    min-height: 380px;
    margin: 12px 0;
    border-radius: 10px;
  }

  .hero__content {
    padding: 48px 16px;
  }

  .hero__btn {
    width: 100%;
    max-width: 260px;
    text-align: center;
  }
}
</style>
