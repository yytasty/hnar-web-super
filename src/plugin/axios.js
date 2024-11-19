import { logAxiosError, logAxiosSuccess } from "@/util/log"
import axios from "axios"
import { ElLoading, ElMessage, ElNotification } from "element-plus"

const config = {
  baseURL: import.meta.env.VITE_api,
  timeout: 20 * 1000,
  withCredentials: false,
  isToastError: true,
  isPruneParam: true,
}

const instance = axios.create(config)

let loadingInstance = null

instance.interceptors.request.use(
  async (config) => {
    if (localStorage.token) {
      config.headers["X-Token"] = localStorage.token
    }
    if (config.isLoadingLock) {
      loadingInstance = ElLoading.service({
        fullscreen: true,
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.7)",
      })
    }
    if (config.params) {
      delete config.params.total
      if (config.isPruneParam) {
        Object.keys(config.params).forEach((key) => {
          if ([undefined, null, -1, "all", "", "全部", 0].includes(config.params[key])) {
            delete config.params[key]
          }
        })
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response) => {
    loadingInstance?.close()
    if (response.data.err === 0) {
      logAxiosSuccess(response)
      return response.data?.data || {}
    } else if ([3001, 3002, 3003, 3004].includes(response.data.err)) {
      ElMessage.error(response.data?.msg || "服务端错误")
      setTimeout(() => {
        window.location.href = "/login"
      }, 1000)
      return
    } else {
      logAxiosError(response)
      if (response?.config?.isToastError) {
        ElMessage.error(response.data?.msg || "服务端错误")
        ElNotification({
          title: "请求异常，请联系管理员",
          type: "error",
          message: response.data?.msg,
        })
      }
      return Promise.reject(response.data)
    }
  },
  (error) => {
    loadingInstance?.close()
    error.msg = error.message || "请求超时，请重试"
    ElNotification({
      title: "请求异常，请联系管理员",
      type: "error",
      message: error.msg,
    })
    return Promise.reject(error)
  },
)

instance.loading = function () {
  instance.interceptors.request.use((config) => {
    config.isLoadingLock = true
    return config
  })
  return instance
}
instance.toast = function () {
  instance.interceptors.request.use((config) => {
    config.isToastError = true
    return config
  })
  return instance
}

export default instance
