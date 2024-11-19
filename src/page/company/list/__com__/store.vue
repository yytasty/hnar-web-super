<template lang="pug">
el-tabs(v-model="activeTab")
  el-tab-pane(label="基本信息", name="基本信息")
    el-form(label-width="6em")
      el-form-item(label="门店名称", required) 
        el-input(v-model="detail.name")
      el-form-item(label="门店编号", required) 
        el-input(v-model="detail.code")
      el-form-item(label="门店简称")
        el-input(v-model="detail.shortName")
      el-form-item(label="门店类型", required)
        el-select(v-model="detail.storeType")
          el-option(v-for="item in storeTypeList", :label="item", :value="item") 
      el-form-item(label="营业时间")
        el-time-picker(v-model="detail.businessStartTime", placeholder="开始时间", style="width: 200px")
        el-time-picker(v-model="detail.businessEndTime", placeholder="结束时间", style="width: 200px; margin: 0 8px")
      el-form-item(label="门店图片")
        yy-imageListUpload(v-model="detail.storeImage", :multiple="false")
  el-tab-pane(label="门店公司信息", name="门店公司信息")
    el-form(label-width="6em", v-if="detail.extendInfo")
      el-form-item(label="联系人")
        el-input(v-model="detail.extendInfo.contactName")
      el-form-item(label="联系电话")
        el-input(v-model="detail.extendInfo.contactNumber")
  el-tab-pane(label="地址信息", name="地址信息")
    ComAddressInfo(v-model="detail.addressInfo", :hasFloor="false")
  el-tab-pane(label="证照信息", name="证照信息")
    ComCertificateList
  el-tab-pane(label="其他信息", name="其他信息")
    el-form(label-width="6em")
      el-form-item(label="排序值")
        el-input-number(v-model="detail.sort")
      el-form-item(label="隐藏门店")
        el-radio-group(v-model="detail.isHide")
          el-radio(:value="true") 是
          el-radio(:value="false") 否
      el-form-item(label="备注")
        el-input(v-model="detail.remark", type="textarea", style="width: 300px")
    .actionBar
      el-button(type="danger", plain, @click="handleDelete") 删除门店
  .actionBar
    el-button(type="primary", style="width: 200px", @click="handleSubmit") {{ isNew ? "新建" : "修改" }}
</template>

<script setup>
import { storeTypeList } from "@/provider/dict"
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
const detail = ref({ station: "", certificateList: [], extendInfo: { areaList: [] } })
provide("detail", detail)

function getData() {
  if (isNew.value) {
    detail.value = { ...currentPick.value, storeImage: "", certificateList: [], extendInfo: { areaList: [] } }
  } else {
    fetch.get(`/store/${currentPick.value._id}`).then((res) => {
      detail.value = res
      if (!detail.value.extendInfo) {
        detail.value.extendInfo = {
          areaList: [],
        }
      }
      if (!detail.value.addressInfo) {
        detail.value.addressInfo = {}
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
    .post(`/store`, detail.value)
    .then(() => {
      message.success("保存成功")
      handleReset()
    })
    .finally(() => {
      loading.hide()
    })
}

function handleDelete() {
  ElMessageBox.confirm(`确定要删除【${detail.value.name}】吗?`).then(() => {
    if (!isNew.value) {
      fetch.delete(`/store/${detail.value._id}`).then(() => {
        message.success("删除成功")
        window.location.reload()
      })
    }
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
