<script setup lang="ts">
import type { PaymentStatus } from '#shared/utils/constants'

definePageMeta({ layout: 'app' })
useHead({ title: 'Financeiro · CL Academy' })

const { data, status, updatePayment, chargeNext, enrollOpen, enrollForm, alunoOptions, priceOptions, openEnroll, enroll } = await useFinance()

const statusFilters = [{ label: 'Todas', value: '' }, ...PAYMENT_STATUSES.map((s) => ({ label: LABELS.paymentStatus[s], value: s }))]
</script>

<template>
  <div v-if="data" class="stack" style="--gap: 20px">
    <AppPageHeader title="Financeiro" :subtitle="`Gateway: ${data.provider === 'asaas' ? 'Asaas (automático)' : 'Manual (baixa pelo admin)'}`">
      <Button label="Matrícula presencial" icon="pi pi-plus" @click="openEnroll" />
    </AppPageHeader>

    <div class="grid-auto" style="--min: 170px; --gap: 12px">
      <AppStatCard ink label="MRR" :value="formatBRL(data.stats.mrrCents)" icon="pi-chart-line" />
      <AppStatCard label="Ativas" :value="data.stats.activeSubscriptions" icon="pi-users" />
      <AppStatCard label="Pendentes" :value="data.stats.pendingPayments" icon="pi-clock" />
      <AppStatCard label="Vencidas" :value="data.stats.overduePayments" icon="pi-exclamation-circle" />
    </div>

    <SelectButton v-model="status" :options="statusFilters" option-label="label" option-value="value" :allow-empty="false" class="filters" />

    <DataTable :value="data.payments" data-key="id" paginator :rows="20" :always-show-paginator="false" striped-rows scrollable>
      <template #empty><AppEmptyState icon="pi-wallet" title="Nenhuma cobrança" /></template>
      <Column header="Aluno">
        <template #body="{ data: p }">
          <strong class="small" style="display: block">{{ p.user.name }}</strong>
          <span class="tiny muted">{{ p.user.email }}</span>
        </template>
      </Column>
      <Column header="Plano">
        <template #body="{ data: p }"><span class="small nowrap">{{ p.subscription.plan.name }}</span></template>
      </Column>
      <Column header="Vencimento">
        <template #body="{ data: p }">
          <span class="small nowrap">{{ formatDate(p.dueDate) }}</span>
          <span v-if="p.paidAt" class="tiny muted" style="display: block">pago {{ formatDate(p.paidAt) }}</span>
        </template>
      </Column>
      <Column header="Valor">
        <template #body="{ data: p }"><span class="mono small nowrap">{{ formatBRL(p.amountCents) }}</span></template>
      </Column>
      <Column header="Status">
        <template #body="{ data: p }"><Tag :value="LABELS.paymentStatus[p.status as PaymentStatus]" :severity="paymentSeverity(p.status)" /></template>
      </Column>
      <Column header="Ações">
        <template #body="{ data: p }">
          <div class="row row--nowrap" style="--gap: 4px">
            <template v-if="isOpenPayment(p.status)">
              <Button label="Baixar" icon="pi pi-check" size="small" :loading="updatePayment.loading.value" @click="updatePayment(p.id, 'confirm')" />
              <Button label="Cancelar" size="small" text severity="secondary" :loading="updatePayment.loading.value" @click="updatePayment(p.id, 'cancel')" />
            </template>
            <Button
              v-else-if="p.status === 'paid' && data.provider === 'manual' && p.subscription.status === 'active'"
              v-tooltip.top="'Gerar próxima mensalidade'"
              label="Próxima"
              icon="pi pi-plus"
              size="small"
              text
              :loading="chargeNext.loading.value"
              @click="chargeNext(p.subscription.id)"
            />
            <Button v-if="p.invoiceUrl" as="a" :href="p.invoiceUrl" target="_blank" rel="noopener" label="Fatura" size="small" link />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="enrollOpen" modal header="Matrícula presencial" :style="{ width: 'min(500px, 96vw)' }">
      <form id="enroll" class="stack" @submit.prevent="enroll()">
        <div class="field">
          <label for="en-aluno">Aluno</label>
          <Select v-model="enrollForm.userId" input-id="en-aluno" :options="alunoOptions" option-label="label" option-value="value" filter placeholder="Selecione…" fluid />
          <small>O aluno precisa ter conta. Cadastre em Usuários, se necessário.</small>
        </div>
        <div class="field">
          <label for="en-price">Plano e periodicidade</label>
          <Select v-model="enrollForm.planPriceId" input-id="en-price" :options="priceOptions" option-label="label" option-value="value" placeholder="Selecione…" fluid />
        </div>
        <div class="field">
          <label for="en-method">Forma de pagamento</label>
          <Select v-model="enrollForm.method" input-id="en-method" :options="IN_PERSON_METHODS" option-label="label" option-value="value" fluid />
        </div>
        <label class="check"><ToggleSwitch v-model="enrollForm.markPaid" /> Pagamento já recebido (ativa na hora)</label>
        <Message severity="secondary" size="small">Se o aluno tiver uma assinatura vigente, ela será substituída.</Message>
      </form>
      <template #footer>
        <Button label="Cancelar" severity="secondary" text @click="enrollOpen = false" />
        <Button
          type="submit"
          form="enroll"
          label="Matricular"
          :loading="enroll.loading.value"
          :disabled="!enrollForm.userId || !enrollForm.planPriceId"
        />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.filters { flex-wrap: wrap; }
</style>
