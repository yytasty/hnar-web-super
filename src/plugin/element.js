import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import "element-plus/dist/index.css"

export default {
  install(app) {
    if (!app) return
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
