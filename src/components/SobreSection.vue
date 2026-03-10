<template>
  <section id="sobre" class="sobre">
    <div class="container">
      <div class="sobre__inner">
        <div class="sobre__img-wrap">
          <img
            src="https://illustrations.popsy.co/amber/woman-doing-yoga.svg"
            alt="Instrutora CL Academy"
          />
        </div>
        <div class="sobre__text">
          <h2>Quem sou eu</h2>
          <p>
            Uma instrutora de fitness apaixonada dedicada a transformar sua energia em
            movimento. Com mais de uma década de experiência em ginástica e dança, criei a
            CL Academy para ajudar você a descobrir seu verdadeiro potencial em um ambiente
            de apoio e energia.
          </p>
          <a href="#" class="sobre__btn">Leia Mais</a>
        </div>
      </div>
    </div>
  </section>
</template>

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
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 14px;
  color: var(--text-dark);
}

.sobre__text p {
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

@media (max-width: 640px) {
  .sobre__inner {
    flex-direction: column;
    padding: 32px 24px;
    text-align: center;
  }
}
</style>
