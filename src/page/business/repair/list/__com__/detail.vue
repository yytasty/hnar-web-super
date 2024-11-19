<template lang="pug">
yy-dialog(:modelValue="isShow", @close="emits('update:isShow', false)", :title="title")
  el-descriptions(title="客户信息")
    el-descriptions-item(label="客户ID") 
      yy-customerChip(:detail="formData.customer")
  el-descriptions(title="工单信息", :column="1")
    el-descriptions-item(label="类型") {{ formData.type }}
    el-descriptions-item(label="详情")
      .pre(style="white-space: pre-wrap") {{ formData.detail }}
    el-descriptions-item(label="附件" v-if="formData.imageList.length > 0") 
      yy-imageList(:modelValue="formData.imageList")
  el-descriptions
    el-descriptions-item(label="创建时间") {{ formatTime(formData.createTime) }}
    el-descriptions-item(label="更新时间") {{ formatTime(formData.updateTime) }}
  el-descriptions(title="处理信息")
    el-descriptions-item(label="维修状态") {{ formData.status }}
    el-descriptions-item(label="维修方法") {{ formData.handleMethod }}
    el-descriptions-item(label="维修人")
      yy-accountChip(:detail="formData.handleStaff")
  template(#footer)
    el-button(type="warning", @click="handleCancel") 作废
    el-button(type="default", @click="emits('update:isShow', false)") 取消
</template>

<script setup>
import { computed, inject, onMounted, ref } from "vue"

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

const baseName = "维修单"
const basePath = `/repair`
const title = computed(() =>
  props.isViewMode ? `${baseName}详情` : props.currentId ? `修改${baseName}` : `添加${baseName}`,
)

const formData = ref({
  customer: "",
  detail: "",
  imageList: [],
  type: "",
  status: "",
  handleMethod: "",
  handleStaff: "",
  createTime: "",
  updateTime: "",
})

function handleSubmit() {}

function handleCancel() {
  fetch.post(`/repair/${formData.value._id}/cancel`).then(() => {
    message.success(`作废${baseName}成功`)
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
          status: "",
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
