<template lang="pug">
yy-dialog(:modelValue="isShow", @close="emits('update:isShow', false)", title="客户开户申请审核", width="700px")
  el-descriptions(:column="2")
    el-descriptions-item(label="姓名") {{ formData.name }}
    el-descriptions-item(label="联系电话") {{ formData.phone }}
  el-descriptions(:column="2")
    el-descriptions-item(label="状态") {{ formData.status }}
    el-descriptions-item(label="创建时间") {{ formatTime(formData.createTime) }}
  el-descriptions(:column="2")
    el-descriptions-item(label="钢瓶规格") {{ formData.bottleSpecific?.name }}
    el-descriptions-item(label="用气瓶数") {{ formData.useBottleNum }}
  el-descriptions(:column="2")
    el-descriptions-item(label="钢瓶押金") {{ formData.guarantyPrice }}
    el-descriptions-item(label="所属配送员") {{ formData.courier?.name }}
  el-descriptions(:column="1")
    el-descriptions-item(label="用气地址") {{ formData.address }}
  el-descriptions(:column="2")
    el-descriptions-item(label="身份证")
      yy-imageList(:modelValue="formData.imageList || []")
  el-descriptions(:column="2")
    el-descriptions-item(label="客户签章")
      yy-image(:src="formData.signatureImage", width="300px", height="200px")
  el-descriptions(:column="1")
    el-descriptions-item(label="备注") {{ formData.remark }}
  #mapContainer(v-if="formData?.location?.coordinates?.[0]")

  template(#footer)
    el-button(type="primary", @click="handleAccess") 审核通过并建档
    el-button(type="default", @click="handleDenied") 审核不通过
</template>

<script setup>
import { AMap } from "@/plugin/map"

const { formatTime } = inject("format")
const { fetch, message, router } = inject("global")

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  currentId: {
    type: String,
    default: "",
  },
})
const emits = defineEmits(["update:isShow", "success"])

const formData = ref({
  imageList: [],
})

function validate() {
  return Promise.resolve()
}

function handleAccess() {
  validate()
    .then(() => {
      return fetch.post(`/customerRegister/${formData.value?._id}/access`)
    })
    .then(() => {
      message.success("审核成功")
      emits("update:isShow", false)
      emits("success")
      router.push(`/customer/edit?id=${formData.value?.customer}`)
    })
    .catch((err) => {
      message.error(err?.msg || err)
    })
}
function handleDenied() {
  validate()
    .then(() => {
      return fetch.post(`/customerRegister/${formData.value?._id}/denied`)
    })
    .then(() => {
      message.success("审核完成")
      emits("update:isShow", false)
      emits("success")
    })
    .catch((err) => {
      message.error(err?.msg || err)
    })
}

function getData(id) {
  fetch.get(`customerRegister/${props.currentId}`).then((res) => {
    formData.value = {
      imageList: [],
      ...res,
    }
    initMap()
  })
}

const mapInstance = ref(null)
const markerLayer = ref(null)
const markerLabel = ref(null)
function initMap() {
  if (!formData.value?.location?.coordinates) return
  if (mapInstance.value) {
    mapInstance.value.setCenter(formData.value?.location?.coordinates, true)
    markerLabel.value.setPosition(formData.value?.location?.coordinates)
    return
  }
  nextTick(() => {
    mapInstance.value = new AMap.Map("mapContainer", {
      viewMode: "2D",
      mapStyle: "amap://styles/macaron",
      zoom: 13,
      center: formData.value?.location?.coordinates,
    })

    markerLayer.value = new AMap.LabelsLayer({
      collision: true,
    })
    markerLabel.value = new AMap.LabelMarker({
      position: formData.value?.location?.coordinates || [0, 0],
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

watch(
  () => props.isShow,
  async (val) => {
    if (val) {
      getData(props.currentId)
    }
  },
  { immediate: true },
)

onMounted(() => {})
</script>

<style lang="less" scoped>
.dialogItem {
  width: 300px;
}
#mapContainer {
  height: 300px;
  width: 500px;
}
</style>
