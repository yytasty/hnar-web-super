import { dayjs } from "element-plus"

export default {
  install(app) {
    if (!app) return
    app.provide("format", {
      formatTime: (time) => {
        return time ? dayjs(time).format("YYYY-MM-DD HH:mm:ss") : ""
      },
      formatDate: (date) => {
        return date ? dayjs(date).format("YYYY-MM-DD") : ""
      },
      formatPrice: (price) => {
        price = Number(price)
        if (isNaN(price)) return price
        return price ? `¥${price.toFixed(2)}` : ""
      },
      formatSize: (size) => {
        if (isNaN(parseInt(size))) return size
        const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
        let unitIndex = 0
        let fileSize = parseInt(size)
        while (fileSize >= 1024 && unitIndex < units.length - 1) {
          fileSize /= 1024
          unitIndex++
        }
        return `${fileSize.toFixed(2)}${units[unitIndex]}`
      },
      formatPriceChinese: (num) => {
        let changeNum = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"]
        let unit = ["", "十", "百", "千", "万"]
        num = parseInt(num)
        let getWan = (temp) => {
          let strArr = temp.toString().split("").reverse()
          let newNum = ""
          for (var i = 0; i < strArr.length; i++) {
            newNum =
              (i == 0 && strArr[i] == 0
                ? ""
                : i > 0 && strArr[i] == 0 && strArr[i - 1] == 0
                  ? ""
                  : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i])) + newNum
          }
          return newNum
        }
        let overWan = Math.floor(num / 10000)
        let noWan = num % 10000
        if (noWan.toString().length < 4) noWan = "0" + noWan
        return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num)
      },
    })
  },
}
