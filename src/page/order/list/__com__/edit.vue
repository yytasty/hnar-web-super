<template lang="pug">
yy-dialog(:modelValue="isShow", @close="handleClose", title="编辑订单信息")
  .body
    el-form(label-width="6em")
      el-form-item(label="下单商品")
        el-table(:data="orderProductList", show-summary, :summary-method="getSummary", border, size="small")
          el-table-column(label="名称", prop="productName", align="center", fixed="left", width="60px")
          el-table-column(label="分类", prop="productTypeGroup", align="center", width="60px")
          el-table-column(label="单位", prop="unit", align="center", width="60px")
          el-table-column(label="净重(Kg)", prop="weight", width="125px", align="center")
            template(#default="{ row }")
              el-input-number(v-model="row.weight", :step="0.1", :controls="false", style="width: 100px")
          el-table-column(label="单价(元)", prop="price", width="150px", align="center")
            template(#default="{ row }")
              el-input-number(
                v-model="row.price",
                :min="0",
                :step="1",
                @change="refreshProductPrice",
                controls-position="right",
                style="width: 120px"
              )
          el-table-column(label="数量", prop="num", width="130px", align="center")
            template(#default="{ row }")
              el-input-number(
                v-model="row.num",
                :min="1",
                :step="1",
                @change="refreshProductPrice",
                controls-position="right",
                style="width: 100px"
              )
          el-table-column(label="配送费", prop="deliveryPrice", align="center")
          el-table-column(label="楼层费", prop="floorPrice", align="center")
          el-table-column(label="总价", prop="totalPrice", align="center", fixed="right")
          el-table-column(label="操作", align="center", width="80px", fixed="right")
            template(#default="{ row, $index }")
              el-button(type="danger", plain, size="small", @click="handleDelete($index)")
                el-icon
                  Delete
        el-button(type="success", plain, size="small", style="margin-top: 10px", @click="isShowProductPicker = true") 添加商品
      el-form(label-width="6em", inline)
        el-form-item(label="商品价")
          el-input-number(v-model="formData.productPrice", :min="0", :step="0.01", controls-position="right", disabled)
        el-form-item(label="配送费")
          el-input-number(
            v-model="formData.deliveryPrice",
            :min="0",
            :step="0.01",
            controls-position="right",
            @change="onPriceChange"
          )
        el-form-item(label="楼层费")
          el-input-number(
            v-model="formData.floorPrice",
            :min="0",
            :step="0.01",
            controls-position="right",
            @change="onPriceChange"
          )
      el-form(label-width="6em", inline)
        el-form-item(label="应收总价")
          el-input-number(v-model="formData.totalPrice", :min="0", :step="0.01", controls-position="right", disabled)
        el-form-item(label="优惠金额")
          el-input-number(
            v-model="formData.discountAmount",
            :min="0",
            :step="0.01",
            controls-position="right",
            @change="onPriceChange"
          )
        el-form-item(label="实收总价")
          el-input-number(v-model="formData.actualAmount", :min="0", :step="0.01", controls-position="right", disabled)
      el-form-item(label="状态")
        el-radio-group(v-model="formData.status")
          el-radio(v-for="i in ['待处理', '未派工', '已派工', '已配送', '已完成', '已作废']", :value="i") {{ i }}
      el-form-item(label="备注")
        el-input(
          v-model="formData.remark",
          type="textarea",
          :autosize="{ minRows: 2, maxRows: 6 }",
          style="width: 260px"
        )
  template(#footer) 
    el-button(type="info", @click="handleClose") 取消
    el-button(type="primary", @click="handleSubmit") 确定

ComProductPicker(v-model="isShowProductPicker", @success="onProductPick")
</template>

<script setup>
import Decimal from "decimal.js"

import ComProductPicker from "@/component/picker/product.vue"

const { fetch, message, router } = inject("global")
const { formatTime, formatPrice } = inject("format")

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  orderId: {
    type: String,
    default: "",
  },
})
const emits = defineEmits(["update:isShow", "success"])

function handleClose() {
  emits("update:isShow", false)
}

const formData = ref({
  remark: "",
  totalPrice: 0,
  discountAmount: 0,
  actualAmount: 0,
})

function getData() {
  fetch.get(`/order/${props.orderId}`).then((res) => {
    formData.value = res
    orderProductList.value = res.productList
  })
}

function onDiscountChange() {
  if (isNaN(formData.value.discountAmount)) {
    formData.value.discountAmount = 0
  }
  formData.value.actualAmount = new Decimal(formData.value.totalPrice || 0)
    .sub(formData.value.discountAmount)
    .toNumber()
}

function handleDelete(index) {
  orderProductList.value.splice(index, 1)
  refreshProductPrice()
}

function handleSubmit() {
  refreshProductPrice()
    .then(() => {
      return fetch.put(`/order/${props.orderId}`, {
        ...formData.value,
        productList: orderProductList.value,
      })
    })
    .then(() => {
      message.success("操作成功")
      emits("success")
      handleClose()
    })
    .catch((err) => {
      message.error(err?.msg || err?.message || "操作失败")
    })
}

const orderProductList = ref([])
const isShowProductPicker = ref(false)
function onProductPick(product) {
  if (orderProductList.value.find((v) => v._id == product._id)) return
  orderProductList.value.push({
    ...product,
    num: 1,
  })
  isShowProductPicker.value = false
  refreshProductPrice()
}

function refreshProductPrice() {
  return fetch
    .post("/order/getOrderBasePrice", {
      customer: formData.value?.customer?._id || formData.value?.customer,
      productList:
        orderProductList.value?.map((v) => ({
          productId: v.productId || v._id,
          num: v.num,
          price: v.price,
          weight: v.weight,
        })) || [],
    })
    .then((res) => {
      if (!res?.productList?.length) return
      orderProductList.value = res.productList
      formData.value.productPrice = res.productPrice
      formData.value.deliveryPrice = res.deliveryPrice
      formData.value.floorPrice = res.floorPrice
      formData.value.totalPrice = res.totalPrice
      formData.value.discountAmount = formData.value.discountAmount || res.discountPrice || 0
      formData.value.actualAmount = new Decimal(res.realPrice || res.totalPrice || 0)
        .sub(formData.value.discountAmount)
        .toNumber()
      return res
    })
}
function onPriceChange() {
  if (isNaN(formData.value.discountAmount)) {
    formData.value.discountAmount = 0
  }
  if (isNaN(formData.value.deliveryPrice)) {
    formData.value.deliveryPrice = 0
  }
  if (isNaN(formData.value.floorPrice)) {
    formData.value.floorPrice = 0
  }
  formData.value.totalPrice = new Decimal(formData.value.productPrice || 0)
    .add(formData.value.deliveryPrice || 0)
    .add(formData.value.floorPrice || 0)
    .toNumber()
  formData.value.actualAmount = new Decimal(formData.value.totalPrice || 0)
    .sub(formData.value.discountAmount)
    .toNumber()
}
function getSummary() {
  return [
    "合计",
    "",
    "",
    "",
    "",
    orderProductList.value.reduce((a, b) => a + b.num, 0),
    formatPrice(orderProductList.value.reduce((a, b) => a.add(b.deliveryPrice || 0), new Decimal(0)).toString()),
    formatPrice(orderProductList.value.reduce((a, b) => a.add(b.floorPrice || 0), new Decimal(0)).toString()),
    formatPrice(orderProductList.value.reduce((a, b) => a.add(b.totalPrice || 0), new Decimal(0)).toString()),
  ]
}

watch(
  () => props.isShow,
  (val) => {
    if (val) {
      getData()
    }
  },
)
</script>

<style lang="less" scoped>
.componentContainer {
  width: 100%;
}
</style>
