<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const dots = ref('')

let interval: ReturnType<typeof setInterval>

onMounted(() => {
    interval = setInterval(() => {
        dots.value = dots.value.length >= 3 ? '' : dots.value + '.'
    }, 420)
})

onUnmounted(() => clearInterval(interval))
</script>

<template>
    <div class="cs">
        <img src="../assets/cl_academy_logo.png" alt="CL Academy" class="logo" />
        <h1 class="title">vem aí<span class="dots">{{ dots }}</span></h1>
        <p class="sub">onde o movimento, vira experiência.</p>
    </div>
</template>

<style scoped>
.cs {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #7E0F0D;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 40px 24px;
    text-align: center;
}

.logo {
    width: clamp(200px, 30vw, 380px);
    opacity: 1;
    filter: brightness(0) invert(1);
}

.title {
    font-family: 'MangoDream', sans-serif;
    font-size: clamp(72px, 16vw, 200px);
    color: #FFBEC5;
    line-height: 1;
    margin: 0;
    letter-spacing: 0.02em;
}

.dot {
    color: #FFBEC5;
}

.dots {
    display: inline-block;
    width: 0.55em;
    color: #FFBEC5;
    text-align: left;
}

.sub {
    font-family: 'BillaMount', cursive;
    font-size: clamp(14px, 2vw, 22px);
    color: #F19DAC;
    letter-spacing: 0.12em;
    margin: 0;
    opacity: 0.90;
}

/* ── Tablet ── */
@media (max-width: 768px) {
    .cs {
        gap: 24px;
        padding: 32px 20px;
    }

    .logo {
        width: clamp(160px, 55vw, 300px);
    }

    .title {
        font-size: clamp(64px, 18vw, 140px);
    }

    .sub {
        font-size: clamp(13px, 3.5vw, 18px);
        letter-spacing: 0.08em;
    }
}

/* ── Mobile ── */
@media (max-width: 480px) {
    .cs {
        gap: 20px;
        padding: 24px 16px;
    }

    .logo {
        width: clamp(140px, 65vw, 240px);
    }

    .title {
        font-size: clamp(56px, 20vw, 100px);
    }

    .sub {
        font-size: clamp(12px, 4vw, 16px);
        letter-spacing: 0.06em;
    }
}

/* ── Mobile pequeno (320px) ── */
@media (max-width: 360px) {
    .logo {
        width: 75vw;
    }

    .title {
        font-size: 18vw;
    }
}
</style>
