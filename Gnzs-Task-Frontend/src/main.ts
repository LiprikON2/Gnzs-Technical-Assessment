import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'

import './assets/main.css'
import App from './App.vue'

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_BASE_URL

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
