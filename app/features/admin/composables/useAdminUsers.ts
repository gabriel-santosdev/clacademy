import type { Role } from '#shared/utils/constants'
import type { AdminUser } from '../domain/users'

/** Gestão de usuários (admin): busca, filtro por papel, criar e editar. Use com await. */
export function useAdminUsers() {
  const role = ref<'' | Role>('')
  const search = ref('')
  const query = useFetch('/api/admin/users', { query: { role }, key: 'admin-users', default: () => [] })

  const list = computed(() => searchUsers(query.data.value, search.value))
  const coaches = computed(() => query.data.value.filter((u) => u.role !== 'aluno'))
  const coachName = (id: number | null) => coaches.value.find((c) => c.id === id)?.name ?? '—'

  const createOpen = ref(false)
  const newUser = reactive(emptyNewUser())
  const create = useAction(async () => {
    await adminApi.createUser(newUser)
    Object.assign(newUser, emptyNewUser())
    createOpen.value = false
    await query.refresh()
  }, 'Usuário criado')

  const editOpen = ref(false)
  const editing = reactive(userToEditForm({ id: 0, name: '', role: 'aluno', active: true, coachId: null } as AdminUser))
  function startEdit(u: AdminUser) {
    Object.assign(editing, userToEditForm(u))
    editOpen.value = true
  }
  const update = useAction(async () => {
    await adminApi.updateUser(editing.id, editFormToPatch(editing))
    editOpen.value = false
    await query.refresh()
  }, 'Usuário atualizado')

  return withAsync(query, { role, search, list, coaches, coachName, createOpen, newUser, create, editOpen, editing, startEdit, update })
}
