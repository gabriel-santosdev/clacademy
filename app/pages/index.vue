<script setup lang="ts">
import '~/features/landing/landing.css'

const { data: settings } = await usePublicSettings()
const instagram = computed(() => settings.value?.instagram?.replace(/^@/, '') || LANDING.instagram)
const whatsapp = computed(() => settings.value?.whatsapp || null)

useHead({ meta: [{ name: 'theme-color', content: '#EEEDEB' }] })
useRevealOnScroll()
</script>

<template>
  <LandingComingSoon v-if="settings?.showComingSoon" />

  <div v-else class="landing">
    <LandingNavbar />
    <LandingBrasilMasthead />
    <main>
      <LandingHero />
      <LandingTicker />
      <LandingAppDemo />
      <LandingCompare />
      <LandingServices />
      <LandingHowItWorks />
      <LandingPlans />
      <LandingInstall />
      <LandingAbout :instagram="instagram" />
      <LandingFaq />
      <LandingFinalCta :whatsapp="whatsapp" />
    </main>
    <LandingFooter :instagram="instagram" :whatsapp="whatsapp" />
    <LandingMobileBar />
  </div>
</template>
