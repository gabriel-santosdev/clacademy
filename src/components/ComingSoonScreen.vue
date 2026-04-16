<script setup lang="ts">
</script>

<template>
    <div class="cs">
        <div class="left">
            <img src="../assets/cl_academy_logo.png" alt="CL Academy" class="logo" />
            <p class="sub">onde o movimento vira experiência.</p>
        </div>
        <video class="promo-video" src="../assets/WhatsApp Video 2026-04-16 at 4.47.03 PM.mp4" autoplay loop muted
            playsinline></video>
    </div>
</template>

<style scoped>
.cs {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #7E0F0D;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 60px;
    padding: 40px 80px;
    text-align: left;
}

.left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    flex: 1;
    max-width: 520px;
}

.logo {
    width: clamp(180px, 22vw, 340px);
    opacity: 1;
    filter: brightness(0) invert(1);
    display: block;
    margin: 0;
    margin-bottom: -12px;
}

.sub {
    font-family: 'BillaMount', cursive;
    font-size: clamp(14px, 1.4vw, 22px);
    color: #F19DAC;
    letter-spacing: 0.12em;
    margin: 0;
    padding: 0;
    opacity: 0.90;
    line-height: 1;
}

.promo-video {
    height: clamp(320px, 65vh, 700px);
    width: auto;
    border-radius: 20px;
    object-fit: cover;
    flex-shrink: 0;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
}

/* ── Tablet ── */
@media (max-width: 900px) {
    .cs {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 24px;
        padding: 32px 20px;
    }

    .left {
        align-items: center;
        max-width: 100%;
        gap: 0;
    }

    .logo {
        width: clamp(160px, 55vw, 300px);
    }

    .promo-video {
        height: auto;
        width: clamp(240px, 75vw, 420px);
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

    .promo-video {
        width: 88vw;
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

    .promo-video {
        width: 95vw;
    }
}
</style>
