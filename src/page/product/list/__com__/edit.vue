<template lang="pug">
yy-dialog(:modelValue="isShow", @close="emits('update:isShow', false)", :title="title")
  el-form(label-width="12em")
    el-form-item(label="商品编号")
      el-input(v-model="formData.code", placeholder="请输入商品编号")
    el-form-item(label="商品名称")
      el-input(v-model="formData.name", placeholder="请输入商品名称")
    el-form-item(label="商品单位")
      el-select(v-model="formData.unit", placeholder="请选择商品单位")
        el-option(v-for="item in productUnitList", :key="item", :label="item", :value="item")
    el-form-item(label="商品类型")
      el-select(v-model="formData.productType", placeholder="请选择商品类型")
        el-option(v-for="item in productTypeList", :key="item._id", :label="item.name", :value="item._id")
    el-form-item(label="钢瓶规格")
      el-select(v-model="formData.bottleSpecific", placeholder="请选择钢瓶规格")
        el-option(v-for="item in bottleSpecificList", :key="item._id", :label="item.name", :value="item._id")
    el-form-item(label="净重公斤")
      el-input(v-model="formData.weight")
        template(#append) kg
    el-form-item(label="使用期限")
      el-input(v-model="formData.timeLimit")
        template(#append) 月
    el-form-item(label="单价")
      el-input(v-model="formData.price")
        template(#append) 元
    el-form-item(label="状态设置")
      el-form(inline, label-width="7em")
        el-form-item(label="下单显示")
          el-switch(v-model="formData.isShowInOrder")
        el-form-item(label="出入库显示")
          el-switch(v-model="formData.isShowInWarehousing")
        el-form-item(label="微信显示")
          el-switch(v-model="formData.isShowInWechat")
        el-form-item(label="自助订气使用")
          el-switch(v-model="formData.isShowInVoiceAuto")
        el-form-item(label="使用状态")
          el-switch(v-model="formData.isShowStatus")
    el-form-item(label="商品图片")
      yy-imageListUpload(v-model="formData.imgList")
    el-form-item(label="备注")
      el-input(v-model="formData.remark", type="textarea", rows="3", placeholder="请输入备注")
  template(#footer)
    el-button(type="primary", @click="handleSubmit") 确定
    el-button(type="default", @click="emits('update:isShow', false)") 取消
</template>

<script setup>
import { ensureCacheData, productUnitList } from "@/provider/cache"
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

const baseName = "商品"
const basePath = `/product`
const title = computed(() =>
  props.isViewMode ? `${baseName}详情` : props.currentId ? `修改${baseName}` : `添加${baseName}`,
)

const formData = ref({
  code: "",
  name: "",
  unit: "",
  productType: "",
  bottleSpecific: "",
  weight: "",
  timeLimit: "",
  cashPledge: "",
  // storeType: "",
  imgList: [],
  remark: "",
  isDefault: false,
  isShowInOrder: false,
  isShowInWarehousing: false,
  isShowStatus: false,
  isShowInWechat: false,
  isShowInVoiceAuto: false,
})

const checkSubmitData = () => {
  if (!formData.value.code) {
    message.error("请输入商品编号")
    return false
  }
  if (!formData.value.name) {
    message.error("请输入商品名称")
    return false
  }
  if (!formData.value.unit) {
    message.error("请选择商品单位")
    return false
  }
  if (!formData.value.productType) {
    message.error("请选择商品类型")
    return false
  }
  // if (!formData.value.bottleSpecific) {
  //   message.error("请选择钢瓶规格")
  //   return false
  // }
  // if (!formData.value.weight) {
  //   message.error("请输入净重公斤")
  //   return false
  // }
  // if (!formData.value.timeLimit) {
  //   message.error("请输入使用期限")
  //   return false
  // }
  if (!formData.value.price) {
    message.error("请输入单价")
    return false
  }
  // if (!formData.value.imgList.length) {
  //   message.error("请上传商品图片")
  //   return false
  // }
  return true
}

function handleSubmit() {
  if (!checkSubmitData()) return
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

const productTypeList = ref([])
function getProductType() {
  fetch.get(`/productType?size=-1`).then((res) => {
    productTypeList.value = res?.list || []
  })
}

const bottleSpecificList = ref([])
function getBottleSpecific() {
  fetch.get(`/bottle/specific?size=-1`).then((res) => {
    bottleSpecificList.value = res?.list || []
  })
}

onBeforeMount(() => {
  ensureCacheData("productUnitList")
})

watch(
  () => props.isShow,
  (val) => {
    if (val) {
      getProductType()
      getBottleSpecific()
      if (props.currentId) {
        fetch.get(`${basePath}/${props.currentId}`).then((res) => {
          formData.value = { ...res }
        })
      } else {
        formData.value = {
          code: "",
          name: "",
          unit: "",
          productType: "",
          bottleSpecific: "",
          weight: "",
          timeLimit: "",
          cashPledge: "",
          // storeType: "",
          imgList: [],
          remark: "",
        }
      }
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped></style>
