import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

/**
 * Tema PrimeVue da CL Academy (mesmo sistema visual da landing).
 * - Neutros quentes derivados de #EEEDEB (osso) e #5E5E5E (grafite)
 * - Primária: grafite/preto no claro, volt no escuro (volt nunca vira texto sobre fundo claro)
 * - Cantos generosos e botões em pílula
 */
const ClAcademyPreset = definePreset(Aura, {
  primitive: {
    borderRadius: { none: '0', xs: '6px', sm: '8px', md: '12px', lg: '16px', xl: '22px' },
    bone: {
      50: '#fbfaf8',
      100: '#f4f3f1',
      200: '#eeedeb',
      300: '#e4e2de',
      400: '#d7d4cf',
      500: '#a8a7a4',
      600: '#8a8884',
      700: '#5e5e5e',
      800: '#2c2c2c',
      900: '#1f1f1f',
      950: '#141414',
    },
    volt: {
      50: '#fafee8',
      100: '#f2fcc6',
      200: '#e8fa94',
      300: '#def865',
      400: '#d4f53c',
      500: '#bedd2a',
      600: '#99b21f',
      700: '#73861a',
      800: '#4d5a14',
      900: '#333c0e',
      950: '#1c2108',
    },
  },
  semantic: {
    primary: {
      50: '{volt.50}',
      100: '{volt.100}',
      200: '{volt.200}',
      300: '{volt.300}',
      400: '{volt.400}',
      500: '{volt.500}',
      600: '{volt.600}',
      700: '{volt.700}',
      800: '{volt.800}',
      900: '{volt.900}',
      950: '{volt.950}',
    },
    focusRing: { width: '2px', style: 'solid', color: '{primary.color}', offset: '2px' },
    formField: { borderRadius: '{border.radius.md}', paddingX: '0.85rem', paddingY: '0.65rem' },
    colorScheme: {
      light: {
        surface: {
          0: '#fbfaf8',
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
          contrastColor: '#eeedeb',
          hoverColor: '#000000',
          activeColor: '{bone.800}',
        },
        highlight: {
          background: '{bone.900}',
          focusBackground: '{bone.800}',
          color: '#eeedeb',
          focusColor: '#eeedeb',
        },
        text: { color: '{bone.900}', hoverColor: '#000000', mutedColor: '{bone.700}', hoverMutedColor: '{bone.900}' },
        content: { background: '#fbfaf8', hoverBackground: '{bone.100}', borderColor: '{bone.300}', color: '{text.color}', hoverColor: '{text.hover.color}' },
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
          color: '{volt.400}',
          contrastColor: '{bone.900}',
          hoverColor: '{volt.300}',
          activeColor: '{volt.500}',
        },
        highlight: {
          background: 'rgba(212, 245, 60, 0.16)',
          focusBackground: 'rgba(212, 245, 60, 0.24)',
          color: '{volt.300}',
          focusColor: '{volt.200}',
        },
        text: { color: '{bone.200}', hoverColor: '#ffffff', mutedColor: '{bone.500}', hoverMutedColor: '{bone.200}' },
        content: { background: '#1c1c1c', hoverBackground: '{bone.800}', borderColor: '#333333', color: '{text.color}', hoverColor: '{text.hover.color}' },
        formField: { background: '#161616', borderColor: '#3a3a3a', hoverBorderColor: '{bone.600}', focusBorderColor: '{volt.400}' },
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
