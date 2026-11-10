<script setup lang="ts">
definePageMeta({ layout: 'app' })
useHead({ title: 'Perfil · CL Academy' })

const { data: profile, form, save } = await useProfile('aluno')
</script>

<template>
  <div v-if="profile" class="stack" style="--gap: 20px">
    <AppPageHeader title="Perfil" :subtitle="profile.email" />

    <Card>
      <template #title>Seus dados</template>
      <template #content>
        <form class="stack" @submit.prevent="save()">
          <div class="field">
            <label for="p-name">Nome</label>
            <InputText id="p-name" v-model="form.name" required fluid />
          </div>
          <div class="grid-2">
            <div class="field">
              <label for="p-phone">WhatsApp</label>
              <InputText id="p-phone" v-model="form.phone" type="tel" fluid />
            </div>
            <div class="field">
              <label for="p-cpf">CPF</label>
              <InputMask id="p-cpf" v-model="form.cpf" mask="999.999.999-99" :auto-clear="false" unmask fluid />
            </div>
          </div>
          <div class="field">
            <label for="p-birth">Data de nascimento</label>
            <InputText id="p-birth" v-model="form.birthDate" type="date" fluid />
          </div>
          <div class="row row--end"><Button type="submit" label="Salvar" :loading="save.loading.value" /></div>
        </form>
      </template>
    </Card>

    <AccountDeviceCard />

    <NuxtLink to="/app/aluno/perfil/integracoes" class="link-card">
      <span class="link-card__icon"><i class="pi pi-link" /></span>
      <span class="grow">
        <strong>Relógio e apps</strong>
        <span class="small muted">Apple Watch, Garmin, Coros e outros</span>
      </span>
      <Tag v-if="!profile.stravaAvailable" value="Em breve" severity="secondary" />
      <i v-else class="pi pi-chevron-right muted" />
    </NuxtLink>

    <AccountPasswordCard />
  </div>
</template>

<style scoped>
.link-card {
  display: flex; align-items: center; gap: 14px; padding: 16px 18px; border-radius: var(--radius-lg);
  background: var(--app-surface); border: 1px solid var(--app-border); transition: transform 0.15s var(--ease-out), border-color 0.2s;
}
.link-card strong { display: block; font-weight: 800; }
.link-card:active { transform: scale(0.98); }
@media (hover: hover) { .link-card:hover { border-color: var(--app-muted); } }
.link-card__icon { width: 42px; height: 42px; flex-shrink: 0; border-radius: 50%; display: grid; place-items: center; background: var(--accent); color: var(--accent-ink); }
</style>
