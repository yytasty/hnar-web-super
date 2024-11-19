const cacheMap = ref({})

export function setCache(key, value) {
  cacheMap.value[key] = value
  sessionStorage[key] = JSON.stringify(value || "")
  return value
}

export function clearCache(key) {
  delete cacheMap.value[key]
  sessionStorage.removeItem(key)
}
export function clearAllCache() {
  cacheMap.value = {}
  sessionStorage.clear()
}

export function getCache(key) {
  if (cacheMap.value[key]) {
    return cacheMap.value[key]
  }
  if (sessionStorage[key] && sessionStorage[key] !== "undefined") {
    try {
      cacheMap.value[key] = JSON.parse(sessionStorage[key])
      return cacheMap.value[key]
    } catch (e) {
      return ""
    }
  }
}

export function refreshCacheFromStorage() {
  Object.keys(sessionStorage).forEach((key) => {
    if (sessionStorage[key] && !cacheMap.value[key]) {
      cacheMap.value[key] = JSON.parse(sessionStorage[key])
    }
  })
}

export async function ensureCacheData(key) {
  switch (key) {
    case "accountList":
      return getCache(key) || (await fetch.get("/staff/all").then((res) => setCache(key, res?.list || [])))

    case "courierList":
      return getCache(key) || (await fetch.get("/staff/all?type=配送员").then((res) => setCache(key, res?.list || [])))

    case "customerTypeList":
      return getCache(key) || (await fetch.get("/config/customerTypeList").then((res) => setCache(key, res || [])))

    case "customerSourceList":
      return getCache(key) || (await fetch.get("/config/customerSourceList").then((res) => setCache(key, res || [])))

    case "customerNatureList":
      return getCache(key) || (await fetch.get("/config/customerNatureList").then((res) => setCache(key, res || [])))

    case "repairTypeList":
      return getCache(key) || (await fetch.get("/config/repairTypeList").then((res) => setCache(key, res || [])))

    case "consultTypeList":
      return getCache(key) || (await fetch.get("/config/consultTypeList").then((res) => setCache(key, res || [])))

    case "complaintTypeList":
      return getCache(key) || (await fetch.get("/config/complaintTypeList").then((res) => setCache(key, res || [])))

    case "rentTypeList":
      return getCache(key) || (await fetch.get("/config/rentTypeList").then((res) => setCache(key, res || [])))

    case "bottleSpecificList":
      return getCache(key) || (await fetch.get("/bottle/specific?size=-1").then((res) => setCache(key, res.list || [])))

    case "bottleFactoryList":
      return getCache(key) || (await fetch.get("/bottle/factory?size=-1").then((res) => setCache(key, res.list || [])))

    case "stationList":
      return getCache(key) || (await fetch.get("/station/all").then((res) => setCache(key, res.list || [])))

    case "productUnitList":
      return getCache(key) || (await fetch.get("/config/productUnitList").then((res) => setCache(key, res || [])))

    default:
      return getCache(key)
  }
}

export const courierList = computed(() => getCache("courierList") || [])
export const customerTypeList = computed(() => getCache("customerTypeList") || [])
export const customerNatureList = computed(() => getCache("customerNatureList") || [])
export const customerSourceList = computed(() => getCache("customerSourceList") || [])
export const repairTypeList = computed(() => getCache("repairTypeList") || [])
export const consultTypeList = computed(() => getCache("consultTypeList") || [])
export const complaintTypeList = computed(() => getCache("complaintTypeList") || [])
export const rentTypeList = computed(() => getCache("rentTypeList") || [])
export const bottleSpecificList = computed(() => getCache("bottleSpecificList") || [])
export const bottleFactoryList = computed(() => getCache("bottleFactoryList") || [])
export const stationList = computed(() => getCache("stationList") || [])
export const productUnitList = computed(() => getCache("productUnitList") || [])
