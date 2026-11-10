<script setup lang="ts">
definePageMeta({ layout: 'app' })
useHead({ title: 'Perfil · CL Academy' })

const { data: profile, refresh, form, save } = await useProfile('aluno')
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

    <AccountStravaCard
      v-if="profile.stravaAvailable"
      :connected="profile.strava.connected"
      :last-sync-at="profile.strava.lastSyncAt"
      :on-change="refresh"
    />

    <AccountPasswordCard />
  </div>
</template>
