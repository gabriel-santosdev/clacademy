export interface AppSettings {
  theme: 'default' | 'brasil'
  showComingSoon: boolean
  gymName: string
  whatsapp: string
  instagram: string
  pixKey: string
  paymentInstructions: string
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'default',
  showComingSoon: false,
  gymName: 'CL Academy',
  whatsapp: '',
  instagram: 'clacademyy',
  pixKey: '',
  paymentInstructions: 'Após o pagamento via Pix, envie o comprovante pelo WhatsApp para liberarmos seu acesso.',
}

export async function getSettings(): Promise<AppSettings> {
  const db = await useDb()
  const rows = await db.select().from(tables.settings)
  const out: Record<string, unknown> = { ...DEFAULT_SETTINGS }
  for (const r of rows) out[r.key] = r.value
  return out as unknown as AppSettings
}

export async function saveSettings(patch: Partial<AppSettings>) {
  const db = await useDb()
  for (const [key, value] of Object.entries(patch)) {
    if (!(key in DEFAULT_SETTINGS) || value === undefined) continue
    await db
      .insert(tables.settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: tables.settings.key, set: { value } })
  }
  return getSettings()
}
