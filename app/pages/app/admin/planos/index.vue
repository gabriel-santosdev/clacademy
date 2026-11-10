<script setup lang="ts">
definePageMeta({ layout: 'app' })
useHead({ title: 'Planos & preços · CL Academy' })

const { filter, list, setStatus } = await useAdminPlans()
const filters = [
  { label: 'Todos', value: 'all' },
  { label: 'Publicados', value: 'published' },
  { label: 'Rascunhos', value: 'draft' },
  { label: 'Arquivados', value: 'archived' },
]
</script>

<template>
  <div class="stack" style="--gap: 16px">
    <AppPageHeader title="Planos & preços" subtitle="Crie planos, defina preços e publique para os alunos">
      <Button as="router-link" to="/app/admin/planos/novo" label="Novo plano" icon="pi pi-plus" />
    </AppPageHeader>

    <SelectButton v-model="filter" :options="filters" option-label="label" option-value="value" :allow-empty="false" />

    <Card v-if="!list.length">
      <template #content>
        <AppEmptyState icon="pi-tags" title="Nenhum plano aqui" text="Crie um plano de personal ou de assessoria de corrida.">
          <Button as="router-link" to="/app/admin/planos/novo" label="Criar plano" icon="pi pi-plus" />
        </AppEmptyState>
      </template>
    </Card>

    <div class="grid-auto" style="--min: 290px">
      <Card v-for="p in list" :key="p.id">
        <template #content>
          <div class="stack" style="--gap: 12px">
            <div class="row row--between">
              <div class="row" style="--gap: 6px">
                <Tag :value="LABELS.planStatus[p.status]" :severity="planStatusSeverity(p.status)" />
                <Tag :value="LABELS.modality[p.modality]" severity="secondary" />
              </div>
              <i v-if="p.highlight" class="pi pi-star-fill" style="color: var(--brand-wine)" title="Destaque" />
            </div>
            <NuxtLink :to="`/app/admin/planos/${p.id}`" class="h2">{{ p.name }}</NuxtLink>
            <ul class="prices">
              <li v-for="pr in p.prices.filter((x) => x.active)" :key="pr.id">
                <span class="small muted">{{ LABELS.interval[pr.interval] }}</span>
                <strong class="mono small">{{ formatBRL(pr.amountCents) }}</strong>
              </li>
              <li v-if="!p.prices.some((x) => x.active)" class="small" style="color: var(--p-orange-600)">Sem preço definido</li>
            </ul>
            <p class="tiny muted">{{ p.activeSubscribers }} assinante(s) ativo(s)</p>
            <div class="row">
              <Button as="router-link" :to="`/app/admin/planos/${p.id}`" label="Editar" icon="pi pi-pencil" size="small" severity="secondary" />
              <Button
                v-if="p.status !== 'published'"
                label="Publicar"
                icon="pi pi-globe"
                size="small"
                :loading="setStatus.loading.value"
                @click="setStatus(p.id, 'published')"
              />
              <Button v-else label="Despublicar" size="small" text :loading="setStatus.loading.value" @click="setStatus(p.id, 'draft')" />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.prices { display: flex; flex-direction: column; gap: 4px; padding: 10px 0; border-top: 1px solid var(--app-border); border-bottom: 1px solid var(--app-border); }
.prices li { display: flex; justify-content: space-between; }
</style>
