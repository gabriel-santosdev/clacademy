import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { inject } from '@vercel/analytics'
import { registerSW } from 'virtual:pwa-register'

inject()

registerSW({ immediate: true })

createApp(App).mount('#app')
