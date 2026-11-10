<script setup lang="ts">
definePageMeta({ layout: 'app' })
useHead({ title: 'Configurações · CL Academy' })

const { data, form, save } = await useSiteSettings()

const integrations = computed(() => {
  const i = data.value?.integrations
  if (!i) return []
  return [
    { label: 'Banco de dados', value: i.database, ok: i.database === 'postgres' },
    { label: 'Gateway de pagamento', value: i.paymentProvider, ok: i.paymentProvider === 'asaas', neutral: i.paymentProvider !== 'asaas' },
    ...(i.paymentProvider === 'asaas'
      ? [{ label: 'Webhook Asaas (/api/webhooks/asaas)', value: i.asaasWebhook ? 'token ok' : 'sem token', ok: i.asaasWebhook }]
      : []),
    { label: 'Notificações push (VAPID)', value: i.push ? 'ativo' : 'desligado', ok: i.push, neutral: !i.push },
    { label: 'Strava', value: i.strava ? 'ativo' : 'desligado', ok: i.strava, neutral: !i.strava },
  ]
})
</script>

<template>
  <div v-if="data" class="stack" style="--gap: 20px">
    <AppPageHeader title="Configurações" subtitle="Aparência do site, contatos e cobranças" />

    <form class="stack" style="--gap: 20px" @submit.prevent="save()">
      <Card>
        <template #title>Site e aparência</template>
        <template #content>
          <div class="stack">
            <div class="field">
              <span class="field__label">Tema</span>
              <div class="themes">
                <label v-for="t in SITE_THEMES" :key="t.value" class="theme" :class="{ active: form.theme === t.value }">
                  <RadioButton v-model="form.theme" :value="t.value" name="theme" class="sr-only" />
                  <span class="swatches"><i v-for="c in t.swatches" :key="c" :style="{ background: c }" /></span>
                  <strong class="small">{{ t.label }}</strong>
                </label>
              </div>
            </div>
            <label class="check"><ToggleSwitch v-model="form.showComingSoon" /> Exibir tela "Vem aí" no lugar da landing</label>
            <div class="grid-2">
              <div class="field"><label for="s-name">Nome</label><InputText id="s-name" v-model="form.gymName" fluid /></div>
              <div class="field">
                <label for="s-ig">Instagram</label>
                <InputGroup>
                  <InputGroupAddon>@</InputGroupAddon>
                  <InputText id="s-ig" v-model="form.instagram" placeholder="clacademyy" />
                </InputGroup>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #title>Pagamento manual</template>
        <template #subtitle>Usado quando o gateway é manual ou na matrícula presencial</template>
        <template #content>
          <div class="stack">
            <div class="grid-2">
              <div class="field"><label for="s-pix">Chave Pix</label><InputText id="s-pix" v-model="form.pixKey" fluid /></div>
              <div class="field">
                <label for="s-wa">WhatsApp para comprovantes</label>
                <InputText id="s-wa" v-model="form.whatsapp" placeholder="5511999999999" fluid />
              </div>
            </div>
            <div class="field">
              <label for="s-instr">Instruções exibidas ao aluno</label>
              <Textarea id="s-instr" v-model="form.paymentInstructions" rows="3" auto-resize fluid />
            </div>
          </div>
        </template>
      </Card>

      <div class="row row--end"><Button type="submit" label="Salvar configurações" icon="pi pi-check" :loading="save.loading.value" /></div>
    </form>

    <Card>
      <template #title>Integrações</template>
      <template #subtitle>Configuradas por variáveis de ambiente no servidor</template>
      <template #content>
        <div class="divided">
          <div v-for="i in integrations" :key="i.label" class="list-row">
            <span class="grow small">{{ i.label }}</span>
            <Tag :value="i.value" :severity="i.ok ? 'success' : i.neutral ? 'secondary' : 'danger'" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.themes { display: flex; gap: 12px; flex-wrap: wrap; }
.theme {
  display: flex; flex-direction: column; gap: 8px; min-width: 150px; padding: 12px 16px; cursor: pointer;
  border: 1px solid var(--app-border); border-radius: var(--radius);
}
.theme.active { border-color: var(--p-primary-color); box-shadow: 0 0 0 1px var(--p-primary-color); }
.swatches { display: flex; gap: 4px; }
.swatches i { width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--app-border); }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
</style>
