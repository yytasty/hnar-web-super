<template lang="pug">
yy-dialog(:modelValue="isShow", @close="emits('update:isShow', false)", :title="title")
  el-descriptions(title="客户信息")
    el-descriptions-item(label="客户ID") {{ formData.customer }}
  el-descriptions(title="工单信息")
    el-descriptions-item(label="类型") {{ formData.type }}
    el-descriptions-item(label="详情") {{ formData.detail }}
    el-descriptions-item(label="附件") {{ formData.imageList }}
  el-descriptions(title="处理信息")
    el-descriptions-item(label="处理结果") {{ formData.handleResult }}
    el-descriptions-item(label="处理方法") {{ formData.handleMethod }}
    el-descriptions-item(label="处理人") {{ formData.handleStaff }}
  el-descriptions
    el-descriptions-item(label="创建时间") {{ formatTime(formData.createTime) }}
    el-descriptions-item(label="更新时间") {{ formatTime(formData.updateTime) }}
  template(#footer)
    el-button(type="primary", @click="handleSubmit") 指派
    el-button(type="warning", @click="handleSubmit") 关闭
    el-button(type="default", @click="emits('update:isShow', false)") 取消
</template>

<script setup>
import { inject, onMounted, computed, ref } from "vue"

const { fetch, message, router } = inject("global")
const { formatTime } = inject("format")

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  currentId: {
    type: String,
    default: "",
  },
  isViewMode: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(["update:isShow", "success"])

const baseName = "投诉单"
const basePath = `/complaint`
const title = computed(() =>
  props.isViewMode ? `${baseName}详情` : props.currentId ? `修改${baseName}` : `添加${baseName}`,
)

const formData = ref({
  customer: "",
  detail: "",
  imageList: [],
  type: "",
  handleResult: "",
  handleMethod: "",
  handleStaff: "",
  createTime: "",
  updateTime: "",
})

function handleSubmit() {
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
      if (props.currentId) {
        fetch.get(`${basePath}/${props.currentId}`).then((res) => {
          formData.value = { ...res }
        })
      } else {
        formData.value = {
          customer: "",
          detail: "",
          imageList: [],
          type: "",
          handleResult: "",
          handleMethod: "",
          handleStaff: "",
          createTime: "",
          updateTime: "",
        }
      }
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped></style>
