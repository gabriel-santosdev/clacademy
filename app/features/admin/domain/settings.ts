/** Configurações do site (admin). */

export interface SettingsForm {
  theme: 'default' | 'brasil'
  showComingSoon: boolean
  gymName: string
  whatsapp: string
  instagram: string
  pixKey: string
  paymentInstructions: string
}

export const emptySettingsForm = (): SettingsForm => ({
  theme: 'default',
  showComingSoon: false,
  gymName: '',
  whatsapp: '',
  instagram: '',
  pixKey: '',
  paymentInstructions: '',
})

export const SITE_THEMES = [
  { value: 'default', label: 'Padrão CL', swatches: ['#141416', '#7e0f0d', '#f4f4f5'] },
  { value: 'brasil', label: 'Copa Brasil', swatches: ['#009c3b', '#ffdf00', '#002776'] },
] as const
