import { ElLoading } from "element-plus"

const loadingInstance = ref(null)

let index = 0
function showLoading(option = {}) {
  index++
  if (index == 1) {
    loadingInstance.value = ElLoading.service({
      text: "加载中...",
      background: "rgba(0, 0, 0, 0.7)",
      ...option,
    })
  }
}
function hideLoading() {
  index--
  if (index == 0) {
    loadingInstance.value && loadingInstance.value.close()
  }
}

export const loadingProvider = {
  open: () => showLoading(),
  show: () => showLoading(),
  hide: () => hideLoading(),
  close: () => hideLoading(),
  lock: () => showLoading({ lock: true }),
  isLock: () => {
    return (loadingInstance.value?.visible && loadingInstance.value?.lock) || false
  },
}
