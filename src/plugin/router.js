import { authPageList, isLogin, isNeedRefresh, loginByToken } from "@/provider/account"
import { getPageId } from "@/util/auth"
import { setupLayouts } from "virtual:generated-layouts"
import { createRouter, createWebHistory } from "vue-router"
import { routes } from "vue-router/auto-routes"

routes.unshift({
  path: "/",
  redirect: "/dashboard",
})

const router = createRouter({
  history: createWebHistory(),
  routes: setupLayouts(routes),
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      }
    } else {
      return { top: 0 }
    }
  },
})

router.beforeEach((to, from, next) => {
  if (to?.meta?.isPass) {
    next()
  } else if (isNeedRefresh()) {
    loginByToken()
      .then(() => {
        next()
      })
      .catch((err) => {
        console.log(">>>>>>> beforeEach loginByToken err", err)
        next("/login")
      })
  } else if (!isLogin()) {
    next("/login")
  } else if (!isPageAuthOK(to)) {
    next("/redirect/401")
  } else {
    next()
  }
})

router.afterEach(() => {})

export default router

function isPageAuthOK(to) {
  if (!authPageList.value?.length) return true
  return authPageList.value.includes(getPageId(to))
}
