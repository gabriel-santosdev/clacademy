<script setup lang="ts">
definePageMeta({ layout: 'app' })
useHead({ title: 'Meu plano · CL Academy' })

const route = useRoute()
const { data, refresh, sub, subscribable, pendingPayment, receiptLink, copyPix, askCancel } = await useMySubscription()
const { data: plans } = await usePublicPlans()
const { data: profile } = await useFetch('/api/me/profile', { key: 'me-profile' })

const checkout = useCheckout(plans, () => profile.value?.cpf ?? '', refresh)
const { visible: checkoutOpen, form: checkoutForm, plan: checkoutPlan } = checkout

onMounted(() => {
  const planId = Number(route.query.plano)
  if (planId && subscribable.value) checkout.start(planId)
})
</script>

<template>
  <div v-if="data" class="stack" style="--gap: 20px">
    <AppPageHeader title="Meu plano" subtitle="Assinatura, pagamentos e troca de plano" />

    <!-- assinatura atual -->
    <Card v-if="sub && sub.status !== 'canceled'">
      <template #title>
        <div class="row row--between">
          <span>{{ sub.plan.name }}</span>
          <Tag :value="LABELS.subscriptionStatus[sub.status]" :severity="subscriptionSeverity(sub.status)" />
        </div>
      </template>
      <template #subtitle>{{ LABELS.interval[sub.price.interval] }} · {{ formatBRL(sub.price.amountCents) }}</template>
      <template #content>
        <div class="stack" style="--gap: 12px">
          <p v-if="sub.currentPeriodEnd" class="small muted">
            {{ sub.status === 'trialing' ? 'Teste gratuito até' : 'Acesso válido até' }} <b>{{ formatDate(sub.currentPeriodEnd) }}</b>
          </p>

          <Message v-if="pendingPayment" :severity="pendingPayment.status === 'overdue' ? 'error' : 'warn'" :closable="false">
            <div class="stack" style="--gap: 10px">
              <div class="row row--between">
                <div>
                  <strong>{{ pendingPayment.status === 'overdue' ? 'Pagamento vencido' : 'Pagamento pendente' }}</strong>
                  <p class="small">{{ formatBRL(pendingPayment.amountCents) }} · vence em {{ formatDate(pendingPayment.dueDate) }}</p>
                </div>
                <Button v-if="pendingPayment.invoiceUrl" as="a" :href="pendingPayment.invoiceUrl" target="_blank" rel="noopener" label="Pagar agora" icon="pi pi-external-link" />
              </div>
              <template v-if="!pendingPayment.invoiceUrl">
                <p class="small">{{ data.manual.instructions }}</p>
                <div v-if="data.manual.pixKey" class="row">
                  <code class="pix">{{ data.manual.pixKey }}</code>
                  <Button label="Copiar Pix" icon="pi pi-copy" size="small" severity="secondary" @click="copyPix" />
                </div>
                <Button v-if="receiptLink" as="a" :href="receiptLink" target="_blank" rel="noopener" label="Enviar comprovante" icon="pi pi-whatsapp" size="small" severity="secondary" class="fit" />
              </template>
            </div>
          </Message>

          <div class="row row--end">
            <Button label="Cancelar assinatura" size="small" severity="secondary" text @click="askCancel" />
          </div>
        </div>
      </template>
    </Card>

    <Message v-else-if="sub?.status === 'canceled' && sub.hasAccess" severity="secondary" :closable="false">
      Sua assinatura foi cancelada, mas você ainda tem acesso até <b>{{ formatDate(sub.currentPeriodEnd) }}</b>.
    </Message>

    <!-- vitrine -->
    <section v-if="subscribable" class="stack" style="--gap: 16px">
      <h2 class="h2">{{ sub ? 'Escolha um novo plano' : 'Escolha seu plano' }}</h2>
      <Card v-if="!plans.length">
        <template #content><AppEmptyState icon="pi-tags" title="Nenhum plano disponível" text="Em breve novos planos por aqui." /></template>
      </Card>
      <div class="grid-auto" style="--min: 260px; --gap: 20px">
        <BillingPlanCard v-for="p in plans" :key="p.id" :plan="p">
          <Button label="Assinar" :outlined="!p.highlight" fluid @click="checkout.start(p.id)" />
        </BillingPlanCard>
      </div>
    </section>

    <!-- pagamentos -->
    <Card v-if="data.payments.length">
      <template #title>Pagamentos</template>
      <template #content><BillingPaymentsTable :payments="data.payments" /></template>
    </Card>

    <BillingCheckoutDialog
      v-model:visible="checkoutOpen"
      :form="checkoutForm"
      :plan="checkoutPlan"
      :provider="data.provider"
      :loading="checkout.submit.loading.value"
      @submit="checkout.submit()"
    />
  </div>
</template>

<style scoped>
.pix { padding: 6px 10px; border-radius: var(--p-border-radius-sm); background: var(--app-surface); font-size: 0.85rem; word-break: break-all; }
.fit { width: fit-content; }
</style>
