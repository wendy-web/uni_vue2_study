/** 重置样式 */
import '@/styles/reset.css'
import 'uno.css'
import '@/styles/global.scss'
import 'virtual:svg-icons-register'

import { createApp } from 'vue'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import { btnPerms } from '@/utils/directive/permission'
import App from './App.vue'

async function setupApp() {
  const app = createApp(App)
  setupStore(app)
  btnPerms(app)
  await setupRouter(app)
  app.mount('#app')
}

setupApp()
