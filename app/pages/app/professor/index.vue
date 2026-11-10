<script setup lang="ts">
definePageMeta({ layout: 'app' })
useHead({ title: 'Painel do professor · CL Academy' })

const { data, scope, feedback, name } = await useCoachFeed()
const { drafts, openId, send } = feedback
</script>

<template>
  <div v-if="data" class="stack" style="--gap: 20px">
    <AppPageHeader title="Painel" :subtitle="`Olá, ${name}! Acompanhe seus alunos.`">
      <Button as="router-link" to="/app/professor/treinos/novo" label="Novo treino" icon="pi pi-plus" severity="secondary" />
      <Button as="router-link" to="/app/professor/corridas/novo" label="Nova planilha" icon="pi pi-plus" />
    </AppPageHeader>

    <div class="grid-auto" style="--min: 170px; --gap: 12px">
      <AppStatCard label="Meus alunos" :value="data.stats.myStudents" icon="pi-users" />
      <AppStatCard label="Treinos (7 dias)" :value="data.stats.weekLogs" icon="pi-bolt" />
      <AppStatCard ink label="Sem feedback" :value="data.stats.pendingFeedback" icon="pi-comment" hint="registros dos últimos 7 dias" />
    </div>

    <Card>
      <template #title>
        <div class="row row--between">
          <span>Atividade dos alunos</span>
          <SelectButton v-model="scope" :options="SCOPE_OPTIONS" option-label="label" option-value="value" :allow-empty="false" size="small" />
        </div>
      </template>
      <template #content>
        <AppEmptyState v-if="!data.logs.length" icon="pi-history" title="Sem atividade ainda" text="Quando seus alunos registrarem treinos, eles aparecem aqui." />
        <div v-else class="divided" style="margin: -14px 0">
          <TrainingActivityItem v-for="l in data.logs" :key="l.id" :log="l" show-aluno>
            <template v-if="!l.feedback">
              <Button v-if="openId !== l.id" label="Dar feedback" icon="pi pi-comment" size="small" text class="fb-btn" @click="openId = l.id" />
              <CoachingFeedbackForm v-else v-model="drafts[l.id]" placeholder="Mandou bem! Na próxima…" :loading="send.loading.value" @submit="send(l.id)" />
            </template>
          </TrainingActivityItem>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.fb-btn { margin-top: 6px; margin-left: -10px; }
</style>
