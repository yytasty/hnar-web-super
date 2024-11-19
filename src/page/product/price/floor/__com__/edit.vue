<template lang="pug">
//- 楼层价是按梯度的
//- 比如：基础楼层价  1块       基础楼层 3楼
//-            3楼以上， 每层加 2块
//-            8楼以上，每层加 3块
yy-dialog(:modelValue="isShow", @close="emits('update:isShow', false)", :title="title")
  el-form(label-width="12em", :disabled="isViewMode")
    el-form-item(label="商品列表")
      el-select(v-model="formData.productList", placeholder="请选择商品", multiple, clearable)
        el-option(v-for="item in productList", :key="item.id", :label="item.name", :value="item._id")
    el-form-item(label="基础楼层费用")
      el-input-number(v-model="formData.basicPrice", :controls="false", placeholder="请输入基础楼层费用")
        template(#append) 元
    el-form-item(label="楼层梯度价")
      .flex
        el-button(type="primary", @click="setLevelPriceItem", v-if="!isViewMode") 设置楼层梯度价
        div
          .item(
            style="display: flex; align-items: center; margin-top: 10px",
            v-for="(item, index) in formData.stagePriceList",
            :key="index"
          )
            el-input(
              v-model="item.level",
              type="number",
              :min="1",
              placeholder="请输入楼层梯度",
              style="margin-right: 10px; flex: 1"
            )
              template(#append) 楼
            div(style="width: 90px; text-align: center") 及以上加收
            el-input(
              v-model="item.addPrice",
              type="number",
              :min="0",
              placeholder="请输入楼层梯度价",
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
    el-form-item(label="排序")
      el-input(v-model="formData.sortNum")
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

const baseName = "楼层送气费"
const basePath = `/productFloorPrice`
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
    info.level = Math.floor(Number(info.level))
    info.addPrice = Number(info.addPrice)
    if (info.level < 1) {
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

const setLevelPriceItem = () => {
  formData.value.stagePriceList.push({ level: "", addPrice: "" })
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
