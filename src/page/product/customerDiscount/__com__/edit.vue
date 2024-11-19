<template lang="pug">
yy-dialog(:modelValue="isShow", @close="emits('update:isShow', false)", :title="title")
  el-form(label-width="12em", :disabled="isViewMode")
    el-form-item(label="名称")
      el-input(v-model="formData.name", placeholder="请输入优惠名称")
    el-form-item(label="优惠类型")
      el-radio-group(v-model="formData.type")
        el-radio(value="折扣") 折扣
        el-radio(value="减免") 减免
    el-form-item(label="优惠值")
      el-input-number(v-model="formData.value", controls-position="right", placeholder="请输入优惠值")
    el-form-item(label="适用客户类型")
      el-checkbox-group(v-model="formData.customerTypeList")
        el-checkbox(v-for="item in customerTypeList", :label="item")
    el-form-item(label="是否启用")
      el-switch(v-model="formData.isEnable")
  template(#footer)
    el-button(type="primary", @click="handleSubmit", v-if="!isViewMode", :loading="loading") 确定
    el-button(type="default", @click="emits('update:isShow', false)") 取消
</template>

<script setup>
import { customerTypeList, ensureCacheData } from "@/provider/cache"
import { computed, inject, ref } from "vue"
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
  isViewMode: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(["update:isShow", "success"])

const baseName = "客户优惠方案"
const basePath = `/customerDiscount`
const title = computed(() =>
  props.isViewMode ? `${baseName}详情` : props.currentId ? `修改${baseName}` : `添加${baseName}`,
)

const formData = ref({
  name: "",
  type: "",
  value: "",
  customerTypeList: [],
  isEnable: true,
})

const loading = ref(false)
function handleSubmit() {
  if (loading.value) return
  loading.value = true
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
    .catch((e) => {
      message.error(e.message || e.msg || e)
    })
    .finally(() => {
      loading.value = false
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
          name: "",
          type: "",
          value: "",
          customerTypeList: [],
          isEnable: true,
        }
      }
    }
  },
  { immediate: true },
)

onBeforeMount(() => {
  ensureCacheData("customerTypeList")
})
</script>

<style lang="less" scoped>
/deep/ .el-form-item {
  .el-input {
    width: auto;
  }
}
</style>
