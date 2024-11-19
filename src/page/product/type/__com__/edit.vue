<template lang="pug">
yy-dialog(:modelValue="isShow", @close="emits('update:isShow', false)", :title="title")
  el-form(label-width="12em")
    el-form-item(label="字典类型")
      el-radio-group(v-model="formData.group")
        el-radio-button(value="气体") 气体
        el-radio-button(value="钢瓶") 钢瓶
        el-radio-button(value="配件") 配件
        el-radio-button(value="其他") 其他
    el-form-item(label="类型编号")
      el-input-number(v-model="formData.code", :controls="false")
    el-form-item(label="类型名称")
      el-input(v-model="formData.name")
    el-form-item(label="是否包含净重")
      el-switch(v-model="formData.hasNetWeight")
    el-form-item(label="备注")
      el-input(v-model="formData.remark")
  template(#footer)
    el-button(type="primary", @click="handleSubmit") 确定
    el-button(type="default", @click="emits('update:isShow', false)") 取消
</template>

<script setup>
import { inject, onMounted, computed, ref } from "vue"

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

const baseName = "商品类型"
const basePath = `/productType`
const title = computed(() =>
  props.isViewMode ? `${baseName}详情` : props.currentId ? `修改${baseName}` : `添加${baseName}`,
)

const formData = ref({
  name: "",
  group: "气体",
  code: "",
  remark: "",
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
          name: "",
          group: "气体",
          code: "",
          remark: "",
        }
      }
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped>
/deep/ .el-input-number {
  width: 100%;
}
/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
</style>
