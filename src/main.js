import "@/assets/css/icon.css"
import component from "@/plugin/component"
import directive from "@/plugin/directive"
import element from "@/plugin/element"
import format from "@/plugin/format"
import map from "@/plugin/map"
import router from "@/plugin/router"
import "@/style/global.css"
import { createPinia } from "pinia"
import { createApp } from "vue"
import App from "./App.vue"

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(directive)
app.use(component)
app.use(element)
app.use(map)
app.use(format)

app.mount("#app")
