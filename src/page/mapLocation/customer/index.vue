<route lang="yaml">
meta:
  title: 客户定位
  pageId: customerLocation
  categoryList:
    - 安全监管/地图定位
</route>

<template lang="pug">
.page
  el-card
    el-form(inline)
      el-form-item(label="客户名称")
        el-input(v-model="filter.name")
      el-form-item(label="客户类型")
        el-select(v-model="filter.type")
          el-option(label="全部", value="")
          el-option(v-for="i in customerTypeList", :label="i", :value="i")
      el-form-item
        el-button(type="primary", @click="handleSearch") 查询
        el-button(type="warning", plain, @click="handleReset") 重置
  .result
    el-card(header="结果列表", style="flex-basis: 400px")
      el-table(:data="list")
        el-table-column(label="客户名称", prop="name")
        el-table-column(label="客户类型", prop="type")
        el-table-column(label="地址定位")
          template(#default="{ row }")
            el-tooltip(
              v-if="row.addressInfo?.location?.coordinates?.[0]",
              :content="row.addressInfo?.location?.coordinates.toString()",
              placement="top"
            )
              el-button(type="success", plain, size="small", @click="handleMoveMap(row)") 有
      el-pagination(
        style="margin-top: 20px; justify-content: center",
        background,
        size="small",
        v-model:current-page="pagination.page",
        v-model:page-size="pagination.size",
        :total="pagination.total",
        layout="prev, pager, next",
        @change="getList"
      )
    el-card(header="地图视图", style="flex-grow: 1")
      #container
</template>

<script setup>
import { AMap, currentLocation } from "@/plugin/map"
import { useListPage } from "@/provider/listPage"
import { customerTypeList, ensureCacheData } from "@/provider/cache"

const { fetch, message, router } = inject("global")

const { list, pagination, filter, getList, handleSearch, handleReset } = useListPage({
  url: "/customer",
  filter: {
    name: "",
    type: "",
  },
})

ensureCacheData("customerTypeList")

const mapInstance = ref(null)
const markerLayer = ref(null)
function initMap() {
  if (mapInstance.value) return
  nextTick(() => {
    mapInstance.value = new AMap.Map("container", {
      viewMode: "2D",
      mapStyle: "amap://styles/macaron",
      zoom: 13,
      center: currentLocation.value || [0, 0],
    })
    markerLayer.value = new AMap.LabelsLayer({
      collision: true,
    })
    mapInstance.value.add(markerLayer.value)
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
  if (!list.value) return
  if (!mapInstance.value) {
    initMap()
  }
  if (markerLayer.value) {
    markerLayer.value.clear()
  }
  list.value.forEach((i) => {
    if (i.addressInfo?.location?.coordinates?.[0]) {
      const marker = new AMap.LabelMarker({
        position: i.addressInfo.location.coordinates,
        title: i.name,
        icon: {
          image: "https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
          size: [25, 34],
          anchor: "bottom-center",
        },
        text: {
          content: i.name,
          direction: "center",
          offset: [0, -8],
          style: {
            fontSize: 10,
            fillColor: "#fff",
          },
        },
      })
      marker.on("click", () => {
        mapInstance.value.setCenter(i.addressInfo.location.coordinates, true)
      })
      markerLayer.value.add(marker)
    }
  })
}
function handleMoveMap(row) {
  if (row.addressInfo?.location?.coordinates?.[0]) {
    mapInstance.value.setCenter(row.addressInfo.location.coordinates, true)
  }
}

watch(
  () => list.value,
  () => {
    refreshMap()
  },
)

onMounted(() => {
  handleReset()
  initMap()
})
</script>

<style lang="less" scoped>
.result {
  display: flex;
  align-items: flex-start;
  .el-card {
    margin-right: 20px;
  }
}
#container {
  width: 1200px;
  height: 800px;
}
</style>
