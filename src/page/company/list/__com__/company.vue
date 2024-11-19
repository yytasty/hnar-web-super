<template lang="pug">
el-tabs(v-model="activeTab")
  el-tab-pane(label="基本信息", name="基本信息")
    el-form(label-width="8em")
      el-form-item(label="单位名称", required) 
        el-input(v-model="detail.name")
      el-form-item(label="单位编号", required) 
        el-input(v-model="detail.code")
      el-form-item(label="单位简称")
        el-input(v-model="detail.shortName")
      el-form-item(label="客户端链接", required) 
        div https://qq.hnar.top/login?company={{ detail._id }}
      el-form-item(label="员工端链接", required) 
        div https://oo.hnar.top/login?company={{ detail._id  }}
  el-tab-pane(label="公司信息", name="公司信息")
    el-form(label-width="6em", v-if="detail.extendInfo")
      el-form-item(label="联系人")
        el-input(v-model="detail.extendInfo.contactName")
      el-form-item(label="联系电话")
        el-input(v-model="detail.extendInfo.contactNumber")
  el-tab-pane(label="地址信息", name="地址信息")
    ComAddressInfo(v-model="detail.addressInfo", :hasFloor="false")
  el-tab-pane(label="证照信息", name="证照信息")
    ComCertificateList
  .actionBar
    el-button(type="primary", style="width: 200px", @click="handleSubmit") {{ isNew ? "新建" : "修改" }}
</template>

<script setup>
import ComAddressInfo from "@/component/mixin/addressInfo.vue"
import ComCertificateList from "./certificateList.vue"

const { fetch, message, router, loading } = inject("global")

const activeTab = ref("基本信息")

const currentPick = inject("currentPick")
const handleReset = inject("handleReset")
const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(["update:isShow"])

const isNew = computed(() => !currentPick.value?._id)
const detail = ref({ certificateList: [], extendInfo: { areaList: [] } })
provide("detail", detail)

function getData() {
  if (isNew.value) {
    detail.value = { certificateList: [], extendInfo: { areaList: [] } }
  } else {
    fetch.get(`/company/${currentPick.value._id}`).then((res) => {
      detail.value = res
      if (!detail.value.extendInfo) {
        detail.value.extendInfo = {
          areaList: [],
        }
      }
      if (!detail.value.certificateList) {
        detail.value.certificateList = []
      }
    })
  }
}

function handleSubmit() {
  if (detail.value.extendInfo.contactNumber) {
    const telReg = /^(\d{3,4}-)?\d{7,8}$|^1[3-9]\d{9}$/
    if (!telReg.test(detail.value.extendInfo.contactNumber)) {
      message.error("请填写正确的联系电话（手机号码/座机号码）")
      return
    }
  }
  loading.lock()
  fetch
    .post(`/company`, detail.value)
    .then(() => {
      message.success("保存成功")
      handleReset()
    })
    .finally(() => {
      loading.hide()
    })
}

watch(
  () => currentPick.value?._id,
  (val) => {
    getData()
  },
  { immediate: true },
)
</script>

<style lang="less" scoped>
.actionBar {
  margin-top: 40px;
}
</style>
