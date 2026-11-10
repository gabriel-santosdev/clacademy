<script setup lang="ts">
import eventImg from '~/assets/landing/danca.webp'

defineProps<{ instagram: string }>()
</script>

<template>
  <section id="sobre" class="lp-section lp-dark about">
    <div class="lp-container about__inner">
      <figure class="about__photo" data-reveal data-reveal-from="left">
        <img :src="eventImg" alt="Turma reunida em um evento da CL Academy" loading="lazy" width="720" height="1280" />
        <BrandLogo variant="mark" bold class="about__stamp" />
        <figcaption><i class="pi pi-calendar" /> Evento CL Academy</figcaption>
      </figure>

      <div class="about__copy" data-reveal="1">
        <p class="lp-eyebrow"><b>07</b> A marca</p>
        <h2 class="lp-h2">Onde o movimento <em>vira experiência.</em></h2>
        <p class="lp-lead">
          A CL Academy é uma assessoria esportiva de personal trainer e corrida. Cada aluno tem um professor que monta o
          treino, acompanha pelo app e ajusta conforme a evolução.
        </p>
        <p class="lp-lead">
          E de tempos em tempos a gente junta todo mundo. Os eventos CL Academy têm aulão de funcional, dança e corrida,
          com parceiros, brindes e sorteios.
        </p>
        <ul class="about__facts">
          <li><strong>1:1</strong><span>acompanhamento individual</span></li>
          <li><strong>21K</strong><span>até a meia maratona</span></li>
          <li><strong>0</strong><span>loja de app</span></li>
        </ul>
        <div class="about__foot">
          <a :href="`https://instagram.com/${instagram}`" target="_blank" rel="noopener" class="lp-btn lp-btn--ghost-light">
            <i class="pi pi-instagram" /> @{{ instagram }}
          </a>
          <p class="about__founder">Fundada pela profissional de Educação Física Carla Lívian.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about__inner { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: clamp(40px, 6vw, 88px); align-items: center; }
.about__photo { position: relative; aspect-ratio: 4 / 5; border-radius: 28px; overflow: hidden; background: var(--ink-2); }
.about__photo img { width: 100%; height: 100%; object-fit: cover; object-position: center 40%; filter: grayscale(1) contrast(1.05); transition: filter 0.9s var(--ease-out), transform 1.2s var(--ease-out); }
.about__photo:hover img { filter: grayscale(0); transform: scale(1.03); }
.about__stamp { position: absolute; top: 18px; right: 18px; font-size: 64px; color: var(--bone); filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4)); }
.about__photo figcaption {
  position: absolute; left: 16px; bottom: 16px; display: inline-flex; align-items: center; gap: 8px; padding: 9px 14px; border-radius: 999px;
  background: var(--volt); color: var(--volt-ink); font-size: 0.82rem; font-weight: 800;
}
.about__facts { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 32px; border-top: 1px solid var(--ink-line); }
.about__facts li { padding: 18px 0 0; }
.about__facts li + li { padding-left: 18px; border-left: 1px solid var(--ink-line); }
.about__facts strong { display: block; font-family: var(--f-display); font-size: clamp(2.4rem, 5vw, 3.4rem); font-weight: 800; line-height: 0.9; color: var(--volt); }
.about__facts span { display: block; margin-top: 4px; font-size: 0.85rem; font-weight: 600; color: #a8a7a4; }
.about__foot { display: flex; align-items: center; flex-wrap: wrap; gap: 14px 20px; margin-top: 32px; }
.about__founder { font-size: 0.85rem; color: #8f8e8b; }
@media (max-width: 900px) {
  .about__inner { grid-template-columns: 1fr; }
  .about__photo { max-width: 460px; aspect-ratio: 4 / 4.4; }
}
</style>
