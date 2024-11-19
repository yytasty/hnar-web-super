<template lang="pug">
yy-dialog(:modelValue="isShow", @close="emits('update:isShow', false)", :title="title")
  el-form(label-width="6em")
    el-form-item(label="商品信息")
      el-descriptions(:column="3", border)
        template(#extra)
          el-button(type="success", @click="isShowProductPicker = true") 选择商品
        template(v-if="productInfo")
          el-descriptions-item(label="商品编号") {{ productInfo?.code }}
          el-descriptions-item(label="商品名称") {{ productInfo?.name }}
          el-descriptions-item(label="商品单位") {{ productInfo?.unit }}
          el-descriptions-item(label="商品类型") {{ productInfo?.productType?.name }}
          el-descriptions-item(label="钢瓶规格") {{ productInfo?.bottleSpecific?.name }}
          el-descriptions-item(label="单价") {{ productInfo?.price }}
          el-descriptions-item(label="图片")
            yy-imageList(v-model="productInfo.imgList")
          el-descriptions-item(label="备注") {{ productInfo?.remark }}
    el-form-item(label="所属门店")
      el-select(v-model="formData.storeList", placeholder="请选择门店", multiple, clearable)
        el-option(v-for="item in storeList", :key="item.id", :label="item.name", :value="item._id")
    el-form-item(label="商品类型")
      el-select(v-model="formData.customerType", placeholder="请选择商品类型")
        el-option(v-for="item in productTypeList", :key="item", :label="item", :value="item")
    el-form-item(label="单价")
      el-input-number(v-model="formData.price", :min="0", :precision="2")
    //- el-form-item(label='生效时间')
    //-   el-date-picker(v-model="formData.effectiveTime", type="datetime", placeholder="选择日期")
    //- el-form-item(label="备注")
      el-input(v-model="formData.remark", type="textarea", rows="3", placeholder="请输入备注")
  template(#footer)
    el-button(type="primary", @click="handleSubmit") 确定
    el-button(type="default", @click="emits('update:isShow', false)") 取消

ComProductPicker(v-model="isShowProductPicker", @success="onProductPick")
</template>

<script setup>
import ComProductPicker from "@/component/picker/product.vue"
import { productTypeList } from "@/provider/dict"

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

const baseName = "门店价格设置"
const basePath = `/productStorePrice`
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
  imgList: [],
  remark: "",
})
const productInfo = ref(null)

function validate() {
  if (!formData.value.storeList?.length) {
    return Promise.reject("请选择门店")
  }
  if (!formData.value.product) {
    return Promise.reject("请选择商品")
  }
  if (!formData.value.customerType) {
    return Promise.reject("请选择商品类型")
  }
  if (!formData.value.price) {
    return Promise.reject("请输入单价")
  }
  return Promise.resolve()
}

function handleSubmit() {
  validate()
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
    .catch((err) => {
      message.error(err?.msg || err || "操作失败")
    })
}

const isShowProductPicker = ref(false)
function onProductPick(val) {
  if (val) {
    productInfo.value = val
    formData.value.product = val._id
    formData.value.price = val.price
  }
  isShowProductPicker.value = false
}

const storeList = ref([])
function getStoreList() {
  fetch
    .get(`/store`, {
      page: 1,
      size: 1000,
    })
    .then((res) => {
      storeList.value = res?.list || []
    })
}

watch(
  () => props.isShow,
  (val) => {
    if (val) {
      getStoreList()
      if (props.currentId) {
        fetch.get(`${basePath}/${props.currentId}`).then((res) => {
          formData.value = { ...res }
          fetch.get(`/product/${formData.value.product}`).then((res2) => {
            productInfo.value = res2
          })
        })
      } else {
        productInfo.value = null
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
