<template lang="pug">
el-form(label-width="9em", v-if="modelValue")
  el-divider(content-position="left") 营业执照照片
  el-form-item(label="", label-width="4em") 
    div
      el-button(
        v-if="!modelValue.image",
        type="success",
        plain,
        style="margin-bottom: 10px",
        @click="handelImportImage"
      ) 导入营业执照照片
      yy-imageListUpload(v-model="modelValue.image", :multiple="false", :limit="1")
      el-button(v-if="isShowOCR", type="primary", plain, style="margin-top: 10px", @click="handelOCR") 识别营业执照照片
  template(v-if="modelValue.image")
    el-divider(content-position="left") 营业执照信息
    el-form(label-width="9em", inline)
      el-form-item(label="营业名称")
        el-input(v-model="modelValue.companyName", clearable)
      el-form-item(label="类型")
        el-input(v-model="modelValue.companyType", clearable)
      el-form-item(label="组成形式")
        el-input(v-model="modelValue.companyForm", clearable)
      el-form-item(label="统一社会信用代码")
        el-input(v-model="modelValue.creditCode", clearable)
      el-form-item(label="法人/负责人")
        el-input(v-model="modelValue.legalPerson", clearable)
      el-form-item(label="注册资本")
        el-input(v-model="modelValue.registeredCapital", clearable)
      el-form-item(label="营业期限")
        el-input(v-model="modelValue.validPeriod", clearable)
      el-form-item(label="注册日期")
        el-input(v-model="modelValue.registrationDate", clearable)
      el-form-item(label="发照日期")
        el-input(v-model="modelValue.issueDate", clearable)
      el-form-item(label="证照标题")
        el-input(v-model="modelValue.title", clearable)
      el-form-item(label="营业场所/住所")
        el-input(v-model="modelValue.businessAddress", clearable)
      el-form-item(label="经营范围")
        el-input(v-model="modelValue.businessScope", clearable)
</template>

<script setup>
import { pickAndUploadFile } from "@/provider/file"

const { fetch, message } = inject("global")

const props = defineProps({
  modelValue: {
    type: Object,
    default: {
      image: "",
      companyName: "",
      companyType: "",
      companyForm: "",
      creditCode: "",
      legalPerson: "",
      registeredCapital: "",
      validPeriod: "",
      registrationDate: "",
      issueDate: "",
      title: "",
      businessAddress: "",
      businessScope: "",
    },
  },
})
const emits = defineEmits(["update:modelValue"])

const isShowOCR = computed(() => props.modelValue?.image && !props.modelValue.companyName)

function handelOCR() {
  if (!props.modelValue.image) {
    message.error("请先上传营业执照照片")
    return
  }
  fetch
    .post(`/ocr/businessLicense`, {
      image: props.modelValue.image,
    })
    .then((res) => {
      emits("update:modelValue", { ...props.modelValue, ...res })
    })
    .catch((err) => {
      message.error(`解析失败:${err?.msg || err}`)
    })
}

function handelImportImage() {
  pickAndUploadFile().then((res) => {
    emits("update:modelValue", { ...props.modelValue, image: res })
    nextTick(handelOCR)
  })
}
</script>
