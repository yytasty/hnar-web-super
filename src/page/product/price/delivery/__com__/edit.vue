<template lang="pug">
yy-dialog(:modelValue="isShow", @close="emits('update:isShow', false)", :title="title")
  el-form(label-width="12em", :disabled="isViewMode")
    el-form-item(label="商品列表")
      el-select(v-model="formData.productList", placeholder="请选择商品", multiple, clearable)
        el-option(v-for="item in productList", :key="item.id", :label="item.name", :value="item._id")
    el-form-item(label="基础配送费")
      el-input-number(v-model="formData.basicPrice", :controls="false", placeholder="请输入基础配送费")
        template(#append) 元
    el-form-item(label="梯度价")
      .flex
        el-button(type="primary", @click="setdistancePriceItem", v-if="!isViewMode") 设置梯度价格
        div
          .item(
            style="display: flex; align-items: center; margin-top: 10px",
            v-for="(item, index) in formData.stagePriceList",
            :key="index"
          )
            el-input(
              v-model="item.distance",
              type="number",
              :min="1",
              placeholder="请输入距离梯度",
              style="margin-right: 10px; flex: 1"
            )
              template(#append) 公里
            div(style="width: 120px; text-align: center") 以上每公里加收
            el-input(
              v-model="item.extraPrice",
              type="number",
              :min="0",
              placeholder="请输入距离梯度价",
              style="margin-right: 10px; flex: 1"
            )
              template(#append) 元
            el-button(
              type="danger",
              circle,
              @click="formData.stagePriceList.splice(index, 1)",
              :icon="Delete",
              v-if="!isViewMode"
            )
  template(#footer)
    el-button(type="primary", @click="handleSubmit", v-if="!isViewMode", :loading="loading") 确定
    el-button(type="default", @click="emits('update:isShow', false)") 取消
</template>

<script setup>
import { Delete } from "@element-plus/icons-vue"
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

const baseName = "配送费"
const basePath = `/productDeliveryPrice`
const title = computed(() =>
  props.isViewMode ? `${baseName}详情` : props.currentId ? `修改${baseName}` : `添加${baseName}`,
)

const formData = ref({
  productList: [],
  basicPrice: "",
  stagePriceList: [],
  effectiveTime: "",
  sortNum: 1,
})

const loading = ref(false)
function handleSubmit() {
  if (loading.value) return
  if (!formData.value.productList?.length) {
    return message.error("请先选择商品")
  }
  for (let info of formData.value.stagePriceList) {
    info.distance = Math.floor(Number(info.distance))
    info.extraPrice = Number(info.extraPrice)
    if (info.distance < 1) {
      return message.error("请填入正确的楼层")
    }
    if (info.price <= 0) {
      return message.error("请填入正确的楼层梯度价")
    }
  }
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

const setdistancePriceItem = () => {
  formData.value.stagePriceList.push({ distance: "", extraPrice: "" })
}

// 获取商品列表
const productList = ref([])
function getProductList() {
  fetch
    .get(`/product`, {
      page: 1,
      size: 1000,
    })
    .then((res) => {
      productList.value = res?.list || []
    })
}

watch(
  () => props.isShow,
  (val) => {
    if (val) {
      getProductList()
      if (props.currentId) {
        fetch.get(`${basePath}/${props.currentId}`).then((res) => {
          formData.value = { ...res }
        })
      } else {
        formData.value = {
          productList: "",
          basicPrice: "",
          stagePriceList: [],
          effectiveTime: "",
          sortNum: "",
        }
      }
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped>
/deep/ .el-form-item {
  .el-input {
    width: auto;
  }
}
</style>
