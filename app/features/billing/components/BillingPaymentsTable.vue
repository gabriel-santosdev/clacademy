<script setup lang="ts">
import type { PaymentStatus } from '#shared/utils/constants'

defineProps<{
  payments: { id: number; dueDate: string | null; amountCents: number; method: string | null; status: string; invoiceUrl: string | null }[]
}>()
</script>

<template>
  <DataTable :value="payments" data-key="id" size="small" striped-rows>
    <Column header="Vencimento">
      <template #body="{ data }"><span class="nowrap">{{ formatDate(data.dueDate) }}</span></template>
    </Column>
    <Column header="Valor">
      <template #body="{ data }"><span class="mono nowrap">{{ formatBRL(data.amountCents) }}</span></template>
    </Column>
    <Column header="Forma">
      <template #body="{ data }"><span class="small muted">{{ data.method ?? '—' }}</span></template>
    </Column>
    <Column header="Status">
      <template #body="{ data }">
        <Tag :value="LABELS.paymentStatus[data.status as PaymentStatus]" :severity="paymentSeverity(data.status)" />
      </template>
    </Column>
    <Column>
      <template #body="{ data }">
        <a v-if="data.invoiceUrl" :href="data.invoiceUrl" target="_blank" rel="noopener" class="small strong">Fatura <i class="pi pi-external-link" style="font-size: 0.7rem" /></a>
      </template>
    </Column>
  </DataTable>
</template>
