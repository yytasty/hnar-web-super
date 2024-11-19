<template lang="pug">
yy-dialog(:modelValue="isShow", @close="emits('update:isShow', false)", :title="title")
  el-form(label-width="8em")
    el-form-item(label="厂家名称", required)
      el-input(v-model.trim="formData.name", placeholder="请输入厂家名称")
    el-form-item(label="描述")
      el-input(v-model.trim="formData.desc", placeholder="请输入厂家描述")
    el-form-item(label="简称")
      el-input(v-model.trim="formData.shortName", placeholder="请输入厂家简称")
    el-form-item(label="厂家代码", required)
      el-input(v-model.trim="formData.code", placeholder="请输入厂家代码")
    el-form-item(label="制造许可证编号")
      el-input(v-model.trim="formData.prcLicenseNo", placeholder="请输入制造许可证编号")
    el-form-item(label="单位代码")
      el-input(v-model.trim="formData.unitCode", placeholder="请输入单位代码")
    el-form-item(label="是否常用")
      el-switch(v-model="formData.isStar")
    el-form-item(label="备注")
      el-input(v-model="formData.remark", type="textarea", placeholder="请输入备注", style="width: 300px")
    el-form-item(label="排序")
      el-input-number(v-model="formData.order", placeholder="请输入排序(非必填，数字越小排前面)")
    el-form-item(label="可抓取内容")
      el-switch(v-model="formData.isAllowFetch")
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

const 名称 = "生产厂家"
const URL名称 = `/bottle/factory`
const title = computed(() => (props.isViewMode ? `${名称}详情` : props.currentId ? `修改${名称}` : `添加${名称}`))

const formData = ref({
  name: "",
  desc: "",
  shortName: "",
  code: "",
  prcLicenseNo: "",
  unitCode: "",
  remark: "",
  isStar: false,
  isAllowFetch: false,
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
          desc: "",
          shortName: "",
          code: "",
          prcLicenseNo: "",
          unitCode: "",
          remark: "",
          isStar: false,
          isAllowFetch: false,
          order: 0,
        }
      }
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped></style>
