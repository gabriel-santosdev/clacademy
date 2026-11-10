<script setup lang="ts">
definePageMeta({ layout: 'app' })
useHead({ title: 'Dashboard · CL Academy' })

const { data, openPayments, byPlan } = await useFinanceDashboard()
</script>

<template>
  <div v-if="data" class="stack" style="--gap: 20px">
    <AppPageHeader title="Dashboard" subtitle="Visão geral da CL Academy">
      <Button as="router-link" to="/app/admin/planos/novo" label="Novo plano" icon="pi pi-plus" />
    </AppPageHeader>

    <div class="grid-auto" style="--min: 180px; --gap: 12px">
      <AppStatCard ink label="Receita recorrente" :value="formatBRL(data.stats.mrrCents)" hint="MRR (equivalente mensal)" icon="pi-chart-line" />
      <AppStatCard label="Assinaturas ativas" :value="data.stats.activeSubscriptions" icon="pi-users" />
      <AppStatCard label="Em teste" :value="data.stats.trialing" icon="pi-star" />
      <AppStatCard label="Inadimplentes" :value="data.stats.pastDue" :hint="`${data.stats.overduePayments} cobranças vencidas`" icon="pi-exclamation-circle" />
    </div>

    <div class="grid-2">
      <Card>
        <template #title>Receita recebida</template>
        <template #subtitle>Últimos 6 meses</template>
        <template #content>
          <AppBarChart
            :labels="data.revenue.map((r) => r.label)"
            :values="data.revenue.map((r) => r.totalCents)"
            :format="compactBRL"
            height="220px"
          />
        </template>
      </Card>

      <Card>
        <template #title>Assinantes por plano</template>
        <template #content>
          <AppEmptyState v-if="!byPlan.length" icon="pi-tags" title="Sem assinantes ainda" />
          <div v-else class="stack" style="--gap: 14px">
            <div v-for="p in byPlan" :key="p.name" class="stack" style="--gap: 6px">
              <div class="row row--between small"><span>{{ p.name }}</span><strong class="mono">{{ p.count }}</strong></div>
              <ProgressBar :value="p.pct" :show-value="false" style="height: 8px" />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <Card>
      <template #title>
        <div class="row row--between">
          <span>Cobranças em aberto</span>
          <Button as="router-link" to="/app/admin/financeiro" label="Financeiro" icon="pi pi-arrow-right" icon-pos="right" size="small" text />
        </div>
      </template>
      <template #content>
        <AppEmptyState v-if="!openPayments.length" icon="pi-check-circle" title="Tudo em dia" text="Nenhuma cobrança pendente ou vencida." />
        <div v-else class="divided">
          <div v-for="p in openPayments" :key="p.id" class="list-row">
            <Avatar :label="initials(p.user.name)" shape="circle" />
            <div class="grow">
              <strong class="small">{{ p.user.name }}</strong>
              <p class="tiny muted">{{ p.subscription.plan.name }} · vence {{ formatDate(p.dueDate) }}</p>
            </div>
            <span class="mono small">{{ formatBRL(p.amountCents) }}</span>
            <Tag :value="LABELS.paymentStatus[p.status]" :severity="paymentSeverity(p.status)" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
