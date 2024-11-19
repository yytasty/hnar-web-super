<template lang="pug">
yy-dialog(:modelValue="isShow", @close="emits('update:isShow', false)", :title="title")
  el-form(label-width="12em")
    el-form-item(label="所属部门", required)
      el-input(:modelValue="formData.station?.name || formData.station", disabled)
        template(#append)
          el-button(size="small", @click="isShowPickerStation = true") 选择部门
      el-button(size="small", type="warning", plain, circle, style="margin-left: 5px", @click="formData.station = ''")
        el-icon
          CircleClose
    el-form-item(label="所属门店", required)
      el-input(:modelValue="formData.store?.name || formData.store", disabled)
        template(#append)
          el-button(size="small", @click="isShowPickerStore = true") 选择门店
      el-button(size="small", type="warning", plain, circle, style="margin-left: 5px", @click="formData.store = ''")
        el-icon
          CircleClose
    el-form-item(label="类型", required)
      el-radio-group(v-model="formData.type")
        el-radio-button(v-for="i in carTypeList", :value="i") {{ i }}
    el-form-item(label="使用状态", required)
      el-radio-group(v-model="formData.status")
        el-radio-button(v-for="i in carStatusList", :value="i") {{ i }}
    el-form-item(label="车牌号", required)
      el-input(v-model="formData.plateNumber")
    el-form-item(label="名称")
      el-input(v-model="formData.name")
    el-form-item(label="型号")
      el-input(v-model="formData.model")
    el-form-item(label="载重")
      el-input(v-model="formData.capacity")
    el-form-item(label="gps设备号")
      el-input(v-model="formData.gpsDeviceNumber")
    el-form-item(label="当前司机")
      el-input(:modelValue="formData.currentDriver?.name || formData.currentDriver", disabled)
      el-button(@click="isShowPickerStaff = true") 选择司机
    //- el-form-item(label="可选的司机")
      el-input(v-model="formData.availableDriverList")
    el-form-item(label="登记日期")
      el-date-picker(v-model="formData.registerDate")
    el-form-item(label="备注")
      el-input(v-model="formData.remark")
  template(#footer)
    el-button(type="primary", @click="handleSubmit") 确定
    el-button(type="default", @click="emits('update:isShow', false)") 取消

ComPickerStation(v-model="isShowPickerStation", @success="onPickStationSuccess")
ComPickerStore(v-model="isShowPickerStore", @success="onPickStoreSuccess")
ComPickerStaff(v-model="isShowPickerStaff", @success="onPickStaffSuccess")
</template>

<script setup>
import ComPickerStaff from "@/component/picker/staff.vue"
import ComPickerStation from "@/component/picker/station.vue"
import ComPickerStore from "@/component/picker/store.vue"

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

const baseName = "车辆"
const basePath = `/car`
const title = computed(() =>
  props.isViewMode ? `${baseName}详情` : props.currentId ? `修改${baseName}` : `添加${baseName}`,
)

const formData = ref({
  type: "",
  status: "",
  plateNumber: "",
  name: "",
  model: "",
  capacity: "",
  gpsDeviceNumber: "",
  currentDriver: "",
  availableDriverList: "",
  company: "",
  station: "",
  store: "",
  registerDate: "",
  remark: "",
})

const isShowPickerStation = ref(false)
function onPickStationSuccess(val) {
  if (!val) return
  formData.value.station = val
}
const isShowPickerStore = ref(false)
function onPickStoreSuccess(val) {
  if (!val) return
  formData.value.store = val
}

const isShowPickerStaff = ref(false)
function onPickStaffSuccess(val) {
  if (!val) return
  formData.value.currentDriver = val
}

function validate() {
  if (!formData.value.station && !formData.value.store) {
    return Promise.reject("请选择所属部门或门店")
  }
  if (!formData.value.type) {
    return Promise.reject("请选择类型")
  }
  if (!formData.value.status) {
    return Promise.reject("请选择使用状态")
  }
  if (!formData.value.plateNumber) {
    return Promise.reject("请输入车牌号")
  }
  if (!formData.value.name) {
    formData.value.name = formData.value.plateNumber
  }
  return Promise.resolve()
}
function handleSubmit() {
  validate()
    .then(() => {
      if (formData.value._id) {
        return fetch.put(`${basePath}/${formData.value._id}`, formData.value)
      } else {
        return fetch.post(`${basePath}`, formData.value)
      }
    })
    .then(() => {
      message.success(formData.value._id ? `修改${baseName}成功` : `添加${baseName}成功`)
      emits("update:isShow", false)
      emits("success")
    })
    .catch((err) => {
      message.error(err?.msg || err)
    })
}

const carTypeList = ref([])
function getCarTypeList() {
  fetch.get(`/config/carTypeList`).then((res) => {
    carTypeList.value = res
    if (!formData.value.type) {
      formData.value.type = res[0] || ""
    }
  })
}
const carStatusList = ref([])
function getCarStatusList() {
  fetch.get(`/config/carStatusList`).then((res) => {
    carStatusList.value = res
    if (!formData.value.status) {
      formData.value.status = res[0] || ""
    }
  })
}

watch(
  () => props.isShow,
  (val) => {
    if (val) {
      if (props.currentId) {
        fetch.get(`${basePath}/${props.currentId}`).then((res) => {
          formData.value = { ...res }
        })
      } else {
        formData.value = {
          type: carTypeList.value[0] || "",
          status: carStatusList.value[0] || "",
          plateNumber: "",
          name: "",
          model: "",
          capacity: "",
          gpsDeviceNumber: "",
          currentDriver: "",
          availableDriverList: "",
          company: "",
          station: "",
          registerDate: "",
          remark: "",
        }
      }
    }
  },
  { immediate: true },
)

onMounted(() => {
  getCarTypeList()
  getCarStatusList()
})
</script>

<style lang="less" scoped></style>
