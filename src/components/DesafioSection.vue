<template>
    <section id="desafio" class="desafio">
        <div class="container">

            <!-- Topo -->
            <div class="desafio__header">
                <span class="desafio__eyebrow">Desafio Movimento CL</span>
                <h2 class="desafio__title">Cada treino conta.<br />Cada dia soma.</h2>
                <p class="desafio__subtitle">
                    Um desafio pra te tirar da zona de conforto — dias de movimento, constância e motivação
                    até o nosso evento no dia <strong>23 de maio</strong>.
                </p>
            </div>

            <!-- Conteúdo principal -->
            <div class="desafio__body">

                <!-- Imagem -->
                <div class="desafio__image-wrap">
                    <img src="../assets/desafio_cl.PNG" alt="Desafio Movimento CL" class="desafio__image" />
                </div>

                <!-- Informações -->
                <div class="desafio__info">

                    <!-- Como funciona -->
                    <div class="desafio__block">
                        <h3 class="desafio__block-title">Como funciona</h3>
                        <ol class="desafio__steps">
                            <li>
                                <span class="step__num">01</span>
                                <div class="step__text">
                                    Baixe o <strong>Gym Rats</strong> e entre na nossa comunidade
                                    <a href="https://share.gymrats.app/join?code=VXDIRECH" target="_blank"
                                        rel="noopener noreferrer" class="desafio__link">Desafio Movimento CL</a>
                                </div>
                            </li>
                            <li>
                                <span class="step__num">02</span>
                                <div class="step__text">
                                    Ao realizar a atividade do dia, faça <strong>check-in no app</strong> — sem limite
                                    de atividades por dia
                                </div>
                            </li>
                            <li>
                                <span class="step__num">03</span>
                                <div class="step__text">
                                    Poste uma foto do treino e marque
                                    <a href="https://instagram.com/clacademyyy" target="_blank"
                                        rel="noopener noreferrer" class="desafio__link">@clacademyyy</a>
                                    e
                                    <a href="https://instagram.com/nutri.kayannemorais" target="_blank"
                                        rel="noopener noreferrer" class="desafio__link">@nutri.kayannemorais</a>
                                    no Instagram
                                </div>
                            </li>
                        </ol>
                    </div>

                    <!-- Pontuação -->
                    <div class="desafio__block">
                        <h3 class="desafio__block-title">Pontuação</h3>
                        <ul class="desafio__bullets">
                            <li>Pontos de <strong>hustle</strong> no app (somatória de atividades)</li>
                            <li>Fotos/stories marcando
                                <a href="https://instagram.com/clacademyyy" target="_blank" rel="noopener noreferrer"
                                    class="desafio__link">@clacademyyy</a>
                                e
                                <a href="https://instagram.com/nutri.kayannemorais" target="_blank"
                                    rel="noopener noreferrer" class="desafio__link">@nutri.kayannemorais</a>
                            </li>
                            <li>Para concorrer aos prêmios, siga todos os patrocinadores</li>
                        </ul>
                    </div>

                    <!-- Premiação -->
                    <div class="desafio__block desafio__block--premio">
                        <h3 class="desafio__block-title">Premiação ✨</h3>
                        <p class="desafio__premio-text">
                            Prêmios especiais com nossos patrocinadores para o <strong>participante destaque</strong> do
                            desafio.
                        </p>
                    </div>

                    <!-- CTA -->
                    <a href="https://share.gymrats.app/join?code=VXDIRECH" target="_blank" rel="noopener noreferrer"
                        class="desafio__cta">
                        Participar do Desafio
                    </a>

                </div>
            </div>

            <!-- Patrocinadores -->
            <div class="desafio__sponsors">
                <p class="sponsors__label">Patrocinadores do Desafio</p>
                <div class="sponsors__list">
                    <a v-for="sponsor in sponsors" :key="sponsor"
                        :href="`https://instagram.com/${sponsor.replace('@', '')}`" target="_blank"
                        rel="noopener noreferrer" class="sponsors__tag">{{ sponsor }}</a>
                </div>
            </div>

        </div>
    </section>
</template>

<script setup lang="ts">
const sponsors = [
    '@emme.sgrafica',
    '@gabrielsantos.tec',
    '@bela_bronzee',
    '@dra.isadoramsa',
    '@cspratass_',
    '@nutri.kayannemorais',
    '@yassminsantoslash',
    '@aasmodas.store',
    '@alohaacai.oficial',
    '@cocosaudaveis',
    '@jennyferibeiroo',
    '@karmin_oculoskarmin',
]
</script>

<style scoped>
/* ── Seção ───────────────────────────────────────── */
.desafio {
    padding: 104px 0;
    background: var(--white);
}

/* ── Header ──────────────────────────────────────── */
.desafio__header {
    text-align: center;
    max-width: 600px;
    margin: 0 auto 72px;
}

.desafio__eyebrow {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--dark);
    background: var(--bg-warm);
    padding: 6px 20px;
    border-radius: 50px;
    margin-bottom: 20px;
}

.desafio__title {
    font-family: var(--font-heading);
    font-size: clamp(2rem, 5vw, 3.2rem);
    color: var(--text-dark);
    line-height: 1.15;
    margin-bottom: 16px;
}

.desafio__subtitle {
    font-size: 1rem;
    color: var(--text-muted);
    line-height: 1.7;
}

/* ── Body (imagem + info) ─────────────────────────── */
.desafio__body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: start;
}

/* ── Imagem ──────────────────────────────────────── */
.desafio__image-wrap {
    position: sticky;
    top: 88px;
}

.desafio__image {
    width: 100%;
    border-radius: 24px;
    object-fit: cover;
    box-shadow: 0 24px 64px rgba(124, 1, 22, 0.12);
}

/* ── Info ────────────────────────────────────────── */
.desafio__info {
    display: flex;
    flex-direction: column;
    gap: 40px;
}

/* ── Bloco ───────────────────────────────────────── */
.desafio__block {
    border-left: 2px solid var(--border);
    padding-left: 24px;
}

.desafio__block-title {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--dark);
    margin-bottom: 20px;
}

/* ── Steps ───────────────────────────────────────── */
.desafio__steps {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.desafio__steps li {
    display: flex;
    align-items: flex-start;
    gap: 16px;
}

.step__num {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--bg-warm);
    color: var(--dark);
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.step__text {
    font-size: 0.9rem;
    color: var(--text-dark);
    line-height: 1.6;
    padding-top: 6px;
}

/* ── Bullets ─────────────────────────────────────── */
.desafio__bullets {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.desafio__bullets li {
    font-size: 0.9rem;
    color: var(--text-dark);
    line-height: 1.6;
    padding-left: 16px;
    position: relative;
}

.desafio__bullets li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 9px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--accent);
}

/* ── Prêmio ──────────────────────────────────────── */
.desafio__block--premio {
    background: var(--bg-warm);
    border: none;
    border-radius: 16px;
    padding: 24px 28px;
}

.desafio__premio-text {
    font-size: 0.9rem;
    color: var(--text-dark);
    line-height: 1.7;
}

/* ── Link ────────────────────────────────────────── */
.desafio__link {
    color: var(--dark);
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
}

/* ── CTA ─────────────────────────────────────────── */
.desafio__cta {
    display: inline-block;
    background: var(--dark);
    color: #fff;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    padding: 14px 36px;
    border-radius: 50px;
    text-decoration: none;
    align-self: flex-start;
    transition: background 0.2s, transform 0.2s;
}

.desafio__cta:hover {
    background: #000;
    transform: translateY(-2px);
}

/* ── Patrocinadores ──────────────────────────────── */
.desafio__sponsors {
    margin-top: 80px;
    text-align: center;
}

.sponsors__label {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 20px;
}

.sponsors__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
}

.sponsors__tag {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--dark);
    background: var(--bg-light);
    border: 1px solid var(--border);
    padding: 6px 16px;
    border-radius: 50px;
    letter-spacing: 0.3px;
    text-decoration: none;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.sponsors__tag:hover {
    background: var(--dark);
    color: #fff;
    border-color: var(--dark);
}

/* ── Responsivo ──────────────────────────────────── */
@media (max-width: 900px) {
    .desafio__body {
        grid-template-columns: 1fr;
        gap: 40px;
    }

    .desafio__image-wrap {
        position: static;
        max-width: 520px;
        margin: 0 auto;
    }
}

@media (max-width: 768px) {
    .desafio {
        padding: 72px 0;
    }

    .desafio__header {
        margin-bottom: 48px;
    }

    .desafio__title {
        font-size: clamp(1.75rem, 7vw, 2.6rem);
    }

    .desafio__info {
        gap: 32px;
    }

    .desafio__cta {
        align-self: stretch;
        text-align: center;
    }

    .desafio__sponsors {
        margin-top: 56px;
    }
}

@media (max-width: 480px) {
    .desafio {
        padding: 56px 0;
    }

    .desafio__header {
        margin-bottom: 36px;
    }

    .desafio__eyebrow {
        font-size: 0.62rem;
        letter-spacing: 2px;
        padding: 5px 14px;
    }

    .desafio__image-wrap {
        max-width: 100%;
    }

    .desafio__image {
        border-radius: 16px;
    }

    .desafio__block {
        padding-left: 16px;
    }

    .desafio__block--premio {
        padding: 18px 18px;
    }

    .desafio__info {
        gap: 28px;
    }

    .step__text {
        font-size: 0.85rem;
    }

    .desafio__bullets li {
        font-size: 0.85rem;
    }

    .desafio__cta {
        font-size: 0.82rem;
        padding: 13px 28px;
    }

    .sponsors__list {
        gap: 8px;
    }

    .sponsors__tag {
        font-size: 0.7rem;
        padding: 5px 12px;
    }

    .desafio__sponsors {
        margin-top: 44px;
    }
}
</style>
