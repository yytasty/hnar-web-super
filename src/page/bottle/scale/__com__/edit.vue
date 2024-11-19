<template lang="pug">
yy-dialog(:modelValue="isShow", @close="emits('update:isShow', false)", :title="title")
  el-form(label-width="8em")
    el-form-item(label="称号", required)
      el-input(v-model="formData.code")
    el-form-item(label="气站")
      yy-stationSelect(v-model="formData.station")
    el-form-item(label="备注")
      el-input(v-model="formData.remark", placeholder="请输入备注")
    el-form-item(label="排序")
      el-input-number(v-model="formData.order", placeholder="请输入排序(非必填，数字越小排前面)")
  template(#footer)
    el-button(type="primary", @click="handleSubmit") 确定
    el-button(type="default", @click="emits('update:isShow', false)") 取消
</template>

<script setup>
import { computed, inject, onMounted, ref } from "vue"

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

const 名称 = "电子秤"
const URL名称 = `/bottle/scale`
const title = computed(() => (props.isViewMode ? `${名称}详情` : props.currentId ? `修改${名称}` : `添加${名称}`))

const formData = ref({
  name: "",
  code: "",
  prcLicenseNo: "",
  unitCode: "",
  remark: "",
  order: 0,
})

function handleSubmit() {
  Promise.resolve()
    .then(() => {
      if (formData.value._id) {
        return fetch.put(`${URL名称}/${formData.value._id}`, formData.value)
      } else {
        return fetch.post(`${URL名称}`, formData.value)
      }
    })
    .then(() => {
      message.success(formData.value._id ? `修改${名称}成功` : `添加${名称}成功`)
      emits("update:isShow", false)
      emits("success")
    })
}

watch(
  () => props.isShow,
  (val) => {
    if (val) {
      if (props.currentId) {
        fetch.get(`${URL名称}/${props.currentId}`).then((res) => {
          formData.value = { ...res }
        })
      } else {
        formData.value = {
          name: "",
          code: "",
          prcLicenseNo: "",
          unitCode: "",
          remark: "",
          order: 0,
        }
      }
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped></style>
