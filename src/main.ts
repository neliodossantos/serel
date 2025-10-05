import './assets/main.css'
import { createApp as createVueApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import router from './router'

export function createApp() {
  const app = createVueApp(App)
  const pinia = createPinia()
  const head = createHead()
  app.use(pinia)
  app.use(head)
  app.use(router)
  return { app, router, head }
}
