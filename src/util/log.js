const isDev = import.meta.env.DEV

export function log(...arg) {
  if (isDev) {
    console.log(
      "%cdebug%cinfo",
      "background-color: #333;color:white;padding:2px 6px;border-radius:3px 0 0 3px",
      "background-color: #e67e22;color:white;padding:2px 6px;border-radius:0 3px 3px 0",
      ...arg,
    )
  }
}

export function logAxiosSuccess(response) {
  if (isDev) {
    groupStart(response.config.method.toUpperCase() + " " + response.config.url.replace(response.config.baseURL, "/"))
    if (response.config.params) {
      printLabel("request", "params", "#2ecc71")
      console.log(response.config.params)
    }
    if (response.config.data) {
      printLabel("request", "payload", "#2ecc71")
      console.log(response.config.data)
    }
    if (response.data.list) {
      if (response.data.page) {
        printLabel("response", "page", "#3498db")
        console.log(response.data.page)
      }
      if (response.data.other) {
        printLabel("response", "other", "#3498db")
        console.log(response.data.other)
      }
      printLabel("response", "list", "#3498db")
      console.log(response.data.list)
    } else {
      printLabel("response", "data", "#3498db")
      console.log(response.data.data || response.data)
    }
    console.groupEnd()
  }
}
export function logAxiosError(response) {
  if (isDev) {
    console.groupCollapsed(`😈❌%c>>>>>>> ${response.config.method.toUpperCase()} ${response.config.url}`, "color:red")
    if (response.config.params) {
      printLabel("request", "params", "#2ecc71")
      console.log(response.config.params)
    }
    if (response.config.data) {
      printLabel("request", "payload", "#2ecc71")
      console.log(response.config.data)
    }
    printLabel("response", "data", "#3498db")
    console.log(response.data || response)
    console.groupEnd()
  }
}

const printLabel = (type = "debug", label = "label", color = "#e67e22") => {
  console.log(
    `%c${type}%c${label}`,
    "background-color: #35495e;color:white;padding:2px 6px;border-radius:3px 0 0 3px",
    `background-color:${color};color:white;padding:2px 6px;border-radius:0 3px 3px 0`,
  )
}

const rainbow = [
  "color: #e74c3c",
  "color: #e67e22",
  "color: #f1c40f",
  "color: #2ecc71",
  "color: #1abc9c",
  "color: #3498db",
  "color: #9b59b6",
  "color: #333",
]
const groupStart = (val) => {
  let cord = []
  while (cord.length < 7) {
    let n = Math.floor(Math.random() * 7)
    if (!cord.includes(rainbow[n])) {
      cord.push(rainbow[n])
    }
  }
  console.groupCollapsed("😈✅%c>>%c>>%c>>%c>>%c>>%c>>%c>>%c " + val, ...cord, "color: #B4B4B4")
}
