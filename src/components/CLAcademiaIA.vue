<script setup lang="ts">
import { ref, nextTick } from 'vue'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const isOpen = ref(false)
const userInput = ref('')
const messages = ref<Message[]>([])
const isLoading = ref(false)
const messagesEl = ref<HTMLElement | null>(null)

const SYSTEM_PROMPT = `Você é a CL Academy IA, assistente pessoal de treino da CL Academy — uma academia especializada em treino funcional, musculação e corrida.

Sua personalidade:
- Fofa, acolhedora e super motivadora 💪
- Use linguagem neutra ou feminina (evite "campeão", prefira "campeã", "você arrasou", "bora lá!")
- Use emojis com moderação para deixar a conversa mais animada
- Trate a pessoa sempre com carinho, como uma amiga personal trainer

Sua função é sugerir treinos para o dia com base no nível, objetivo e disponibilidade de tempo informados.

Diretrizes do treino:
- Se a pessoa não informar nível (iniciante/intermediário/avançado) ou objetivo, pergunte com leveza antes de sugerir
- Estruture os treinos com: aquecimento, parte principal e volta à calma
- Dê dicas de hidratação e nutrição pré/pós-treino quando relevante
- Para corrida, inclua pace sugerido e tipo de treino (contínuo, intervalado, longo)
- Para musculação, indique séries, repetições e tempo de descanso
- Para funcional, descreva cada exercício com clareza
- Escreva as respostas de forma COMPLETA, nunca corte no meio de um exercício ou frase`

const scrollToBottom = async () => {
  await nextTick()
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}

const sendMessage = async () => {
  const text = userInput.value.trim()
  if (!text || isLoading.value) return

  messages.value.push({ role: 'user', content: text })
  userInput.value = ''
  isLoading.value = true
  await scrollToBottom()

  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey || apiKey === 'sua-chave-aqui') {
      throw new Error('config')
    }

    // Converte histórico para o formato Gemini (role: 'user' | 'model')
    const geminiContents = messages.value.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: geminiContents,
          generationConfig: { maxOutputTokens: 1200, temperature: 0.75 },
        }),
      }
    )

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err?.error?.message ?? 'api_error')
    }

    const data = await response.json()
    const reply: string = data.candidates[0].content.parts[0].text
    messages.value.push({ role: 'assistant', content: reply })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg === 'config') {
      messages.value.push({
        role: 'assistant',
        content: '🔧 Ops! Estou em manutenção agora. Volto em breve! 💪',
      })
    } else {
      messages.value.push({
        role: 'assistant',
        content: '😕 Algo deu errado por aqui. Tente novamente em instantes — prometo que volto em forma! 🏃‍♀️',
      })
    }
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value && messages.value.length === 0) {
    messages.value.push({
      role: 'assistant',
      content: '👋 Olá! Sou o CL Academy IA.\n\nMe conta: qual é o seu nível (iniciante, intermediário ou avançado) e o que você quer treinar hoje? Funcional, musculação ou corrida?',
    })
  }
}

const formatMessage = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')

const quickSend = (text: string) => {
  userInput.value = text
  sendMessage()
}
</script>

<template>
  <!-- Botão flutuante -->
  <button
    class="ia-fab"
    :class="{ 'ia-fab--open': isOpen }"
    @click="toggleChat"
    aria-label="Abrir CL Academy IA"
  >
    <Transition name="ia-icon" mode="out-in">
      <!-- Ícone haltere (fechado) -->
      <svg v-if="!isOpen" key="open" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="26" height="26">
        <path d="M6.5 6.5h11M6.5 17.5h11"/>
        <rect x="2" y="4" width="3" height="5" rx="1"/>
        <rect x="2" y="15" width="3" height="5" rx="1"/>
        <rect x="19" y="4" width="3" height="5" rx="1"/>
        <rect x="19" y="15" width="3" height="5" rx="1"/>
        <line x1="5" y1="6.5" x2="5" y2="17.5"/>
        <line x1="19" y1="6.5" x2="19" y2="17.5"/>
        <line x1="8" y1="9" x2="16" y2="9"/>
        <line x1="8" y1="15" x2="16" y2="15"/>
        <line x1="12" y1="9" x2="12" y2="15"/>
      </svg>
      <!-- X (aberto) -->
      <svg v-else key="close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </Transition>
    <!-- Pulse ring (apenas quando fechado) -->
    <span v-if="!isOpen" class="ia-fab__pulse" />
  </button>

  <!-- Janela de chat -->
  <Transition name="ia-slide">
    <div v-if="isOpen" class="ia-chat">

      <!-- Header -->
      <div class="ia-chat__header">
        <div class="ia-chat__hd-left">
          <div class="ia-chat__avatar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
              <path d="M6.5 6.5h11M6.5 17.5h11"/>
              <rect x="2" y="4" width="3" height="5" rx="1"/>
              <rect x="2" y="15" width="3" height="5" rx="1"/>
              <rect x="19" y="4" width="3" height="5" rx="1"/>
              <rect x="19" y="15" width="3" height="5" rx="1"/>
              <line x1="5" y1="6.5" x2="5" y2="17.5"/>
              <line x1="19" y1="6.5" x2="19" y2="17.5"/>
              <line x1="8" y1="9" x2="16" y2="9"/>
              <line x1="8" y1="15" x2="16" y2="15"/>
              <line x1="12" y1="9" x2="12" y2="15"/>
            </svg>
          </div>
          <div class="ia-chat__hd-info">
            <span class="ia-chat__name">CL Academy IA</span>
            <span class="ia-chat__status">
              <span class="ia-chat__dot" />
              Assistente de treino
            </span>
          </div>
        </div>
        <button class="ia-chat__close" @click="isOpen = false" aria-label="Fechar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Sugestões rápidas (só aparece antes de qualquer mensagem do usuário) -->
      <div v-if="messages.length <= 1" class="ia-chips">
        <button class="ia-chip" @click="quickSend('Musculação intermediário, 1 hora')">🏋️ Musculação</button>
        <button class="ia-chip" @click="quickSend('Funcional iniciante, 45 min')">⚡ Funcional</button>
        <button class="ia-chip" @click="quickSend('Corrida avançado, 1 hora')">🏃 Corrida</button>
      </div>

      <!-- Mensagens -->
      <div class="ia-chat__messages" ref="messagesEl">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          class="ia-msg"
          :class="msg.role === 'user' ? 'ia-msg--user' : 'ia-msg--bot'"
        >
          <div v-if="msg.role === 'assistant'" class="ia-msg__icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
              <path d="M6.5 6.5h11M6.5 17.5h11"/>
              <rect x="2" y="4" width="3" height="5" rx="1"/>
              <rect x="2" y="15" width="3" height="5" rx="1"/>
              <rect x="19" y="4" width="3" height="5" rx="1"/>
              <rect x="19" y="15" width="3" height="5" rx="1"/>
              <line x1="5" y1="6.5" x2="5" y2="17.5"/>
              <line x1="19" y1="6.5" x2="19" y2="17.5"/>
              <line x1="8" y1="9" x2="16" y2="9"/>
              <line x1="8" y1="15" x2="16" y2="15"/>
              <line x1="12" y1="9" x2="12" y2="15"/>
            </svg>
          </div>
          <div class="ia-msg__bubble" v-html="formatMessage(msg.content)" />
        </div>

        <div v-if="isLoading" class="ia-msg ia-msg--bot">
          <div class="ia-msg__icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
              <path d="M6.5 6.5h11M6.5 17.5h11"/>
              <rect x="2" y="4" width="3" height="5" rx="1"/>
              <rect x="2" y="15" width="3" height="5" rx="1"/>
              <rect x="19" y="4" width="3" height="5" rx="1"/>
              <rect x="19" y="15" width="3" height="5" rx="1"/>
              <line x1="5" y1="6.5" x2="5" y2="17.5"/>
              <line x1="19" y1="6.5" x2="19" y2="17.5"/>
              <line x1="8" y1="9" x2="16" y2="9"/>
              <line x1="8" y1="15" x2="16" y2="15"/>
              <line x1="12" y1="9" x2="12" y2="15"/>
            </svg>
          </div>
          <div class="ia-msg__bubble ia-msg__bubble--typing">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="ia-chat__footer">
        <div class="ia-chat__input-wrap">
          <textarea
            v-model="userInput"
            placeholder="Pergunte sobre seu treino de hoje…"
            rows="1"
            class="ia-chat__input"
            @keydown="handleKeydown"
          />
          <button
            class="ia-chat__send"
            :disabled="!userInput.trim() || isLoading"
            @click="sendMessage"
            aria-label="Enviar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
        <p class="ia-chat__hint">Enter para enviar · Shift+Enter para nova linha</p>
      </div>

    </div>
  </Transition>
</template>

<style scoped>
/* ── Botão flutuante ─────────────────────────────────── */
.ia-fab {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 1000;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2);
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
  cursor: pointer;
  overflow: visible;
}

.ia-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 28px rgba(0,0,0,0.35);
}

.ia-fab--open {
  background: linear-gradient(135deg, #444 0%, #666 100%);
}

/* Anel pulsante */
.ia-fab__pulse {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.35);
  animation: pulse-ring 2.4s ease-out infinite;
  pointer-events: none;
}

@keyframes pulse-ring {
  0%   { transform: scale(1);    opacity: 0.8; }
  70%  { transform: scale(1.22); opacity: 0; }
  100% { transform: scale(1.22); opacity: 0; }
}

/* Transição de ícone */
.ia-icon-enter-active, .ia-icon-leave-active { transition: opacity 0.15s, transform 0.15s; }
.ia-icon-enter-from { opacity: 0; transform: rotate(-30deg) scale(0.7); }
.ia-icon-leave-to   { opacity: 0; transform: rotate( 30deg) scale(0.7); }

/* ── Janela de chat ──────────────────────────────────── */
.ia-chat {
  position: fixed;
  bottom: 100px;
  right: 28px;
  z-index: 999;
  width: 380px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 120px);
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 16px 60px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Header ─────────────────────────────────────────── */
.ia-chat__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  background: linear-gradient(120deg, #1a1a1a 0%, #2e2e2e 100%);
  color: #fff;
  flex-shrink: 0;
}

.ia-chat__hd-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ia-chat__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.12);
  border: 1.5px solid rgba(255,255,255,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ia-chat__hd-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ia-chat__name {
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.01em;
}

.ia-chat__status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  color: rgba(255,255,255,0.6);
}

.ia-chat__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 2px rgba(74,222,128,0.3);
  flex-shrink: 0;
}

.ia-chat__close {
  background: rgba(255,255,255,0.1);
  border: none;
  color: rgba(255,255,255,0.7);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}

.ia-chat__close:hover {
  background: rgba(255,255,255,0.2);
  color: #fff;
}

/* ── Chips de sugestão rápida ────────────────────────── */
.ia-chips {
  display: flex;
  gap: 6px;
  padding: 10px 14px;
  background: #fafafa;
  border-bottom: 1px solid #efefef;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.ia-chip {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 0.78rem;
  font-family: inherit;
  color: #333;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, transform 0.1s;
  white-space: nowrap;
}

.ia-chip:hover {
  background: #f0f0f0;
  border-color: #bbb;
  transform: translateY(-1px);
}

/* ── Mensagens ───────────────────────────────────────── */
.ia-chat__messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 380px;
  min-height: 180px;
  background: #f7f7f8;
  scroll-behavior: smooth;
}

.ia-chat__messages::-webkit-scrollbar { width: 4px; }
.ia-chat__messages::-webkit-scrollbar-thumb { background: #d0d0d0; border-radius: 4px; }
.ia-chat__messages::-webkit-scrollbar-track { background: transparent; }

.ia-msg {
  display: flex;
  align-items: flex-end;
  gap: 6px;
}

.ia-msg--user {
  justify-content: flex-end;
}

.ia-msg--bot {
  justify-content: flex-start;
}

/* Ícone mini do bot */
.ia-msg__icon {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #2e2e2e;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-bottom: 2px;
}

.ia-msg__bubble {
  max-width: 78%;
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 0.875rem;
  line-height: 1.6;
  word-break: break-word;
}

.ia-msg--user .ia-msg__bubble {
  background: #1a1a1a;
  color: #fff;
  border-bottom-right-radius: 5px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

.ia-msg--bot .ia-msg__bubble {
  background: #fff;
  color: #2b2b2b;
  border-bottom-left-radius: 5px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  border: 1px solid #ebebeb;
}

/* ── Typing indicator ─────────────────────────────── */
.ia-msg__bubble--typing {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 13px 16px;
}

.ia-msg__bubble--typing span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #aaa;
  animation: blink 1.2s infinite;
}

.ia-msg__bubble--typing span:nth-child(2) { animation-delay: 0.2s; }
.ia-msg__bubble--typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); }
  40%            { opacity: 1;   transform: scale(1); }
}

/* ── Footer / Input ──────────────────────────────────── */
.ia-chat__footer {
  border-top: 1px solid #efefef;
  background: #fff;
  padding: 10px 12px 8px;
  flex-shrink: 0;
}

.ia-chat__input-wrap {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background: #f3f3f4;
  border-radius: 14px;
  padding: 6px 6px 6px 12px;
  border: 1.5px solid transparent;
  transition: border-color 0.15s;
}

.ia-chat__input-wrap:focus-within {
  border-color: #333;
  background: #fff;
}

.ia-chat__input {
  flex: 1;
  resize: none;
  border: none;
  background: transparent;
  padding: 4px 0;
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.45;
  outline: none;
  max-height: 90px;
  overflow-y: auto;
  color: #2b2b2b;
}

.ia-chat__input::placeholder { color: #aaa; }

.ia-chat__send {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #1a1a1a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s, transform 0.1s;
  flex-shrink: 0;
}

.ia-chat__send:not(:disabled):hover {
  background: #000;
  transform: scale(1.08);
}

.ia-chat__send:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.ia-chat__hint {
  font-size: 0.68rem;
  color: #bbb;
  text-align: center;
  margin-top: 6px;
  letter-spacing: 0.01em;
}

/* ── Tema Brasil ─────────────────────────────────────── */
[data-theme="brasil"] .ia-fab,
[data-theme="brasil"] .ia-chat__header {
  background: linear-gradient(135deg, #001f63 0%, #002776 100%);
}

[data-theme="brasil"] .ia-fab--open {
  background: linear-gradient(135deg, #002776 0%, #003399 100%);
}

[data-theme="brasil"] .ia-msg--user .ia-msg__bubble,
[data-theme="brasil"] .ia-msg__icon,
[data-theme="brasil"] .ia-chat__send {
  background: #002776;
}

[data-theme="brasil"] .ia-chat__input-wrap:focus-within {
  border-color: #002776;
}

/* ── Transição ───────────────────────────────────────── */
.ia-slide-enter-active,
.ia-slide-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.ia-slide-enter-from,
.ia-slide-leave-to {
  opacity: 0;
  transform: translateY(18px) scale(0.96);
}

/* ── Mobile ──────────────────────────────────────────── */
@media (max-width: 480px) {
  .ia-fab {
    bottom: 18px;
    right: 16px;
  }

  .ia-chat {
    bottom: 90px;
    right: 10px;
    left: 10px;
    width: auto;
    max-width: none;
  }

  .ia-chat__messages {
    max-height: 320px;
  }
}
</style>
