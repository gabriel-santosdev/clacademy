<script setup lang="ts">
import type { PublicPlan } from '../domain/pricing'
import type { BillingType } from '../domain/status'

const visible = defineModel<boolean>('visible', { default: false })
/** `form` é o objeto reativo do useCheckout; o diálogo só edita seus campos. */
defineProps<{
  form: { planId: number; priceId: number; billingType: BillingType; cpf: string }
  plan?: PublicPlan
  provider: string
  loading?: boolean
}>()
const emit = defineEmits<{ submit: [] }>()
</script>

<template>
  <Dialog v-model:visible="visible" modal :header="plan ? `Assinar ${plan.name}` : 'Assinar'" :style="{ width: 'min(480px, 96vw)' }" :breakpoints="{ '560px': '100vw' }">
    <form v-if="plan" id="checkout" class="stack" @submit.prevent="emit('submit')">
      <div class="field">
        <span class="field__label">Periodicidade</span>
        <div class="stack" style="--gap: 8px">
          <label v-for="pr in plan.prices" :key="pr.id" class="option" :class="{ active: form.priceId === pr.id }">
            <RadioButton v-model="form.priceId" :value="pr.id" name="price" />
            <span class="grow">{{ LABELS.interval[pr.interval] }}</span>
            <Tag v-if="savingsVsMonthly(plan.prices, pr)" :value="`-${savingsVsMonthly(plan.prices, pr)}%`" severity="success" />
            <strong class="mono">{{ formatBRL(pr.amountCents) }}</strong>
          </label>
        </div>
      </div>
      <template v-if="provider === 'asaas'">
        <div class="field">
          <label for="co-type">Forma de pagamento</label>
          <Select v-model="form.billingType" input-id="co-type" :options="[...BILLING_TYPES]" option-label="label" option-value="value" fluid />
        </div>
        <div class="field">
          <label for="co-cpf">CPF</label>
          <InputMask id="co-cpf" v-model="form.cpf" mask="999.999.999-99" :auto-clear="false" unmask required fluid />
          <small>Exigido pelo emissor da cobrança</small>
        </div>
      </template>
      <Message v-else severity="secondary" size="small" icon="pi pi-info-circle">
        Pagamento via Pix ou na recepção. Após a confirmação, seu acesso é liberado.
      </Message>
      <Message v-if="plan.trialDays" severity="success" size="small" icon="pi pi-gift">
        Você terá {{ plan.trialDays }} dias grátis. A primeira cobrança vence ao final do teste.
      </Message>
    </form>
    <template #footer>
      <Button label="Voltar" severity="secondary" text @click="visible = false" />
      <Button type="submit" form="checkout" label="Confirmar assinatura" :loading="loading" />
    </template>
  </Dialog>
</template>

<style scoped>
.option {
  display: flex; align-items: center; gap: 10px; padding: 12px 14px; cursor: pointer;
  border: 1px solid var(--app-border); border-radius: var(--p-border-radius-md); transition: border-color 0.15s, box-shadow 0.15s;
}
.option.active { border-color: var(--p-primary-color); box-shadow: 0 0 0 1px var(--p-primary-color); }
</style>
