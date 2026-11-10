import { useToast } from 'primevue/usetoast'

/** Feedback ao usuário via PrimeVue Toast. */
export function useNotify() {
  const toast = useToast()
  return {
    success: (summary: string, detail?: string) => toast.add({ severity: 'success', summary, detail, life: 3500 }),
    error: (summary: string, detail?: string) => toast.add({ severity: 'error', summary, detail, life: 5000 }),
    info: (summary: string, detail?: string) => toast.add({ severity: 'info', summary, detail, life: 3500 }),
  }
}
