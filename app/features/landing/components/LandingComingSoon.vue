<template>
  <div class="cs landing">
    <div class="cs__copy">
      <BrandLogo class="cs__logo" />
      <p class="cs__sub">Em breve. {{ LANDING.tagline }}.</p>
    </div>
    <video class="cs__video" src="~/assets/WhatsApp Video 2026-04-16 at 4.47.03 PM.mp4" autoplay loop muted playsinline />
  </div>
</template>

<style scoped>
.cs {
  position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; gap: 60px;
  padding: 40px 80px; background: var(--bone);
}
.cs__copy { flex: 1; max-width: 520px; }
.cs__logo { font-size: clamp(110px, 14vw, 190px); color: var(--graphite); }
.cs__sub { margin-top: 18px; font-family: var(--f-display); font-size: clamp(1.1rem, 1.8vw, 1.5rem); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink); }
.cs__video { height: clamp(320px, 65vh, 700px); width: auto; flex-shrink: 0; object-fit: cover; border-radius: 24px; box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.4); }
@media (max-width: 900px) {
  .cs { flex-direction: column; text-align: center; gap: 24px; padding: 32px 20px; }
  .cs__copy { max-width: 100%; display: flex; flex-direction: column; align-items: center; }
  .cs__video { height: auto; width: clamp(240px, 75vw, 420px); }
}
@media (max-width: 480px) { .cs__video { width: 88vw; } }
</style>
