import tinyMceQ from "@quincyx/tinymce-vue-q"
import "@quincyx/tinymce-vue-q/dist/style.css"

const commonModuleList = import.meta.glob("../component/common/*.vue", { eager: true })
const formModuleList = import.meta.glob("../component/form/*.vue", { eager: true })

const allModuleList = { ...commonModuleList, ...formModuleList }

console.log(">>>>>>> auto register component plugin, moduleListL: ", allModuleList)

export default {
  install(app) {
    if (!app) return
    Object.keys(allModuleList).forEach((fileName) => {
      let moduleName = fileName.substring(2, fileName.length - 4)
      const nameArr = moduleName.split("/")
      moduleName = "yy-" + nameArr[nameArr.length - 1]
      app.component(moduleName, allModuleList[fileName].default)
    })

    app.use(tinyMceQ)
  },
}
