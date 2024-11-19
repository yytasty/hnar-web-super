<template lang="pug">
el-form(label-width="9em", v-if="modelValue")
  el-divider(content-position="left") 身份证照片
  el-form-item(label="", label-width="4em") 
    div
      yy-imageListUpload(v-model="modelValue.imageList", :limit="2")
      el-button(v-if="isShowOCR", type="primary", plain, style="margin-top: 10px", @click="handleOCR") 识别身份证照片
  template(v-if="modelValue.imageList")
    el-divider(content-position="left") 身份证信息
    el-form(label-width="9em", inline)
      el-form-item(label="姓名")
        el-input(v-model="modelValue.name", clearable)
      el-form-item(label="性别")
        el-radio-group(v-model="modelValue.sex")
          el-radio(value="男") 男
          el-radio(value="女") 女
      el-form-item(label="民族")
        el-input(v-model="modelValue.ethnicity", clearable)
      el-form-item(label="出生日期")
        el-input(v-model="modelValue.birthDate", clearable)
      el-form-item(label="身份证号")
        el-input(v-model="modelValue.idNumber", clearable)
      el-form-item(label="身份证地址")
        el-input(v-model="modelValue.address", clearable)
      el-form-item(label="身份证有效期")
        el-input(v-model="modelValue.validPeriod", clearable)
      el-form-item(label="发证机关")
        el-input(v-model="modelValue.issueAuthority", clearable)
</template>

<script setup>
import { pickAndUploadFile } from "@/provider/file"

const { fetch, message } = inject("global")

const props = defineProps({
  modelValue: {
    type: Object,
    default: {
      imageList: [],
      name: "",
      sex: "",
      ethnicity: "",
      birthDate: "",
      idNumber: "",
      address: "",
      validPeriod: "",
      issueAuthority: "",
    },
  },
})
const emits = defineEmits(["update:modelValue"])

const isShowOCR = computed(() => props.modelValue?.imageList?.length && !props.modelValue.name)

function handleOCR() {
  if (!props.modelValue.imageList?.length) {
    message.error("请先上传身份证照片")
    return
  }
  if (props.modelValue.imageList?.length < 2) {
    message.error("请先上传身份证【正面】【反面】")
    return
  }
  fetch
    .post(`/ocr/idCard`, {
      imageList: props.modelValue.imageList,
    })
    .then((res) => {
      emits("update:modelValue", { ...props.modelValue, ...res })
    })
    .catch((err) => {
      message.error(`解析失败:${err?.msg || err}`)
    })
}
</script>
