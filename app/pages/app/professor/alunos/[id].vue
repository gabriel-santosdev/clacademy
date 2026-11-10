<script setup lang="ts">
definePageMeta({ layout: 'app' })

const route = useRoute()
const id = Number(route.params.id)
const { data, refresh, stats, whatsapp, isMine, coach, feedback, setCoach, setProfile, takeOver, release, askEndAssignment } = await useCoachStudent(id)
const { drafts, send } = feedback
useHead({ title: () => `${data.value?.aluno.name ?? 'Aluno'} · CL Academy` })

const assignOpen = ref(false)
</script>

<template>
  <div v-if="data" class="stack" style="--gap: 20px">
    <AppPageHeader :title="data.aluno.name" :subtitle="data.aluno.email" back="/app/professor/alunos">
      <Button v-if="whatsapp" as="a" :href="whatsapp" target="_blank" rel="noopener" label="WhatsApp" icon="pi pi-whatsapp" severity="secondary" />
      <Button label="Atribuir treino" icon="pi pi-send" @click="assignOpen = true" />
    </AppPageHeader>

    <div class="grid-auto" style="--min: 170px; --gap: 12px">
      <AppStatCard label="Treinos (30d)" :value="stats.sessions" icon="pi-bolt" />
      <AppStatCard label="Km (30d)" :value="stats.km" icon="pi-map" />
      <AppStatCard ink label="Esforço médio" :value="stats.rpe" icon="pi-gauge" />
    </div>

    <div class="grid-2">
      <Card>
        <template #title>Plano</template>
        <template #content>
          <div v-if="data.subscription" class="stack" style="--gap: 6px">
            <div class="row row--between">
              <strong>{{ data.subscription.plan.name }}</strong>
              <Tag :value="LABELS.subscriptionStatus[data.subscription.status]" :severity="subscriptionSeverity(data.subscription.status)" />
            </div>
            <p class="small muted">Válido até {{ formatDate(data.subscription.currentPeriodEnd) }}</p>
          </div>
          <p v-else class="small muted">Sem plano contratado.</p>
        </template>
      </Card>
      <Card>
        <template #title>Professor responsável</template>
        <template #content>
          <div class="row row--between">
            <p class="small">{{ coach }}</p>
            <Button v-if="!isMine" label="Assumir aluno" size="small" :loading="setCoach.loading.value" @click="takeOver" />
            <Button v-else label="Liberar" size="small" text severity="secondary" :loading="setCoach.loading.value" @click="release" />
          </div>
        </template>
      </Card>
    </div>

    <Card>
      <template #title>Perfil de treino</template>
      <template #subtitle>Usado para sugerir as fichas certas na hora de atribuir</template>
      <template #content>
        <div class="grid-2">
          <div class="field">
            <label for="p-level">Nível</label>
            <Select
              :model-value="data.aluno.trainingLevel"
              input-id="p-level"
              :options="LEVEL_OPTIONS"
              option-label="label"
              option-value="value"
              placeholder="Não definido"
              show-clear
              :loading="setProfile.loading.value"
              fluid
              @update:model-value="(v) => setProfile({ trainingLevel: v ?? null })"
            />
          </div>
          <div class="field">
            <label for="p-goal">Objetivo</label>
            <Select
              :model-value="data.aluno.trainingGoal"
              input-id="p-goal"
              :options="GOAL_OPTIONS"
              option-label="label"
              option-value="value"
              placeholder="Não definido"
              show-clear
              :loading="setProfile.loading.value"
              fluid
              @update:model-value="(v) => setProfile({ trainingGoal: v ?? null })"
            />
          </div>
        </div>
      </template>
    </Card>

    <Card>
      <template #title>Treinos atribuídos</template>
      <template #content>
        <AppEmptyState v-if="!data.assignments.length" icon="pi-bolt" title="Nada atribuído" text="Envie um treino ou planilha de corrida para este aluno.">
          <Button label="Atribuir" size="small" @click="assignOpen = true" />
        </AppEmptyState>
        <div v-else class="divided">
          <div v-for="a in data.assignments" :key="a.id" class="list-row">
            <i :class="['pi', a.workout ? 'pi-bolt' : 'pi-map', 'muted']" />
            <div class="grow">
              <NuxtLink :to="a.workout ? `/app/professor/treinos/${a.workout.id}` : `/app/professor/corridas/${a.runPlan!.id}`" class="strong small">
                {{ a.workout?.title ?? a.runPlan?.title }}
              </NuxtLink>
              <p class="tiny muted">
                desde {{ formatDate(a.startDate) }}
                <template v-if="a.endDate"> até {{ formatDate(a.endDate) }}</template>
                <template v-if="a.runPlan"> · semana {{ a.currentWeek }}/{{ a.runPlan.weeks }}</template>
                <template v-if="a.weekdays.length"> · {{ a.weekdays.map((d) => WEEKDAYS_SHORT[d]).join(', ') }}</template>
              </p>
            </div>
            <Button
              icon="pi pi-times"
              text
              rounded
              severity="secondary"
              aria-label="Encerrar atribuição"
              @click="askEndAssignment(a.id, a.workout?.title ?? a.runPlan?.title ?? '')"
            />
          </div>
        </div>
      </template>
    </Card>

    <Card>
      <template #title>Histórico</template>
      <template #content>
        <AppEmptyState v-if="!data.logs.length" icon="pi-history" title="Sem registros" />
        <div v-else class="divided" style="margin: -14px 0">
          <TrainingActivityItem v-for="l in data.logs" :key="l.id" :log="l">
            <CoachingFeedbackForm v-if="!l.feedback" v-model="drafts[l.id]" :loading="send.loading.value" @submit="send(l.id)" />
          </TrainingActivityItem>
        </div>
      </template>
    </Card>

    <TrainingAssignDialog
      v-model:visible="assignOpen"
      :aluno-ids="[id]"
      :profile="{ level: data.aluno.trainingLevel, goal: data.aluno.trainingGoal }"
      @saved="refresh"
    />
  </div>
</template>
