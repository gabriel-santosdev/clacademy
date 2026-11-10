<script setup lang="ts">
const { data: plans, ctaFor } = await usePublicPlans()
</script>

<template>
  <section v-if="plans.length" id="planos" class="lp-section plans">
    <div class="lp-container">
      <header class="plans__head" data-reveal>
        <p class="lp-eyebrow"><b>05</b> Planos</p>
        <h2 class="lp-h2">Escolhe como <em>quer treinar.</em></h2>
        <p class="lp-lead">Personal ou assessoria de corrida. Todo plano vem com o app, o histórico e o retorno do professor.</p>
      </header>
      <div class="plans__grid">
        <BillingPlanCard v-for="(p, i) in plans" :key="p.id" :plan="p" dark :data-reveal="i">
          <NuxtLink :to="ctaFor(p.id)" class="lp-btn" :class="p.highlight ? 'lp-btn--light' : 'lp-btn--ink'">
            {{ p.trialDays ? 'Experimentar grátis' : 'Quero esse' }} <i class="pi pi-arrow-right" />
          </NuxtLink>
        </BillingPlanCard>
      </div>
      <p class="plans__note"><i class="pi pi-lock" /> Pix, boleto ou cartão. Cancele quando quiser, pelo próprio app.</p>
    </div>
  </section>
</template>

<style scoped>
.plans__head { max-width: 720px; margin-bottom: clamp(36px, 5vw, 56px); }
.plans__grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); align-items: stretch; padding-top: 14px; }
.plans__note { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 28px; text-align: center; font-size: 0.88rem; font-weight: 600; color: var(--graphite); }

/* pele da landing sobre o card de plano do billing */
.plans :deep(.plan.plan) {
  --plan-bg: var(--paper); --plan-text: var(--ink); --plan-muted: var(--graphite); --plan-border: var(--line);
  border-radius: 26px; padding: 30px 26px 26px; font-family: var(--f-body);
}
.plans :deep(.plan.plan--dark.plan--highlight) { --plan-bg: var(--ink); --plan-text: var(--bone); --plan-muted: #a6a6a6; --plan-border: var(--ink-line); border-color: var(--ink); }
.plans :deep(.plan .plan__ribbon) { background: #fff; color: var(--ink); box-shadow: 0 0 0 1.5px var(--ink), 0 8px 18px -10px rgba(0, 0, 0, 0.5); font-family: var(--f-display); font-size: 0.85rem; letter-spacing: 0.08em; }
.plans :deep(.plan .plan__modality) { font-family: var(--f-display); font-size: 0.9rem; }
.plans :deep(.plan .plan__name) { font-family: var(--f-display); font-size: 2.2rem; font-weight: 800; text-transform: uppercase; line-height: 0.95; letter-spacing: 0; }
.plans :deep(.plan .plan__price strong) { font-family: var(--f-display); font-size: 3.2rem; letter-spacing: 0; line-height: 1; }
.plans :deep(.plan .plan__features .pi) { color: var(--ink); }
.plans :deep(.plan.plan--dark.plan--highlight .plan__features .pi) { color: var(--hi); }
.plans :deep(.plan .plan__trial) { background: var(--bone-2); color: var(--ink); }
.plans :deep(.plan.plan--dark.plan--highlight .plan__trial) { background: var(--ink-2); color: var(--hi); }
.plans :deep(.plan .plan__save) { color: #fff; background: var(--ink); padding: 1px 6px; border-radius: 4px; font-weight: 800; }
.plans :deep(.plan.plan--dark.plan--highlight .plan__save) { color: var(--ink); background: #fff; }
.plans :deep(.plan .plan__action .lp-btn) { width: 100%; }
</style>
