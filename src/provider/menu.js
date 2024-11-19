import router from "@/plugin/router"
import { checkAuthPage } from "@/provider/account"
import { nextTick } from "vue"

export const menuGroupList = computed(() => {
  return Object.keys(menuData.value).filter((i) => menuData.value[i]?.length)
})

export const menuGroup = ref("客服中心")

export const menuData = ref({
  客服中心: [],
  销售管理: [],
  报表中心: [],
  生产中心: [],
  安全监管: [],
  系统管理: [],
})

export const isCollapse = ref(false)
export function switchCollapse() {
  isCollapse.value = !isCollapse.value
}

export const menuPathTitleMap = (function getMenuPathNameMap() {
  let obj = {}
  for (let list of Object.values(menuData.value)) {
    for (let item of list) {
      obj[item.index] = item.title
      if (item.children) {
        item.children.reduce((a, subItem) => {
          a[subItem?.index] = subItem?.title
          return obj
        }, obj)
      }
    }
  }
  return obj
})()

export function ensureMenuData() {
  const menuDataStr = sessionStorage.getItem("menuData")
  if (menuDataStr) {
    menuData.value = JSON.parse(menuDataStr) || []
  } else {
    generateMenuData()
  }
}

export function generateMenuData() {
  menuData.value = {
    客服中心: [],
    销售管理: [],
    报表中心: [],
    生产中心: [],
    安全监管: [],
    系统管理: [],
  }
  nextTick(() => {
    const routerList =
      router
        .getRoutes()
        .filter((item) => item.meta?.categoryList?.length)
        .filter((i) => i.meta.isPass || checkAuthPage(i.meta.pageId))
        .sort((a, b) => a.meta.order - b.meta.order) || []
    sessionStorage.removeItem("menuData")
    routerList.forEach((routerItem) => {
      routerItem.meta?.categoryList?.forEach((categoryItem) => {
        const category = categoryItem.split("/")[0]
        const subCategory = categoryItem.split("/")[1] || ""
        let menuList = menuData.value[category]
        if (!menuList) {
          menuData.value[category] = []
          menuList = menuData.value[category]
        }
        if (!subCategory) {
          menuList.push({
            title: routerItem.meta.title,
            index: routerItem.path,
            order: routerItem.meta.order || 100,
            icon: routerItem.meta.icon || "Odometer",
          })
        } else {
          let subMenu = menuList.find((item) => item.title === subCategory)
          if (!subMenu) {
            menuList.push({
              title: subCategory,
              children: [],
            })
            subMenu = menuList.find((item) => item.title === subCategory)
          }
          subMenu.children.push({
            title: routerItem.meta.title,
            index: routerItem.path,
            order: routerItem.meta.order || 100,
          })
          if (!subMenu.order) {
            subMenu.order = subMenu.children[0]?.order || 100
          }
        }
      })
    })
    for (let key in menuData.value) {
      if (!menuData.value[key].length) {
        delete menuData.value[key]
      }
      menuData.value[key] = menuData.value[key].sort((a, b) => a.order - b.order)
    }
    sessionStorage.setItem("menuData", JSON.stringify(menuData.value))
  })
}
