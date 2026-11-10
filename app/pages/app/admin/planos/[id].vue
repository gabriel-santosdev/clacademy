<script setup lang="ts">
definePageMeta({ layout: 'app' })

const route = useRoute()
const editor = usePlanEditor(String(route.params.id))
const { isNew, form, prices, history, hasPrice, monthlyEquivalent, save, askRemove, addFeature, removeFeature } = editor
await editor.load()
useHead({ title: isNew ? 'Novo plano · CL Academy' : 'Editar plano · CL Academy' })

const modalityOptions = MODALITIES.map((m) => ({ label: LABELS.modality[m], value: m }))
const statusOptions = PLAN_STATUSES.map((s) => ({ label: LABELS.planStatus[s], value: s }))
</script>

<template>
  <div>
    <AppPageHeader :title="isNew ? 'Novo plano' : form.name || 'Plano'" back="/app/admin/planos">
      <Button v-if="!isNew" label="Excluir" icon="pi pi-trash" severity="danger" text @click="askRemove" />
      <Button label="Salvar" severity="secondary" :loading="save.loading.value" @click="save()" />
      <Button
        v-if="form.status !== 'published'"
        label="Salvar e publicar"
        icon="pi pi-globe"
        :loading="save.loading.value"
        :disabled="!hasPrice"
        @click="save(true)"
      />
    </AppPageHeader>

    <form class="layout" @submit.prevent="save()">
      <div class="stack" style="--gap: 20px">
        <Card>
          <template #title>Informações</template>
          <template #content>
            <div class="stack">
              <div class="field">
                <label for="pl-name">Nome do plano</label>
                <InputText id="pl-name" v-model="form.name" placeholder="Assessoria CL Run" required fluid />
              </div>
              <div class="field">
                <label for="pl-desc">Descrição</label>
                <Textarea id="pl-desc" v-model="form.description" rows="3" auto-resize placeholder="O que o aluno recebe com este plano" fluid />
              </div>
              <div class="grid-2">
                <div class="field">
                  <label for="pl-mod">Modalidade</label>
                  <Select v-model="form.modality" input-id="pl-mod" :options="modalityOptions" option-label="label" option-value="value" fluid />
                </div>
                <div class="field">
                  <label for="pl-cpw">Sessões por semana</label>
                  <InputNumber v-model="form.classesPerWeek" input-id="pl-cpw" :min="0" placeholder="Ilimitado" fluid />
                </div>
              </div>
            </div>
          </template>
        </Card>

        <Card>
          <template #title>Preços</template>
          <template #subtitle>Deixe em branco as periodicidades que não quer oferecer</template>
          <template #content>
            <div class="stack" style="--gap: 12px">
              <div v-for="i in INTERVALS" :key="i" class="price-row">
                <label :for="`pr-${i}`" class="strong small">{{ LABELS.interval[i] }}</label>
                <InputNumber v-model="prices[i]" :input-id="`pr-${i}`" mode="currency" currency="BRL" locale="pt-BR" :min="0" placeholder="R$ 0,00" fluid />
                <span class="tiny muted">{{ monthlyEquivalent(i) }}</span>
              </div>
              <Message severity="secondary" size="small" icon="pi pi-info-circle">
                Ao alterar um valor, uma nova versão do preço é criada. Quem já assina continua pagando o valor contratado.
              </Message>
            </div>
          </template>
        </Card>

        <Card>
          <template #title>Benefícios</template>
          <template #subtitle>Aparecem na vitrine de planos</template>
          <template #content>
            <div class="stack" style="--gap: 8px">
              <div v-for="(_, i) in form.features" :key="i" class="row row--nowrap">
                <InputText v-model="form.features[i]" class="grow" placeholder="Ex: Planilha personalizada" />
                <Button icon="pi pi-times" text rounded severity="secondary" aria-label="Remover" @click="removeFeature(i)" />
              </div>
              <Button label="Adicionar benefício" icon="pi pi-plus" size="small" severity="secondary" class="fit" @click="addFeature" />
            </div>
          </template>
        </Card>
      </div>

      <div class="stack" style="--gap: 20px">
        <Card>
          <template #title>Publicação</template>
          <template #content>
            <div class="stack">
              <div class="field">
                <label for="pl-status">Status</label>
                <Select v-model="form.status" input-id="pl-status" :options="statusOptions" option-label="label" option-value="value" fluid />
                <small>Só planos publicados aparecem no site e no app.</small>
              </div>
              <label class="check"><ToggleSwitch v-model="form.highlight" /> Destacar como "Mais escolhido"</label>
              <div class="field">
                <label for="pl-trial">Dias de teste grátis</label>
                <InputNumber v-model="form.trialDays" input-id="pl-trial" :min="0" :max="90" show-buttons fluid />
              </div>
              <div class="field">
                <label for="pl-order">Ordem na vitrine</label>
                <InputNumber v-model="form.sortOrder" input-id="pl-order" :min="0" show-buttons fluid />
              </div>
            </div>
          </template>
        </Card>

        <Card v-if="history.length">
          <template #title>Histórico de preços</template>
          <template #content>
            <div class="divided">
              <div v-for="h in history" :key="h.id" class="list-row small">
                <span class="grow">{{ LABELS.interval[h.interval] }} <span class="tiny muted">v{{ h.version }}</span></span>
                <span class="mono">{{ formatBRL(h.amountCents) }}</span>
                <Tag :value="h.active ? 'atual' : formatDate(h.createdAt)" :severity="h.active ? 'success' : 'secondary'" />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </form>
  </div>
</template>

<style scoped>
.layout { display: grid; gap: 20px; grid-template-columns: 1fr; align-items: start; }
@media (min-width: 1000px) { .layout { grid-template-columns: minmax(0, 1fr) 320px; } }
.price-row { display: grid; grid-template-columns: 100px minmax(0, 220px) 1fr; align-items: center; gap: 12px; }
@media (max-width: 480px) { .price-row { grid-template-columns: 90px 1fr; } .price-row .tiny { grid-column: 2; } }
.fit { width: fit-content; }
</style>
