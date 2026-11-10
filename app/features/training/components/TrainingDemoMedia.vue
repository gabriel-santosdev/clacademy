<script setup lang="ts">
/** Player da demonstração (YouTube, Vimeo, Drive, Instagram, vídeo ou GIF), sem moldura de diálogo. */
const props = defineProps<{ url: string | null | undefined; title?: string }>()
const media = computed(() => parseDemoUrl(props.url))
</script>

<template>
  <div v-if="media" class="demo">
    <div v-if="media.kind === 'iframe'" class="demo__frame" :class="{ 'demo__frame--vertical': media.vertical }">
      <iframe
        :src="media.src"
        :title="`Demonstração: ${title ?? 'exercício'}`"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin"
      />
    </div>
    <video v-else-if="media.kind === 'video'" class="demo__media" :src="media.src" controls autoplay loop muted playsinline />
    <img v-else-if="media.kind === 'image'" class="demo__media" :src="media.src" :alt="`Demonstração: ${title ?? 'exercício'}`" />
    <a v-else :href="media.src" target="_blank" rel="noopener" class="demo__link"><i class="pi pi-external-link" /> Abrir a demonstração</a>
    <a v-if="media.kind === 'iframe'" :href="url!" target="_blank" rel="noopener" class="tiny muted demo__out">
      Não carregou? Abrir no {{ media.provider }} <i class="pi pi-external-link" />
    </a>
  </div>
  <p v-else class="muted small">Link de demonstração inválido.</p>
</template>

<style scoped>
.demo { display: flex; flex-direction: column; gap: 10px; }
.demo__frame { position: relative; width: 100%; aspect-ratio: 16 / 9; border-radius: var(--radius); overflow: hidden; background: #000; }
.demo__frame--vertical { aspect-ratio: 9 / 16; height: min(70dvh, 640px); width: auto; max-width: 100%; margin-inline: auto; }
.demo__frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.demo__media { width: 100%; max-height: 70dvh; object-fit: contain; border-radius: var(--radius); background: #000; }
.demo__link { display: inline-flex; align-items: center; gap: 8px; font-weight: 700; color: var(--app-text); }
.demo__out { display: inline-flex; align-items: center; gap: 6px; align-self: center; }
.demo__out .pi { font-size: 0.7rem; }
</style>
