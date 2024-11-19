<template lang="pug">
el-form(label-width="9em", v-if="modelValue")
  el-divider(content-position="left") 户口本照片
  el-form(label-width="9em", inline)
    el-form-item(label="户主页") 
      yy-imageListUpload(v-model="modelValue.homeImage", :limit="1")
    //- el-form-item(label="常住人口页") 
      yy-imageListUpload(v-model="modelValue.personImage", :limit="1")
  el-form-item(label="") 
    el-button(type="primary", plain, style="margin-top: 10px", @click="handelOCR") 识别户口本照片
  template(v-if="modelValue.imageList")
    el-divider(content-position="left") 户口本信息
    el-form(label-width="9em", inline)
      el-form-item(label="姓名")
        el-input(v-model="modelValue.name", clearable)
      el-form-item(label="曾用名")
        el-input(v-model="modelValue.formerName", clearable)
      el-form-item(label="性别")
        el-radio-group(v-model="modelValue.sex")
          el-radio(value="男") 男
          el-radio(value="女") 女
      el-form-item(label="民族")
        el-input(v-model="modelValue.ethnicity", clearable)
      el-form-item(label="出生日期")
        el-input(v-model="modelValue.birthDate", clearable)
      el-form-item(label="户口本号")
        el-input(v-model="modelValue.householdNumber", clearable)
      el-form-item(label="户口本地址")
        el-input(v-model="modelValue.address", clearable)
      el-form-item(label="籍贯")
        el-input(v-model="modelValue.nativePlace", clearable)
      el-form-item(label="宗教信仰")
        el-input(v-model="modelValue.religious", clearable)
      el-form-item(label="与户主关系")
        el-input(v-model="modelValue.relation", clearable)
      el-form-item(label="签发日期")
        el-input(v-model="modelValue.issueDate", clearable)
      el-form-item(label="登记日期")
        el-input(v-model="modelValue.registrationDate", clearable)
</template>

<script setup>
import { pickAndUploadFile } from "@/provider/file"

const { fetch, message } = inject("global")

const props = defineProps({
  modelValue: {
    type: Object,
    default: {
      homeImage: "",
      personImage: "",
      name: "",
      formerName: "",
      sex: "",
      ethnicity: "",
      birthDate: "",
      householdNumber: "",
      address: "",
      nativePlace: "",
      religious: "",
      relation: "",
      issueDate: "",
      registrationDate: "",
    },
  },
})
const emits = defineEmits(["update:modelValue"])

const isShowOCR = computed(() => props.modelValue?.homeImage && props.modelValue?.personImage && !props.modelValue.name)

function handelOCR() {
  if (!props.modelValue.homeImage) {
    message.error("请先上传户口本【户主页】照片")
    return
  }
  fetch
    .post(`/ocr/household`, {
      homeImage: props.modelValue.homeImage,
    })
    .then((res) => {
      emits("update:modelValue", { ...props.modelValue, ...res })
    })
    .catch((err) => {
      message.error(`解析失败:${err?.msg || err}`)
    })
}
</script>
