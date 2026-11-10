<script setup lang="ts">
import type { PublicPlan } from '../domain/pricing'

/** Card de plano da vitrine. Ação no slot (link ou botão). */
const props = defineProps<{ plan: PublicPlan; dark?: boolean }>()
const starting = computed(() => startingMonthlyPrice(props.plan.prices))
</script>

<template>
  <article class="plan" :class="{ 'plan--highlight': plan.highlight, 'plan--dark': dark }">
    <span v-if="plan.highlight" class="plan__ribbon"><i class="pi pi-star-fill" /> Mais escolhido</span>
    <span class="plan__modality">{{ LABELS.modality[plan.modality] }}</span>
    <h3 class="plan__name">{{ plan.name }}</h3>
    <p v-if="plan.description" class="plan__desc">{{ plan.description }}</p>

    <div v-if="starting" class="plan__price">
      <small>a partir de</small>
      <strong>{{ formatBRL(starting.monthlyCents) }}</strong><span>/mês</span>
    </div>
    <ul class="plan__intervals">
      <li v-for="pr in plan.prices" :key="pr.id">
        <span>{{ LABELS.interval[pr.interval] }}</span>
        <span class="mono">
          {{ formatBRL(pr.amountCents) }}
          <em v-if="savingsVsMonthly(plan.prices, pr)" class="plan__save">-{{ savingsVsMonthly(plan.prices, pr) }}%</em>
        </span>
      </li>
    </ul>

    <ul class="plan__features">
      <li v-for="f in plan.features" :key="f"><i class="pi pi-check" /> {{ f }}</li>
    </ul>
    <p v-if="plan.trialDays" class="plan__trial"><i class="pi pi-gift" /> {{ plan.trialDays }} dias grátis para experimentar</p>
    <div class="plan__action"><slot /></div>
  </article>
</template>

<style scoped>
.plan {
  --plan-bg: var(--app-surface, #fff);
  --plan-text: var(--app-text, #18181b);
  --plan-muted: var(--app-muted, #71717a);
  --plan-border: var(--app-border, #e4e4e7);
  position: relative; display: flex; flex-direction: column; gap: 12px; height: 100%;
  padding: 28px 24px 24px; border-radius: var(--radius-lg);
  background: var(--plan-bg); color: var(--plan-text); border: 1px solid var(--plan-border);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.plan:hover { transform: translateY(-4px); box-shadow: 0 18px 50px rgba(0, 0, 0, 0.08); }
.plan--highlight { border-color: var(--p-primary-color); box-shadow: 0 10px 36px rgba(0, 0, 0, 0.08); }
.plan--dark.plan--highlight { --plan-bg: var(--brand-ink); --plan-text: #fafafa; --plan-muted: #a1a1aa; --plan-border: #27272a; }
.plan__ribbon {
  position: absolute; top: -12px; left: 24px; display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 12px; border-radius: 999px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  background: var(--brand-wine); color: #fff;
}
.plan__ribbon .pi { font-size: 0.6rem; }
.plan__modality { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--plan-muted); }
.plan__name { font-size: 1.45rem; font-weight: 750; letter-spacing: -0.02em; line-height: 1.15; }
.plan__desc { font-size: 0.9rem; color: var(--plan-muted); }
.plan__price { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
.plan__price small { width: 100%; font-size: 0.75rem; color: var(--plan-muted); }
.plan__price strong { font-size: 2.2rem; font-weight: 800; letter-spacing: -0.03em; }
.plan__price span { color: var(--plan-muted); }
.plan__intervals { display: flex; flex-direction: column; gap: 4px; font-size: 0.82rem; color: var(--plan-muted); }
.plan__intervals li { display: flex; justify-content: space-between; gap: 8px; }
.plan__intervals .mono { color: var(--plan-text); font-weight: 600; }
.plan__save { font-style: normal; font-size: 0.7rem; color: var(--p-green-600); margin-left: 4px; }
.plan__features { flex: 1; display: flex; flex-direction: column; gap: 8px; padding-top: 14px; border-top: 1px solid var(--plan-border); }
.plan__features li { display: flex; gap: 8px; font-size: 0.9rem; }
.plan__features .pi { color: var(--brand-wine); font-size: 0.8rem; margin-top: 5px; }
.plan--dark.plan--highlight .plan__features .pi { color: var(--brand-blush); }
.plan__trial { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 600; padding: 8px 10px; border-radius: 10px; background: var(--brand-wine-soft); color: var(--brand-wine); }
.plan--dark.plan--highlight .plan__trial { background: rgba(241, 157, 172, 0.14); color: var(--brand-blush); }
.plan__action { margin-top: 4px; }
</style>
