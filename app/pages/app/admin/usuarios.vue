<script setup lang="ts">
import type { Role } from '#shared/utils/constants'

definePageMeta({ layout: 'app' })
useHead({ title: 'Usuários · CL Academy' })

const { role, search, list, coaches, coachName, createOpen, newUser, create, editOpen, editing, startEdit, update } = await useAdminUsers()

const roleFilters = [{ label: 'Todos', value: '' }, ...ROLES.map((r) => ({ label: LABELS.role[r], value: r }))]
const roleOptions = ROLES.map((r) => ({ label: LABELS.role[r], value: r }))
const coachOptions = computed(() => [{ label: 'Nenhum', value: null }, ...coaches.value.map((c) => ({ label: c.name, value: c.id }))])
</script>

<template>
  <div class="stack" style="--gap: 16px">
    <AppPageHeader title="Usuários" subtitle="Alunos, professores e administradores">
      <Button label="Novo usuário" icon="pi pi-plus" @click="createOpen = true" />
    </AppPageHeader>

    <div class="row">
      <IconField class="grow" style="max-width: 320px">
        <InputIcon class="pi pi-search" />
        <InputText v-model="search" placeholder="Buscar…" fluid />
      </IconField>
      <SelectButton v-model="role" :options="roleFilters" option-label="label" option-value="value" :allow-empty="false" />
    </div>

    <DataTable :value="list" data-key="id" paginator :rows="20" :always-show-paginator="false" striped-rows>
      <template #empty><AppEmptyState icon="pi-users" title="Nenhum usuário encontrado" /></template>
      <Column header="Nome">
        <template #body="{ data }">
          <div class="row row--nowrap" style="--gap: 10px">
            <Avatar :label="initials(data.name)" shape="circle" />
            <div style="min-width: 0">
              <strong class="small truncate" style="display: block">{{ data.name }}</strong>
              <span class="tiny muted">{{ data.email }}</span>
            </div>
          </div>
        </template>
      </Column>
      <Column header="Papel">
        <template #body="{ data }"><Tag :value="LABELS.role[data.role as Role]" :severity="roleSeverity(data.role)" /></template>
      </Column>
      <Column header="Professor">
        <template #body="{ data }"><span class="small muted nowrap">{{ coachName(data.coachId) }}</span></template>
      </Column>
      <Column header="Status">
        <template #body="{ data }"><Tag :value="data.active ? 'Ativo' : 'Inativo'" :severity="data.active ? 'success' : 'secondary'" /></template>
      </Column>
      <Column header="Desde">
        <template #body="{ data }"><span class="small muted nowrap">{{ formatDate(data.createdAt) }}</span></template>
      </Column>
      <Column style="width: 1%">
        <template #body="{ data }"><Button icon="pi pi-pencil" text rounded severity="secondary" aria-label="Editar" @click="startEdit(data)" /></template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="createOpen" modal header="Novo usuário" :style="{ width: 'min(460px, 96vw)' }">
      <form id="create-user" class="stack" @submit.prevent="create()">
        <div class="field">
          <label for="nu-role">Papel</label>
          <Select v-model="newUser.role" input-id="nu-role" :options="roleOptions" option-label="label" option-value="value" fluid />
        </div>
        <div class="field"><label for="nu-name">Nome</label><InputText id="nu-name" v-model="newUser.name" required fluid /></div>
        <div class="field"><label for="nu-email">E-mail</label><InputText id="nu-email" v-model="newUser.email" type="email" required fluid /></div>
        <div class="field"><label for="nu-phone">Telefone</label><InputText id="nu-phone" v-model="newUser.phone" type="tel" fluid /></div>
        <div class="field">
          <label for="nu-pw">Senha inicial</label>
          <InputText id="nu-pw" v-model="newUser.password" minlength="8" required fluid />
          <small>Compartilhe com a pessoa; ela pode trocar depois.</small>
        </div>
      </form>
      <template #footer>
        <Button label="Cancelar" severity="secondary" text @click="createOpen = false" />
        <Button type="submit" form="create-user" label="Criar" :loading="create.loading.value" />
      </template>
    </Dialog>

    <Dialog v-model:visible="editOpen" modal header="Editar usuário" :style="{ width: 'min(460px, 96vw)' }">
      <form id="edit-user" class="stack" @submit.prevent="update()">
        <div class="field"><label for="eu-name">Nome</label><InputText id="eu-name" v-model="editing.name" required fluid /></div>
        <div class="field">
          <label for="eu-role">Papel</label>
          <Select v-model="editing.role" input-id="eu-role" :options="roleOptions" option-label="label" option-value="value" fluid />
        </div>
        <div v-if="editing.role === 'aluno'" class="field">
          <label for="eu-coach">Professor responsável</label>
          <Select v-model="editing.coachId" input-id="eu-coach" :options="coachOptions" option-label="label" option-value="value" fluid />
        </div>
        <div class="field">
          <label for="eu-pw">Redefinir senha</label>
          <InputText id="eu-pw" v-model="editing.password" minlength="8" placeholder="Deixe vazio para manter" fluid />
        </div>
        <label class="check"><ToggleSwitch v-model="editing.active" /> Conta ativa</label>
      </form>
      <template #footer>
        <Button label="Cancelar" severity="secondary" text @click="editOpen = false" />
        <Button type="submit" form="edit-user" label="Salvar" :loading="update.loading.value" />
      </template>
    </Dialog>
  </div>
</template>
