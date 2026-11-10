<script setup lang="ts">
definePageMeta({ layout: 'app' })
useHead({ title: 'Minha conta · CL Academy' })

const { data: profile, form, save } = await useProfile('staff')
</script>

<template>
  <div v-if="profile" class="stack" style="--gap: 20px">
    <AppPageHeader title="Minha conta" :subtitle="profile.email" />

    <Card>
      <template #title>Dados</template>
      <template #content>
        <form class="stack" @submit.prevent="save()">
          <div class="grid-2">
            <div class="field">
              <label for="c-name">Nome</label>
              <InputText id="c-name" v-model="form.name" required fluid />
            </div>
            <div class="field">
              <label for="c-phone">Telefone</label>
              <InputText id="c-phone" v-model="form.phone" type="tel" fluid />
            </div>
          </div>
          <div class="field">
            <label for="c-bio">Mini bio (visível aos alunos)</label>
            <Textarea id="c-bio" v-model="form.bio" rows="3" auto-resize fluid />
          </div>
          <div class="row row--end"><Button type="submit" label="Salvar" :loading="save.loading.value" /></div>
        </form>
      </template>
    </Card>

    <AccountDeviceCard push-hint="Receba avisos quando alunos registrarem treinos ou assinarem planos." />
    <AccountPasswordCard />
  </div>
</template>
