export const authPageList = ref([])
export const authActionList = ref([])

export function checkAuthPage(pageId) {
  if (!authPageList.value?.length) return true
  if (!pageId) return true
  return authPageList.value.includes(pageId)
}
export function checkAuthActionIn(actionId) {
  if (!authActionList.value?.length) return true
  return authActionList.value.includes(actionId)
}
export function checkAuthActionSome(actionIdList) {
  if (!authActionList.value?.length) return true
  return authActionList.value.some((i) => actionIdList.includes(i))
}
