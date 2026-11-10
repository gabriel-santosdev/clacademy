<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'

/** Strava: o hub que traz os treinos do relógio. Conectar, ver status, sincronizar, desconectar. */
const props = defineProps<{
  strava: {
    available: boolean
    connected: boolean
    athleteName: string | null
    lastSyncAt: string | Date | null
    autoSync: boolean
    imported: number
  }
  connectUrl: string
  syncing: boolean
  disconnecting: boolean
}>()
const emit = defineEmits<{ sync: []; disconnect: [] }>()

const confirm = useConfirm()
function askDisconnect() {
  confirm.require({
    header: 'Desconectar o Strava?',
    message: 'Os treinos já importados continuam aqui. Os próximos deixam de chegar e de dar check-out sozinhos.',
    acceptLabel: 'Desconectar',
    rejectLabel: 'Cancelar',
    acceptProps: { severity: 'danger' },
    rejectProps: { severity: 'secondary', text: true },
    accept: () => emit('disconnect'),
  })
}
const firstName = computed(() => props.strava.athleteName?.split(' ')[0] ?? null)
</script>

<template>
  <section class="tile-ink strava rise">
    <template v-if="!strava.available">
      <p class="strava__kicker">Em breve</p>
      <h2 class="strava__title">Treinou no relógio,<br><em>já vai estar feito aqui.</em></h2>
      <p class="strava__lead">
        Estamos preparando a sincronização com relógios. Quando chegar, o treino do seu Apple Watch, Garmin ou outro relógio
        vai marcar o treino do dia como feito e avisar o seu professor, sem você digitar nada.
      </p>
      <IntegrationFlow class="strava__flow" />
      <p class="strava__soon">Por enquanto, registre seus treinos pela tela <NuxtLink to="/app/aluno">Hoje</NuxtLink>.</p>
    </template>

    <template v-else-if="!strava.connected">
      <p class="strava__kicker">Relógio e apps</p>
      <h2 class="strava__title">Treinou no relógio,<br><em>já está feito aqui.</em></h2>
      <p class="strava__lead">
        Conecte o Strava uma vez. Cada treino do seu Apple Watch, Garmin ou outro relógio chega sozinho,
        marca o treino do dia como feito e avisa o seu professor.
      </p>
      <IntegrationFlow class="strava__flow" />
      <a :href="connectUrl" class="strava__connect">
        <b>S</b> Conectar com Strava
      </a>
    </template>

    <template v-else>
      <div class="strava__head">
        <span class="strava__badge"><b>S</b></span>
        <div class="grow">
          <p class="strava__kicker">Strava conectado</p>
          <h2 class="strava__name">{{ firstName ? `Olá, ${firstName}` : 'Tudo pronto' }}</h2>
        </div>
        <span class="strava__mode" :class="{ 'strava__mode--live': strava.autoSync }">
          <i />{{ strava.autoSync ? 'Automático' : 'Manual' }}
        </span>
      </div>

      <IntegrationFlow class="strava__flow" :live="strava.autoSync" />

      <p class="strava__lead">
        <template v-if="strava.autoSync">Os treinos chegam sozinhos, segundos depois de irem para o Strava, e já dão check-out no treino do dia.</template>
        <template v-else>Toque em sincronizar depois de treinar. O check-out do treino do dia é feito na hora.</template>
      </p>

      <dl class="strava__stats">
        <div><dt>Importados</dt><dd>{{ strava.imported }}</dd></div>
        <div><dt>Última vez</dt><dd class="small">{{ strava.lastSyncAt ? relativeTime(strava.lastSyncAt) : 'agora' }}</dd></div>
      </dl>

      <div class="strava__actions">
        <button type="button" class="strava__sync" :disabled="syncing" @click="emit('sync')">
          <i class="pi pi-refresh" :class="{ 'pi-spin': syncing }" /> {{ syncing ? 'Sincronizando…' : 'Sincronizar agora' }}
        </button>
        <button type="button" class="strava__off" :disabled="disconnecting" @click="askDisconnect">Desconectar</button>
      </div>
    </template>
  </section>
</template>

<style scoped>
.strava { display: flex; flex-direction: column; gap: 14px; padding: 24px 20px 20px; }
.strava__kicker { font-family: var(--font-display); font-size: 0.85rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #a6a6a6; }
.strava__title { font-family: var(--font-display); font-size: clamp(2.1rem, 9vw, 2.8rem); font-weight: 800; text-transform: uppercase; line-height: 0.92; }
.strava__title em { font-style: italic; color: #8e8e8e; }
.strava__name { font-family: var(--font-display); font-size: 1.7rem; font-weight: 800; text-transform: uppercase; line-height: 1; }
.strava__lead { font-size: 0.92rem; line-height: 1.55; color: #b8b8b8; max-width: 520px; }
.strava__flow { margin: 6px 0 4px; max-width: 420px; }
.strava__soon { font-size: 0.85rem; color: #a6a6a6; }
.strava__soon a { color: var(--cl-hi); font-weight: 800; text-decoration: underline; text-underline-offset: 3px; }

/* botão no padrão de marca do Strava (laranja oficial) */
.strava__connect {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 52px; padding: 0 22px; border-radius: 999px;
  background: #fc4c02; color: #fff; font-weight: 800; font-size: 1rem; transition: transform 0.15s var(--ease-out), background 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.strava__connect b { font-family: var(--font-display); font-size: 1.3rem; line-height: 1; }
.strava__connect:active { transform: scale(0.97); }
@media (hover: hover) { .strava__connect:hover { background: #e34402; } }
@media (max-width: 520px) { .strava__connect { width: 100%; } }

.strava__head { display: flex; align-items: center; gap: 12px; }
.strava__badge { width: 46px; height: 46px; border-radius: 14px; display: grid; place-items: center; background: #fc4c02; color: #fff; flex-shrink: 0; }
.strava__badge b { font-family: var(--font-display); font-size: 1.5rem; }
.strava__mode {
  display: inline-flex; align-items: center; gap: 7px; padding: 6px 12px; border-radius: 999px;
  border: 1px solid #3a3a3a; font-size: 0.75rem; font-weight: 800; color: #b8b8b8; white-space: nowrap;
}
.strava__mode i { width: 8px; height: 8px; border-radius: 50%; background: #6b6b6b; }
.strava__mode--live { color: var(--cl-hi); border-color: #4a4a4a; }
.strava__mode--live i { background: var(--cl-hi); animation: live 1.8s ease-out infinite; }
@keyframes live { 0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.6); } 100% { box-shadow: 0 0 0 8px rgba(255, 255, 255, 0); } }

.strava__stats { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--cl-ink-line); padding-top: 14px; }
.strava__stats div + div { padding-left: 16px; border-left: 1px solid var(--cl-ink-line); }
.strava__stats dt { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #8e8e8e; }
.strava__stats dd { margin-top: 2px; font-family: var(--font-display); font-size: 1.9rem; font-weight: 800; line-height: 1; }
.strava__stats dd.small { font-family: var(--font-body); font-size: 0.95rem; font-weight: 700; padding-top: 8px; }

.strava__actions { display: flex; gap: 8px; flex-wrap: wrap; }
.strava__sync, .strava__off {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 46px; padding: 0 18px; border-radius: 999px;
  border: 0; font-weight: 800; font-size: 0.92rem; transition: transform 0.15s var(--ease-out), opacity 0.2s; -webkit-tap-highlight-color: transparent;
}
.strava__sync { flex: 1; background: var(--cl-hi); color: var(--cl-hi-ink); }
.strava__off { background: transparent; color: #a6a6a6; }
.strava__sync:active:not(:disabled), .strava__off:active:not(:disabled) { transform: scale(0.97); }
.strava__sync:disabled, .strava__off:disabled { opacity: 0.6; }
@media (min-width: 640px) { .strava__sync { flex: 0 0 auto; } }
</style>
