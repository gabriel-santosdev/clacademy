<script setup lang="ts">
import type { SubscriptionStatus } from '#shared/utils/constants'

definePageMeta({ layout: 'app' })
useHead({ title: 'Alunos · CL Academy' })

const { data: alunos, scope, search, selected, selectedIds, emptyText, afterAssign } = await useCoachStudents()
const assignOpen = ref(false)
</script>

<template>
  <div class="stack" style="--gap: 16px">
    <AppPageHeader title="Alunos" :subtitle="`${alunos.length} aluno(s)`">
      <Button v-if="selected.length" :label="`Atribuir a ${selected.length}`" icon="pi pi-send" @click="assignOpen = true" />
    </AppPageHeader>

    <div class="row">
      <IconField class="grow" style="max-width: 360px">
        <InputIcon class="pi pi-search" />
        <InputText v-model="search" placeholder="Buscar por nome ou e-mail…" fluid />
      </IconField>
      <SelectButton v-model="scope" :options="SCOPE_OPTIONS" option-label="label" option-value="value" :allow-empty="false" />
    </div>

    <DataTable v-model:selection="selected" :value="alunos" data-key="id" paginator :rows="25" :always-show-paginator="false" striped-rows>
      <template #empty><AppEmptyState icon="pi-users" title="Nenhum aluno" :text="emptyText" /></template>
      <Column selection-mode="multiple" header-style="width: 3rem" />
      <Column header="Aluno">
        <template #body="{ data: a }">
          <NuxtLink :to="`/app/professor/alunos/${a.id}`" class="row row--nowrap" style="--gap: 10px">
            <Avatar :label="initials(a.name)" shape="circle" />
            <div style="min-width: 0">
              <strong class="small truncate" style="display: block">{{ a.name }}</strong>
              <span class="tiny muted truncate" style="display: block">{{ a.email }}</span>
            </div>
          </NuxtLink>
        </template>
      </Column>
      <Column header="Plano">
        <template #body="{ data: a }">
          <div v-if="a.subscription" class="stack" style="--gap: 4px">
            <span class="small nowrap">{{ a.subscription.planName }}</span>
            <Tag
              :value="LABELS.subscriptionStatus[a.subscription.status as SubscriptionStatus]"
              :severity="subscriptionSeverity(a.subscription.status)"
              style="width: fit-content"
            />
          </div>
          <span v-else class="small muted">Sem plano</span>
        </template>
      </Column>
      <Column header="Professor">
        <template #body="{ data: a }"><span class="small muted nowrap">{{ a.coachName ?? '—' }}</span></template>
      </Column>
      <Column header="Última atividade">
        <template #body="{ data: a }"><span class="small muted nowrap">{{ relativeTime(a.lastActivityAt) }}</span></template>
      </Column>
    </DataTable>

    <TrainingAssignDialog v-model:visible="assignOpen" :aluno-ids="selectedIds" @saved="afterAssign" />
  </div>
</template>
