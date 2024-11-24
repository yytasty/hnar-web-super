import fetch from "@/plugin/axios"
import { generateMenuData } from "@/provider/menu"
import { ElMessage as message } from "element-plus"

export const accountInfo = ref(null)
export const companyInfo = ref(null)

export function isLogin() {
  return !!accountInfo.value?._id && !!companyInfo.value?._id && !!localStorage.token
}
export function isNeedRefresh() {
  return !!localStorage.token && !isLogin()
}

export function loginByToken() {
  return fetch.post("/account/loginByToken").then((res) => {
    return afterLogin(res)
  })
}

export async function loginByPassword(info) {
  localStorage.removeItem("token")
  return fetch.post("/super/loginByPassword", info).then((res) => {
    message.success("登录成功")
    return afterLogin(res)
  })
}

function afterLogin(res) {
  accountInfo.value = res.accountInfo
  companyInfo.value = res.companyInfo
  localStorage.token = res.token
  return getAuthInfo()
}

export const authPageList = ref([])
function getAuthInfo() {
  return fetch.get("/account/auth").then((res) => {
    authPageList.value = res?.authPageList || []
    generateMenuData()
    return res
  })
}

export function checkAuthPage(pageId) {
  if (!authPageList.value?.length) return true
  if (!pageId) return true
  return authPageList.value.includes(pageId)
}

export function logout() {
  accountInfo.value = null
  companyInfo.value = null
  sessionStorage.clear()
  localStorage.removeItem("token")
  return Promise.resolve()
}
