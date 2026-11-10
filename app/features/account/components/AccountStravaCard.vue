<script setup lang="ts">
const props = defineProps<{ connected: boolean; lastSyncAt: string | null; onChange: () => Promise<unknown> }>()
const strava = useStrava(props.onChange)
</script>

<template>
  <Card>
    <template #title>Strava</template>
    <template #subtitle>Importe suas corridas automaticamente</template>
    <template #content>
      <div class="row row--between">
        <p class="small muted">
          <template v-if="connected">
            <Tag severity="success" value="Conectado" /> · última sincronização {{ relativeTime(lastSyncAt) }}
          </template>
          <template v-else>Não conectado</template>
        </p>
        <div class="row">
          <template v-if="connected">
            <Button label="Sincronizar" icon="pi pi-refresh" size="small" severity="secondary" :loading="strava.sync.loading.value" @click="strava.sync()" />
            <Button label="Desconectar" size="small" text :loading="strava.disconnect.loading.value" @click="strava.disconnect()" />
          </template>
          <a v-else :href="strava.connectUrl" class="strava-btn">Conectar Strava</a>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.strava-btn {
  display: inline-flex; align-items: center; padding: 8px 14px; border-radius: var(--p-border-radius-md);
  background: #fc4c02; color: #fff; font-weight: 600; font-size: 0.875rem;
}
.strava-btn:hover { background: #e34402; }
</style>
