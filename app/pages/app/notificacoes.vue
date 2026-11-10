<script setup lang="ts">
definePageMeta({ layout: 'app' })
useHead({ title: 'Notificações · CL Academy' })

const { data: items, markAllRead } = await useNotifications()
onMounted(markAllRead)
</script>

<template>
  <div>
    <AppPageHeader title="Notificações" subtitle="Avisos, feedbacks e pagamentos" />
    <Card>
      <template #content>
        <AppEmptyState v-if="!items.length" icon="pi-bell" title="Nada por aqui" text="Quando houver novidades, elas aparecem aqui." />
        <div v-else class="divided">
          <component
            :is="n.url ? resolveComponent('NuxtLink') : 'div'"
            v-for="n in items"
            :key="n.id"
            :to="n.url ?? undefined"
            class="notif"
            :class="{ unread: !n.readAt }"
          >
            <span class="notif__dot" />
            <div class="grow">
              <strong class="small">{{ n.title }}</strong>
              <p v-if="n.body" class="small muted">{{ n.body }}</p>
            </div>
            <span class="tiny muted nowrap">{{ relativeTime(n.createdAt) }}</span>
          </component>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.notif { display: flex; gap: 12px; align-items: flex-start; padding: 14px 4px; color: inherit; }
a.notif:hover strong { text-decoration: underline; }
.notif__dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 7px; flex-shrink: 0; background: transparent; }
.notif.unread .notif__dot { background: var(--brand-wine); }
</style>
