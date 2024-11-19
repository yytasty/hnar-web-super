<template lang="pug">
yy-dialog(:modelValue="isShow", @close="emits('update:isShow', false)", :title="title")
  el-form(label-width="12em")
    el-form-item(label="名称", required)
      el-input(v-model="formData.title", placeholder="请输入入户安检模板名称")
    el-form-item(label="编制单位", required)
      el-input(v-model="formData.authorized")
    el-form-item(label="盖章图片")
      yy-imageListUpload(v-model="formData.signatureImage", :multiple="false")
    el-form-item(label="类型")
      el-radio-group(v-model="formData.type")
        el-radio(value="daily") 日常入户检
        el-radio(value="year") 年检
    el-form-item(label="适用客户类型")
      el-checkbox-group(v-model="formData.customerTypeList")
        el-checkbox(v-for="item in customerTypeList", :label="item")
    el-form-item(label="启用状态")
      el-switch(v-model="formData.isEnable")
    el-form-item(label="备注")
      el-input(v-model="formData.remark", placeholder="请输入备注")
  template(#footer)
    el-button(type="primary", @click="handleSubmit") 确定
    el-button(type="default", @click="emits('update:isShow', false)") 取消
</template>

<script setup>
import { customerTypeList, ensureCacheData } from "@/provider/cache"

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

const baseName = "入户安检模板"
const basePath = `/security/template`
const title = computed(() =>
  props.isViewMode ? `${baseName}详情` : props.currentId ? `修改${baseName}` : `添加${baseName}`,
)

const formData = ref({
  title: "",
  company: "",
  companyInfo: null,
  customerTypeList: [],
  isEnable: true,
  signatureImage: "",
  type: "daily",
  remark: "",
})

function handleSubmit() {
  delete formData.value.checkItemList
  Promise.resolve()
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
}

watch(
  () => props.isShow,
  (val) => {
    if (val) {
      ensureCacheData("customerTypeList")
      if (props.currentId) {
        fetch.get(`${basePath}/${props.currentId}`).then((res) => {
          formData.value = { ...res }
        })
      } else {
        formData.value = {
          title: "",
          company: "",
          companyInfo: null,
          customerTypeList: [],
          isEnable: true,
          signatureImage: "",
          type: "daily",
          remark: "",
        }
      }
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped></style>
