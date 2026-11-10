<script setup lang="ts">
const { form, submit } = usePasswordChange()
</script>

<template>
  <Card>
    <template #title>Alterar senha</template>
    <template #content>
      <form class="stack" @submit.prevent="submit()">
        <div class="grid-2">
          <div class="field">
            <label for="pw-current">Senha atual</label>
            <Password v-model="form.currentPassword" input-id="pw-current" :feedback="false" toggle-mask required fluid
              :input-props="{ autocomplete: 'current-password' }" />
          </div>
          <div class="field">
            <label for="pw-new">Nova senha</label>
            <Password v-model="form.newPassword" input-id="pw-new" toggle-mask required fluid
              :input-props="{ autocomplete: 'new-password', minlength: 8 }" />
          </div>
        </div>
        <div class="row row--end">
          <Button type="submit" label="Alterar senha" severity="secondary" :loading="submit.loading.value" />
        </div>
      </form>
    </template>
  </Card>
</template>
