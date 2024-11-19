<template lang="pug">
yy-dialog(:modelValue="isShow", @close="emits('update:isShow', false)", :title="title")
  el-form(label-width="9em")
    el-form-item(label="所属部门")
      el-input(:modelValue="formData.station?.name", disabled)
        template(#append)
          el-button(type="primary", @click="handlePickStation") 选择
    el-form-item(label="使用门店")
      el-input(:modelValue="formData.store?.name", disabled)
        template(#append)
          el-button(type="primary", @click="isShowStorePicker = true") 选择
    el-form-item(label="检验单位")
      el-input(:modelValue="formData.auditStation?.name", disabled)
        template(#append)
          el-button(type="primary", @click="handlePickAuditStation") 选择
    el-form-item(label="产权类型")
      el-radio-group(v-model="formData.property")
        el-radio(value="自有") 自有
        el-radio(value="托管") 托管
    el-form-item(label="产权标识码")
      el-input(v-model="formData.propertyCode")
    el-form-item(label="钢瓶条码")
      el-input(v-model="formData.sn", required)
    el-form-item(label="电子标签")
      el-input(v-model="formData.rfid")
    el-form-item(label="单位内编号")
      el-input(v-model="formData.internalCode")
    el-form-item(label="产品编号")
      el-input(v-model="formData.productCode")
    el-form-item(label="制造单位")
      el-select(v-model="formData.bottleFactory", style="width: 300px")
        el-option(v-for="item in bottleFactoryList", :key="item._id", :label="item.name", :value="item._id")
  el-form(label-width="9em", inline)
    el-form-item(label="出厂日期")
      el-date-picker(v-model="formData.productionDate", type="month")
    el-form-item(label="末检日期")
      el-date-picker(v-model="formData.auditDate", type="month")
    el-form-item(label="下检日期")
      el-date-picker(v-model="formData.nextAuditDate", type="month")
    el-form-item(label="报废日期")
      el-date-picker(v-model="formData.scrapDate", type="month")
    el-form-item(label="设计使用截止日期")
      el-date-picker(v-model="formData.designEndDate", type="month")
    el-form-item(label="终止使用日期")
      el-date-picker(v-model="formData.endDate", type="month")
  el-form(label-width="8em")
    el-form-item(label="钢瓶规格")
      el-select(v-model="formData.bottleSpecific", style="width: 300px")
        el-option(
          v-for="item in bottleSpecificList",
          :key="item._id",
          :label="`${item.name}(${item.bottleType})`",
          :value="item._id"
        )
  el-form(label-width="8em", inline)
    el-form-item(label="公称压力(MPa)")
      el-input-number(v-model="formData.generalPressure")
    el-form-item(label="水试压力(MPa)")
      el-input-number(v-model="formData.waterPressure")
    el-form-item(label="容积(L)")
      el-input-number(v-model="formData.volume")
    el-form-item(label="是否重瓶")
      el-switch(v-model="formData.isHeavy")
  el-form(label-width="8em")
    el-form-item(label="检验报告")
      yy-imageListUpload(v-model="formData.auditReportList")
    el-form-item(label="钢瓶交付文件")
      yy-imageListUpload(v-model="formData.deliveryFileList")
    el-form-item(label="检验质量说明书")
      yy-imageListUpload(v-model="formData.auditQualityFileList")
    el-form-item(label="制造监督验证书")
      yy-imageListUpload(v-model="formData.manufactureFileList")
    el-form-item(label="钢瓶照片")
      yy-imageListUpload(v-model="formData.bottleImageList")
    el-form-item(label="阀门照片")
      yy-imageListUpload(v-model="formData.valveImageList")
    el-form-item(label="状态")
      el-radio-group(v-model="formData.status")
        el-radio(v-for="i in ['正常', '检测中', '充气中', '作废', '过期', '归档', '其它']", :value="i") {{ i }}
  template(#footer)
    el-button(type="primary", @click="handleSubmit") 确定
    el-button(type="default", @click="emits('update:isShow', false)") 取消

  ComStationPicker(v-model="isShowStationPicker", @success="onStationPick")
  ComStorePicker(v-model="isShowStorePicker", @success="onStorePick")
</template>

<script setup>
import ComStationPicker from "@/component/picker/station.vue"
import ComStorePicker from "@/component/picker/store.vue"
import { companyInfo } from "@/provider/account"
import { bottleFactoryList, bottleSpecificList, ensureCacheData } from "@/provider/cache"

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

const 名称 = "钢瓶档案"
const baseURL = `/bottle`
const title = computed(() => (props.isViewMode ? `${名称}详情` : props.currentId ? `修改${名称}` : `添加${名称}`))

const formData = ref({
  company: "",
  station: "",
  store: "",
  auditStation: "",
  property: "自有",
  propertyCode: "",
  sn: "",
  rfid: "",
  productCode: "",
  internalCode: "",
  bottleSpecific: "",
  bottleFactory: "",
  productionDate: "",
  auditDate: "",
  nextAuditDate: "",
  scrapDate: "",
  designEndDate: "",
  endDate: "",
  generalPressure: 0,
  waterPressure: 0,
  volume: 0,
  auditReportList: [],
  deliveryFileList: [],
  auditQualityFileList: [],
  manufactureFileList: [],
  bottleImageList: [],
  valveImageList: [],
  remark: "",
})

function handleSubmit() {
  Promise.resolve()
    .then(() => {
      if (formData.value._id) {
        return fetch.put(`${baseURL}/${formData.value._id}`, formData.value)
      } else {
        return fetch.post(`${baseURL}`, formData.value)
      }
    })
    .then(() => {
      message.success(formData.value._id ? `修改${名称}成功` : `添加${名称}成功`)
      emits("update:isShow", false)
      emits("success")
    })
}

const isShowStationPicker = ref(false)
const stationPickTarget = ref("store")
function handlePickStation() {
  stationPickTarget.value = "station"
  isShowStationPicker.value = true
}
function handlePickAuditStation() {
  stationPickTarget.value = "auditStation"
  isShowStationPicker.value = true
}
function onStationPick(val) {
  if (stationPickTarget.value === "store") {
    formData.value.store = val
  } else if (stationPickTarget.value === "station") {
    formData.value.station = val
  } else {
    formData.value.auditStation = val
  }
  isShowStationPicker.value = false
}
const isShowStorePicker = ref(false)
function onStorePick(val) {
  formData.value.store = val
  isShowStorePicker.value = false
}

watch(
  () => props.isShow,
  (val) => {
    if (val) {
      if (props.currentId) {
        fetch.get(`${baseURL}/${props.currentId}`).then((res) => {
          formData.value = { ...res }
        })
      } else {
        formData.value = {
          company: "",
          station: "",
          store: "",
          auditStation: "",
          property: "自有",
          propertyCode: "",
          sn: "",
          rfid: "",
          productCode: "",
          internalCode: "",
          bottleSpecific: "",
          bottleFactory: "",
          productionDate: "",
          auditDate: "",
          nextAuditDate: "",
          scrapDate: "",
          designEndDate: "",
          endDate: "",
          generalPressure: 0,
          waterPressure: 0,
          volume: 0,
          auditReportList: [],
          deliveryFileList: [],
          auditQualityFileList: [],
          manufactureFileList: [],
          bottleImageList: [],
          valveImageList: [],
          remark: "",
        }
      }
    }
  },
  { immediate: true },
)
onBeforeMount(() => {
  ensureCacheData("bottleSpecificList")
  ensureCacheData("bottleFactoryList")
})
</script>

<style lang="less" scoped></style>
