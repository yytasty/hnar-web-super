<template lang="pug">
el-form(label-width="6em", v-if="modelValue")
  el-divider(content-position="left") 地图定位
  el-form-item(label="")
    div
      #container
      .desc(v-if="pickAddress") 当前地址：{{ pickAddress }}
      .actionBar
        el-button(type="warning", plain, @click="handleClear") 清空地址信息
        el-button(type="primary", @click="handlePickLocation") 确定选择地址
  el-divider(content-position="left") 位置信息
  el-form-item(label="地图位置")
    el-input(:modelValue="modelValue.location?.coordinates?.[0]", disabled, style="width: 170px; margin-right: 10px")
      template(#prepend)
        span 经度
    el-input(:modelValue="modelValue.location?.coordinates?.[1]", disabled, style="width: 170px")
      template(#prepend)
        span 纬度
  el-form-item(label="地区")
    el-input(v-model="modelValue.province", style="width: 190px; margin-right: 10px")
      template(#append)
        span 省
    el-input(v-model="modelValue.city", style="width: 190px; margin-right: 10px") 
      template(#append)
        span 市
    el-input(v-model="modelValue.district", style="width: 190px") 
      template(#append)
        span 区
  el-form-item(label="乡镇/街道")
    el-input(v-model="modelValue.township", style="width: 110px; margin-right: 10px", placeholder="乡镇")
    el-input(v-model="modelValue.street", style="width: 110px; margin-right: 10px", placeholder="街道") 
    el-input(v-model="modelValue.houseNumber", style="width: 70px; margin-right: 10px", placeholder="门牌号") 
    el-input(v-model="modelValue.neighborhood", style="width: 130px; margin-right: 10px", placeholder="社区") 
    el-input(v-model="modelValue.building", style="width: 130px; margin-right: 10px", placeholder="楼栋") 
  el-form-item(label="详细地址", required)
    el-input(v-model="modelValue.address", style="width: 590px") 
  el-form(label-width="6em", inline, v-if="hasFloor")
    el-form-item(label="所在楼层", required)
      el-input-number(v-model="modelValue.floor", controls-position="right")
    el-form-item(label="楼梯类型", required)
      el-radio-group(v-model="modelValue.stairType")
        el-radio(value="楼梯") 楼梯
        el-radio(value="电梯") 电梯
</template>

<script setup>
import { AMap, currentLocation } from "@/plugin/map"

import { pickAndUploadFile } from "@/provider/file"

const { fetch, message } = inject("global")

const props = defineProps({
  modelValue: {
    type: Object,
    default: {
      province: "",
      city: "",
      district: "",
      township: "",
      street: "",
      neighborhood: "",
      address: "",
      floor: 0,
      stairType: "电梯",
      mapImage: "",
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
    },
  },
  hasFloor: {
    type: Boolean,
    default: true,
  },
})
const emits = defineEmits(["update:modelValue"])

function handleClear() {
  pickAddress.value = ""
  emits("update:modelValue", {
    province: "",
    city: "",
    district: "",
    township: "",
    street: "",
    neighborhood: "",
    address: "",
    floor: 0,
    stairType: "电梯",
    mapImage: "",
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
  })
}

function handlePickLocation() {
  const location = mapInstance.value.getCenter()
  fetch
    .get("/area/addressInfoByLocation", {
      params: {
        longitude: location.lng,
        latitude: location.lat,
      },
    })
    .then((res) => {
      if (res?.address) {
        emits("update:modelValue", {
          ...props.modelValue,
          ...res,
        })
      }
    })
}

const mapInstance = ref(null)
const markerLayer = ref(null)
const markerLabel = ref(null)
const pickAddress = ref("")
function initMap() {
  if (mapInstance.value) return
  nextTick(() => {
    mapInstance.value = new AMap.Map("container", {
      viewMode: "2D",
      mapStyle: "amap://styles/macaron",
      zoom: 13,
    })

    markerLayer.value = new AMap.LabelsLayer({
      collision: true,
    })
    markerLabel.value = new AMap.LabelMarker({
      position: props.modelValue?.location?.coordinates || [0, 0],
      icon: {
        image: "https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
        size: [25, 34],
        anchor: "bottom-center",
      },
      text: {
        content: "客户",
        direction: "center",
        offset: [0, -8],
        style: {
          fontSize: 10,
          fillColor: "#fff",
        },
      },
    })
    markerLayer.value.add(markerLabel.value)
    mapInstance.value.add(markerLayer.value)
    mapInstance.value.on("click", async function ({ lnglat: location }) {
      mapInstance.value.setCenter(location)
      markerLabel.value.setPosition(location)
      pickAddress.value = await fetch.get("/area/addressSimpleByLocation", {
        params: {
          longitude: location.lng,
          latitude: location.lat,
        },
      })
    })
    AMap.plugin("AMap.ToolBar", function () {
      mapInstance.value.addControl(new AMap.ToolBar())
    })
    AMap.plugin("AMap.Scale", function () {
      mapInstance.value.addControl(new AMap.Scale())
    })
    AMap.plugin("AMap.Geolocation", function () {
      mapInstance.value.addControl(new AMap.Geolocation())
    })
    AMap.plugin("AMap.MapType", function () {
      mapInstance.value.addControl(new AMap.MapType())
    })
    AMap.plugin("AMap.ControlBar", function () {
      mapInstance.value.addControl(new AMap.ControlBar())
    })
  })
}

function refreshMap() {
  if (!mapInstance.value) return
  if (props.modelValue?.location?.coordinates?.[0]) {
    mapInstance.value.setCenter(props.modelValue?.location?.coordinates, true)
    markerLabel.value.setPosition(props.modelValue?.location?.coordinates)
  } else {
    mapInstance.value.setCenter(currentLocation.value, true)
  }
}

watch(
  () => props.modelValue?.location?.coordinates,
  () => {
    if (props.modelValue && !mapInstance.value) {
      initMap()
    }
    refreshMap()
  },
  {
    immediate: true,
  },
)
</script>

<style lang="less" scoped>
#container {
  width: 600px;
  height: 400px;
}
.desc {
  text-align: right;
  font-size: 12px;
  color: #666;
}
.actionBar {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
</style>
