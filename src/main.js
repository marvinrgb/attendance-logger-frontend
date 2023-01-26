// import { Html5Qrcode } from 'html5-qrcode'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// app.use(Html5Qrcode)

app.use(router)

app.mount('#app')
