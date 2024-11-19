import AMapLoader from "@amap/amap-jsapi-loader"

export let AMap = null

export default {
  install(app) {
    if (!app) return
    window._AMapSecurityConfig = {
      securityJsCode: import.meta.env.VITE_amap_jscode,
    }
    AMapLoader.load({
      key: import.meta.env.VITE_amap_key,
      version: "2.0",
      plugins: ["AMap.Scale"],
    })
      .then((res) => {
        AMap = res
        console.log("地图SDK加载成功", res)
        providePlugin()
      })
      .catch((e) => {
        console.log("地图SDK加载失败", e)
      })
  },
}

export const currentLocation = ref([])
function providePlugin() {
  AMap.plugin("AMap.Geolocation", function () {
    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000,
      offset: [10, 20],
      zoomToAccuracy: true,
      position: "RB",
    })
    geolocation.getCurrentPosition(function (status, result) {
      if (status == "complete") {
        currentLocation.value = [result.position.lng, result.position.lat]
      } else {
        currentLocation.value = [0, 0]
      }
    })
  })
  
}
