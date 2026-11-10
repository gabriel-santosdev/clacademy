import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

/**
 * Tema PrimeVue da CL Academy (mesmo sistema visual da landing).
 * - Neutros quentes derivados de #f0f0f0 (osso) e #5E5E5E (grafite)
 * - Primária: grafite no claro, branco no escuro (monocromático, sem cor de destaque)
 * - Cantos generosos e botões em pílula
 */
const ClAcademyPreset = definePreset(Aura, {
  primitive: {
    borderRadius: { none: '0', xs: '6px', sm: '8px', md: '12px', lg: '16px', xl: '22px' },
    // cinzas neutros (sem tom quente nem frio)
    bone: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#f0f0f0',
      300: '#e6e6e6',
      400: '#dadada',
      500: '#a6a6a6',
      600: '#8a8a8a',
      700: '#5f5f5f',
      800: '#2a2a2a',
      900: '#1a1a1a',
      950: '#111111',
    },
    // "success" do Aura usa {green.*}: no padrão monocromático, estado positivo é grafite.
    // Aviso (âmbar) e erro (vermelho) continuam coloridos para manter o significado.
    green: {
      50: '#fafafa',
      100: '#f0f0f0',
      200: '#e0e0e0',
      300: '#c7c7c7',
      400: '#9e9e9e',
      500: '#6b6b6b',
      600: '#4a4a4a',
      700: '#2e2e2e',
      800: '#1f1f1f',
      900: '#171717',
      950: '#0d0d0d',
    },
  },
  semantic: {
    primary: {
      50: '{bone.50}',
      100: '{bone.100}',
      200: '{bone.200}',
      300: '{bone.300}',
      400: '{bone.400}',
      500: '{bone.500}',
      600: '{bone.600}',
      700: '{bone.700}',
      800: '{bone.800}',
      900: '{bone.900}',
      950: '{bone.950}',
    },
    focusRing: { width: '2px', style: 'solid', color: '{primary.color}', offset: '2px' },
    formField: { borderRadius: '{border.radius.md}', paddingX: '0.85rem', paddingY: '0.65rem' },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '{bone.100}',
          100: '{bone.200}',
          200: '{bone.300}',
          300: '{bone.400}',
          400: '{bone.500}',
          500: '{bone.600}',
          600: '{bone.700}',
          700: '#474747',
          800: '{bone.800}',
          900: '{bone.900}',
          950: '{bone.950}',
        },
        primary: {
          color: '{bone.900}',
          contrastColor: '#ffffff',
          hoverColor: '#000000',
          activeColor: '{bone.800}',
        },
        highlight: {
          background: '{bone.900}',
          focusBackground: '{bone.800}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
        text: { color: '{bone.900}', hoverColor: '#000000', mutedColor: '{bone.700}', hoverMutedColor: '{bone.900}' },
        content: { background: '#ffffff', hoverBackground: '{bone.100}', borderColor: '{bone.300}', color: '{text.color}', hoverColor: '{text.hover.color}' },
        formField: { background: '#ffffff', borderColor: '{bone.400}', hoverBorderColor: '{bone.600}', focusBorderColor: '{bone.900}' },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '{bone.200}',
          100: '{bone.300}',
          200: '{bone.400}',
          300: '{bone.500}',
          400: '{bone.600}',
          500: '{bone.700}',
          600: '#474747',
          700: '#3a3a3a',
          800: '{bone.800}',
          900: '#222222',
          950: '{bone.950}',
        },
        primary: {
          color: '#f5f5f5',
          contrastColor: '{bone.900}',
          hoverColor: '#ffffff',
          activeColor: '{bone.400}',
        },
        highlight: {
          background: 'rgba(255, 255, 255, 0.12)',
          focusBackground: 'rgba(255, 255, 255, 0.18)',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
        text: { color: '{bone.200}', hoverColor: '#ffffff', mutedColor: '{bone.500}', hoverMutedColor: '{bone.200}' },
        content: { background: '#1a1a1a', hoverBackground: '{bone.800}', borderColor: '#333333', color: '{text.color}', hoverColor: '{text.hover.color}' },
        formField: { background: '#141414', borderColor: '#383838', hoverBorderColor: '{bone.600}', focusBorderColor: '{bone.200}' },
      },
    },
  },
  components: {
    button: {
      root: { borderRadius: '999px', paddingX: '1.15rem', paddingY: '0.7rem', label: { fontWeight: '700' } },
    },
    card: {
      root: { borderRadius: '{border.radius.xl}', shadow: 'none' },
      body: { padding: '1.35rem', gap: '0.75rem' },
      title: { fontSize: '1.05rem', fontWeight: '700' },
    },
    tag: { root: { borderRadius: '999px', fontWeight: '700', padding: '0.25rem 0.6rem' } },
    dialog: { root: { borderRadius: '{border.radius.xl}' } },
    message: { root: { borderRadius: '{border.radius.lg}' } },
    selectbutton: { root: { borderRadius: '999px' } },
    togglebutton: { root: { borderRadius: '999px' }, content: { borderRadius: '999px' } },
    menu: { root: { borderRadius: '{border.radius.lg}' } },
  },
})

export default {
  preset: ClAcademyPreset,
  options: {
    darkModeSelector: '.app-dark',
    // PrimeVue numa camada própria: o reset (layer base) fica abaixo dele
    // e o CSS do app (sem layer) consegue sobrescrever quando preciso.
    cssLayer: { name: 'primevue', order: 'base, primevue' },
  },
}
