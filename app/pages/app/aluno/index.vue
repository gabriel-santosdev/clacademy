<script setup lang="ts">
import type { StoryData } from '~/features/training/domain/story'

definePageMeta({ layout: 'app' })
useHead({ title: 'Hoje · CL Academy' })

const { data, refresh, name, nothingToday, pendingPayment, isWorkoutDone, isRunDone } = await useTodayOverview()
const { visible: logOpen, context: logContext, open: openLog } = useActivityLogger()
const { visible: shareOpen, story, open: openShare } = useStoryShare()
const { user } = useUserSession()

function onSaved(s: StoryData) {
  refresh()
  openShare(s)
}
const today = longDate()

const todayTotal = computed(() => (data.value ? data.value.today.workouts.length + data.value.today.runs.length : 0))
const todayDone = computed(() => {
  if (!data.value) return 0
  return (
    data.value.today.workouts.filter((w) => isWorkoutDone(w.workout.id)).length +
    data.value.today.runs.filter((r) => isRunDone(r.session.id)).length
  )
})
/* anel de progresso do dia */
const R = 15.9
const C = 2 * Math.PI * R
const dash = computed(() => `${todayTotal.value ? (todayDone.value / todayTotal.value) * C : 0} ${C}`)
</script>

<template>
  <div v-if="data" class="stack" style="--gap: 22px">
    <section class="hero tile-ink rise">
      <svg class="hero__lanes" viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true">
        <path v-for="l in 5" :key="l" :d="`M ${120 + l * 26} 210 C ${150 + l * 26} 110, ${220 + l * 18} 60, 320 ${l * 22 - 30}`" />
      </svg>
      <div class="hero__top">
        <div>
          <p class="hero__hello">{{ greeting() }}</p>
          <h1 class="hero__name">{{ name }}</h1>
          <p class="hero__date">{{ today }}</p>
        </div>
        <svg v-if="data.hasAccess && todayTotal" class="ring" viewBox="0 0 36 36" :aria-label="`${todayDone} de ${todayTotal} feitos hoje`">
          <circle cx="18" cy="18" :r="R" class="ring__bg" />
          <circle cx="18" cy="18" :r="R" class="ring__fg" :stroke-dasharray="dash" />
          <text x="18" y="21" text-anchor="middle">{{ todayDone }}/{{ todayTotal }}</text>
        </svg>
      </div>
      <div class="hero__kpis">
        <div><strong>{{ data.month.sessions }}</strong><span>treinos no mês</span></div>
        <div><strong>{{ data.month.km }}</strong><span>km no mês</span></div>
        <div><strong>{{ data.month.minutes }}</strong><span>minutos</span></div>
      </div>
    </section>

    <div v-if="!data.hasAccess" class="cta rise rise-1">
      <span class="cta__icon"><i :class="['pi', pendingPayment ? 'pi-clock' : 'pi-credit-card']" /></span>
      <div class="grow">
        <strong>{{ pendingPayment ? 'Pagamento pendente' : 'Escolha seu plano' }}</strong>
        <p class="small muted">
          {{ pendingPayment ? 'Assim que o pagamento for confirmado, seus treinos são liberados.' : 'Assine personal ou assessoria de corrida para receber seus treinos.' }}
        </p>
      </div>
      <Button as="router-link" to="/app/aluno/plano" :label="pendingPayment ? 'Ver pagamento' : 'Ver planos'" icon="pi pi-arrow-right" icon-pos="right" size="small" />
    </div>

    <section v-if="data.hasAccess" class="stack rise rise-1" style="--gap: 12px">
      <div class="row row--between">
        <h2 class="h2">Para hoje</h2>
        <Button label="Registro livre" icon="pi pi-plus" size="small" severity="secondary" outlined @click="openLog({ kind: 'checkin' })" />
      </div>

      <article v-for="w in data.today.workouts" :key="`w${w.assignmentId}`" class="today-card" :class="{ done: isWorkoutDone(w.workout.id) }">
        <header class="today-card__head">
          <div class="grow">
            <span class="today-card__tag"><i class="pi pi-bolt" /> Personal</span>
            <h3 class="today-card__title">{{ w.workout.title }}</h3>
            <p v-if="w.workout.description" class="small muted">{{ w.workout.description }}</p>
          </div>
          <span v-if="isWorkoutDone(w.workout.id)" class="today-card__done"><i class="pi pi-check" /> Feito</span>
        </header>
        <TrainingWorkoutPlayer
          :assignment-id="w.assignmentId"
          :workout-id="w.workout.id"
          :items="w.workout.items"
          :done="isWorkoutDone(w.workout.id)"
          @log="(extra) => openLog({ kind: 'treino', assignmentId: w.assignmentId, workoutId: w.workout.id, title: w.workout.title, ...extra })"
        />
      </article>

      <article v-for="r in data.today.runs" :key="`r${r.session.id}`" class="today-card" :class="{ done: isRunDone(r.session.id) }">
        <span class="today-card__tag"><i class="pi pi-map" /> {{ r.planTitle }}</span>
        <TrainingRunSession :session="r.session" class="today-card__run">
          <span v-if="isRunDone(r.session.id)" class="today-card__done"><i class="pi pi-check" /> Feito</span>
        </TrainingRunSession>
        <Button
          v-if="!isRunDone(r.session.id)"
          label="Registrar corrida"
          icon="pi pi-check"
          fluid
          class="today-card__cta"
          @click="openLog({ kind: 'corrida', assignmentId: r.assignmentId, runSessionId: r.session.id, title: LABELS.runType[r.session.type], suggestedKm: r.session.distanceKm })"
        />
      </article>

      <div v-if="nothingToday" class="today-card today-card--rest">
        <AppEmptyState icon="pi-moon" title="Dia de descanso" text="Nada programado para hoje. Fez alguma atividade extra? Registre aqui.">
          <Button label="Registrar atividade" icon="pi pi-plus" severity="secondary" outlined size="small" @click="openLog({ kind: 'checkin' })" />
        </AppEmptyState>
      </div>
    </section>

    <section v-if="data.recent.length" class="recent rise rise-2">
      <div class="row row--between">
        <h2 class="h2">Atividade recente</h2>
        <Button as="router-link" to="/app/aluno/historico" label="Ver tudo" icon="pi pi-arrow-right" icon-pos="right" size="small" text />
      </div>
      <div class="divided">
        <TrainingActivityItem v-for="l in data.recent" :key="l.id" :log="l">
          <Button label="Compartilhar" icon="pi pi-share-alt" size="small" text class="share-btn" @click="openShare(storyFromLog(l, firstName(user?.name)))" />
        </TrainingActivityItem>
      </div>
    </section>

    <TrainingLogDialog v-model:visible="logOpen" :context="logContext" @saved="onSaved" />
    <TrainingShareDialog v-model:visible="shareOpen" :story="story" />
  </div>
</template>

<style scoped>
.share-btn { margin: 6px 0 0 -10px; }
.hero { padding: 24px 22px 20px; }
.hero__lanes { position: absolute; top: 0; right: 0; z-index: -1; width: 70%; height: 62%; opacity: 0.7; -webkit-mask-image: linear-gradient(180deg, #000 40%, transparent); mask-image: linear-gradient(180deg, #000 40%, transparent); }
.hero__lanes path { fill: none; stroke: #333; stroke-width: 1.4; vector-effect: non-scaling-stroke; }
.hero__lanes path:nth-child(3) { stroke: var(--cl-volt); stroke-dasharray: 6 8; opacity: 0.8; }
.hero__top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.hero__hello { font-family: var(--font-display); font-size: 1rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--cl-volt); }
.hero__name { margin-top: 6px; font-family: var(--font-display); font-size: clamp(3rem, 12vw, 4.6rem); font-weight: 800; text-transform: uppercase; line-height: 0.86; }
.hero__date { margin-top: 10px; font-size: 0.88rem; color: #a8a7a4; }
.hero__date::first-letter { text-transform: uppercase; }
.ring { width: 74px; height: 74px; flex-shrink: 0; transform: rotate(-90deg); }
.ring circle { fill: none; stroke-width: 3.4; }
.ring__bg { stroke: #3a3a3a; }
.ring__fg { stroke: var(--cl-volt); stroke-linecap: round; transition: stroke-dasharray 0.8s var(--ease-out); }
.ring text { transform: rotate(90deg); transform-origin: 18px 18px; font-family: var(--font-display); font-size: 9px; font-weight: 800; fill: var(--cl-bone); }
.hero__kpis { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 22px; border-top: 1px solid #3a3a3a; }
.hero__kpis div { padding: 14px 0 0; }
.hero__kpis div + div { padding-left: 14px; border-left: 1px solid #3a3a3a; }
.hero__kpis strong { display: block; font-family: var(--font-display); font-size: clamp(2rem, 7vw, 2.8rem); font-weight: 800; line-height: 0.9; color: var(--cl-volt); font-variant-numeric: tabular-nums; }
.hero__kpis span { display: block; margin-top: 4px; font-size: 0.75rem; font-weight: 700; color: #a8a7a4; }

.cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; padding: 16px 18px; border-radius: var(--radius); background: var(--accent-soft); border: 1px solid color-mix(in srgb, var(--accent-text) 30%, transparent); }
.cta__icon { width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center; background: var(--cl-ink); color: var(--cl-volt); }

.today-card { display: flex; flex-direction: column; gap: 14px; padding: 18px; border-radius: var(--radius-lg); background: var(--app-tile); border: 1px solid var(--app-border); transition: border-color 0.3s; }
.today-card.done { border-color: color-mix(in srgb, var(--accent-text) 45%, transparent); }
.today-card__head { display: flex; gap: 12px; align-items: flex-start; }
.today-card__tag { display: inline-flex; align-items: center; gap: 6px; width: fit-content; font-family: var(--font-display); font-size: 0.82rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--app-muted); }
.today-card__tag .pi { font-size: 0.75rem; color: var(--accent-text); }
.today-card__title { margin-top: 4px; font-family: var(--font-display); font-size: 2rem; font-weight: 800; text-transform: uppercase; line-height: 0.95; }
.today-card__done { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; background: var(--cl-volt); color: var(--cl-volt-ink); font-size: 0.78rem; font-weight: 800; white-space: nowrap; }
.today-card__done .pi { font-size: 0.7rem; }
.today-card--rest { padding: 0; }

.recent { padding: 18px 20px 4px; border-radius: var(--radius-lg); background: var(--app-tile); border: 1px solid var(--app-border); }
</style>
