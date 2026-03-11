<template>
  <section id="patrocinadores" class="patrocinadores">
    <div class="container">
      <p class="patrocinadores__label">NOSSOS PATROCINADORES</p>
      <p class="patrocinadores__em-breve">
        Em breve divulgaremos nossos patrocinadores.
      </p>
    </div>
  </section>
</template>

<style scoped>
.patrocinadores {
  padding: 60px 0 48px;
  border-top: 1px solid var(--border);
}

.patrocinadores__label {
  text-align: center;
  font-size: 0.72rem;
  letter-spacing: 2px;
  color: var(--text-muted);
  font-weight: 600;
  margin-bottom: 16px;
}

.patrocinadores__em-breve {
  text-align: center;
  font-family: var(--font-script);
  font-size: 1.4rem;
  color: var(--sand);
  letter-spacing: 0.02em;
}

@media (max-width: 480px) {
  .patrocinadores {
    padding: 40px 0 32px;
  }

  .patrocinadores__em-breve {
    font-size: 1.2rem;
  }
}
</style>

<style scoped>
.patrocinadores {
  padding: 60px 0 48px;
  border-top: 1px solid var(--border);
}

.patrocinadores__label {
  text-align: center;
  font-size: 0.72rem;
  letter-spacing: 2px;
  color: var(--text-muted);
  font-weight: 600;
  margin-bottom: 28px;
}

.patrocinadores__grid {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 40px;
}

.pat {
  font-size: 1.2rem;
  color: var(--text-dark);
  user-select: none;
}

.pat--bold {
  font-weight: 900;
  letter-spacing: 1px;
}

.pat--light {
  font-weight: 300;
  font-style: italic;
  font-size: 1.3rem;
}

.pat--box {
  border: 2px solid var(--text-dark);
  padding: 4px 10px;
  font-weight: 700;
  font-size: 1rem;
}

.pat--thin {
  font-weight: 400;
  font-size: 1.3rem;
  letter-spacing: 3px;
}

.pat--icon {
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.5px;
}

@media (max-width: 600px) {
  .patrocinadores {
    padding: 40px 0 32px;
  }

  .patrocinadores__grid {
    gap: 24px 32px;
    justify-content: center;
  }

  .pat {
    font-size: 1rem;
  }

  .pat--light,
  .pat--thin {
    font-size: 1.05rem;
  }
}

@media (max-width: 380px) {
  .patrocinadores__grid {
    gap: 18px 20px;
  }
}
</style>
