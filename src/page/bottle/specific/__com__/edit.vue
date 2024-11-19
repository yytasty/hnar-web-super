<template lang="pug">
yy-dialog(:modelValue="isShow", @close="emits('update:isShow', false)", :title="title")
  el-form(label-width="12em", :disabled="isViewMode")
    el-form-item(label="规格名称", required)
      el-select(v-model="formData.name", placeholder="请选择规格", @change="handleSelectChange", style="width: 200px" allow-create filterable)
        el-option(v-for="item in bottleSpecificList", :label="item.name", :value="item.name")
  el-form(label-width="12em", :disabled="isViewMode", inline)
    el-form-item(label="空瓶重(kg)", required)
      el-input-number(v-model="formData.emptyWeight", placeholder="请输入空瓶重")
    el-form-item(label="使用年限", required)
      el-input-number(v-model="formData.yearLimit", placeholder="请输入使用年限")
    el-form-item(label="检验周期", required)
      el-input-number(v-model="formData.auditCycle", placeholder="请输入检验周期")
    el-form-item(label="公称压力(Mpa)", required)
      el-input-number(v-model="formData.generalPressure", placeholder="请输入公称压力")
    el-form-item(label="水试压力(Mpa)", required)
      el-input-number(v-model="formData.waterPressure", placeholder="请输入水试压力")
    el-form-item(label="容积(L)", required)
      el-input-number(v-model="formData.volume", placeholder="请输入容积")
    el-form-item(label="壁厚(mm)", required)
      el-input-number(v-model="formData.designThickness", placeholder="请输入壁厚")
    el-form-item(label="瓶内直径(mm)", required)
      el-input-number(v-model="formData.innerDiameter", placeholder="请输入瓶内直径")
    el-form-item(label="最大充装(kg)", required)
      el-input-number(v-model="formData.maxFillingWeight", placeholder="请输入最大充装")
    el-form-item(label="钢瓶型号", required)
      el-input(v-model="formData.bottleType", placeholder="请输入钢瓶型号")
    el-form-item(label="排序", required)
      el-input-number(v-model="formData.order", placeholder="请输入排序号")
  template(#footer)
    el-button(v-if="!isViewMode", type="primary", @click="handleSubmit") 确定
    el-button(type="default", @click="emits('update:isShow', false)") 取消
</template>

<script setup>
import { bottleSpecificList } from "@/provider/bottle"

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

const 名称 = "钢瓶规格"
const URL名称 = `/bottle/specific`
const title = computed(() => (props.isViewMode ? `${名称}详情` : props.currentId ? `修改${名称}` : `添加${名称}`))

const formData = ref({
  name: "",
  emptyWeight: "",
  yearLimit: "",
  auditCycle: "",
  generalPressure: "",
  waterPressure: "",
  volume: "",
  designThickness: "",
  innerDiameter: "",
  maxFillingWeight: "",
  bottleType: "",
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

function handleSelectChange() {
  const item = bottleSpecificList.find((item) => item.name === formData.value.name)
  if (item) {
    formData.value = { ...item }
  }
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
          emptyWeight: "",
          yearLimit: "",
          auditCycle: "",
          generalPressure: "",
          waterPressure: "",
          volume: "",
          designThickness: "",
          innerDiameter: "",
          maxFillingWeight: "",
          bottleType: "",
          order: 0,
        }
      }
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped></style>
