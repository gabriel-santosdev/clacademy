export function usePasswordChange() {
  const form = reactive({ currentPassword: '', newPassword: '' })
  const submit = useAction(async () => {
    await accountApi.changePassword({ ...form })
    Object.assign(form, { currentPassword: '', newPassword: '' })
  }, 'Senha alterada')
  return { form, submit }
}
