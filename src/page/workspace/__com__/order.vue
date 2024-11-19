<template lang="pug">
.comOrderInfo
  el-form(label-width="6em")
    el-form-item(label="下单商品") 
      el-table(:data="orderProductList", show-summary, :summary-method="getSummary", border)
        el-table-column(label="名称", prop="productName", align="center", fixed="left", width="60px")
        el-table-column(label="分类", prop="productTypeGroup", align="center", width="60px")
        el-table-column(label="单位", prop="unit", align="center", width="60px")
        el-table-column(label="净重(Kg)", prop="weight", width="125px", align="center")
          template(#default="{ row }")
            template(v-if="row.hasNetWeight")
              el-input-number(v-model="row.weight", :step="0.1", :controls="false", style="width: 100px")
            template(v-else)
              span -
        el-table-column(label="单价(元)", prop="price", width="150px", align="center")
          template(#default="{ row }")
            el-input-number(
              v-model="row.price",
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
        el-table-column(label="总价", prop="totalPrice", align="center")
        el-table-column(label="操作", align="center", width="80px")
          template(#default="{ row, $index }")
            el-button(type="danger", plain, size="small", @click="handleDelete($index)")
              el-icon
                Delete
      el-button(type="success", plain, style="margin-top: 10px", @click="isShowProductPicker = true") 添加商品
  el-form(label-width="6em", inline)
    el-form-item(label="商品价")
      el-input-number(v-model="priceInfo.productPrice", :min="0", :step="0.01", controls-position="right", disabled)
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
      el-input-number(v-model="priceInfo.totalPrice", :min="0", :step="0.01", controls-position="right", disabled)
    el-form-item(label="优惠金额")
      el-input-number(
        v-model="formData.discountAmount",
        :min="0",
        :step="0.01",
        controls-position="right",
        @change="onPriceChange"
      )
    el-form-item(label="实收总价")
      el-input-number(v-model="priceInfo.realPrice", :min="0", :step="0.01", controls-position="right", disabled)
  el-form(label-width="6em", inline)
    el-form-item(label="加急")
      el-switch(v-model="formData.isUrgent")
    el-form-item(label="自提")
      el-switch(v-model="formData.isTakeTheir")
    el-form-item(label="燃气险")
      el-switch(v-model="formData.isInsurance")
  el-form(label-width="6em", inline)
    el-form-item(label="下单门店")
      el-input(:modelValue="formData.store?.name || formData.store", disabled, style="width: 260px")
        template(#append)
          el-button(@click="isShowStorePicker = true") 选择门店
    el-form-item(label="配送员")
      el-input(:modelValue="formData.courier?.name || formData.courier", disabled, style="width: 260px")
        template(#append)
          el-button(@click="isShowStaffPicker = true") 选择配送员
    el-form-item(label="预约时间")
      el-date-picker(v-model="formData.planTime", type="datetime", style="width: 260px")
  el-form(label-width="6em")
    el-form-item(label="备注")
      el-input(
        v-model="formData.remark",
        type="textarea",
        :autosize="{ minRows: 2, maxRows: 6 }",
        style="width: 260px"
      )
  .actionBar
    el-button(type="warning", plain, @click="handleReset()", style="margin-right: 40px") 清空
    el-button(type="primary", @click="handleSubmit", :disabled="!customerInfo?._id || !orderProductList?.length") 提交订单

ComStorePicker(v-model="isShowStorePicker", @success="onStorePick")
ComStaffPicker(v-model="isShowStaffPicker", @success="onStaffPick", :store="formData.store?._id || formData.store")
ComProductPicker(v-model="isShowProductPicker", @success="onProductPick")
</template>

<script setup>
import ComProductPicker from "@/component/picker/product.vue"
import ComStaffPicker from "@/component/picker/staff.vue"
import ComStorePicker from "@/component/picker/store.vue"
import Decimal from "decimal.js"
import mitt from "@/provider/mitt"

const { fetch, message, router, loading } = inject("global")
const { formatTime, formatPrice } = inject("format")

const customerInfo = inject("customerInfo")

const orderProductList = ref([])
const formData = ref({
  planTime: "",
  station: "",
  store: "",
  courier: "",
  isUrgent: false,
  isTakeTheir: false,
  isInsurance: false,
  remark: "",
  discountAmount: 0,
  deliveryPrice: 0,
  floorPrice: 0,
  customerDiscount: "",
})
const priceInfo = ref({
  productPrice: 0,
  totalPrice: 0,
  realPrice: 0,
})

const isShowStaffPicker = ref(false)
function onStaffPick(staff) {
  formData.value.courier = staff
}
const isShowStorePicker = ref(false)
function onStorePick(store) {
  formData.value.store = store
}

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
  fetch
    .post("/order/getOrderBasePrice", {
      customer: customerInfo.value?._id,
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
      priceInfo.value.productPrice = res.productPrice
      formData.value.deliveryPrice = res.deliveryPrice
      formData.value.floorPrice = res.floorPrice
      priceInfo.value.totalPrice = res.totalPrice
      formData.value.discountAmount = formData.value.discountAmount || res.discountPrice || 0
      priceInfo.value.realPrice = new Decimal(res.realPrice || res.totalPrice || 0)
        .sub(formData.value.discountAmount || 0)
        .toNumber()
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
  priceInfo.value.totalPrice = new Decimal(priceInfo.value.productPrice || 0)
    .add(formData.value.deliveryPrice || 0)
    .add(formData.value.floorPrice || 0)
    .toNumber()
  priceInfo.value.realPrice = new Decimal(priceInfo.value.totalPrice || 0).sub(formData.value.discountAmount).toNumber()
}

function getSummary() {
  return [
    "合计",
    "",
    "",
    "",
    "",
    orderProductList.value.reduce((a, b) => a + b.num, 0),
    formatPrice(
      orderProductList.value.reduce((a, b) => a.add(new Decimal(b.deliveryPrice || 0)), new Decimal(0)).toNumber(),
    ),
    formatPrice(
      orderProductList.value.reduce((a, b) => a.add(new Decimal(b.floorPrice || 0)), new Decimal(0)).toNumber(),
    ),
    formatPrice(
      orderProductList.value.reduce((a, b) => a.add(new Decimal(b.totalPrice || 0)), new Decimal(0)).toNumber(),
    ),
  ]
}

// 删除商品
function handleDelete(index) {
  orderProductList.value.splice(index, 1)
}

function validate() {
  if (!customerInfo.value?._id) {
    return Promise.reject("请选择客户")
  } else if (!customerInfo.value?.addressInfo?.address) {
    return Promise.reject("客户未填写地址")
  } else if (!customerInfo.value?.contractInfo?.code) {
    return Promise.reject("客户未签约合同")
  } else if (
    new Date(customerInfo.value?.contractInfo?.endTime) < new Date() &&
    customerInfo.value?.contractInfo?.isDisabledOrderForDeadline
  ) {
    return Promise.reject("客户合同签约已过期，不允许下单")
  } else if (!orderProductList.value.length) {
    return Promise.reject("请添加商品")
  } else if (!formData.value.store) {
    return Promise.reject("请选择门店")
  }
  return Promise.resolve()
}
function handleSubmit() {
  if (loading.isLock()) return
  loading.lock()
  const payload = {
    ...formData.value,
    customer: customerInfo.value?._id,
    productList: orderProductList.value.map((v) => ({
      productId: v.productId || v._id,
      num: v.num,
      price: v.price,
      weight: v.weight,
    })),
  }
  validate()
    .then(() => {
      return fetch.post("/order/createFromHomebrew", payload)
    })
    .then((res) => {
      message.success("创建订单成功")
      mitt.emit("refreshOrderLog")
      handleReset(true)
    })
    .catch((err) => {
      message.error(err?.msg || err)
    })
    .finally(() => {
      loading.hide()
    })
}

function handleReset(saveStore) {
  orderProductList.value = []
  formData.value = {
    planTime: "",
    station: "",
    courier: "",
    isUrgent: false,
    isTakeTheir: false,
    isInsurance: false,
    remark: "",
    store: saveStore ? formData.value.store : undefined,
    discountAmount: 0,
    deliveryPrice: 0,
    floorPrice: 0,
    customerDiscount: "",
  }
  priceInfo.value = {
    productPrice: 0,
    totalPrice: 0,
    realPrice: 0,
  }
}

onMounted(() => {})

watch(
  () => customerInfo.value,
  (val) => {
    if (customerInfo.value?.courier && !formData.value.courier) {
      formData.value.courier = customerInfo.value.courier
    }
    if (customerInfo.value?.store && !formData.value.store) {
      formData.value.store = customerInfo.value.store
    }
  },
  { immediate: true },
)
</script>

<style lang="less" scoped>
.actionBar {
  display: flex;
  justify-content: flex-end;
}
</style>
