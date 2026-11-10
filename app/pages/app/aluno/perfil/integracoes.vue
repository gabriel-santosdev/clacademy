<script setup lang="ts">
definePageMeta({ layout: 'app' })
useHead({ title: 'Relógio e apps · CL Academy' })

const { data, sync, disconnect, rate, connectUrl } = await useIntegrations()
</script>

<template>
  <div v-if="data" class="stack" style="--gap: 24px">
    <AppPageHeader title="Relógio e apps" subtitle="Treinou no relógio, o check-out acontece sozinho" back="/app/aluno/perfil" />

    <IntegrationStravaCard
      :strava="data.strava"
      :connect-url="connectUrl"
      :syncing="sync.loading.value"
      :disconnecting="disconnect.loading.value"
      @sync="sync()"
      @disconnect="disconnect()"
    />

    <IntegrationPushCard v-if="data.strava.connected" />

    <IntegrationRecentList v-if="data.strava.connected" :logs="data.recent" :rating="rate.loading.value" @rate="(id, rpe) => rate(id, rpe)" />

    <IntegrationDeviceGrid
      :devices="data.devices"
      :strava-connected="data.strava.connected"
      :strava-available="data.strava.available"
      :connect-url="connectUrl"
    />

    <section class="why">
      <i class="pi pi-info-circle" />
      <p class="small muted">
        <b>Por que pelo Strava?</b> A Apple não libera os dados do Apple Watch para sites, e Garmin, Coros e Polar só abrem
        acesso direto a parceiros. Todos falam com o Strava, então ele leva o seu treino até aqui com segurança.
        Só lemos as suas atividades; nada é publicado no seu perfil.
      </p>
    </section>
  </div>
</template>

<style scoped>
.why { display: flex; gap: 12px; padding: 4px 4px 0; }
.why .pi { margin-top: 3px; color: var(--app-muted); }
.why b { color: var(--app-text); }
</style>
